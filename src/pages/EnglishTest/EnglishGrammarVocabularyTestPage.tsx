import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, CheckCircle, Clock, Keyboard, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  ENGLISH_TEST_SECONDS_PER_QUESTION,
  ENGLISH_TEST_TOTAL_QUESTIONS,
  buildEnglishTestQuestions,
  englishGrammarVocabularyQuestions,
  type EnglishQuestion,
  type EnglishQuestionCategory,
  type PreparedEnglishQuestion,
} from '@/data/englishGrammarVocabularyQuestions';
import {
  saveEnglishTestAttempt,
  type EnglishTestAttemptPayload,
} from '@/lib/englishTestSupabaseService';
import { EnglishQuestionCard } from './components/EnglishQuestionCard';
import { EnglishTestResult } from './components/EnglishTestResult';
import { EnglishTestStart } from './components/EnglishTestStart';
import { getEnglishGrammarQuestions } from '@/lib/testDataService';

type TestPhase = 'start' | 'countdown' | 'active' | 'result';

interface AnswerRecord {
  questionId: string;
  category: EnglishQuestionCategory;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timedOut: boolean;
  answeredAtSecond: number;
}

interface ResultSummary {
  score: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeTakenSeconds: number;
  strongestCategory: EnglishQuestionCategory | 'N/A';
  weakestCategory: EnglishQuestionCategory | 'N/A';
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getCategoryProfile(answers: AnswerRecord[]) {
  const stats = new Map<EnglishQuestionCategory, { total: number; correct: number }>();

  answers.forEach((answer) => {
    const current = stats.get(answer.category) ?? { total: 0, correct: 0 };
    stats.set(answer.category, {
      total: current.total + 1,
      correct: current.correct + (answer.isCorrect ? 1 : 0),
    });
  });

  const ranked = [...stats.entries()].sort((a, b) => {
    const aRate = a[1].total ? a[1].correct / a[1].total : 0;
    const bRate = b[1].total ? b[1].correct / b[1].total : 0;
    return bRate - aRate;
  });

  return {
    strongestCategory: ranked[0]?.[0] ?? 'N/A',
    weakestCategory: ranked[ranked.length - 1]?.[0] ?? 'N/A',
  };
}

export default function EnglishGrammarVocabularyTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';
  const shouldAutoStart = searchParams.get('start') === '1';
  const { user } = useAuth();
  const [phase, setPhase] = useState<TestPhase>('start');
  const [questionBank, setQuestionBank] = useState<EnglishQuestion[]>(englishGrammarVocabularyQuestions);
  const [questions, setQuestions] = useState<PreparedEnglishQuestion[]>(() => buildEnglishTestQuestions(englishGrammarVocabularyQuestions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ENGLISH_TEST_SECONDS_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [result, setResult] = useState<ResultSummary | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    const loadAdminQuestions = async () => {
      const firebaseQuestions = await getEnglishGrammarQuestions(set);
      if (firebaseQuestions.length > 0) {
        setQuestionBank(firebaseQuestions as EnglishQuestion[]);
        setQuestions(buildEnglishTestQuestions(firebaseQuestions as EnglishQuestion[]));
      }
    };

    loadAdminQuestions();
  }, [set]);

  const currentQuestion = questions[questionIndex];

  const playTone = useCallback((type: 'select' | 'timeout' | 'finish') => {
    if (!soundEnabled) return;

    try {
      const audioWindow = window as Window & typeof globalThis & {
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.frequency.value = type === 'timeout' ? 180 : type === 'finish' ? 620 : 420;
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.16);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.16);
    } catch {
      // WebAudio can be blocked by the browser; the visual timer still remains authoritative.
    }
  }, [soundEnabled]);

  const completeTest = useCallback((finalAnswers: AnswerRecord[]) => {
    const timeTakenSeconds = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
    const correctCount = finalAnswers.filter((answer) => answer.isCorrect).length;
    const unansweredCount = finalAnswers.filter((answer) => answer.selectedAnswer === null).length;
    const incorrectCount = finalAnswers.length - correctCount - unansweredCount;
    const totalQuestions = finalAnswers.length;
    const accuracy = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const { strongestCategory, weakestCategory } = getCategoryProfile(finalAnswers);

    const summary: ResultSummary = {
      score: correctCount,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracy,
      timeTakenSeconds,
      strongestCategory,
      weakestCategory,
    };

    setResult(summary);
    setPhase('result');
    playTone('finish');

    const payload: EnglishTestAttemptPayload = {
      userId: user?.id ?? 'guest',
      ...summary,
      answers: finalAnswers,
    };

    saveEnglishTestAttempt(payload).catch((error) => {
      console.error('English test attempt save failed:', error);
    });
  }, [playTone, startedAt, user?.id]);

  const moveToNextQuestion = useCallback((finalAnswers: AnswerRecord[]) => {
    if (questionIndex >= questions.length - 1) {
      completeTest(finalAnswers);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSecondsLeft(ENGLISH_TEST_SECONDS_PER_QUESTION);
    setSelectedAnswer(null);
    setLocked(false);
  }, [completeTest, questionIndex, questions.length]);

  const submitAnswer = useCallback((answer: string | null, timedOut = false) => {
    if (locked || !currentQuestion) return;

    const record: AnswerRecord = {
      questionId: currentQuestion.testQuestionId,
      category: currentQuestion.category,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: answer === currentQuestion.correctAnswer,
      timedOut,
      answeredAtSecond: ENGLISH_TEST_SECONDS_PER_QUESTION - secondsLeft,
    };

    setLocked(true);
    setSelectedAnswer(answer);
    playTone(timedOut ? 'timeout' : 'select');

    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers, record];
      window.setTimeout(() => moveToNextQuestion(nextAnswers), 720);
      return nextAnswers;
    });
  }, [currentQuestion, locked, moveToNextQuestion, playTone, secondsLeft]);

  useEffect(() => {
    if (phase !== 'active' || locked) return;

    if (secondsLeft <= 0) {
      submitAnswer(null, true);
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [locked, phase, secondsLeft, submitAnswer]);

  useEffect(() => {
    if (phase !== 'active' || locked || !currentQuestion) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const optionIndex = ['a', 'b', 'c', 'd'].indexOf(event.key.toLowerCase());
      if (optionIndex === -1) return;

      const option = currentQuestion.shuffledOptions[optionIndex];
      if (option) submitAnswer(option);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, locked, phase, submitAnswer]);

  const startTest = () => {
    setQuestions(buildEnglishTestQuestions(questionBank));
    setQuestionIndex(0);
    setSecondsLeft(ENGLISH_TEST_SECONDS_PER_QUESTION);
    setSelectedAnswer(null);
    setLocked(false);
    setAnswers([]);
    setResult(null);
    setStartedAt(null);
    setCountdown(3);
    setPhase('countdown');
  };

  useEffect(() => {
    if (!shouldAutoStart || autoStartedRef.current || phase !== 'start') return;

    autoStartedRef.current = true;
    startTest();
  }, [phase, shouldAutoStart]);

  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdown <= 1) {
      const timerId = window.setTimeout(() => {
        setStartedAt(Date.now());
        setPhase('active');
      }, 1000);

      return () => window.clearTimeout(timerId);
    }

    const timerId = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [countdown, phase]);

  const handleFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const instructionItems = useMemo(() => [
    'Total 50 questions with 30 seconds for each question.',
    'The test automatically moves forward when time ends.',
    'A, B, C, D keyboard shortcuts select the visible option.',
    'Once an answer is selected or timed out, it cannot be changed.',
    'Pause is disabled to preserve assessment integrity.',
  ], []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 px-4 py-4 sm:px-6 sm:py-6">
      <header className="mx-auto mb-4 max-w-6xl rounded-lg border bg-white px-4 py-3 sm:mb-6 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="hidden items-center gap-4 text-xs font-medium text-slate-500 sm:flex">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 17s per question</span>
            <span className="inline-flex items-center gap-1"><Keyboard className="h-3.5 w-3.5" /> A/B/C/D</span>
            <span className="inline-flex items-center gap-1"><Volume2 className="h-3.5 w-3.5" /> Sound {soundEnabled ? 'On' : 'Off'}</span>
          </div>
        </div>
      </header>

      {phase === 'start' && (
        <EnglishTestStart
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((current) => !current)}
          onOpenInstructions={() => setInstructionsOpen(true)}
          onStart={startTest}
          onFullscreen={handleFullscreen}
        />
      )}

      {phase === 'countdown' && (
        <section className="mx-auto flex min-h-[55vh] w-full max-w-6xl items-center justify-center rounded-xl border bg-white p-6 text-center shadow-sm">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Starting Set {set.replace('set', '')}</div>
            <div className="mt-6 text-8xl font-bold text-slate-900">{countdown}</div>
            <p className="mt-5 text-sm text-slate-600">Get ready. The first question will appear automatically.</p>
          </div>
        </section>
      )}

      {phase === 'active' && currentQuestion && (
        <EnglishQuestionCard
          question={currentQuestion}
          questionIndex={questionIndex}
          totalQuestions={questions.length}
          secondsLeft={secondsLeft}
          selectedAnswer={selectedAnswer}
          locked={locked}
          onSelectAnswer={(answer) => submitAnswer(answer)}
        />
      )}

      {phase === 'result' && result && (
        <EnglishTestResult
          score={result.score}
          totalQuestions={questions.length}
          correctCount={result.correctCount}
          incorrectCount={result.incorrectCount}
          unansweredCount={result.unansweredCount}
          accuracy={result.accuracy}
          timeTaken={formatDuration(result.timeTakenSeconds)}
          strongestCategory={result.strongestCategory}
          weakestCategory={result.weakestCategory}
          onRestart={startTest}
        />
      )}

      <Dialog open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <DialogContent className="mx-4 w-full max-w-lg border border-slate-200">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle>Test Instructions</DialogTitle>
                <DialogDescription>Read the protocol before entering the assessment.</DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => setInstructionsOpen(false)}
                className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="space-y-3 p-6 pt-4">
            {instructionItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
            <Button onClick={startTest} className="mt-2 w-full bg-slate-950 text-white hover:bg-slate-800">
              Begin Assessment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
