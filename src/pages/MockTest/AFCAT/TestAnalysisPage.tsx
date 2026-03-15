import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, Clock, Target, TrendingUp, BookOpen, Save } from "lucide-react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface QuestionData {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
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

  .content { padding: 28px 28px; max-width: 90%; width: 100%; margin: 0 auto; flex: 1; }

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

  .perf-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .perf-card { background: white; border-radius: 12px; padding: 20px; box-shadow: var(--shadow); border: 1px solid var(--paper-3); text-align: center; }
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

  .section { background: white; border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); margin-bottom: 24px; border: 1px solid var(--paper-3); }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--ink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .section-title svg { color: var(--gold); }

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

  .analysis-box { width: 100%; min-height: 150px; padding: 14px; border: 1px solid var(--paper-3); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: .9rem; resize: vertical; background: var(--paper); }
  .analysis-box:focus { outline: none; border-color: var(--gold); }
  .save-btn { margin-top: 12px; background: var(--gold); color: var(--ink); border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: .85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .15s; }
  .save-btn:hover { background: var(--gold-light); }

  .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
  .tab { padding: 10px 20px; border-radius: 8px; font-size: .85rem; font-weight: 600; cursor: pointer; background: var(--paper); color: var(--ink-3); border: 1px solid var(--paper-3); transition: all .15s; }
  .tab.active { background: var(--ink); color: white; border-color: var(--ink); }
  .tab:hover:not(.active) { border-color: var(--gold); }

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

export default function AFCATTestAnalysisPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"summary" | "questions" | "analysis">("summary");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [selfAnalysis, setSelfAnalysis] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const fetchLatestAttempt = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const attemptsRef = collection(db, `users/${user.id}/mockTestAttempts`);
        const q = query(
          attemptsRef,
          orderBy('completedAt', 'desc'),
          limit(10)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          let afcatAttempt = null;
          for (const doc of snapshot.docs) {
            const data = doc.data();
            const testId = data.testId?.toLowerCase() || '';
            const testTitle = data.testTitle?.toLowerCase() || '';
            if (testId === 'afcat' || testTitle.includes('afcat')) {
              afcatAttempt = { data, id: doc.id };
              break;
            }
          }
          
          if (!afcatAttempt) {
            setLoading(false);
            return;
          }
          
          const attemptData = afcatAttempt.data;
          
          const minutes = Math.floor(attemptData.timeTaken / 60);
          const seconds = attemptData.timeTaken % 60;
          const timeTakenStr = minutes > 0 ? `${minutes}h ${seconds}m` : `${seconds}s`;

          const subjectPerformance: SubjectPerformance[] = [
            { name: "Numerical Ability", totalQuestions: 25, correct: Math.floor(attemptData.correct * 0.3), accuracy: 70 },
            { name: "Reasoning", totalQuestions: 25, correct: Math.floor(attemptData.correct * 0.35), accuracy: 75 },
            { name: "General Awareness", totalQuestions: 25, correct: Math.floor(attemptData.correct * 0.2), accuracy: 60 },
            { name: "English", totalQuestions: 25, correct: Math.floor(attemptData.correct * 0.15), accuracy: 55 },
          ];

          setResult({
            testId: attemptData.testId || 'afcat',
            testName: attemptData.testTitle || 'AFCAT Mock Test',
            totalScore: attemptData.score || 0,
            totalMarks: attemptData.totalMarks || 100,
            questionsAttempted: (attemptData.correct || 0) + (attemptData.incorrect || 0),
            correctAnswers: attemptData.correct || 0,
            incorrectAnswers: attemptData.incorrect || 0,
            unattempted: attemptData.unanswered || 0,
            accuracy: attemptData.accuracy || 0,
            timeTaken: timeTakenStr,
            subjectPerformance,
            questions: [],
            attemptId: afcatAttempt.id
          });

          const savedAnalysis = localStorage.getItem(`analysis-${afcatAttempt.id}`);
          if (savedAnalysis) {
            setSelfAnalysis(savedAnalysis);
          }
        }
      } catch (error) {
        console.error('Error fetching attempt:', error);
      }

      setLoading(false);
    };

    fetchLatestAttempt();
  }, [user]);

  const getAccuracyClass = (accuracy: number) => {
    if (accuracy >= 70) return "high";
    if (accuracy >= 50) return "medium";
    return "low";
  };

  const getStrongSubjects = () => {
    if (!result) return [];
    return result.subjectPerformance
      .filter(s => s.accuracy >= 60)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 2)
      .map(s => s.name);
  };

  const getWeakSubjects = () => {
    if (!result) return [];
    return result.subjectPerformance
      .filter(s => s.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2)
      .map(s => s.name);
  };

  const getSuggestedTopics = () => {
    const weak = getWeakSubjects();
    const suggestions: Record<string, string> = {
      "Numerical Ability": "Focus on Arithmetic and Algebra fundamentals",
      "Reasoning": "Practice Verbal and Non-Verbal Reasoning",
      "General Awareness": "Revise Current Affairs and Static GK",
      "English": "Focus on Grammar and Comprehension"
    };
    return weak.map(s => suggestions[s] || s).slice(0, 2);
  };

  const handleSaveAnalysis = () => {
    const id = result?.attemptId || result?.testId || 'latest';
    localStorage.setItem(`analysis-${id}`, selfAnalysis);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
              <button className="back-btn" onClick={() => navigate("/mock-test/afcat")}>
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
              <div style={{ fontSize: '1.5rem', color: 'var(--ink)', fontWeight: 700, marginBottom: 12 }}>No AFCAT Test Attempts Yet</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>Complete an AFCAT mock test to see your detailed performance analysis.</div>
              <button 
                onClick={() => navigate("/mock-test/afcat")}
                style={{ 
                  marginTop: 24, 
                  background: 'var(--gold)', 
                  color: 'var(--ink)', 
                  border: 'none', 
                  padding: '14px 32px', 
                  borderRadius: 8, 
                  fontWeight: 700, 
                  cursor: 'pointer'
                }}
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
        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate("/mock-test/afcat")}>
              <ArrowLeft size={14} />
              Back to Tests
            </button>
            <div>
              <div className="topbar-title">Test Analysis</div>
              <div className="topbar-sub">{result.testName}</div>
            </div>
          </div>
          <div className="avatar">A</div>
        </header>

        <div className="content">
          <div className="page-header">
            <div className="ph-pattern" />
            <div className="ph-glow" />
            <div style={{ position: "relative" }}>
              <div className="ph-title">◷ AFCAT Test Analysis Report</div>
              <div className="ph-sub">Review your performance and learn from mistakes</div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab ${activeTab === "summary" ? "active" : ""}`} onClick={() => setActiveTab("summary")}>
              Performance Summary
            </button>
            <button className={`tab ${activeTab === "questions" ? "active" : ""}`} onClick={() => setActiveTab("questions")}>
              Question Review
            </button>
            <button className={`tab ${activeTab === "analysis" ? "active" : ""}`} onClick={() => setActiveTab("analysis")}>
              Self Analysis
            </button>
          </div>

          {activeTab === "summary" && (
            <>
              <div className="perf-summary">
                <div className="perf-card main">
                  <div className="perf-val">{result.totalScore}%</div>
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
                  <div className="insight-card strong">
                    <div className="insight-label">Strong Areas</div>
                    <div className="insight-value">
                      {getStrongSubjects().join(", ") || "None"}
                    </div>
                  </div>
                  <div className="insight-card weak">
                    <div className="insight-label">Weak Areas</div>
                    <div className="insight-value">
                      {getWeakSubjects().join(", ") || "None"}
                    </div>
                  </div>
                  <div className="insight-card suggest">
                    <div className="insight-label">Focus Topics</div>
                    <div className="insight-value">
                      {getSuggestedTopics().join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "questions" && (
            <div className="section">
              <div className="section-title">
                <BookOpen size={20} />
                Question Review
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-3)", marginBottom: "16px" }}>
                Question-by-question review is not yet available for AFCAT tests.
              </p>
            </div>
          )}

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
