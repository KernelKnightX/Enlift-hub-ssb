import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWATWords } from '@/hooks/useTestData';
import { useAuth } from '@/contexts/AuthContext';
import { exitLiveActivity } from '@/lib/appNavigation';
import { savePsychTestCompleted, savePsychTestQuit } from '@/lib/psychTestSession';
import { useBfCacheLiveTestRecovery } from '@/hooks/useBfCacheLiveTestRecovery';
import { PsychTestRunShell } from '@/components/practice/PsychTestRunShell';
import { PsychStartCountdown } from '@/components/practice/PsychStartCountdown';
import { PsychCandidateVerificationGate } from '@/components/practice/PsychCandidateVerificationGate';
import { getPsychModule } from '@/data/psychTestModules';
import { FileText, CheckCircle } from 'lucide-react';

export default function WATTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';
  const TOTAL_WORDS = 60;

  const { user } = useAuth();
  const { data: words, loading } = useWATWords(set, TOTAL_WORDS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const startTimeRef = useRef<Date>(new Date());
  const savedCompleteRef = useRef(false);
  const module = getPsychModule('wat');
  useBfCacheLiveTestRecovery(module.routes.sets);

  const WORD_TIME = 15;

  useEffect(() => {
    if (completed || !started) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextWord();
          return WORD_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, completed, started]);

  const handleNextWord = () => {
    if (currentIndex < TOTAL_WORDS - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeRemaining(WORD_TIME);
    } else {
      saveCompletedSession();
      setCompleted(true);
    }
  };

  const saveCompletedSession = () => {
    if (!user || savedCompleteRef.current) return;
    savedCompleteRef.current = true;
    savePsychTestCompleted(user.id, 'wat', set, TOTAL_WORDS, startTimeRef.current);
  };

  const handleQuit = () => {
    if (!confirm('Quit this set? Progress is saved; the set stays marked partial until you finish all words.')) return;
    if (user && started) {
      savePsychTestQuit(user.id, 'wat', set, TOTAL_WORDS, currentIndex + 1, startTimeRef.current);
    }
    exitLiveActivity(navigate, module.routes.sets);
  };

  if (!started && !completed) {
    return (
      <PsychCandidateVerificationGate label="WAT" color={module.primary}>
        <PsychStartCountdown
          module={module}
          setLabel={set.replace('set', 'Set ')}
          loading={loading}
          onReady={() => setStarted(true)}
          subtitle="One sentence per word on paper."
        />
      </PsychCandidateVerificationGate>
    );
  }

  if (completed) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#eef2f7] px-4">
        <Card className="w-full max-w-md border p-6 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
          <h2 className="text-lg font-bold">WAT set completed</h2>
          <p className="mt-2 text-sm text-slate-600">All {TOTAL_WORDS} words in {set} are done.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => exitLiveActivity(navigate, module.routes.sets)} style={{ background: module.primary }} className="text-white">
              Back to sets
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / TOTAL_WORDS) * 100;

  const getTimerColor = () => {
    if (timeRemaining <= 5) return 'text-red-600';
    if (timeRemaining <= 10) return 'text-amber-600';
    return 'text-slate-900';
  };

  return (
    <PsychTestRunShell
      moduleId="wat"
      set={set}
      progress={progress}
      itemLine={`Word ${currentIndex + 1} of ${TOTAL_WORDS}`}
      timerLabel="Time remaining"
      timerDisplay={`${timeRemaining}s`}
      onQuit={handleQuit}
      footerNote="Write one sentence on paper · timer auto-advances"
    >
      <div className="flex max-h-full w-full max-w-lg flex-col items-center justify-center gap-3 px-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          <FileText className="h-3.5 w-3.5" /> Word {currentIndex + 1}
        </span>
        <p className={`text-4xl font-black tabular-nums sm:text-5xl ${getTimerColor()}`}>
          {words[currentIndex]?.word || '…'}
        </p>
        <p className="text-center text-sm text-slate-600">Write a complete sentence using this word</p>
      </div>
    </PsychTestRunShell>
  );
}
