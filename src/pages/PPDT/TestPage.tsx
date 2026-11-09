import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePPDTImages } from '@/hooks/useTestData';
import { useAuth } from '@/contexts/AuthContext';
import { savePsychTestCompleted, savePsychTestQuit } from '@/lib/psychTestSession';
import { exitLiveActivity } from '@/lib/appNavigation';
import { useBfCacheLiveTestRecovery } from '@/hooks/useBfCacheLiveTestRecovery';
import { PsychTestRunShell } from '@/components/practice/PsychTestRunShell';
import { PsychStartCountdown } from '@/components/practice/PsychStartCountdown';
import { PsychCandidateVerificationGate } from '@/components/practice/PsychCandidateVerificationGate';
import { getPsychModule } from '@/data/psychTestModules';
import { Clock, Eye, PenTool, Coffee, CheckCircle, Loader2 } from 'lucide-react';

type TestPhase = 'viewing' | 'writing' | 'break' | 'completed';

export default function PPDTTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';

  // Always 5 pictures per set
  const TOTAL_PICTURES = 5;

  // Images fetched from backend (admin-controlled)
  const { data: images, loading } = usePPDTImages(set, TOTAL_PICTURES);
  const { user } = useAuth();
  const startTimeRef = useRef<Date>(new Date());
  const savedCompleteRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<TestPhase>('viewing');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [started, setStarted] = useState(false);

  const VIEW_TIME = 30;
  const WRITE_TIME = 240;
  const BREAK_TIME = 30;

  const handlePhaseTransition = useCallback(() => {
    if (phase === 'viewing') {
      setPhase('writing');
      setTimeRemaining(WRITE_TIME);
    } else if (phase === 'writing') {
      setPhase('break');
      setTimeRemaining(BREAK_TIME);
    } else if (phase === 'break') {
      if (currentIndex < TOTAL_PICTURES - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase('viewing');
        setTimeRemaining(VIEW_TIME);
      } else {
        setPhase('completed');
      }
    }
  }, [phase, currentIndex, TOTAL_PICTURES, WRITE_TIME, BREAK_TIME, VIEW_TIME]);

  useEffect(() => {
    if (phase === 'completed' || !started) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, currentIndex, started]);

  useEffect(() => {
    if (!started || phase === 'completed' || timeRemaining > 0) return;
    handlePhaseTransition();
  }, [timeRemaining, started, phase, handlePhaseTransition]);

  const module = getPsychModule('ppdt');
  useBfCacheLiveTestRecovery(module.routes.sets);
  const itemsReached = currentIndex + 1;

  useEffect(() => {
    if (phase !== 'completed' || !user || savedCompleteRef.current) return;
    savedCompleteRef.current = true;
    savePsychTestCompleted(user.id, 'ppdt', set, TOTAL_PICTURES, startTimeRef.current);
  }, [phase, user, set]);

  const handleQuit = () => {
    if (!confirm('Quit this set? Progress is saved; the set stays marked partial until you finish all items.')) return;
    if (user && started) {
      savePsychTestQuit(user.id, 'ppdt', set, TOTAL_PICTURES, itemsReached, startTimeRef.current);
    }
    exitLiveActivity(navigate, module.routes.sets);
  };

  if (!started) {
    return (
      <PsychCandidateVerificationGate label="PPDT" color={module.primary}>
        <PsychStartCountdown
          module={module}
          setLabel={set.replace('set', 'Set ')}
          loading={loading}
          onReady={() => setStarted(true)}
          subtitle="Observe each picture, then write on paper."
        />
      </PsychCandidateVerificationGate>
    );
  }

  if (phase === 'completed') {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#eef2f7] px-4">
        <Card className="w-full max-w-md border p-6 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
          <h2 className="text-lg font-bold">PPDT set completed</h2>
          <p className="mt-2 text-sm text-slate-600">All {TOTAL_PICTURES} pictures in {set} are done.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => exitLiveActivity(navigate, module.routes.sets)} style={{ background: module.primary }} className="text-white">
              Back to sets
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ---------------- UI HELPERS ---------------- */
  const progress = ((currentIndex + 1) / TOTAL_PICTURES) * 100;

  const phaseConfig = {
    viewing: {
      label: 'Picture Viewing',
      icon: <Eye className="w-5 h-5" />,
      note: 'Observe carefully. Picture will disappear automatically.',
    },
    writing: {
      label: 'Story Writing',
      icon: <PenTool className="w-5 h-5" />,
      note: 'Write your story on paper. No typing allowed.',
    },
    break: {
      label: 'Break Time',
      icon: <Coffee className="w-5 h-5" />,
      note: 'Relax, change paper, prepare for next picture.',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle className="w-5 h-5" />,
      note: 'Test finished',
    },
  };

  /* ---------------- MAIN RENDER ---------------- */
  const timerDisplay =
    phase === 'viewing' || phase === 'break'
      ? `${timeRemaining}s`
      : `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`;

  const runPhases = [
    { id: 'viewing', label: 'View', icon: <Eye className="h-3 w-3" /> },
    { id: 'writing', label: 'Write', icon: <PenTool className="h-3 w-3" /> },
    { id: 'break', label: 'Break', icon: <Coffee className="h-3 w-3" /> },
  ];

  return (
    <PsychTestRunShell
      moduleId="ppdt"
      set={set}
      progress={progress}
      itemLine={`Picture ${currentIndex + 1} of ${TOTAL_PICTURES}`}
      timerLabel={phaseConfig[phase].label}
      timerDisplay={timerDisplay}
      phases={runPhases}
      activePhaseId={phase}
      onQuit={handleQuit}
      footerNote={phase !== 'viewing' ? phaseConfig[phase].note : undefined}
    >
      {phase === 'viewing' && images[currentIndex] && (
        <img
          src={images[currentIndex].url}
          alt="PPDT stimulus"
          decoding="async"
          fetchPriority="high"
          className="max-h-full max-w-full object-contain"
        />
      )}
      {phase !== 'viewing' && (
        <p className="max-w-md text-center text-sm text-slate-600">{phaseConfig[phase].note}</p>
      )}
    </PsychTestRunShell>
  );
}
