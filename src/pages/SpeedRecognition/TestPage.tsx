import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, CheckCircle, Clock, Home, Keyboard, Maximize2, Radar, RotateCcw, Volume2, VolumeX, XCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeedRecognitionQuestions } from '@/hooks/useSpeedRecognitionQuestions';
import { submitSpeedRecognitionAttempt } from '@/services/speedRecognitionService';
import { savePracticeSession } from '@/utils/practiceHistory';
import type { SpeedRecognitionAnalytics, SpeedRecognitionAnswerKey, SpeedRecognitionAnswerRecord } from '@/types/schema';
import type { TestStatus, TestType } from '@/types/enums';

type Phase = 'countdown' | 'active' | 'feedback' | 'submitting' | 'result';

const QUESTION_TIME_MS = 3000;
const keyMap: Record<string, SpeedRecognitionAnswerKey> = { a: 'A', b: 'B', c: 'C', d: 'D' };

function formatMs(ms: number) {
  return `${ms} ms`;
}

export default function SpeedRecognitionTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setId = searchParams.get('set') || 'set1';
  const { user } = useAuth();
  const { questions, loading, error, retry } = useSpeedRecognitionQuestions(setId);
  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SpeedRecognitionAnswerRecord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<SpeedRecognitionAnswerKey | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(QUESTION_TIME_MS);
  const [analytics, setAnalytics] = useState<SpeedRecognitionAnalytics | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startedAt, setStartedAt] = useState('');
  const questionStartedAtRef = useRef(0);
  const submittedRef = useRef(false);

  const currentQuestion = questions[questionIndex];
  const progress = questions.length ? ((questionIndex + 1) / questions.length) * 100 : 0;
  const timerProgress = (timeLeftMs / QUESTION_TIME_MS) * 100;
  const urgency = timeLeftMs <= 1000;

  const playTone = useCallback((frequency: number, duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Audio may be blocked by the browser; the visual timer remains authoritative.
    }
  }, [soundEnabled]);

  const finishTest = useCallback(async (finalAnswers: SpeedRecognitionAnswerRecord[]) => {
    setPhase('submitting');
    const completedAt = new Date().toISOString();
    const result = await submitSpeedRecognitionAttempt({
      userId: user?.id ?? 'guest',
      setId,
      answers: finalAnswers,
      startedAt,
      completedAt,
    });

    if (user) {
      savePracticeSession({
        id: crypto.randomUUID(),
        userId: user.id,
        testType: 'speed-recognition' as TestType,
        set: setId,
        startTime: startedAt,
        endTime: completedAt,
        status: 'completed' as TestStatus,
        score: result.accuracy,
        totalItems: result.totalQuestions,
        answeredItems: finalAnswers.filter((answer) => answer.selectedAnswer !== null).length,
        totalTimeMinutes: Math.max(1, Math.ceil((Date.now() - new Date(startedAt).getTime()) / 60000)),
        responses: finalAnswers.map((answer) => answer.selectedAnswer || ''),
      });
    }

    setAnalytics(result);
    playTone(720, 0.22);
    setPhase('result');
  }, [playTone, setId, startedAt, user]);

  const moveNext = useCallback((nextAnswers: SpeedRecognitionAnswerRecord[]) => {
    if (questionIndex >= questions.length - 1) {
      finishTest(nextAnswers);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    submittedRef.current = false;
    setTimeLeftMs(QUESTION_TIME_MS);
    setPhase('active');
  }, [finishTest, questionIndex, questions.length]);

  const submitAnswer = useCallback((answer: SpeedRecognitionAnswerKey | null, timedOut = false) => {
    if (!currentQuestion || submittedRef.current || phase !== 'active') return;

    submittedRef.current = true;
    const responseTimeMs = timedOut ? QUESTION_TIME_MS : Math.min(QUESTION_TIME_MS, Date.now() - questionStartedAtRef.current);
    const record: SpeedRecognitionAnswerRecord = {
      questionId: currentQuestion.id,
      difficulty: currentQuestion.difficulty,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: answer === currentQuestion.correctAnswer,
      responseTimeMs,
      timedOut,
    };

    setSelectedAnswer(answer);
    setAnswers((current) => {
      const next = [...current, record];
      window.setTimeout(() => moveNext(next), 420);
      return next;
    });
    setPhase('feedback');
    playTone(record.isCorrect ? 620 : 180);
  }, [currentQuestion, moveNext, phase, playTone]);

  useEffect(() => {
    if (loading || error || !questions.length || phase !== 'countdown') return;

    if (countdown <= 1) {
      const timer = window.setTimeout(() => {
        setStartedAt(new Date().toISOString());
        setQuestionIndex(0);
        setAnswers([]);
        setSelectedAnswer(null);
        submittedRef.current = false;
        questionStartedAtRef.current = Date.now();
        setTimeLeftMs(QUESTION_TIME_MS);
        setPhase('active');
      }, 1000);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
      playTone(320 + countdown * 80, 0.08);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, error, loading, phase, playTone, questions.length]);

  useEffect(() => {
    if (phase !== 'active' || !currentQuestion) return;

    questionStartedAtRef.current = Date.now();
    setTimeLeftMs(QUESTION_TIME_MS);

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - questionStartedAtRef.current;
      const remaining = Math.max(0, QUESTION_TIME_MS - elapsed);
      setTimeLeftMs(remaining);
      if (remaining <= 0) submitAnswer(null, true);
    }, 40);

    return () => window.clearInterval(timer);
  }, [currentQuestion, phase, submitAnswer]);

  useEffect(() => {
    if (phase !== 'active') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = keyMap[event.key.toLowerCase()];
      if (key) submitAnswer(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, submitAnswer]);

  const restart = () => {
    setCountdown(3);
    setQuestionIndex(0);
    setAnswers([]);
    setAnalytics(null);
    setSelectedAnswer(null);
    submittedRef.current = false;
    setPhase('countdown');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/speed-recognition/sets')} className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <ArrowLeft className="w-4 h-4" />
          Sets
        </Button>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
          <span className="inline-flex items-center gap-1"><Radar className="w-4 h-4 text-amber-600" /> Set {setId.replace('set', '')}</span>
          <span className="inline-flex items-center gap-1"><Keyboard className="w-4 h-4 text-amber-600" /> A/B/C/D</span>
          <button onClick={() => setSoundEnabled((current) => !current)} className="inline-flex items-center gap-1 hover:text-amber-700">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-amber-600" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>
        </div>
        <Button variant="outline" size="sm" onClick={() => document.documentElement.requestFullscreen?.()} className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <Maximize2 className="w-4 h-4" />
          Fullscreen
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-xl border bg-white" />
            <div className="h-80 animate-pulse rounded-xl border bg-white" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border rounded-xl shadow-sm p-8 text-center">
            <Radar className="mx-auto mb-4 h-10 w-10 text-amber-600" />
            <h1 className="text-2xl font-semibold text-slate-900">Question Feed Unavailable</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={retry} className="bg-amber-600 hover:bg-amber-700">Retry</Button>
              <Button variant="outline" onClick={() => navigate('/speed-recognition/sets')}>Back to Sets</Button>
            </div>
          </div>
        )}

        {!loading && !error && phase === 'countdown' && (
          <section className="flex min-h-[55vh] items-center justify-center rounded-xl border bg-white p-6 text-center shadow-sm">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-amber-600">Speed Recognition starts in</div>
              <div key={countdown} className="mt-6 animate-in zoom-in-50 fade-in text-8xl font-bold text-slate-900 duration-300">
                {countdown}
              </div>
              <p className="mt-5 text-sm text-slate-600">Get ready. The first target will appear automatically.</p>
            </div>
          </section>
        )}

        {!loading && !error && (phase === 'active' || phase === 'feedback') && currentQuestion && (
          <main>
            <div className="mb-4 bg-white border rounded-xl shadow-sm p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-base font-semibold text-slate-900">Speed Recognition Test</h1>
                  <p className="text-xs text-slate-600">Question {questionIndex + 1} of {questions.length}</p>
                </div>
                <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${urgency ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-bold">{(timeLeftMs / 1000).toFixed(1)}s</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full transition-all duration-75 ${urgency ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${timerProgress}%` }} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <section key={currentQuestion.id} className="bg-white border rounded-xl shadow-sm p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wide text-amber-600">Target Object</div>
                  <Badge variant="outline" className="capitalize">{currentQuestion.difficulty}</Badge>
                </div>
                <div className="flex aspect-square items-center justify-center rounded-lg border bg-slate-50 p-5">
                  <img src={currentQuestion.targetImage} alt="Speed recognition target" className="max-h-full max-w-full object-contain" />
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3 sm:gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = option.key === currentQuestion.correctAnswer;
                  const isSelected = selectedAnswer === option.key;
                  const showFeedback = phase === 'feedback';

                  return (
                    <button
                      key={`${currentQuestion.id}-${option.key}`}
                      type="button"
                      disabled={phase !== 'active'}
                      onClick={() => submitAnswer(option.key)}
                      className={`group relative rounded-xl border bg-white p-3 transition ${
                        showFeedback && isCorrect
                          ? 'border-emerald-400 bg-emerald-50'
                          : showFeedback && isSelected
                            ? 'border-red-400 bg-red-50'
                            : 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                      }`}
                    >
                      <span className="absolute left-3 top-3 rounded border bg-white px-2 py-1 text-xs font-bold text-slate-700">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-50 p-4">
                        <img src={option.image} alt={`Option ${String.fromCharCode(65 + index)}`} className="max-h-full max-w-full object-contain transition group-hover:scale-105" />
                      </div>
                      {showFeedback && (isCorrect || isSelected) && (
                        <div className="absolute right-3 top-3">
                          {isCorrect ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </section>
            </div>
          </main>
        )}

        {phase === 'submitting' && (
          <div className="bg-white border rounded-xl shadow-sm p-10 text-center">
            <Zap className="mx-auto mb-4 h-10 w-10 animate-pulse text-amber-600" />
            <p className="font-semibold text-slate-900">Computing recognition analytics...</p>
          </div>
        )}

        {phase === 'result' && analytics && (
          <section className="bg-white border rounded-xl shadow-sm p-5 sm:p-7">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Radar className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Recognition Analytics</h1>
              <p className="mt-2 text-sm text-slate-600">Set {setId.replace('set', '')} assessment complete</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ['Score', `${analytics.score}/${analytics.totalQuestions}`],
                ['Accuracy', `${analytics.accuracy}%`],
                ['Avg Reaction', formatMs(analytics.avgReactionTimeMs)],
                ['Correct', analytics.correctCount],
                ['Fastest', formatMs(analytics.fastestResponseMs)],
                ['Slowest', formatMs(analytics.slowestResponseMs)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border bg-slate-50 p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">{value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {Object.entries(analytics.difficultyBreakdown).map(([difficulty, item]) => (
                <div key={difficulty} className="rounded-lg border bg-slate-50 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="capitalize font-medium text-slate-900">{difficulty}</span>
                    <span className="text-amber-600 font-semibold">{item.accuracy}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-amber-500" style={{ width: `${item.accuracy}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{item.correct}/{item.total} correct</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button onClick={restart} className="bg-amber-600 hover:bg-amber-700">
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
