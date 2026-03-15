import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getMockTestById, saveMockTestAttempt } from '@/lib/mockTestService';
import { useAuth } from '@/contexts/AuthContext';
import type { MockTest, MockTestQuestion } from '@/types/schema';

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

  .ndax-wrap { display: flex; flex-direction: column; height: 100vh; background: var(--paper); overflow: hidden; }

  .ndax-topbar {
    background: var(--ink); padding: 0 20px; height: 56px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .ndax-topbar-left { display: flex; align-items: center; gap: 14px; }
  .ndax-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); border-radius: 7px;
    color: rgba(255,255,255,.7); font-size: .75rem; font-weight: 600;
    padding: 6px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-back-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
  .ndax-exam-title { font-family: 'Playfair Display', serif; font-size: .95rem; color: #fff; }
  .ndax-exam-sub { font-size: .68rem; color: rgba(255,255,255,.4); margin-top: 1px; }
  .ndax-timer {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.1); border-radius: 8px; padding: 6px 14px;
    font-weight: 700; color: var(--gold); font-size: .92rem; letter-spacing: .03em;
    font-variant-numeric: tabular-nums;
  }
  .ndax-timer.urgent { background: rgba(139,26,26,.4); color: #fca5a5; }
  .ndax-submit-top {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--gold); color: var(--ink); border: none; border-radius: 8px;
    padding: 8px 18px; font-size: .8rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-submit-top:hover { background: var(--gold-light); }

  .ndax-body { flex: 1; display: flex; overflow: hidden; }

  .ndax-q-panel { flex: 1; overflow-y: auto; padding: 20px; }
  .ndax-q-card {
    background: white; border-radius: var(--radius);
    border: 1px solid var(--paper-3); box-shadow: var(--shadow);
  }
  .ndax-q-head {
    padding: 14px 20px; border-bottom: 1px solid var(--paper-3);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ndax-q-num { font-size: .7rem; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .07em; }
  .ndax-q-subj {
    font-size: .68rem; font-weight: 600; padding: 3px 9px; border-radius: 5px;
    background: var(--paper); color: var(--ink-3); border: 1px solid var(--paper-3);
  }
  .ndax-flag-btn {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .72rem; font-weight: 600; color: var(--ink-3);
    background: var(--paper); border: 1px solid var(--paper-3); border-radius: 6px;
    padding: 5px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-flag-btn.flagged { border-color: #f59e0b; color: #b45309; background: #fef3c7; }

  .ndax-q-body { padding: 22px 20px; }
  .ndax-q-text { font-size: 1rem; color: var(--ink); line-height: 1.7; font-weight: 500; margin-bottom: 22px; }
  .ndax-options { display: flex; flex-direction: column; gap: 10px; }
  .ndax-option {
    display: flex; align-items: center; gap: 14px;
    background: var(--paper); border: 1.5px solid var(--paper-3); border-radius: 10px;
    padding: 13px 16px; cursor: pointer; transition: all .15s;
    text-align: left; width: 100%; font-family: 'DM Sans', sans-serif;
  }
  .ndax-option:hover { border-color: var(--gold); background: #fffbeb; }
  .ndax-option.selected { border-color: var(--gold); background: #fffbeb; }
  .ndax-opt-letter {
    width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--paper-3);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: .78rem; color: var(--ink-3); flex-shrink: 0; transition: all .15s;
  }
  .ndax-option.selected .ndax-opt-letter { border-color: var(--gold); background: var(--gold); color: var(--ink); }
  .ndax-opt-text { font-size: .88rem; color: var(--ink-2); font-weight: 500; }

  .ndax-q-foot {
    padding: 14px 20px; border-top: 1px solid var(--paper-3);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ndax-nav-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .8rem; font-weight: 600; color: var(--ink-3);
    background: white; border: 1.5px solid var(--paper-3); border-radius: 8px;
    padding: 9px 18px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-nav-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--ink); }
  .ndax-nav-btn:disabled { opacity: .35; cursor: not-allowed; }
  .ndax-clear-btn {
    font-size: .75rem; font-weight: 600; color: var(--ink-3);
    background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: underline; transition: color .15s;
  }
  .ndax-clear-btn:hover { color: #8b1a1a; }

  .ndax-palette {
    width: 256px; background: white; border-left: 1px solid var(--paper-3);
    padding: 18px; overflow-y: auto; flex-shrink: 0;
  }
  .ndax-palette-title { font-family: 'Playfair Display', serif; font-size: .88rem; color: var(--ink); margin-bottom: 14px; }
  .ndax-palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; margin-bottom: 18px; }
  .ndax-p-btn {
    width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid var(--paper-3);
    background: white; font-size: .76rem; font-weight: 700; color: var(--ink-3);
    cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center;
  }
  .ndax-p-btn.answered { background: #16a34a; border-color: #16a34a; color: white; }
  .ndax-p-btn.marked   { background: #f59e0b; border-color: #f59e0b; color: white; }
  .ndax-p-btn.current  { box-shadow: 0 0 0 2.5px var(--gold); }

  .ndax-legend { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
  .ndax-legend-item { display: flex; align-items: center; gap: 8px; font-size: .7rem; color: var(--ink-3); font-weight: 500; }
  .ndax-legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }

  .ndax-palette-submit {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--ink); color: white; border: none; border-radius: 8px;
    padding: 11px; font-size: .85rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-palette-submit:hover { background: var(--gold); color: var(--ink); }

  .ndax-center {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--paper); gap: 14px; padding: 24px;
  }
  .ndax-center-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--ink); }
  .ndax-center-sub { font-size: .82rem; color: var(--ink-3); text-align: center; }
  .ndax-spinner {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid var(--paper-3); border-top-color: var(--gold);
    animation: ndaxSpin .75s linear infinite;
  }
  @keyframes ndaxSpin { to { transform: rotate(360deg); } }
  .ndax-err-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--ink); color: white; border: none; border-radius: 8px;
    padding: 10px 22px; font-size: .85rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-err-btn:hover { background: var(--gold); color: var(--ink); }

  .ndax-res-wrap { min-height: 100vh; background: var(--paper); padding: 32px 16px; display: flex; align-items: center; justify-content: center; }
  .ndax-res-card {
    background: white; border-radius: 20px; box-shadow: var(--shadow-lg);
    border: 1px solid var(--paper-3); max-width: 560px; width: 100%; overflow: hidden;
  }
  .ndax-res-head { background: var(--ink); padding: 32px; text-align: center; position: relative; overflow: hidden; }
  .ndax-res-head::before {
    content: ''; position: absolute; inset: 0; opacity: .04;
    background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
    background-size: 20px 20px;
  }
  .ndax-res-glow {
    position: absolute; right: -40px; top: -40px; width: 180px; height: 180px; border-radius: 50%;
    background: radial-gradient(circle, var(--gold) 0%, transparent 70%); opacity: .14;
  }
  .ndax-res-score { font-family: 'Playfair Display', serif; font-size: 3.2rem; color: var(--gold); line-height: 1; position: relative; }
  .ndax-res-score-lbl { font-size: .7rem; color: rgba(255,255,255,.35); font-weight: 600; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 6px; position: relative; }
  .ndax-res-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #fff; margin-top: 6px; position: relative; }
  .ndax-res-sub { font-size: .78rem; color: rgba(255,255,255,.45); margin-top: 4px; position: relative; }
  .ndax-res-body { padding: 24px; }
  .ndax-res-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .ndax-res-stat { border-radius: 10px; padding: 14px; text-align: center; }
  .ndax-res-stat-val { font-family: 'Playfair Display', serif; font-size: 1.6rem; line-height: 1; margin-bottom: 4px; }
  .ndax-res-stat-lbl { font-size: .66rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .ndax-res-stat-correct { background: #d1fae5; color: #065f46; }
  .ndax-res-stat-wrong   { background: #fee2e2; color: #991b1b; }
  .ndax-res-stat-skip    { background: var(--paper-2); color: var(--ink-3); }
  .ndax-res-raw { background: var(--paper); border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
  .ndax-res-raw-item { font-size: .8rem; color: var(--ink-2); font-weight: 500; }
  .ndax-res-raw-val { font-weight: 700; color: var(--ink); }
  .ndax-res-btns { display: flex; gap: 10px; }
  .ndax-res-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border-radius: 10px; padding: 12px; font-size: .85rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; border: none;
  }
  .ndax-res-btn-primary { background: var(--ink); color: white; }
  .ndax-res-btn-primary:hover { background: var(--gold); color: var(--ink); }
  .ndax-res-btn-outline { background: white; color: var(--ink); border: 1.5px solid var(--paper-3) !important; }
  .ndax-res-btn-outline:hover { border-color: var(--gold) !important; }

  .ndax-rev-wrap { min-height: 100vh; background: var(--paper); padding: 24px 16px; }
  .ndax-rev-inner { max-width: 760px; margin: 0 auto; }
  .ndax-rev-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .ndax-rev-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--ink); }
  .ndax-rev-count { font-size: .78rem; color: var(--ink-3); font-weight: 500; }
  .ndax-rev-card {
    background: white; border-radius: var(--radius);
    border: 1px solid var(--paper-3); box-shadow: var(--shadow); overflow: hidden; margin-bottom: 16px;
  }
  .ndax-rev-card-head {
    padding: 12px 18px; background: var(--paper); border-bottom: 1px solid var(--paper-3);
    display: flex; align-items: center; gap: 8px;
  }
  .ndax-rev-badge { font-size: .68rem; font-weight: 700; padding: 3px 10px; border-radius: 5px; }
  .ndax-rev-badge-correct { background: #d1fae5; color: #065f46; }
  .ndax-rev-badge-wrong   { background: #fee2e2; color: #991b1b; }
  .ndax-rev-badge-skip    { background: var(--paper-2); color: var(--ink-3); }
  .ndax-rev-card-body { padding: 18px; }
  .ndax-rev-q-text { font-size: .9rem; color: var(--ink); font-weight: 600; margin-bottom: 14px; line-height: 1.6; }
  .ndax-rev-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .ndax-rev-option { display: flex; align-items: center; gap: 12px; border-radius: 8px; padding: 10px 14px; font-size: .82rem; border: 1.5px solid transparent; }
  .ndax-rev-option-neutral { background: var(--paper); border-color: var(--paper-3); color: var(--ink-2); }
  .ndax-rev-option-correct { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
  .ndax-rev-option-wrong   { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
  .ndax-rev-opt-letter { font-weight: 700; min-width: 22px; }
  .ndax-rev-expl { background: #eff6ff; border-radius: 8px; padding: 12px 14px; font-size: .78rem; color: #1e40af; line-height: 1.55; }
  .ndax-rev-expl-lbl { font-weight: 700; margin-bottom: 3px; }
  .ndax-rev-nav { display: flex; justify-content: space-between; gap: 10px; margin-top: 8px; }
  .ndax-rev-nav-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .8rem; font-weight: 600; color: var(--ink-3);
    background: white; border: 1.5px solid var(--paper-3); border-radius: 8px;
    padding: 9px 18px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .ndax-rev-nav-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--ink); }
  .ndax-rev-nav-btn:disabled { opacity: .35; cursor: not-allowed; }
`;

interface Answer { questionId: number; selectedIndex: number; }
interface ReviewAnswer {
  questionId: number; question: string; userAnswer: number | null;
  correctAnswer: number; isCorrect: boolean; isUnanswered: boolean;
  explanation: string; topic: string;
}
interface ResultData {
  correct: number; incorrect: number; unanswered: number;
  rawScore: number; scorePercent: number; timeTaken: number;
  negativeMarks: number; answers: ReviewAnswer[];
}
type Screen = 'exam' | 'result' | 'review';

function formatTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

export default function NDATestInterface() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const testId = searchParams.get('testId');

  const [test, setTest]       = useState<MockTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [screen, setScreen]   = useState<Screen>('exam');
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState<Answer[]>([]);
  const [marked, setMarked]       = useState<number[]>([]);
  const [timeLeft, setTimeLeft]   = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]       = useState<ResultData | null>(null);
  const [reviewIdx, setReviewIdx] = useState(0);

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  useEffect(() => {
    if (!testId) { setError('No test ID provided'); setLoading(false); return; }
    getMockTestById(testId)
      .then(t => { if (t) { setTest(t); setTimeLeft(t.duration * 60); } else setError('Test not found. Please go back and try again.'); })
      .catch(() => setError('Failed to load test. Check your connection.'))
      .finally(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    if (!test || loading || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timer); handleSubmitInternal(); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, loading, submitted]);

  const questions: MockTestQuestion[] = test?.questions ?? [];
  const currentQuestion = questions[currentQ];
  const getSelectedIndex = (qId: number) => answers.find(a => a.questionId === qId)?.selectedIndex ?? null;

  const selectAnswer = (qId: number, idx: number) => {
    setAnswers(prev => {
      const ex = prev.find(a => a.questionId === qId);
      if (ex) return prev.map(a => a.questionId === qId ? { ...a, selectedIndex: idx } : a);
      return [...prev, { questionId: qId, selectedIndex: idx }];
    });
  };
  const clearAnswer = (qId: number) => setAnswers(prev => prev.filter(a => a.questionId !== qId));
  const toggleMark = (qId: number) => setMarked(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]);
  const getStatus = (qId: number) => {
    if (marked.includes(qId)) return 'marked';
    if (answers.find(a => a.questionId === qId)) return 'answered';
    return 'unanswered';
  };

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
      return { questionId: q.id, question: q.question, userAnswer, correctAnswer: q.correctAnswer, isCorrect, isUnanswered, explanation: q.explanation, topic: q.subject };
    });
    const finalScore = Math.max(0, rawScore);
    const totalAnswered = correct + incorrect;
    const scorePercent = Math.round((finalScore / (test.totalQuestions * test.positiveMarking)) * 100);
    const timeTaken = (test.duration * 60) - timeLeftRef.current;
    setResult({ correct, incorrect, unanswered: test.questions.length - totalAnswered, rawScore: finalScore, scorePercent, timeTaken, negativeMarks, answers: answerDetails });
    setScreen('result');
    if (user) {
      try {
        await saveMockTestAttempt(user.id, {
          testId: test.id, testTitle: test.title, examType: test.examType, examName: test.examName,
          score: scorePercent, correct, incorrect, total: test.questions.length, totalAnswered,
          totalUnanswered: test.questions.length - totalAnswered, rawScore: finalScore, negativeMarks,
          timeTaken, timeLimit: test.duration * 60, answers: answerDetails,
          completedAt: new Date().toISOString(), passingScore: 40, isPassed: scorePercent >= 40,
        });
      } catch (err) { console.error('Failed to save attempt:', err); }
    }
  };

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ndax-center">
        <div className="ndax-spinner" />
        <div className="ndax-center-title">Loading Test…</div>
        <div className="ndax-center-sub">Fetching questions from the server</div>
      </div>
    </>
  );

  if (error || !test) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ndax-center">
        <div className="ndax-center-title">Oops! Something went wrong</div>
        <div className="ndax-center-sub">{error}</div>
        <button className="ndax-err-btn" onClick={() => navigate('/mock-test/nda')}>← Back to NDA Tests</button>
      </div>
    </>
  );

  if (screen === 'result' && result) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ndax-res-wrap">
        <div className="ndax-res-card">
          <div className="ndax-res-head">
            <div className="ndax-res-glow" />
            <div className="ndax-res-score-lbl">Your Score</div>
            <div className="ndax-res-score">{result.scorePercent}%</div>
            <div className="ndax-res-title">{test.title}</div>
            <div className="ndax-res-sub">{test.examName} · {test.subject}</div>
          </div>
          <div className="ndax-res-body">
            <div className="ndax-res-grid">
              <div className="ndax-res-stat ndax-res-stat-correct"><div className="ndax-res-stat-val">{result.correct}</div><div className="ndax-res-stat-lbl">Correct</div></div>
              <div className="ndax-res-stat ndax-res-stat-wrong"><div className="ndax-res-stat-val">{result.incorrect}</div><div className="ndax-res-stat-lbl">Wrong</div></div>
              <div className="ndax-res-stat ndax-res-stat-skip"><div className="ndax-res-stat-val">{result.unanswered}</div><div className="ndax-res-stat-lbl">Skipped</div></div>
            </div>
            <div className="ndax-res-raw">
              <span className="ndax-res-raw-item">Raw Score: <span className="ndax-res-raw-val">{result.rawScore.toFixed(2)} / {test.totalMarks}</span></span>
              <span className="ndax-res-raw-item">Negative: <span className="ndax-res-raw-val" style={{ color: '#991b1b' }}>−{result.negativeMarks.toFixed(2)}</span></span>
              <span className="ndax-res-raw-item">Time: <span className="ndax-res-raw-val">{formatTime(result.timeTaken)}</span></span>
            </div>
            <div className="ndax-res-btns">
              <button className="ndax-res-btn ndax-res-btn-outline" onClick={() => navigate('/mock-test/nda')}>← Back to Tests</button>
              <button className="ndax-res-btn ndax-res-btn-primary" onClick={() => { setScreen('review'); setReviewIdx(0); }}>Review Answers</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (screen === 'review' && result) {
    const q = questions[reviewIdx];
    const ra = result.answers.find(a => a.questionId === q.id);
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ndax-rev-wrap">
          <div className="ndax-rev-inner">
            <div className="ndax-rev-header">
              <div className="ndax-rev-title">Answer Review</div>
              <div className="ndax-rev-count">Question {reviewIdx + 1} of {questions.length}</div>
            </div>
            <div className="ndax-rev-card">
              <div className="ndax-rev-card-head">
                <span className={`ndax-rev-badge ${ra?.isUnanswered ? 'ndax-rev-badge-skip' : ra?.isCorrect ? 'ndax-rev-badge-correct' : 'ndax-rev-badge-wrong'}`}>
                  {ra?.isUnanswered ? 'Skipped' : ra?.isCorrect ? '✓ Correct' : '✕ Wrong'}
                </span>
                <span style={{ fontSize: '.68rem', color: 'var(--ink-3)', fontWeight: 500 }}>{q.subject}</span>
              </div>
              <div className="ndax-rev-card-body">
                <div className="ndax-rev-q-text">{q.question}</div>
                <div className="ndax-rev-options">
                  {q.options.map((opt, idx) => {
                    const isUserAns = ra?.userAnswer === idx;
                    const isCorrect = idx === q.correctAnswer;
                    const cls = isCorrect ? 'ndax-rev-option-correct' : isUserAns ? 'ndax-rev-option-wrong' : 'ndax-rev-option-neutral';
                    return (
                      <div key={idx} className={`ndax-rev-option ${cls}`}>
                        <span className="ndax-rev-opt-letter">{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt}</span>
                        {isCorrect && <span style={{ marginLeft: 'auto', fontSize: '.72rem', fontWeight: 700 }}>✓</span>}
                        {isUserAns && !isCorrect && <span style={{ marginLeft: 'auto', fontSize: '.72rem', fontWeight: 700 }}>✗</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && <div className="ndax-rev-expl"><div className="ndax-rev-expl-lbl">Explanation</div>{q.explanation}</div>}
              </div>
            </div>
            <div className="ndax-rev-nav">
              <button className="ndax-rev-nav-btn" disabled={reviewIdx === 0} onClick={() => setReviewIdx(p => p - 1)}>← Previous</button>
              <button className="ndax-res-btn ndax-res-btn-outline" style={{ flex: 'none', padding: '9px 20px', fontSize: '.8rem', border: '1.5px solid var(--paper-3)' }} onClick={() => setScreen('result')}>Back to Results</button>
              <button className="ndax-rev-nav-btn" disabled={reviewIdx === questions.length - 1} onClick={() => setReviewIdx(p => p + 1)}>Next →</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentQuestion) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ndax-wrap">
        <div className="ndax-topbar">
          <div className="ndax-topbar-left">
            <button className="ndax-back-btn" onClick={() => navigate('/mock-test/nda')}>← Exit</button>
            <div>
              <div className="ndax-exam-title">{test.title}</div>
              <div className="ndax-exam-sub">{test.examName} · {test.subject}</div>
            </div>
          </div>
          <div className={`ndax-timer${timeLeft < 300 ? ' urgent' : ''}`}>◷ {formatTime(timeLeft)}</div>
          <button className="ndax-submit-top" onClick={handleSubmitInternal}>Submit Test</button>
        </div>

        <div className="ndax-body">
          <div className="ndax-q-panel">
            <div className="ndax-q-card">
              <div className="ndax-q-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="ndax-q-num">Question {currentQ + 1} / {questions.length}</div>
                  <div className="ndax-q-subj">{currentQuestion.subject}</div>
                </div>
                <button className={`ndax-flag-btn${marked.includes(currentQuestion.id) ? ' flagged' : ''}`} onClick={() => toggleMark(currentQuestion.id)}>
                  {marked.includes(currentQuestion.id) ? '⚑ Marked' : '⚐ Mark'}
                </button>
              </div>
              <div className="ndax-q-body">
                <div className="ndax-q-text">{currentQuestion.question}</div>
                <div className="ndax-options">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = getSelectedIndex(currentQuestion.id) === idx;
                    return (
                      <button key={idx} className={`ndax-option${isSelected ? ' selected' : ''}`} onClick={() => selectAnswer(currentQuestion.id, idx)}>
                        <div className="ndax-opt-letter">{String.fromCharCode(65 + idx)}</div>
                        <span className="ndax-opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="ndax-q-foot">
                <button className="ndax-nav-btn" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>← Previous</button>
                {getSelectedIndex(currentQuestion.id) !== null && (
                  <button className="ndax-clear-btn" onClick={() => clearAnswer(currentQuestion.id)}>Clear Response</button>
                )}
                <button className="ndax-nav-btn" disabled={currentQ === questions.length - 1} onClick={() => setCurrentQ(p => p + 1)}>Next →</button>
              </div>
            </div>
          </div>

          <div className="ndax-palette">
            <div className="ndax-palette-title">Question Palette</div>
            <div className="ndax-palette-grid">
              {questions.map((q, idx) => {
                const st = getStatus(q.id);
                return (
                  <button key={q.id} className={`ndax-p-btn${st === 'answered' ? ' answered' : st === 'marked' ? ' marked' : ''}${currentQ === idx ? ' current' : ''}`} onClick={() => setCurrentQ(idx)}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="ndax-legend">
              <div className="ndax-legend-item"><div className="ndax-legend-dot" style={{ background: '#16a34a' }} />Answered ({answers.length})</div>
              <div className="ndax-legend-item"><div className="ndax-legend-dot" style={{ background: '#f59e0b' }} />Marked ({marked.length})</div>
              <div className="ndax-legend-item"><div className="ndax-legend-dot" style={{ background: 'var(--paper-3)' }} />Not Visited ({questions.length - answers.length})</div>
            </div>
            <button className="ndax-palette-submit" onClick={handleSubmitInternal}>Submit Test</button>
          </div>
        </div>
      </div>
    </>
  );
}
