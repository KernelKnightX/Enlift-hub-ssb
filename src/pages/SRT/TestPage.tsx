import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSRTSituations } from '@/hooks/useTestData';
import { savePsychTestCompleted, savePsychTestQuit } from '@/lib/psychTestSession';
import { exitLiveActivity } from '@/lib/appNavigation';
import { useBfCacheLiveTestRecovery } from '@/hooks/useBfCacheLiveTestRecovery';
import { PsychTestRunShell } from '@/components/practice/PsychTestRunShell';
import { getPsychModule } from '@/data/psychTestModules';
import { useAuth } from '@/contexts/AuthContext';
import { PsychStartCountdown } from '@/components/practice/PsychStartCountdown';
import { PsychCandidateVerificationGate } from '@/components/practice/PsychCandidateVerificationGate';
import { CheckCircle } from 'lucide-react';

type TestPhase = 'situation' | 'completed';

export default function SRTTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';

  // SRT: 30 minutes for 60 situations = 30 seconds per situation
  const TOTAL_SITUATIONS = 60;
  const SITUATION_TIME = 30; // 30 seconds per situation

  // Situations fetched from backend (admin-controlled)
  const { data: situations, loading } = useSRTSituations(set, TOTAL_SITUATIONS);
  const { user } = useAuth();
  const startTimeRef = useRef<Date>(new Date());
  const savedCompleteRef = useRef(false);
  const module = getPsychModule('srt');
  useBfCacheLiveTestRecovery(module.routes.sets);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(SITUATION_TIME);
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<TestPhase>('situation');
  const [started, setStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  /* ---------------- SITUATION TIMER ---------------- */
  useEffect(() => {
    if (testCompleted || completed || phase !== 'situation' || !started) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - advance to next situation
          handleNextSituation();
          return SITUATION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, completed, currentIndex, testCompleted, started]);

  /* ---------------- NEXT SITUATION ---------------- */
  const handleNextSituation = useCallback(() => {
    // Prevent advancing if already completed
    if (testCompleted || completed) return;
    
    if (currentIndex < TOTAL_SITUATIONS - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeRemaining(SITUATION_TIME);
    } else {
      // All situations completed
      setTestCompleted(true);
      setCompleted(true);
      setPhase('completed');
      saveCompletedSession();
    }
  }, [currentIndex, testCompleted, completed]);

  /* ---------------- SAVE COMPLETED SESSION ---------------- */
  const saveCompletedSession = () => {
    if (!user || savedCompleteRef.current) return;
    savedCompleteRef.current = true;
    savePsychTestCompleted(user.id, 'srt', set, TOTAL_SITUATIONS, startTimeRef.current);
  };

  const handleQuit = () => {
    if (!confirm('Quit this set? Progress is saved; the set stays marked partial until you finish all situations.')) return;
    if (user && started) {
      savePsychTestQuit(user.id, 'srt', set, TOTAL_SITUATIONS, currentIndex + 1, startTimeRef.current);
    }
    exitLiveActivity(navigate, module.routes.sets);
  };

  /* ---------------- LOADING STATE ---------------- */
  if (!started && !completed) {
    return (
      <PsychCandidateVerificationGate label="SRT" color={module.primary}>
        <PsychStartCountdown
          module={module}
          setLabel={set.replace('set', 'Set ')}
          loading={loading}
          onReady={() => setStarted(true)}
          subtitle="Read each situation and write your reaction on paper."
        />
      </PsychCandidateVerificationGate>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="max-w-xl w-full text-center p-8 border">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {set} Completed!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You have successfully completed all {TOTAL_SITUATIONS} situations in {set}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => exitLiveActivity(navigate, '/srt/sets')}
              className="px-6 py-3 bg-rose-600 text-white rounded-md font-medium hover:bg-rose-700"
            >
              Select Another Set
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50"
            >
              Back to Dashboard
            </button>
          </div>
        </Card>
      </div>
    );
  }

  /* ---------------- UI HELPERS ---------------- */
  const progress = ((currentIndex + 1) / TOTAL_SITUATIONS) * 100;

  return (
    <PsychTestRunShell
      moduleId="srt"
      set={set}
      progress={progress}
      itemLine={`Situation ${currentIndex + 1} of ${TOTAL_SITUATIONS}`}
      timerLabel="Time remaining"
      timerDisplay={`${timeRemaining}s`}
      onQuit={handleQuit}
      footerNote="Write your response on paper · be practical and concise"
    >
      <p className="max-h-full overflow-y-auto px-2 text-center text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
        {situations[currentIndex]?.situation || 'Loading…'}
      </p>
    </PsychTestRunShell>
  );
}
