import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { getMockTestById, saveMockTestAttempt } from '@/lib/mockTestService';
import { useAuth } from '@/contexts/AuthContext';
import type { MockTest, MockTestQuestion } from '@/types/schema';

/* ─── Inline CSS — same ink/gold/paper theme as listing page ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f1923; --ink-2: #2c3e50; --ink-3: #64748b;
    --paper: #f5f2ee; --paper-2: #ede9e3; --paper-3: #e2ddd6;
    --gold: #c9a84c; --gold-light: #f0d98a;
    --radius: 14px; --shadow: 0 4px 24px rgba(15,25,35,.08); --shadow-lg: 0 12px 40px rgba(15,25,35,.14);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }

  /* ── Exam Layout ── */
  .ex-wrap { display: flex; flex-direction: column; height: 100vh; background: var(--paper); overflow: hidden; }

  .ex-topbar {
    background: var(--ink); padding: 0 20px; height: 56px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .ex-topbar-left { display: flex; align-items: center; gap: 14px; }
  .ex-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); border-radius: 7px;
    color: rgba(255,255,255,.7); font-size: .75rem; font-weight: 600;
    padding: 6px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ex-back-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
  .ex-exam-title { font-family: 'Playfair Display', serif; font-size: .95rem; color: #fff; }
  .ex-exam-sub { font-size: .68rem; color: rgba(255,255,255,.4); margin-top: 1px; }
  .ex-timer {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.1); border-radius: 8px; padding: 6px 14px;
    font-weight: 700; color: var(--gold); font-size: .92rem; letter-spacing: .03em;
    font-variant-numeric: tabular-nums;
  }
  .ex-timer.urgent { background: rgba(139,26,26,.4); color: #fca5a5; }
  .ex-submit-top {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--gold); color: var(--ink); border: none; border-radius: 8px;
    padding: 8px 18px; font-size: .8rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ex-submit-top:hover { background: var(--gold-light); }

  .ex-body { flex: 1; display: flex; overflow: hidden; }

  /* ── Question Panel ── */
  .ex-q-panel { flex: 1; overflow-y: auto; padding: 20px; }
  .ex-q-card {
    background: white; border-radius: var(--radius);
    border: 1px solid var(--paper-3); box-shadow: var(--shadow);
  }
  .ex-q-head {
    padding: 14px 20px; border-bottom: 1px solid var(--paper-3);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ex-q-num {
    font-size: .7rem; font-weight: 700; color: var(--ink-3);
    text-transform: uppercase; letter-spacing: .07em;
  }
  .ex-q-subj {
    font-size: .68rem; font-weight: 600; padding: 3px 9px; border-radius: 5px;
    background: var(--paper); color: var(--ink-3); border: 1px solid var(--paper-3);
  }
  .ex-flag-btn {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .72rem; font-weight: 600; color: var(--ink-3);
    background: var(--paper); border: 1px solid var(--paper-3); border-radius: 6px;
    padding: 5px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ex-flag-btn.flagged { border-color: #f59e0b; color: #b45309; background: #fef3c7; }

  .ex-q-body { padding: 22px 20px; }
  .ex-q-text {
    font-size: 1rem; color: var(--ink); line-height: 1.7; font-weight: 500; margin-bottom: 22px;
  }
  .ex-options { display: flex; flex-direction: column; gap: 10px; }
  .ex-option {
    display: flex; align-items: center; gap: 14px;
    background: var(--paper); border: 1.5px solid var(--paper-3); border-radius: 10px;
    padding: 13px 16px; cursor: pointer; transition: all .15s;
    text-align: left; width: 100%; font-family: 'DM Sans', sans-serif;
  }
  .ex-option:hover { border-color: var(--gold); background: #fffbeb; }
  .ex-option.selected { border-color: var(--gold); background: #fffbeb; }
  .ex-opt-letter {
    width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--paper-3);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: .78rem; color: var(--ink-3); flex-shrink: 0; transition: all .15s;
  }
  .ex-option.selected .ex-opt-letter { border-color: var(--gold); background: var(--gold); color: var(--ink); }
  .ex-opt-text { font-size: .88rem; color: var(--ink-2); font-weight: 500; }

  .ex-q-foot {
    padding: 14px 20px; border-top: 1px solid var(--paper-3);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ex-nav-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .8rem; font-weight: 600; color: var(--ink-3);
    background: white; border: 1.5px solid var(--paper-3); border-radius: 8px;
    padding: 9px 18px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ex-nav-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--ink); }
  .ex-nav-btn:disabled { opacity: .35; cursor: not-allowed; }
  .ex-clear-btn {
    font-size: .75rem; font-weight: 600; color: var(--ink-3);
    background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: underline; transition: color .15s;
  }
  .ex-clear-btn:hover { color: var(--crimson, #8b1a1a); }

  /* ── Question Palette ── */
  .ex-palette {
    width: 256px; background: white; border-left: 1px solid var(--paper-3);
    padding: 18px; overflow-y: auto; flex-shrink: 0;
  }
  .ex-palette-title {
    font-family: 'Playfair Display', serif; font-size: .88rem; color: var(--ink); margin-bottom: 14px;
  }
  .ex-palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; margin-bottom: 18px; }
  .ex-p-btn {
    width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid var(--paper-3);
    background: white; font-size: .76rem; font-weight: 700; color: var(--ink-3);
    cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center;
  }
  .ex-p-btn.answered { background: #16a34a; border-color: #16a34a; color: white; }
  .ex-p-btn.marked   { background: #f59e0b; border-color: #f59e0b; color: white; }
  .ex-p-btn.current  { box-shadow: 0 0 0 2.5px var(--gold); }

  .ex-legend { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
  .ex-legend-item { display: flex; align-items: center; gap: 8px; font-size: .7rem; color: var(--ink-3); font-weight: 500; }
  .ex-legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }

  .ex-palette-submit {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--ink); color: white; border: none; border-radius: 8px;
    padding: 11px; font-size: .85rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ex-palette-submit:hover { background: var(--gold); color: var(--ink); }

  /* ── Loading / Error ── */
  .ex-center {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--paper); gap: 14px; padding: 24px;
  }
  .ex-center-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--ink); }
  .ex-center-sub { font-size: .82rem; color: var(--ink-3); text-align: center; }
  .ex-spinner {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid var(--paper-3); border-top-color: var(--gold);
    animation: exSpin .75s linear infinite;
  }
  @keyframes exSpin { to { transform: rotate(360deg); } }
  .ex-err-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--ink); color: white; border: none; border-radius: 8px;
    padding: 10px 22px; font-size: .85rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ex-err-btn:hover { background: var(--gold); color: var(--ink); }

  /* ── Result Screen ── */
  .res-wrap { min-height: 100vh; background: var(--paper); padding: 32px 16px; display: flex; align-items: center; justify-content: center; }
  .res-card {
    background: white; border-radius: 20px; box-shadow: var(--shadow-lg);
    border: 1px solid var(--paper-3); max-width: 560px; width: 100%; overflow: hidden;
  }
  .res-head {
    background: var(--ink); padding: 32px; text-align: center; position: relative; overflow: hidden;
  }
  .res-head::before {
    content: ''; position: absolute; inset: 0; opacity: .04;
    background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
    background-size: 20px 20px;
  }
  .res-glow {
    position: absolute; right: -40px; top: -40px; width: 180px; height: 180px; border-radius: 50%;
    background: radial-gradient(circle, var(--gold) 0%, transparent 70%); opacity: .14;
  }
  .res-score { font-family: 'Playfair Display', serif; font-size: 3.2rem; color: var(--gold); line-height: 1; position: relative; }
  .res-score-lbl { font-size: .7rem; color: rgba(255,255,255,.35); font-weight: 600; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 6px; position: relative; }
  .res-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #fff; margin-top: 6px; position: relative; }
  .res-sub { font-size: .78rem; color: rgba(255,255,255,.45); margin-top: 4px; position: relative; }
  .res-body { padding: 24px; }
  .res-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .res-stat { border-radius: 10px; padding: 14px; text-align: center; }
  .res-stat-val { font-family: 'Playfair Display', serif; font-size: 1.6rem; line-height: 1; margin-bottom: 4px; }
  .res-stat-lbl { font-size: .66rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .res-stat-correct { background: #d1fae5; color: #065f46; }
  .res-stat-wrong   { background: #fee2e2; color: #991b1b; }
  .res-stat-skip    { background: var(--paper-2); color: var(--ink-3); }
  .res-raw { background: var(--paper); border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .res-raw-item { font-size: .8rem; color: var(--ink-2); font-weight: 500; }
  .res-raw-val { font-weight: 700; color: var(--ink); }
  .res-btns { display: flex; gap: 10px; }
  .res-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border-radius: 10px; padding: 12px; font-size: .85rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; border: none;
  }
  .res-btn-primary { background: var(--ink); color: white; }
  .res-btn-primary:hover { background: var(--gold); color: var(--ink); }
  .res-btn-outline { background: white; color: var(--ink); border: 1.5px solid var(--paper-3) !important; }
  .res-btn-outline:hover { border-color: var(--gold) !important; }

  /* ── Review Screen ── */
  .rev-wrap { min-height: 100vh; background: var(--paper); padding: 24px 16px; }
  .rev-inner { max-width: 760px; margin: 0 auto; }
  .rev-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .rev-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--ink); }
  .rev-count { font-size: .78rem; color: var(--ink-3); font-weight: 500; }
  .rev-card {
    background: white; border-radius: var(--radius);
    border: 1px solid var(--paper-3); box-shadow: var(--shadow); overflow: hidden; margin-bottom: 16px;
  }
  .rev-card-head {
    padding: 12px 18px; background: var(--paper); border-bottom: 1px solid var(--paper-3);
    display: flex; align-items: center; gap: 8px;
  }
  .rev-badge {
    font-size: .68rem; font-weight: 700; padding: 3px 10px; border-radius: 5px;
  }
  .rev-badge-correct { background: #d1fae5; color: #065f46; }
  .rev-badge-wrong   { background: #fee2e2; color: #991b1b; }
  .rev-badge-skip    { background: var(--paper-2); color: var(--ink-3); }
  .rev-card-body { padding: 18px; }
  .rev-q-text { font-size: .9rem; color: var(--ink); font-weight: 600; margin-bottom: 14px; line-height: 1.6; }
  .rev-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .rev-option {
    display: flex; align-items: center; gap: 12px;
    border-radius: 8px; padding: 10px 14px; font-size: .82rem;
    border: 1.5px solid transparent;
  }
  .rev-option-neutral { background: var(--paper); border-color: var(--paper-3); color: var(--ink-2); }
  .rev-option-correct { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
  .rev-option-wrong   { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
  .rev-opt-letter { font-weight: 700; min-width: 22px; }
  .rev-expl { background: #eff6ff; border-radius: 8px; padding: 12px 14px; font-size: .78rem; color: #1e40af; line-height: 1.55; }
  .rev-expl-lbl { font-weight: 700; margin-bottom: 3px; }
  .rev-nav { display: flex; justify-content: space-between; gap: 10px; margin-top: 8px; }
  .rev-nav-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .8rem; font-weight: 600; color: var(--ink-3);
    background: white; border: 1.5px solid var(--paper-3); border-radius: 8px;
    padding: 9px 18px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .rev-nav-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--ink); }
  .rev-nav-btn:disabled { opacity: .35; cursor: not-allowed; }
`;

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

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function AFCATTestInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const testId = searchParams.get('testId');

  // Determine which exam page to navigate back to based on current path
  const getBackPath = () => {
    const path = location.pathname;
    if (path.includes('/cds/')) return '/mock-test/cds';
    if (path.includes('/afcat/')) return '/mock-test/afcat';
    if (path.includes('/nda/')) return '/mock-test/nda';
    return '/mock-tests';
  };

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

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  /* ── Load test ── */
  useEffect(() => {
    if (!testId) { setError('No test ID provided'); setLoading(false); return; }
    getMockTestById(testId)
      .then(t => {
        if (t) { setTest(t); setTimeLeft(t.duration * 60); }
        else   { setError('Test not found. Please go back and try again.'); }
      })
      .catch(() => setError('Failed to load test. Check your connection.'))
      .finally(() => setLoading(false));
  }, [testId]);

  /* ── Timer ── */
  useEffect(() => {
    if (!test || loading || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmitInternal(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, loading, submitted]);

  /* ── Helpers ── */
  const questions: MockTestQuestion[] = test?.questions ?? [];
  const currentQuestion = questions[currentQ];

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
    const scorePercent = Math.round((finalScore / (test.totalQuestions * test.positiveMarking)) * 100);
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

    if (user) {
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
          totalAnswered,
          totalUnanswered: test.questions.length - totalAnswered,
          rawScore: finalScore,
          negativeMarks,
          timeTaken,
          timeLimit: test.duration * 60,
          answers: answerDetails,
          completedAt: new Date().toISOString(),
          passingScore: 40,
          isPassed: scorePercent >= 40,
        });
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

  /* ── Error ── */
  if (error || !test) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ex-center">
          <div className="ex-center-title">Oops! Something went wrong</div>
          <div className="ex-center-sub">{error}</div>
          <button className="ex-err-btn" onClick={() => navigate(getBackPath())}>
            ← Back to AFCAT Tests
          </button>
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
              <div className="res-glow" />
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
                <span className="res-raw-item">Raw Score: <span className="res-raw-val">{result.rawScore.toFixed(2)} / {test.totalMarks}</span></span>
                <span className="res-raw-item">Negative Marks: <span className="res-raw-val" style={{ color: '#991b1b' }}>−{result.negativeMarks.toFixed(2)}</span></span>
                <span className="res-raw-item">Time: <span className="res-raw-val">{formatTime(result.timeTaken)}</span></span>
              </div>
              <div className="res-btns">
                <button className="res-btn res-btn-outline" onClick={() => navigate(getBackPath())}>
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
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="rev-wrap">
          <div className="rev-inner">
            <div className="rev-header">
              <div className="rev-title">Answer Review</div>
              <div className="rev-count">Question {reviewIdx + 1} of {questions.length}</div>
            </div>
            <div className="rev-card">
              <div className="rev-card-head">
                <span className={`rev-badge ${ra?.isUnanswered ? 'rev-badge-skip' : ra?.isCorrect ? 'rev-badge-correct' : 'rev-badge-wrong'}`}>
                  {ra?.isUnanswered ? 'Skipped' : ra?.isCorrect ? '✓ Correct' : '✕ Wrong'}
                </span>
                <span style={{ fontSize: '.68rem', color: 'var(--ink-3)', fontWeight: 500 }}>{q.subject}</span>
              </div>
              <div className="rev-card-body">
                <div className="rev-q-text">{q.question}</div>
                <div className="rev-options">
                  {q.options.map((opt, idx) => {
                    const isUserAns = ra?.userAnswer === idx;
                    const isCorrectAns = idx === q.correctAnswer;
                    const cls = isCorrectAns ? 'rev-option-correct' : isUserAns ? 'rev-option-wrong' : 'rev-option-neutral';
                    return (
                      <div key={idx} className={`rev-option ${cls}`}>
                        <span className="rev-opt-letter">{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt}</span>
                        {isCorrectAns && <span style={{ marginLeft: 'auto', fontSize: '.72rem', fontWeight: 700 }}>✓</span>}
                        {isUserAns && !isCorrectAns && <span style={{ marginLeft: 'auto', fontSize: '.72rem', fontWeight: 700 }}>✗</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="rev-expl">
                    <div className="rev-expl-lbl">Explanation</div>
                    {q.explanation}
                  </div>
                )}
              </div>
            </div>
            <div className="rev-nav">
              <button className="rev-nav-btn" disabled={reviewIdx === 0} onClick={() => setReviewIdx(p => p - 1)}>
                ← Previous
              </button>
              <button className="res-btn res-btn-outline" style={{ flex: 'none', padding: '9px 20px', fontSize: '.8rem' }} onClick={() => setScreen('result')}>
                Back to Results
              </button>
              <button className="rev-nav-btn" disabled={reviewIdx === questions.length - 1} onClick={() => setReviewIdx(p => p + 1)}>
                Next →
              </button>
            </div>
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

        {/* Topbar */}
        <div className="ex-topbar">
          <div className="ex-topbar-left">
            <button className="ex-back-btn" onClick={() => navigate(getBackPath())}>
              ← Exit
            </button>
            <div>
              <div className="ex-exam-title">{test.title}</div>
              <div className="ex-exam-sub">{test.examName} · {test.subject}</div>
            </div>
          </div>
          <div className={`ex-timer${timeLeft < 300 ? ' urgent' : ''}`}>
            ◷ {formatTime(timeLeft)}
          </div>
          <button className="ex-submit-top" onClick={handleSubmitInternal}>
            Submit Test
          </button>
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
