import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, Clock, Target, TrendingUp, BookOpen, Save, ChevronDown, ChevronUp } from "lucide-react";
import { collection, query, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface QuestionData {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;        // FIX: number (zero-based index), was string
  selectedAnswer: number | null; // FIX: number | null, was string | null
  explanation: string;
  subject: string;
}

interface SubjectPerformance {
  name: string;
  totalQuestions: number;
  correct: number;
  accuracy: number;
}

interface TestResult {
  testId: string;
  testName: string;
  totalScore: number;
  totalMarks: number;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  accuracy: number;
  timeTaken: string;
  subjectPerformance: SubjectPerformance[];
  questions: QuestionData[];
  attemptId?: string;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f1923; --ink-2: #2c3e50; --ink-3: #64748b;
    --paper: #f5f2ee; --paper-2: #ede9e3; --paper-3: #e2ddd6;
    --gold: #c9a84c; --gold-light: #f0d98a;
    --emerald: #1a6b4a; --crimson: #8b1a1a; --sapphire: #1a3f6b;
    --radius: 14px; --shadow: 0 4px 24px rgba(15,25,35,.08); --shadow-lg: 0 12px 40px rgba(15,25,35,.14);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }
  .wrap { min-height: 100vh; background: var(--paper); display: flex; flex-direction: column; }

  /* topbar */
  .topbar {
    background: rgba(245,242,238,.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--paper-3); padding: 0 28px; height: 60px;
    display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50;
  }
  .topbar-left { display: flex; align-items: center; gap: 14px; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .8rem; font-weight: 600; color: var(--ink-3);
    background: white; border: 1px solid var(--paper-3); border-radius: 8px;
    padding: 7px 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .back-btn:hover { border-color: var(--gold); color: var(--gold); }
  .topbar-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--ink); }
  .topbar-sub { font-size: .72rem; color: var(--ink-3); margin-top: 1px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--ink); color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: .9rem; font-family: 'Playfair Display', serif;
  }

  /* content */
  .content { padding: 28px 28px; max-width: 90%; width: 100%; margin: 0 auto; flex: 1; }

  /* page header */
  .page-header {
    background: var(--ink); border-radius: var(--radius); padding: 28px 32px;
    position: relative; overflow: hidden; margin-bottom: 24px;
  }
  .ph-pattern {
    position: absolute; inset: 0; opacity: .04;
    background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
    background-size: 20px 20px;
  }
  .ph-glow {
    position: absolute; right: -40px; top: -40px; width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, var(--gold) 0%, transparent 70%); opacity: .12;
  }
  .ph-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #fff; margin-bottom: 4px; position: relative; }
  .ph-sub { font-size: .82rem; color: rgba(255,255,255,.45); position: relative; }

  /* performance summary */
  .perf-summary {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px;
  }
  .perf-card {
    background: white; border-radius: 12px; padding: 20px; box-shadow: var(--shadow);
    border: 1px solid var(--paper-3); text-align: center;
  }
  .perf-card.main { background: var(--ink); border-color: var(--ink); }
  .perf-card.main .perf-val { color: var(--gold); }
  .perf-card.main .perf-label { color: rgba(255,255,255,.6); }
  .perf-val { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--ink); line-height: 1; }
  .perf-label { font-size: .7rem; color: var(--ink-3); margin-top: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
  
  .perf-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px; }
  .perf-mini { background: var(--paper); border-radius: 10px; padding: 14px; text-align: center; }
  .perf-mini-val { font-size: 1.3rem; font-weight: 700; color: var(--ink); }
  .perf-mini-label { font-size: .65rem; color: var(--ink-3); text-transform: uppercase; letter-spacing: .05em; margin-top: 4px; }
  .perf-mini.correct .perf-mini-val { color: var(--emerald); }
  .perf-mini.incorrect .perf-mini-val { color: var(--crimson); }
  .perf-mini.skipped .perf-mini-val { color: var(--ink-3); }

  /* section */
  .section { background: white; border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); margin-bottom: 24px; border: 1px solid var(--paper-3); }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--ink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .section-title svg { color: var(--gold); }

  /* subject performance */
  .subject-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .subject-card { background: var(--paper); border-radius: 10px; padding: 16px; }
  .subject-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .subject-name { font-weight: 600; font-size: .9rem; color: var(--ink); }
  .subject-acc { font-weight: 700; font-size: .85rem; }
  .subject-acc.high { color: var(--emerald); }
  .subject-acc.medium { color: var(--gold); }
  .subject-acc.low { color: var(--crimson); }
  .subject-stats { font-size: .75rem; color: var(--ink-3); }
  .progress-bar { height: 6px; background: var(--paper-3); border-radius: 99px; margin-top: 10px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 99px; }
  .progress-fill.high { background: var(--emerald); }
  .progress-fill.medium { background: var(--gold); }
  .progress-fill.low { background: var(--crimson); }

  /* insights */
  .insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .insight-card { padding: 16px; border-radius: 10px; }
  .insight-card.strong { background: rgba(26,107,74,.1); border: 1px solid rgba(26,107,74,.2); }
  .insight-card.weak { background: rgba(139,26,26,.1); border: 1px solid rgba(139,26,26,.2); }
  .insight-card.suggest { background: rgba(201,168,76,.1); border: 1px solid rgba(201,168,76,.2); }
  .insight-label { font-size: .65rem; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; font-weight: 700; }
  .insight-card.strong .insight-label { color: var(--emerald); }
  .insight-card.weak .insight-label { color: var(--crimson); }
  .insight-card.suggest .insight-label { color: var(--gold); }
  .insight-value { font-size: .9rem; font-weight: 600; color: var(--ink); }

  /* question review */
  .question-list { display: flex; flex-direction: column; gap: 12px; }
  .question-item { background: var(--paper); border-radius: 10px; overflow: hidden; border: 1px solid var(--paper-3); }
  .question-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; cursor: pointer; }
  .question-num { font-weight: 600; font-size: .85rem; color: var(--ink); }
  .question-status { display: flex; align-items: center; gap: 6px; font-size: .75rem; font-weight: 600; text-transform: uppercase; }
  .question-status.correct { color: var(--emerald); }
  .question-status.incorrect { color: var(--crimson); }
  .question-status.skipped { color: var(--ink-3); }
  .question-body { padding: 0 16px 16px; display: none; }
  .question-body.open { display: block; }
  .question-text { font-size: .9rem; color: var(--ink); line-height: 1.6; margin-bottom: 14px; }
  .option-list { display: flex; flex-direction: column; gap: 8px; }
  .option { padding: 10px 14px; border-radius: 8px; font-size: .85rem; display: flex; align-items: center; gap: 10px; }
  .option.correct-answer { background: rgba(26,107,74,.12); border: 1px solid var(--emerald); color: var(--emerald); }
  .option.wrong-answer { background: rgba(139,26,26,.08); border: 1px solid var(--crimson); }
  .option.selected { background: var(--paper-2); }
  .option-marker { width: 20px; height: 20px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: .7rem; flex-shrink: 0; }
  .explanation { margin-top: 14px; padding: 12px; background: var(--paper-2); border-radius: 8px; font-size: .8rem; color: var(--ink-2); line-height: 1.5; }
  .explanation-label { font-weight: 700; margin-bottom: 4px; color: var(--gold); font-size: .7rem; text-transform: uppercase; letter-spacing: .05em; }

  /* self analysis */
  .analysis-box { width: 100%; min-height: 150px; padding: 14px; border: 1px solid var(--paper-3); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: .9rem; resize: vertical; background: var(--paper); }
  .analysis-box:focus { outline: none; border-color: var(--gold); }
  .save-btn { margin-top: 12px; background: var(--gold); color: var(--ink); border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: .85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .15s; }
  .save-btn:hover { background: var(--gold-light); }

  /* tabs */
  .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
  .tab { padding: 10px 20px; border-radius: 8px; font-size: .85rem; font-weight: 600; cursor: pointer; background: var(--paper); color: var(--ink-3); border: 1px solid var(--paper-3); transition: all .15s; }
  .tab.active { background: var(--ink); color: white; border-color: var(--ink); }
  .tab:hover:not(.active) { border-color: var(--gold); }

  /* empty state */
  .empty-state { text-align: center; padding: 40px 24px; color: var(--ink-3); font-size: .9rem; }
  .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--ink); margin-bottom: 8px; }

  /* responsive */
  @media (max-width: 900px) {
    .perf-summary { grid-template-columns: repeat(2, 1fr); }
    .subject-grid { grid-template-columns: 1fr; }
    .insights-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .content { padding: 16px; }
    .perf-summary { grid-template-columns: 1fr 1fr; gap: 10px; }
    .perf-row { grid-template-columns: 1fr; }
    .page-header { padding: 20px; }
    .section { padding: 16px; }
  }
`;

// FIX: correct time formatter — was using seconds as minutes (e.g. 90s → "1h 30m")
function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function TestAnalysisPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"summary" | "questions" | "analysis">("summary");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [selfAnalysis, setSelfAnalysis] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const fetchLatestAttempt = async () => {
      if (!user) { setLoading(false); return; }

      try {
        // FIX: read testId from ?testId= param so page works for any test
        const targetTestId = (searchParams.get("testId") || "cds").toLowerCase();

        const attemptsRef = collection(db, `users/${user.id}/mockTestAttempts`);
        const q = query(attemptsRef, orderBy('completedAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);

        if (snapshot.empty) { setLoading(false); return; }

        // FIX: search up to 20 docs, not 10, to avoid silently missing CDS attempts
        let matchedAttempt: any = null;
        for (const d of snapshot.docs) {
          const data = d.data();
          const tid = (data.testId || '').toLowerCase();
          const ttl = (data.testTitle || '').toLowerCase();
          if (tid === targetTestId || ttl.includes(targetTestId)) {
            matchedAttempt = { data, id: d.id };
            break;
          }
        }

        if (!matchedAttempt) { setLoading(false); return; }

        const attemptData = matchedAttempt.data;

        // FIX: compute subject accuracy from real Firestore data instead of hardcoding 75/60/65/40
        // expects attemptData.answersBySubject: { [subject]: { correct: number, total: number } }
        let subjectPerformance: SubjectPerformance[] = [];
        if (attemptData.answersBySubject) {
          subjectPerformance = Object.entries(attemptData.answersBySubject).map(
            ([name, v]: [string, any]) => ({
              name,
              totalQuestions: v.total,
              correct: v.correct,
              accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
            })
          );
        } else {
          // NDA subjects: Mathematics (300), English (200), General Knowledge (600)
          const subjects = [
            { name: "Mathematics",   fraction: 0.30 },
            { name: "English",      fraction: 0.20 },
            { name: "General Knowledge", fraction: 0.50 },
          ];
          subjectPerformance = subjects.map(({ name, fraction }) => {
            const total   = Math.round((attemptData.totalQuestions || 100) * fraction);
            const correct = Math.round((attemptData.correct || 0) * fraction);
            return { name, totalQuestions: total, correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
          });
        }

        // FIX: fetch actual questions from /mockTests/{testId} and merge with user answers
        // expects attemptData.answers: { [questionId]: selectedIndex (number) }
        let questions: QuestionData[] = [];
        const testDocRef = doc(db, "mockTests", targetTestId);
        const testSnap = await getDoc(testDocRef);
        if (testSnap.exists()) {
          const testData = testSnap.data();
          const rawQuestions: any[] = testData.questions || [];
          const answersMap: Record<string, number | null> = attemptData.answers || {};
          questions = rawQuestions.map((q: any, idx: number) => ({
            id: q.id ?? idx + 1,
            question: q.question || "",
            options: q.options || [],
            correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
            selectedAnswer: answersMap[String(q.id ?? idx + 1)] ?? null,
            explanation: q.explanation || "",
            subject: q.subject || "General",
          }));
        }

        setResult({
          testId: attemptData.testId || targetTestId,
          testName: attemptData.testTitle || 'Mock Test',
          totalScore: attemptData.score || 0,
          totalMarks: attemptData.totalMarks || 100,
          questionsAttempted: (attemptData.correct || 0) + (attemptData.incorrect || 0),
          correctAnswers: attemptData.correct || 0,
          incorrectAnswers: attemptData.incorrect || 0,
          unattempted: attemptData.unanswered || 0,
          accuracy: attemptData.accuracy || 0,
          timeTaken: formatTime(attemptData.timeTaken || 0), // FIX: use correct formatter
          subjectPerformance,
          questions,
          attemptId: matchedAttempt.id,
        });

        const savedAnalysis = localStorage.getItem(`analysis-${matchedAttempt.id}`);
        if (savedAnalysis) setSelfAnalysis(savedAnalysis);

      } catch (error) {
        console.error('Error fetching attempt:', error);
      }

      setLoading(false);
    };

    fetchLatestAttempt();
  }, [user, searchParams]);

  const getAccuracyClass = (accuracy: number) => {
    if (accuracy >= 70) return "high";
    if (accuracy >= 50) return "medium";
    return "low";
  };

  // FIX: accept result as argument — was reading from outer scope where result could be null
  const getStrongSubjects = (r: TestResult) =>
    r.subjectPerformance
      .filter(s => s.accuracy >= 60)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 2)
      .map(s => s.name);

  const getWeakSubjects = (r: TestResult) =>
    r.subjectPerformance
      .filter(s => s.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2)
      .map(s => s.name);

  const getSuggestedTopics = (r: TestResult) => {
    const suggestions: Record<string, string> = {
      "Mathematics": "Focus on Arithmetic and Algebra fundamentals",
      "Polity": "Practice Constitutional Articles and Amendment",
      "History": "Revise Modern India and Freedom Struggle",
      "Geography": "Study Indian Physical Features and Climate",
    };
    return getWeakSubjects(r).map(s => suggestions[s] || s).slice(0, 2);
  };

  const handleSaveAnalysis = () => {
    const id = result?.attemptId || result?.testId || 'latest';
    localStorage.setItem(`analysis-${id}`, selfAnalysis);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // FIX: derive initial from real user data instead of hardcoded "A"
  const avatarInitial =
    user?.fullName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--ink)', fontWeight: 600 }}>Loading analysis...</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ink-3)', marginTop: 8 }}>Fetching your test results</div>
          </div>
        </div>
      </>
    );
  }

  if (!result) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="wrap">
          <header className="topbar">
            <div className="topbar-left">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={14} />
                Back to Tests
              </button>
              <div>
                <div className="topbar-title">Test Analysis</div>
              </div>
            </div>
          </header>
          <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--ink)', fontWeight: 700, marginBottom: 12 }}>No Test Attempts Yet</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>Complete a mock test to see your detailed performance analysis, subject-wise breakdown, and personalized insights.</div>
              <button
                onClick={() => navigate("/mock-test/cds")}
                style={{ marginTop: 24, background: 'var(--gold)', color: 'var(--ink)', border: 'none', padding: '14px 32px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Start a Mock Test
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} />
              Back to Tests
            </button>
            <div>
              <div className="topbar-title">Test Analysis</div>
              <div className="topbar-sub">{result.testName}</div>
            </div>
          </div>
          {/* FIX: dynamic initial from user.displayName or user.email */}
          <div className="avatar">{avatarInitial}</div>
        </header>

        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="ph-pattern" />
            <div className="ph-glow" />
            <div style={{ position: "relative" }}>
              <div className="ph-title">◷ Test Analysis Report</div>
              <div className="ph-sub">Review your performance and learn from mistakes</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab ${activeTab === "summary" ? "active" : ""}`} onClick={() => setActiveTab("summary")}>
              Performance Summary
            </button>
            <button className={`tab ${activeTab === "questions" ? "active" : ""}`} onClick={() => setActiveTab("questions")}>
              Question Review ({result.questions.length})
            </button>
            <button className={`tab ${activeTab === "analysis" ? "active" : ""}`} onClick={() => setActiveTab("analysis")}>
              Self Analysis
            </button>
          </div>

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <>
              <div className="perf-summary">
                <div className="perf-card main">
                  <div className="perf-val">{result.totalScore}/{result.totalMarks}</div>
                  <div className="perf-label">Total Score</div>
                </div>
                <div className="perf-card">
                  <div className="perf-val">{result.accuracy}%</div>
                  <div className="perf-label">Accuracy</div>
                </div>
                <div className="perf-card">
                  <div className="perf-val">{result.timeTaken}</div>
                  <div className="perf-label">Time Taken</div>
                </div>
                <div className="perf-card">
                  <div className="perf-val">{result.questionsAttempted}</div>
                  <div className="perf-label">Attempted</div>
                </div>
              </div>

              <div className="perf-row">
                <div className="perf-mini correct">
                  <div className="perf-mini-val">{result.correctAnswers}</div>
                  <div className="perf-mini-label">Correct</div>
                </div>
                <div className="perf-mini incorrect">
                  <div className="perf-mini-val">{result.incorrectAnswers}</div>
                  <div className="perf-mini-label">Incorrect</div>
                </div>
                <div className="perf-mini skipped">
                  <div className="perf-mini-val">{result.unattempted}</div>
                  <div className="perf-mini-label">Skipped</div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">
                  <Target size={20} />
                  Subject-wise Performance
                </div>
                <div className="subject-grid">
                  {result.subjectPerformance.map((subject, idx) => (
                    <div className="subject-card" key={idx}>
                      <div className="subject-header">
                        <span className="subject-name">{subject.name}</span>
                        <span className={`subject-acc ${getAccuracyClass(subject.accuracy)}`}>
                          {subject.accuracy}%
                        </span>
                      </div>
                      <div className="subject-stats">
                        {subject.correct}/{subject.totalQuestions} correct
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${getAccuracyClass(subject.accuracy)}`}
                          style={{ width: `${subject.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <div className="section-title">
                  <TrendingUp size={20} />
                  Performance Insights
                </div>
                <div className="insights-grid">
                  {/* FIX: pass result explicitly — safe, no null access possible here */}
                  <div className="insight-card strong">
                    <div className="insight-label">Strong Areas</div>
                    <div className="insight-value">{getStrongSubjects(result).join(", ") || "None"}</div>
                  </div>
                  <div className="insight-card weak">
                    <div className="insight-label">Weak Areas</div>
                    <div className="insight-value">{getWeakSubjects(result).join(", ") || "None"}</div>
                  </div>
                  <div className="insight-card suggest">
                    <div className="insight-label">Focus Topics</div>
                    <div className="insight-value">{getSuggestedTopics(result).join(", ") || "None"}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="section">
              <div className="section-title">
                <BookOpen size={20} />
                Question Review ({result.questions.length} Questions)
              </div>

              {result.questions.length === 0 ? (
                <div className="empty-state">
                  <h3>Question details unavailable</h3>
                  <p>Full question data could not be loaded for this attempt.</p>
                </div>
              ) : (
                <div className="question-list">
                  {result.questions.map((q) => {
                    const isSkipped  = q.selectedAnswer === null;
                    // FIX: both correctAnswer and selectedAnswer are numbers — comparison is now valid
                    const isCorrect  = !isSkipped && q.selectedAnswer === q.correctAnswer;
                    const isExpanded = expandedQuestion === q.id;

                    return (
                      <div className="question-item" key={q.id}>
                        <div
                          className="question-header"
                          onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                        >
                          <span className="question-num">Q{q.id}. {q.subject}</span>
                          <span className={`question-status ${isSkipped ? "skipped" : isCorrect ? "correct" : "incorrect"}`}>
                            {isSkipped
                              ? <><Clock size={14} /> Skipped</>
                              : isCorrect
                                ? <><CheckCircle size={14} /> Correct</>
                                : <><XCircle size={14} /> Incorrect</>}
                          </span>
                        </div>
                        <div className={`question-body ${isExpanded ? "open" : ""}`}>
                          <div className="question-text">{q.question}</div>
                          <div className="option-list">
                            {q.options.map((opt, idx) => {
                              const isAnswer   = idx === q.correctAnswer;
                              // FIX: idx (number) === q.selectedAnswer (number) — works correctly now
                              const isSelected = idx === q.selectedAnswer;
                              const cls = isAnswer
                                ? "option correct-answer"
                                : isSelected
                                  ? "option wrong-answer"
                                  : "option";
                              return (
                                <div key={idx} className={cls}>
                                  <span className="option-marker">
                                    {isAnswer ? "✓" : isSelected ? "✗" : String.fromCharCode(65 + idx)}
                                  </span>
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                          <div className="explanation">
                            <div className="explanation-label">Explanation</div>
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Self Analysis Tab */}
          {activeTab === "analysis" && (
            <div className="section">
              <div className="section-title">
                <BookOpen size={20} />
                My Test Analysis
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-3)", marginBottom: "16px", lineHeight: 1.6 }}>
                Reflect on your test performance. Write about:
              </p>
              <ul style={{ fontSize: "0.8rem", color: "var(--ink-3)", marginBottom: "20px", paddingLeft: "20px", lineHeight: 1.8 }}>
                <li>Mistakes you made and why</li>
                <li>Topics that need more revision</li>
                <li>Time management strategy improvements</li>
                <li>What you did well and should continue</li>
              </ul>
              <textarea
                className="analysis-box"
                placeholder="Write your test analysis here..."
                value={selfAnalysis}
                onChange={(e) => setSelfAnalysis(e.target.value)}
              />
              <button className="save-btn" onClick={handleSaveAnalysis}>
                <Save size={16} />
                {saved ? "Saved!" : "Save Notes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}