import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
import { HeaderHistoryNav } from '@/components/practice/HeaderHistoryNav';
import { useBfCacheLiveTestRecovery } from '@/hooks/useBfCacheLiveTestRecovery';
import { exitLiveActivity } from '@/lib/appNavigation';
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
  const { user, isAuthenticated, isFirebaseAuthenticated, loading: authLoading, sendPhoneOtp, completePhoneOtp } = useAuth();
  const testId = searchParams.get('testId');

  // Determine which exam page to navigate back to based on current path
  const getBackPath = () => {
    const path = location.pathname;
    if (path.includes('/cds/')) return '/mock-test/cds';
    if (path.includes('/afcat/')) return '/mock-test/afcat';
    if (path.includes('/nda/')) return '/mock-test/nda';
    return '/mock-tests';
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
  const [needsCloudSignIn, setNeedsCloudSignIn] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneAuthBusy, setPhoneAuthBusy] = useState(false);
  const [phoneAuthError, setPhoneAuthError] = useState('');
  const recaptchaContainer = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const [resumeProgress, setResumeProgress] = useState<MockTestProgress | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [progressSaveState, setProgressSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showPlans, setShowPlans] = useState(false);

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  const progressSnapshotRef = useRef({ answers, marked, currentQ });
  progressSnapshotRef.current = { answers, marked, currentQ };
  useEffect(() => () => recaptchaVerifier.current?.clear(), []);

  /* ── Load test ── */
  useEffect(() => {
    if (authLoading) return;
    if (!testId) { setError('No test ID provided'); setLoading(false); return; }
    getMockTestById(testId)
      .then(async (t) => {
        if (!t) {
          setError('Test not found. Please go back and try again.');
          return;
        }
        if (!t.isPublished) {
          setError('This test is not currently published.');
          return;
        }
        setTest(t);
        if (!isAuthenticated || !user?.id) {
          setNeedsCloudSignIn(true);
          return;
        }
        const examTests = await getMockTestsByExam(t.examName);
        if (!isMockTestUnlocked(t.id, examTests, user?.id)) {
          setAccessLocked(true);
          return;
        }
        setAccessLocked(false);
        const localProgress = readLocalMockProgress(user.id, t.id);
        let cloudProgress: MockTestProgress | null;
        if (isFirebaseAuthenticated) {
          try {
            cloudProgress = await getMockTestProgress(user.id, t.id);
          } catch (progressError) {
            if (!localProgress) throw progressError;
            console.warn('Restoring local mock-test progress while cloud sync is unavailable:', progressError);
            cloudProgress = null;
          }
        } else {
          cloudProgress = null;
        }
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
        setNeedsCloudSignIn(false);
      })
      .catch(() => setError('Failed to load test. Check your connection.'))
      .finally(() => setLoading(false));
  }, [testId, user?.id, isAuthenticated, isFirebaseAuthenticated, authLoading]);

  /* ── Timer ── */
  useEffect(() => {
    if (!test || loading || submitted || accessLocked || needsCloudSignIn || showResumePrompt) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmitInternal(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, loading, submitted, accessLocked, needsCloudSignIn, showResumePrompt]);

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

  const requestCandidateOtp = async () => {
    setPhoneAuthError('');
    if (!candidateName.trim()) {
      setPhoneAuthError('Enter your name to continue.');
      return;
    }
    if (!recaptchaContainer.current) {
      setPhoneAuthError('Phone verification could not start. Refresh the page and try again.');
      return;
    }
    setPhoneAuthBusy(true);
    try {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainer.current, { size: 'invisible' });
      const confirmation = await sendPhoneOtp(candidatePhone, recaptchaVerifier.current);
      setPhoneConfirmation(confirmation);
      setPhoneOtpSent(true);
    } catch (authError) {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
      setPhoneAuthError(authError instanceof Error ? authError.message : 'Unable to send an SMS verification code.');
    } finally {
      setPhoneAuthBusy(false);
    }
  };

  const verifyCandidateOtp = async () => {
    if (!phoneConfirmation) return;
    setPhoneAuthError('');
    setPhoneAuthBusy(true);
    try {
      await completePhoneOtp(phoneConfirmation, phoneOtp, candidateName);
    } catch (authError) {
      setPhoneAuthError(authError instanceof Error ? authError.message : 'Unable to verify the SMS code.');
    } finally {
      setPhoneAuthBusy(false);
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
      !test || !user?.id || !isAuthenticated || loading || submitted ||
      accessLocked || needsCloudSignIn || showResumePrompt || screen !== 'exam'
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
      if (isFirebaseAuthenticated) {
        void saveMockTestProgress(user.id, progress)
          .then(() => setProgressSaveState('saved'))
          .catch((saveError: unknown) => {
            console.error('Failed to save mock test progress:', saveError);
            setProgressSaveState('error');
          });
      } else {
        setProgressSaveState('saved');
      }
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
    isAuthenticated,
    isFirebaseAuthenticated,
    loading,
    submitted,
    accessLocked,
    needsCloudSignIn,
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

    let correct = 0, incorrect = 0, negativeMarks = 0, rawScore = 0;

    const answerDetails: ReviewAnswer[] = test.questions.map(q => {
      const answer = answers.find(a => a.questionId === q.id);
      const userAnswer = answer?.selectedIndex ?? null;
      const isUnanswered = userAnswer === null;
      const isCorrect = !isUnanswered && userAnswer === q.correctAnswer;

      if (!isUnanswered) {
        if (isCorrect) { correct++; rawScore += test.positiveMarking; }
        else { incorrect++; rawScore -= test.negativeMarking; negativeMarks += test.negativeMarking; }
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
    const totalMarks = test.questions.length * test.positiveMarking;
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

    if (user && isFirebaseAuthenticated) {
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
        <div className="ex-center">
          <div className="ex-spinner" />
          <div className="ex-center-title">Loading Test…</div>
          <div className="ex-center-sub">Fetching questions from the server</div>
        </div>
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

  if (needsCloudSignIn && test) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ex-lock-wrap">
          <div className="ex-lock-card ex-candidate-card" role="dialog" aria-modal="true" aria-labelledby="candidate-gate-title">
            <div className="ex-candidate-kicker">{test.examName} · Candidate verification</div>
            <h2 id="candidate-gate-title">Before you start</h2>
            <p>Enter your name and mobile number. We’ll verify your number with an SMS code, then start the test and save your progress.</p>
            {phoneAuthError && <div className="ex-candidate-error" role="alert">{phoneAuthError}</div>}
            {!phoneOtpSent ? (
              <div className="ex-candidate-form">
                <label htmlFor="candidate-name">Your name</label>
                <input
                  id="candidate-name"
                  autoComplete="name"
                  value={candidateName}
                  onChange={(event) => setCandidateName(event.target.value)}
                  placeholder="Enter your full name"
                />
                <label htmlFor="candidate-phone">Mobile number</label>
                <input
                  id="candidate-phone"
                  type="tel"
                  autoComplete="tel"
                  value={candidatePhone}
                  onChange={(event) => setCandidatePhone(event.target.value)}
                  placeholder="+91 9876543210"
                />
                <small>Include the country code. Your test timer starts only after verification.</small>
                <button type="button" className="ex-err-btn" onClick={requestCandidateOtp} disabled={phoneAuthBusy}>
                  {phoneAuthBusy ? 'Sending code…' : 'Continue and send OTP'}
                </button>
              </div>
            ) : (
              <div className="ex-candidate-form">
                <p className="ex-candidate-sent">We sent a verification code to {candidatePhone}.</p>
                <label htmlFor="candidate-otp">6-digit SMS code</label>
                <input
                  id="candidate-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(event) => setPhoneOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter code"
                />
                <button type="button" className="ex-err-btn" onClick={verifyCandidateOtp} disabled={phoneAuthBusy || phoneOtp.length !== 6}>
                  {phoneAuthBusy ? 'Verifying…' : 'Verify and start test'}
                </button>
                <button type="button" className="ex-candidate-link" onClick={() => {
                  setPhoneOtpSent(false);
                  setPhoneConfirmation(null);
                  setPhoneOtp('');
                  setPhoneAuthError('');
                }}>
                  Change mobile number
                </button>
              </div>
            )}
            <div ref={recaptchaContainer} />
            <button type="button" className="ex-candidate-cancel" onClick={() => exitToMockList()}>
              Cancel and return to tests
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Error ── */
  if (error || !test) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ex-center">
          <div className="ex-center-title">Oops! Something went wrong</div>
          <div className="ex-center-sub">{error}</div>
          <button className="ex-err-btn" onClick={() => exitToMockList()}>
            ← Back to AFCAT Tests
          </button>
        </div>
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
                <span className="res-raw-item">Raw Score: <span className="res-raw-val">{result.rawScore.toFixed(2)} / {test.questions.length * test.positiveMarking}</span></span>
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
    const earnedMarks = ra?.isCorrect
      ? test.positiveMarking
      : ra?.isUnanswered ? 0 : -test.negativeMarking;
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
              <div className="rev-brand"><span>Enlift Hub</span><span>Dashboard</span><span>Mock Tests</span><span>{test.examName} Dashboard</span><strong>{test.title}</strong></div>
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
                <span>Marks: {earnedMarks > 0 ? '+' : ''}{earnedMarks.toFixed(2)} / +{test.positiveMarking}</span>
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
                    <div className="rev-q-text">{q.question}</div>
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
          <span><strong>Portal:</strong> Enlift Mock Test</span>
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
                <div className="ex-q-text">{currentQuestion.question}</div>
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
