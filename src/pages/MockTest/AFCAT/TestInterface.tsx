import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { AlertTriangle, ArrowLeft, LoaderCircle, RefreshCw } from 'lucide-react';
import {
  deleteMockTestProgress,
  getMockTestById,
  getMockTestProgress,
  getMockTestsByExam,
  saveMockTestAttempt,
  saveMockTestProgress,
} from '@/lib/mockTestService';
import { isMockTestUnlocked } from '@/lib/mockTestAccess';
import { PremiumPlansModal } from '@/components/mock-test/PremiumPlansModal';
import { createMockTestOrder, loadRazorpayScript } from '@/lib/razorpay';
import { formalCbtStyles as css } from '@/components/mock-test/formalCbtStyles';
import { HeaderHistoryNav } from '@/components/mock-test/HeaderHistoryNav';
import { useBfCacheLiveTestRecovery } from '@/hooks/useBfCacheLiveTestRecovery';
import { exitLiveActivity } from '@/lib/appNavigation';
import { getMockTestMarkingScheme } from '@/lib/mockTestMarking';
import { formatMockQuestionText } from '@/lib/mockTestText';
import { useAuth } from '@/contexts/AuthContext';
import type { MockTest, MockTestProgress, MockTestQuestion } from '@/types/schema';

/* ─── Types ─── */
interface Answer {
  questionId: number;
  selectedIndex: number;
}

interface ReviewAnswer {
  questionId: number;
  question: string;
  userAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
  topic: string;
}

interface ResultData {
  correct: number;
  incorrect: number;
  unanswered: number;
  rawScore: number;
  scorePercent: number;
  timeTaken: number;
  negativeMarks: number;
  answers: ReviewAnswer[];
}

type Screen = 'exam' | 'result' | 'review';
type ReviewFilter = 'all' | 'correct' | 'incorrect' | 'skipped';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getLocalProgressKey(userId: string, testId: string): string {
  return `enlift-mock-progress:${userId}:${testId}`;
}

function readLocalMockProgress(userId: string, testId: string): MockTestProgress | null {
  const key = getLocalProgressKey(userId, testId);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    const value: unknown = JSON.parse(stored);
    if (
      typeof value === 'object' &&
      value !== null &&
      'testId' in value &&
      value.testId === testId &&
      'answers' in value &&
      Array.isArray(value.answers) &&
      'markedQuestionIds' in value &&
      Array.isArray(value.markedQuestionIds) &&
      'currentQuestion' in value &&
      typeof value.currentQuestion === 'number' &&
      'remainingSeconds' in value &&
      typeof value.remainingSeconds === 'number' &&
      'savedAtMs' in value &&
      typeof value.savedAtMs === 'number'
    ) {
      return value as MockTestProgress;
    }
  } catch {
    localStorage.removeItem(key);
    return null;
  }
  localStorage.removeItem(key);
  return null;
}

export default function AFCATTestInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const testId = searchParams.get('testId');

  // Determine which exam page to navigate back to based on current path
  const getBackPath = () => {
    const path = location.pathname;
    if (path.includes('/cds/')) return '/mock-test/cds';
    if (path.includes('/afcat/')) return '/mock-test/afcat';
    if (path.includes('/nda/')) return '/mock-test/nda';
    return '/dashboard';
  };

  const exitToMockList = () => exitLiveActivity(navigate, getBackPath());
  useBfCacheLiveTestRecovery(getBackPath());

  /* ── State ── */
  const [test, setTest]       = useState<MockTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [screen, setScreen]   = useState<Screen>('exam');

  const [currentQ, setCurrentQ]         = useState(0);
  const [answers, setAnswers]           = useState<Answer[]>([]);
  const [marked, setMarked]             = useState<number[]>([]);
  const [timeLeft, setTimeLeft]         = useState(0);
  const [submitted, setSubmitted]       = useState(false);
  const [result, setResult]             = useState<ResultData | null>(null);
  const [reviewIdx, setReviewIdx]       = useState(0);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [accessLocked, setAccessLocked] = useState(false);
  const [resumeProgress, setResumeProgress] = useState<MockTestProgress | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [progressSaveState, setProgressSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showPlans, setShowPlans] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  const progressSnapshotRef = useRef({ answers, marked, currentQ });
  progressSnapshotRef.current = { answers, marked, currentQ };

  /* ── Load test ── */
  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    setError(null);
    setTest(null);
    setAccessLocked(false);
    if (!testId) {
      setError('No test ID was provided. Go back to the exam page and select a paper.');
      setLoading(false);
      return;
    }

    let active = true;
    getMockTestById(testId)
      .then(async (t) => {
        if (!active) return;
        if (!t) {
          setError('This paper could not be found. It may have been removed or its link may be incorrect.');
          return;
        }
        if (!t.isPublished) {
          setError('This paper is not currently available. Please choose another paper.');
          return;
        }
        setTest(t);
        if (!user?.id) {
          setError('Please log in to take this paper.');
          return;
        }
        const examTests = await getMockTestsByExam(t.examName);
        if (!active) return;
        if (!isMockTestUnlocked(t.id, examTests, user?.id)) {
          setAccessLocked(true);
          return;
        }
        setAccessLocked(false);
        const localProgress = readLocalMockProgress(user.id, t.id);
        let cloudProgress: MockTestProgress | null;
        try {
          cloudProgress = await getMockTestProgress(user.id, t.id);
        } catch (progressError) {
          if (!localProgress) throw progressError;
          console.warn('Restoring local mock-test progress while cloud sync is unavailable:', progressError);
          cloudProgress = null;
        }
        if (!active) return;
        const savedProgress =
          localProgress && (!cloudProgress || localProgress.savedAtMs > cloudProgress.savedAtMs)
            ? localProgress
            : cloudProgress;
        if (savedProgress) {
          setResumeProgress(savedProgress);
          setTimeLeft(Math.max(
            0,
            savedProgress.remainingSeconds - Math.floor((Date.now() - savedProgress.savedAtMs) / 1000),
          ));
          setShowResumePrompt(true);
        } else {
          setResumeProgress(null);
          setShowResumePrompt(false);
          setTimeLeft(t.duration * 60);
        }
      })
      .catch((loadError: unknown) => {
        console.error('Failed to load mock test paper:', loadError);
        if (active) setError('We couldn’t load this paper. Check your connection and try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [testId, user?.id, authLoading, loadAttempt]);

  /* ── Timer ── */
  useEffect(() => {
    if (!test || loading || submitted || accessLocked || showResumePrompt) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmitInternal(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, loading, submitted, accessLocked, showResumePrompt]);

  /* ── Helpers ── */
  const questions: MockTestQuestion[] = test?.questions ?? [];
  const currentQuestion = questions[currentQ];
  const reviewIndexes = result
    ? result.answers.reduce<number[]>((indexes, answer, index) => {
        const included =
          reviewFilter === 'all' ||
          (reviewFilter === 'correct' && answer.isCorrect) ||
          (reviewFilter === 'incorrect' && !answer.isCorrect && !answer.isUnanswered) ||
          (reviewFilter === 'skipped' && answer.isUnanswered);
        if (included) indexes.push(index);
        return indexes;
      }, [])
    : [];
  const reviewPosition = reviewIndexes.indexOf(reviewIdx);

  const buyLockedTest = async () => {
    if (!test || !user) return;
    if (!test.price || test.price <= 0) {
      alert('This test does not have a valid price. Please contact support.');
      return;
    }
    try {
      await loadRazorpayScript();
      await createMockTestOrder(
        user.fullName,
        user.email,
        user.phoneNumber || '',
        user.id,
        test.id,
        test.title,
        test.price ?? 0,
      );
    } catch (paymentError) {
      alert(paymentError instanceof Error ? paymentError.message : 'Unable to start payment. Please try again.');
    }
  };

  const getSelectedIndex = (qId: number) =>
    answers.find(a => a.questionId === qId)?.selectedIndex ?? null;

  const selectAnswer = (qId: number, idx: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === qId);
      if (existing) return prev.map(a => a.questionId === qId ? { ...a, selectedIndex: idx } : a);
      return [...prev, { questionId: qId, selectedIndex: idx }];
    });
  };

  const clearAnswer = (qId: number) => {
    setAnswers(prev => prev.filter(a => a.questionId !== qId));
  };

  const toggleMark = (qId: number) => {
    setMarked(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]);
  };

  const getStatus = (qId: number) => {
    if (marked.includes(qId)) return 'marked';
    if (answers.find(a => a.questionId === qId)) return 'answered';
    return 'unanswered';
  };

  const resumeSavedProgress = () => {
    if (!resumeProgress) return;
    setAnswers(resumeProgress.answers);
    setMarked(resumeProgress.markedQuestionIds);
    setCurrentQ(Math.max(0, Math.min(resumeProgress.currentQuestion, Math.max(questions.length - 1, 0))));
    setTimeLeft(Math.max(
      0,
      resumeProgress.remainingSeconds - Math.floor((Date.now() - resumeProgress.savedAtMs) / 1000),
    ));
    setShowResumePrompt(false);
  };

  const startTestFresh = async () => {
    if (!test || !user?.id) return;
    try {
      await deleteMockTestProgress(user.id, test.id);
      localStorage.removeItem(getLocalProgressKey(user.id, test.id));
      setResumeProgress(null);
      setAnswers([]);
      setMarked([]);
      setCurrentQ(0);
      setTimeLeft(test.duration * 60);
      setSubmitted(false);
      setResult(null);
      setShowResumePrompt(false);
      setScreen('exam');
      setProgressSaveState('saved');
    } catch (progressError) {
      alert(progressError instanceof Error ? progressError.message : 'Could not clear saved progress. Please try again.');
    }
  };

  useEffect(() => {
    if (
      !test || !user?.id || loading || submitted ||
      accessLocked || showResumePrompt || screen !== 'exam'
    ) return;

    const save = () => {
      const snapshot = progressSnapshotRef.current;
      const progress: MockTestProgress = {
        testId: test.id,
        answers: snapshot.answers,
        markedQuestionIds: snapshot.marked,
        currentQuestion: snapshot.currentQ,
        remainingSeconds: timeLeftRef.current,
        savedAtMs: Date.now(),
      };
      try {
        localStorage.setItem(getLocalProgressKey(user.id, test.id), JSON.stringify(progress));
      } catch (storageError) {
        console.error('Failed to save local mock test progress:', storageError);
      }
      setProgressSaveState('saving');
      void saveMockTestProgress(user.id, progress)
        .then(() => setProgressSaveState('saved'))
        .catch((saveError: unknown) => {
          console.error('Failed to save mock test progress:', saveError);
          setProgressSaveState('error');
        });
    };

    const debounce = window.setTimeout(save, 500);
    const heartbeat = window.setInterval(save, 10000);
    window.addEventListener('pagehide', save);
    return () => {
      window.clearTimeout(debounce);
      window.clearInterval(heartbeat);
      window.removeEventListener('pagehide', save);
    };
  }, [
    test,
    user?.id,
    loading,
    submitted,
    accessLocked,
    showResumePrompt,
    screen,
    answers,
    marked,
    currentQ,
  ]);

  /* ── Submit ── */
  const handleSubmitInternal = async () => {
    if (!test) return;
    setSubmitted(true);

    const marking = getMockTestMarkingScheme(test.examName, test);
    let correct = 0, incorrect = 0, negativeMarks = 0, rawScore = 0;

    const answerDetails: ReviewAnswer[] = test.questions.map(q => {
      const answer = answers.find(a => a.questionId === q.id);
      const userAnswer = answer?.selectedIndex ?? null;
      const isUnanswered = userAnswer === null;
      const isCorrect = !isUnanswered && userAnswer === q.correctAnswer;

      if (!isUnanswered) {
        if (isCorrect) { correct++; rawScore += marking.positiveMarking; }
        else { incorrect++; rawScore -= marking.negativeMarking; negativeMarks += marking.negativeMarking; }
      }

      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        isUnanswered,
        explanation: q.explanation,
        topic: q.subject,
      };
    });

    const finalScore = Math.max(0, rawScore);
    const totalAnswered = correct + incorrect;
    const totalMarks = test.questions.length * marking.positiveMarking;
    const scorePercent = totalMarks > 0 ? Math.round((finalScore / totalMarks) * 100) : 0;
    const timeTaken = (test.duration * 60) - timeLeftRef.current;

    const resultData: ResultData = {
      correct,
      incorrect,
      unanswered: test.questions.length - totalAnswered,
      rawScore: finalScore,
      scorePercent,
      timeTaken,
      negativeMarks,
      answers: answerDetails,
    };

    setResult(resultData);
    setScreen('result');

    if (user?.id) {
      try {
        await saveMockTestAttempt(user.id, {
          testId: test.id,
          testTitle: test.title,
          examType: test.examType,
          examName: test.examName,
          score: scorePercent,
          correct,
          incorrect,
          total: test.questions.length,
          totalMarks,
          totalAnswered,
          totalUnanswered: test.questions.length - totalAnswered,
          rawScore: finalScore,
          negativeMarks,
          timeTaken,
          timeLimit: test.duration * 60,
          answers: answerDetails,
          completedAt: new Date().toISOString(),
          passingScore: test.passingScore,
          isPassed: scorePercent >= test.passingScore,
        });
        await deleteMockTestProgress(user.id, test.id);
        localStorage.removeItem(getLocalProgressKey(user.id, test.id));
      } catch (err) {
        console.error('Failed to save attempt:', err);
      }
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10" role="status" aria-live="polite">
          <section className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="h-1 bg-gradient-to-r from-sky-800 via-sky-500 to-amber-400" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-800">
                  <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-800">Mock test portal</p>
                  <h1 className="mt-1 text-xl font-bold text-slate-950">Preparing your paper</h1>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                We’re securely loading the questions and your saved progress. This usually takes a few seconds.
              </p>
              <div className="mt-6 space-y-3" aria-hidden="true">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-20 animate-pulse rounded-lg border border-slate-100 bg-slate-50" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
              </div>
              <p className="mt-5 text-xs text-slate-500">Please keep this page open while the paper loads.</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (accessLocked && test) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ex-lock-wrap">
          <div className="ex-lock-card">
            <h2>Paper locked</h2>
            <p>
              <strong>{test.title}</strong>{' '}
              {test.isFree === false
                ? `is available for ₹${test.price ?? 0}. Complete payment to unlock this paper.`
                : 'requires Mock Tests Complete or All Access.'}
            </p>
            {test.isFree === false ? (
              <button type="button" className="ex-err-btn" onClick={buyLockedTest}>
                Unlock for ₹{test.price ?? 0}
              </button>
            ) : (
              <button type="button" className="ex-err-btn" onClick={() => setShowPlans(true)}>
                View premium plans
              </button>
            )}
            <button type="button" className="ex-err-btn" style={{ marginTop: 10, background: '#64748b' }} onClick={() => exitToMockList()}>
              Back to dashboard
            </button>
          </div>
        </div>
        {test.isFree !== false && (
          <PremiumPlansModal open={showPlans} onClose={() => setShowPlans(false)} highlight="mock-complete" />
        )}
      </>
    );
  }

  /* ── Error ── */
  if (error || !test) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
          <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-center shadow-lg sm:p-8" role="alert">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <AlertTriangle className="h-6 w-6" aria-hidden />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Paper unavailable</p>
            <h1 className="mt-1 text-xl font-bold text-slate-950">We couldn’t open this paper</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{error || 'The selected paper is unavailable.'}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-900"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Try again
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                onClick={() => exitToMockList()}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to tests
              </button>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (screen === 'exam' && showResumePrompt && resumeProgress) {
    const savedDate = new Date(resumeProgress.savedAtMs);
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ex-lock-wrap">
          <div className="ex-lock-card">
            <h2>Resume your test?</h2>
            <p>
              We found saved progress for <strong>{test.title}</strong>:
              {' '}{resumeProgress.answers.length} answered question{resumeProgress.answers.length === 1 ? '' : 's'} and
              {' '}{formatTime(Math.max(0, resumeProgress.remainingSeconds - Math.floor((Date.now() - resumeProgress.savedAtMs) / 1000)))} remaining.
            </p>
            <p className="ex-center-sub">
              Last saved {Number.isNaN(savedDate.getTime()) ? 'recently' : savedDate.toLocaleString()}
            </p>
            <button type="button" className="ex-err-btn" onClick={resumeSavedProgress}>
              Resume test
            </button>
            <button
              type="button"
              className="ex-err-btn"
              style={{ marginTop: 10, background: '#64748b' }}
              onClick={startTestFresh}
            >
              Start over
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Result Screen ── */
  if (screen === 'result' && result) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="res-wrap">
          <div className="res-card">
            <div className="res-head">
              <div className="res-score-lbl">Your Score</div>
              <div className="res-score">{result.scorePercent}%</div>
              <div className="res-title">{test.title}</div>
              <div className="res-sub">{test.examName} · {test.subject}</div>
            </div>
            <div className="res-body">
              <div className="res-grid">
                <div className="res-stat res-stat-correct">
                  <div className="res-stat-val">{result.correct}</div>
                  <div className="res-stat-lbl">Correct</div>
                </div>
                <div className="res-stat res-stat-wrong">
                  <div className="res-stat-val">{result.incorrect}</div>
                  <div className="res-stat-lbl">Wrong</div>
                </div>
                <div className="res-stat res-stat-skip">
                  <div className="res-stat-val">{result.unanswered}</div>
                  <div className="res-stat-lbl">Skipped</div>
                </div>
              </div>
              <div className="res-raw">
                <span className="res-raw-item">Raw Score: <span className="res-raw-val">{result.rawScore.toFixed(2)} / {test.questions.length * getMockTestMarkingScheme(test.examName, test).positiveMarking}</span></span>
                <span className="res-raw-item">Negative Marks: <span className="res-raw-val" style={{ color: '#991b1b' }}>−{result.negativeMarks.toFixed(2)}</span></span>
                <span className="res-raw-item">Time: <span className="res-raw-val">{formatTime(result.timeTaken)}</span></span>
              </div>
              <div className="res-btns">
                <button className="res-btn res-btn-outline" onClick={() => exitToMockList()}>
                  ← Back to Tests
                </button>
                <button className="res-btn res-btn-primary" onClick={() => { setScreen('review'); setReviewIdx(0); }}>
                  Review Answers
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Review Screen ── */
  if (screen === 'review' && result) {
    const q = questions[reviewIdx];
    const ra = result.answers.find(a => a.questionId === q.id);
    const marking = getMockTestMarkingScheme(test.examName, test);
    const earnedMarks = ra?.isCorrect
      ? marking.positiveMarking
      : ra?.isUnanswered ? 0 : -marking.negativeMarking;
    const reviewFilterOptions: { id: ReviewFilter; label: string; count: number }[] = [
      { id: 'all', label: 'All', count: result.answers.length },
      { id: 'correct', label: 'Correct', count: result.correct },
      { id: 'incorrect', label: 'Incorrect', count: result.incorrect },
      { id: 'skipped', label: 'Skipped', count: result.unanswered },
    ];

    const setReviewFilterAndQuestion = (filter: ReviewFilter) => {
      setReviewFilter(filter);
      const nextIndex = result.answers.findIndex((answer) =>
        filter === 'all' ||
        (filter === 'correct' && answer.isCorrect) ||
        (filter === 'incorrect' && !answer.isCorrect && !answer.isUnanswered) ||
        (filter === 'skipped' && answer.isUnanswered),
      );
      if (nextIndex >= 0) setReviewIdx(nextIndex);
    };

    const moveReview = (direction: -1 | 1) => {
      const nextPosition = reviewPosition + direction;
      const nextIndex = reviewIndexes[nextPosition];
      if (nextIndex !== undefined) setReviewIdx(nextIndex);
    };

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="rev-wrap">
          <div className="rev-shell">
            <header className="rev-topbar">
              <div className="rev-brand"><span>Fauji Grid</span><span>Dashboard</span><span>Mock Tests</span><span>{test.examName} Dashboard</span><strong>{test.title}</strong></div>
              <div className="rev-topbar-meta"><span>Session: Review Mode</span><span>Candidate: {user?.fullName || 'Guest'}</span></div>
            </header>

            <div className="rev-toolbar">
              <div className="rev-toolbar-title">
                <h1>Answer Review: {test.title}</h1>
                <span>{test.examName} · {test.subject}</span>
              </div>
              <div className="rev-filter-list" aria-label="Filter questions by result">
                {reviewFilterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={option.count === 0}
                    aria-pressed={reviewFilter === option.id}
                    className={`rev-filter${reviewFilter === option.id ? ' active' : ''}`}
                    onClick={() => setReviewFilterAndQuestion(option.id)}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
              <div className="rev-current-meta">
                <span>Question {reviewIdx + 1} of {questions.length}</span>
                <span>{ra?.isUnanswered ? 'Skipped' : ra?.isCorrect ? 'Correct' : 'Incorrect'}</span>
                <span>Marks: {earnedMarks > 0 ? '+' : ''}{earnedMarks.toFixed(2)} / +{marking.positiveMarking}</span>
              </div>
            </div>

            <main className="rev-content">
              <section className="rev-main-column">
                <article className="rev-card">
                  <header className="rev-card-head">
                    <span className="rev-q-label">QUESTION {reviewIdx + 1}</span>
                    <span className={`rev-badge ${ra?.isUnanswered ? 'rev-badge-skip' : ra?.isCorrect ? 'rev-badge-correct' : 'rev-badge-wrong'}`}>
                      {ra?.isUnanswered ? 'Skipped by you' : ra?.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="rev-topic">{q.subject}{q.source ? ` · ${q.source}` : ''}</span>
                  </header>
                  <div className="rev-card-body">
                    {q.passage && <div className="rev-q-text" style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{q.passage}</div>}
                    <div className="rev-q-text">{formatMockQuestionText(q.question)}</div>
                    {q.imageUrl && <img src={q.imageUrl} alt={`Question ${q.id} diagram`} style={{ display: 'block', maxWidth: '100%', maxHeight: 420, objectFit: 'contain', margin: '16px 0', borderRadius: 8 }} />}
                    {ra?.isUnanswered && (
                      <div className="rev-outcome rev-outcome-skip">
                        You did not attempt this question. Correct answer is Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]}).
                      </div>
                    )}
                    {ra && !ra.isUnanswered && !ra.isCorrect && (
                      <div className="rev-outcome rev-outcome-wrong">
                        Your answer: Option {String.fromCharCode(65 + (ra.userAnswer ?? 0))}. Correct answer: Option {String.fromCharCode(65 + q.correctAnswer)}.
                      </div>
                    )}
                    <div className="rev-options">
                      {q.options.map((opt, idx) => {
                        const isUserAns = ra?.userAnswer === idx;
                        const isCorrectAns = idx === q.correctAnswer;
                        const cls = isCorrectAns ? 'rev-option-correct' : isUserAns ? 'rev-option-wrong' : 'rev-option-neutral';
                        return (
                          <div key={idx} className={`rev-option ${cls}`}>
                            <span className="rev-opt-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="rev-opt-text">{opt}</span>
                            {isCorrectAns && <span className="rev-option-tag">✓ Correct answer</span>}
                            {isUserAns && !isCorrectAns && <span className="rev-option-tag">✕ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <section className="rev-expl">
                        <div className="rev-expl-heading">Detailed explanation</div>
                        <div className="rev-expl-text">{q.explanation}</div>
                      </section>
                    )}
                  </div>
                </article>
                <div className="rev-nav">
                  <button className="rev-nav-btn" disabled={reviewPosition <= 0} onClick={() => moveReview(-1)}>
                    ← Previous
                  </button>
                  <button className="rev-nav-btn rev-back-results" onClick={() => setScreen('result')}>
                    Back to Results
                  </button>
                  <button className="rev-nav-btn" disabled={reviewPosition < 0 || reviewPosition >= reviewIndexes.length - 1} onClick={() => moveReview(1)}>
                    Next →
                  </button>
                </div>
              </section>

              <aside className="rev-palette">
                <div className="rev-palette-heading">
                  <div><strong>Question Palette</strong><span>Jump directly to review</span></div>
                  <b>{questions.length} Total</b>
                </div>
                <div className="rev-palette-legend">
                  <span><i className="correct" />Correct</span>
                  <span><i className="wrong" />Incorrect</span>
                  <span><i className="skipped" />Skipped</span>
                  <span><i className="current" />Viewing</span>
                </div>
                <div className="rev-palette-grid">
                  {result.answers.map((answer, index) => (
                    <button
                      key={answer.questionId}
                      type="button"
                      aria-label={`Question ${index + 1}: ${answer.isUnanswered ? 'skipped' : answer.isCorrect ? 'correct' : 'incorrect'}`}
                      aria-current={reviewIdx === index ? 'true' : undefined}
                      className={`rev-palette-btn ${
                        answer.isUnanswered ? 'skipped' : answer.isCorrect ? 'correct' : 'wrong'
                      }${reviewIdx === index ? ' current' : ''}`}
                      onClick={() => {
                        setReviewFilter('all');
                        setReviewIdx(index);
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <p className="rev-palette-help">Click any question number to inspect your response and explanation.</p>
              </aside>
            </main>
          </div>
        </div>
      </>
    );
  }

  /* ── Exam Screen ── */
  if (!currentQuestion) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ex-wrap">
        <div className="ex-subbar">
          <span><strong>Candidate:</strong> {user?.fullName || 'Guest'}</span>
          <span className={`ex-save-status ${progressSaveState}`} aria-live="polite">
            <strong>Progress:</strong>{' '}
            {progressSaveState === 'saving' ? 'Saving…' : progressSaveState === 'error' ? 'Could not sync' : 'Saved to account'}
          </span>
          <span><strong>Portal:</strong> Fauji Grid Mock Test</span>
        </div>

        {/* Topbar */}
        <div className="ex-topbar" style={{ position: 'relative' }}>
          <div className="ex-topbar-left">
            <HeaderHistoryNav backFallback={getBackPath()} onBack={exitToMockList} iconOnly />
            <div className="ex-brand">CBT</div>
            <div>
              <div className="ex-exam-title">{test.title}</div>
              <div className="ex-exam-sub">{test.examName} · {test.subject}</div>
            </div>
          </div>
          <div className="ex-topbar-right">
          <div className={`ex-timer${timeLeft < 300 ? ' urgent' : ''}`}>
            ◷ {formatTime(timeLeft)}
          </div>
          <button type="button" className="ex-submit-top" onClick={handleSubmitInternal}>
            Submit Test
          </button>
          </div>
        </div>

        <div className="ex-body">
          {/* Question Panel */}
          <div className="ex-q-panel">
            <div className="ex-q-card">
              <div className="ex-q-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="ex-q-num">Question {currentQ + 1} / {questions.length}</div>
                  <div className="ex-q-subj">{currentQuestion.subject}</div>
                </div>
                <button
                  className={`ex-flag-btn${marked.includes(currentQuestion.id) ? ' flagged' : ''}`}
                  onClick={() => toggleMark(currentQuestion.id)}
                >
                  {marked.includes(currentQuestion.id) ? '⚑ Marked' : '⚐ Mark'}
                </button>
              </div>

              <div className="ex-q-body">
                {currentQuestion.passage && <div className="ex-q-text" style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{currentQuestion.passage}</div>}
                <div className="ex-q-text">{formatMockQuestionText(currentQuestion.question)}</div>
                {currentQuestion.imageUrl && <img src={currentQuestion.imageUrl} alt={`Question ${currentQuestion.id} diagram`} style={{ display: 'block', maxWidth: '100%', maxHeight: 420, objectFit: 'contain', margin: '16px 0', borderRadius: 8 }} />}
                <div className="ex-options">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = getSelectedIndex(currentQuestion.id) === idx;
                    return (
                      <button
                        key={idx}
                        className={`ex-option${isSelected ? ' selected' : ''}`}
                        onClick={() => selectAnswer(currentQuestion.id, idx)}
                      >
                        <div className="ex-opt-letter">{String.fromCharCode(65 + idx)}</div>
                        <span className="ex-opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ex-q-foot">
                <button
                  className="ex-nav-btn"
                  disabled={currentQ === 0}
                  onClick={() => setCurrentQ(p => p - 1)}
                >
                  ← Previous
                </button>
                {getSelectedIndex(currentQuestion.id) !== null && (
                  <button className="ex-clear-btn" onClick={() => clearAnswer(currentQuestion.id)}>
                    Clear Response
                  </button>
                )}
                <button
                  className="ex-nav-btn"
                  disabled={currentQ === questions.length - 1}
                  onClick={() => setCurrentQ(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Palette */}
          <div className="ex-palette">
            <div className="ex-palette-title">Question Palette</div>
            <div className="ex-palette-grid">
              {questions.map((q, idx) => {
                const st = getStatus(q.id);
                return (
                  <button
                    key={q.id}
                    className={`ex-p-btn${st === 'answered' ? ' answered' : st === 'marked' ? ' marked' : ''}${currentQ === idx ? ' current' : ''}`}
                    onClick={() => setCurrentQ(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="ex-legend">
              <div className="ex-legend-item">
                <div className="ex-legend-dot" style={{ background: '#16a34a' }} />
                Answered ({answers.length})
              </div>
              <div className="ex-legend-item">
                <div className="ex-legend-dot" style={{ background: '#f59e0b' }} />
                Marked ({marked.length})
              </div>
              <div className="ex-legend-item">
                <div className="ex-legend-dot" style={{ background: 'var(--paper-3)' }} />
                Not Visited ({questions.length - answers.length - marked.filter(id => !answers.find(a => a.questionId === id)).length})
              </div>
            </div>
            <button className="ex-palette-submit" onClick={handleSubmitInternal}>
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
