import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Headphones, Keyboard, Maximize2, Radio, Shield, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LISTENING_TEST_REQUIRED_SELECTIONS,
  LISTENING_TEST_SELECTION_SECONDS,
  LISTENING_TEST_TOTAL_QUESTIONS,
  buildListeningTestQuestions,
  listeningTestQuestions,
  type ListeningQuestion,
  type PreparedListeningQuestion,
} from '@/data/listeningTestQuestions';
import { getListeningQuestions } from '@/lib/testDataService';
import { ListeningAudioPlayer } from './components/ListeningAudioPlayer';
import { ListeningProgressBar } from './components/ListeningProgressBar';
import { ListeningResultCard } from './components/ListeningResultCard';
import { ListeningTimer } from './components/ListeningTimer';
import { ListeningWordGrid } from './components/ListeningWordGrid';

type ListeningPhase = 'start' | 'countdown' | 'audio' | 'select' | 'feedback' | 'result';

export interface ListeningAnswerRecord {
  questionId: string;
  audioWords: string[];
  correctAnswers: string[];
  selectedWords: string[];
  correctSelectedCount: number;
  isQuestionCorrect: boolean;
  reactionSeconds: number;
  timedOut: boolean;
}

const keyToOptionIndex: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '0': 9,
  '-': 10,
  '=': 11,
};

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function speakWord(word: string) {
  return new Promise<void>((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.86;
    utterance.pitch = 0.95;
    utterance.volume = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export default function ListeningTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';
  const shouldAutoStart = searchParams.get('start') === '1';
  const [phase, setPhase] = useState<ListeningPhase>('start');
  const [questionBank, setQuestionBank] = useState<ListeningQuestion[]>(listeningTestQuestions);
  const [questions, setQuestions] = useState<PreparedListeningQuestion[]>(() => buildListeningTestQuestions(listeningTestQuestions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(LISTENING_TEST_SELECTION_SECONDS);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [answers, setAnswers] = useState<ListeningAnswerRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const selectionStartedAtRef = useRef<number | null>(null);
  const submittedRef = useRef(false);
  const autoStartedRef = useRef(false);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    const loadAdminQuestions = async () => {
      const firebaseQuestions = await getListeningQuestions(set);
      if (firebaseQuestions.length > 0) {
        setQuestionBank(firebaseQuestions as ListeningQuestion[]);
        setQuestions(buildListeningTestQuestions(firebaseQuestions as ListeningQuestion[]));
      }
    };

    loadAdminQuestions();
  }, [set]);

  const score = useMemo(
    () => answers.filter((answer) => answer.isQuestionCorrect).length,
    [answers],
  );

  const correctWords = useMemo(
    () => answers.reduce((total, answer) => total + answer.correctSelectedCount, 0),
    [answers],
  );

  const averageReactionSpeed = useMemo(() => {
    if (!answers.length) return 0;
    return answers.reduce((total, answer) => total + answer.reactionSeconds, 0) / answers.length;
  }, [answers]);

  const accuracy = Math.round((correctWords / (LISTENING_TEST_TOTAL_QUESTIONS * LISTENING_TEST_REQUIRED_SELECTIONS)) * 100);

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const resetQuestionState = () => {
    submittedRef.current = false;
    setSelectedWords([]);
    setSecondsLeft(LISTENING_TEST_SELECTION_SECONDS);
    setAudioProgress(0);
    selectionStartedAtRef.current = null;
  };

  const startTest = () => {
    window.speechSynthesis?.cancel();
    setQuestions(buildListeningTestQuestions(questionBank));
    setQuestionIndex(0);
    setAnswers([]);
    resetQuestionState();
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
        resetQuestionState();
        setPhase('audio');
      }, 1000);

      return () => window.clearTimeout(timerId);
    }

    const timerId = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [countdown, phase]);

  const moveNext = useCallback((nextAnswers: ListeningAnswerRecord[]) => {
    if (questionIndex >= questions.length - 1) {
      setAnswers(nextAnswers);
      setPhase('result');
      return;
    }

    setAnswers(nextAnswers);
    setQuestionIndex((current) => current + 1);
    resetQuestionState();
    setPhase('audio');
  }, [questionIndex, questions.length]);

  const submitSelection = useCallback((words: string[], timedOut = false) => {
    if (!currentQuestion || submittedRef.current) return;

    submittedRef.current = true;
    const correctSet = new Set(currentQuestion.correctAnswers);
    const correctSelectedCount = words.filter((word) => correctSet.has(word)).length;
    const isQuestionCorrect = correctSelectedCount === LISTENING_TEST_REQUIRED_SELECTIONS && words.length === LISTENING_TEST_REQUIRED_SELECTIONS;
    const reactionSeconds = selectionStartedAtRef.current
      ? Math.min(LISTENING_TEST_SELECTION_SECONDS, (Date.now() - selectionStartedAtRef.current) / 1000)
      : LISTENING_TEST_SELECTION_SECONDS;

    const record: ListeningAnswerRecord = {
      questionId: currentQuestion.testQuestionId,
      audioWords: currentQuestion.audioWords,
      correctAnswers: currentQuestion.correctAnswers,
      selectedWords: words,
      correctSelectedCount,
      isQuestionCorrect,
      reactionSeconds,
      timedOut,
    };

    setPhase('feedback');
    setAnswers((previous) => {
      const next = [...previous, record];
      window.setTimeout(() => moveNext(next), 1400);
      return previous;
    });
  }, [currentQuestion, moveNext]);

  const toggleWord = useCallback((word: string) => {
    if (phase !== 'select' || submittedRef.current) return;

    setSelectedWords((current) => {
      const exists = current.includes(word);
      const next = exists
        ? current.filter((selectedWord) => selectedWord !== word)
        : current.length < LISTENING_TEST_REQUIRED_SELECTIONS
          ? [...current, word]
          : current;

      if (next.length === LISTENING_TEST_REQUIRED_SELECTIONS && !exists) {
        window.setTimeout(() => submitSelection(next), 260);
      }

      return next;
    });
  }, [phase, submitSelection]);

  useEffect(() => {
    if (phase !== 'audio' || !currentQuestion) return;

    let cancelled = false;

    const playTransmission = async () => {
      window.speechSynthesis?.cancel();

      for (let index = 0; index < currentQuestion.audioWords.length; index += 1) {
        if (cancelled) return;

        setAudioProgress((index / currentQuestion.audioWords.length) * 100);
        if (soundEnabled) {
          await speakWord(currentQuestion.audioWords[index]);
        } else {
          await wait(620);
        }
        await wait(1000);
      }

      if (cancelled) return;
      setAudioProgress(100);
      await wait(350);
      selectionStartedAtRef.current = Date.now();
      setPhase('select');
    };

    playTransmission();

    return () => {
      cancelled = true;
      window.speechSynthesis?.cancel();
    };
  }, [currentQuestion, phase, soundEnabled]);

  useEffect(() => {
    if (phase !== 'select' || submittedRef.current) return;

    if (secondsLeft <= 0) {
      submitSelection(selectedWords, true);
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [phase, secondsLeft, selectedWords, submitSelection]);

  useEffect(() => {
    if (phase !== 'select' || !currentQuestion) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const optionIndex = keyToOptionIndex[event.key];
      if (optionIndex === undefined) return;

      const word = currentQuestion.shuffledOptions[optionIndex];
      if (word) toggleWord(word);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, phase, toggleWord]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 sm:px-6 sm:py-6">
      <style>{`
        @keyframes listeningWave {
          0%, 100% { transform: scaleY(0.45); opacity: 0.65; }
          50% { transform: scaleY(1.18); opacity: 1; }
        }
        @keyframes listeningPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(251, 191, 36, 0); }
          50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.22); }
        }
      `}</style>

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
            <span className="inline-flex items-center gap-1"><Radio className="h-3.5 w-3.5" /> One transmission</span>
            <span className="inline-flex items-center gap-1"><Keyboard className="h-3.5 w-3.5" /> 1-0, -, =</span>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="inline-flex items-center gap-1 transition hover:text-emerald-600"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              Sound {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </header>

      {phase === 'start' && (
        <section className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900">
                <Shield className="h-3.5 w-3.5" />
                Cognitive Audio Recall
              </div>
              <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">Listening Test</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Hear four words once, then identify them from twelve candidates under an eight-second recall window.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['30', 'Questions'],
                  ['4', 'Heard Words'],
                  ['8s', 'Recall Timer'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border bg-slate-50 p-4 text-center">
                    <div className="text-3xl font-bold text-slate-900">{value}</div>
                    <div className="mt-1 text-xs font-medium text-slate-600">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button onClick={startTest} className="bg-emerald-600 px-7 text-white hover:bg-emerald-700">
                  Start Listening Test
                </Button>
                <Button onClick={requestFullscreen} variant="outline">
                  <Maximize2 className="h-4 w-4" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </div>

          <aside className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Headphones className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Headphones Recommended</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>Audio plays automatically and cannot be replayed.</p>
              <p>Select exactly four words. The fourth selection submits automatically.</p>
              <p>Keyboard shortcuts map to visible option positions: 1-9, 0, -, =.</p>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="mt-6 flex w-full items-center justify-between rounded-lg border bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <span className="inline-flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Sound Effects
              </span>
              <span className="text-emerald-600">{soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </aside>
        </section>
      )}

      {phase === 'countdown' && (
        <section className="mx-auto flex min-h-[55vh] w-full max-w-6xl items-center justify-center rounded-xl border bg-white p-6 text-center shadow-sm">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-sky-600">Starting Set {set.replace('set', '')}</div>
            <div className="mt-6 text-8xl font-bold text-slate-900">{countdown}</div>
            <p className="mt-5 text-sm text-slate-600">Get ready. The first audio transmission will begin automatically.</p>
          </div>
        </section>
      )}

      {(phase === 'audio' || phase === 'select' || phase === 'feedback') && currentQuestion && (
        <main className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1fr_300px]">
          <section>
            {phase === 'audio' ? (
              <ListeningAudioPlayer progress={audioProgress} muted={!soundEnabled} />
            ) : (
              <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-600">Recall Matrix</div>
                    <h1 className="mt-1 text-xl font-semibold text-slate-900">Select the 4 transmitted words</h1>
                  </div>
                  <ListeningTimer secondsLeft={phase === 'feedback' ? 0 : secondsLeft} />
                </div>
                <ListeningWordGrid
                  options={currentQuestion.shuffledOptions}
                  selectedWords={selectedWords}
                  correctAnswers={currentQuestion.correctAnswers}
                  locked={phase === 'feedback'}
                  onToggleWord={toggleWord}
                />
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <ListeningProgressBar current={questionIndex + 1} total={questions.length} />
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">System State</div>
              <div className="mt-3 rounded-lg border bg-slate-50 p-3 text-sm font-semibold text-slate-900">
                {phase === 'audio' && 'Listening locked'}
                {phase === 'select' && 'Recall active'}
                {phase === 'feedback' && 'Answer review'}
              </div>
              <div className="mt-3 text-xs leading-5 text-slate-500">
                Replay and pause are disabled during the assessment. The next question advances automatically after review.
              </div>
            </div>
            {phase === 'feedback' && (
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-emerald-600">Correct Answers</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentQuestion.correctAnswers.map((word) => (
                    <span key={word} className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </main>
      )}

      {phase === 'result' && (
        <ListeningResultCard
          score={score}
          totalQuestions={LISTENING_TEST_TOTAL_QUESTIONS}
          accuracy={accuracy}
          averageReactionSpeed={averageReactionSpeed}
          correctWords={correctWords}
          totalWords={LISTENING_TEST_TOTAL_QUESTIONS * LISTENING_TEST_REQUIRED_SELECTIONS}
          answers={answers}
          onRestart={startTest}
        />
      )}
    </div>
  );
}
