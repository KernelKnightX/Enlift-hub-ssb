import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getMockTestsByExam } from "@/lib/mockTestService";
import type { MockTest } from "@/types/schema";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
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

  /* stats row */
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card { background: white; border-radius: 12px; padding: 18px 20px; box-shadow: var(--shadow); border: 1px solid var(--paper-3); }
  .stat-val { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: var(--ink); line-height: 1; }
  .stat-label { font-size: .7rem; color: var(--ink-3); margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
  .stat-bar { height: 3px; border-radius: 99px; margin-top: 12px; background: var(--paper-3); overflow: hidden; }
  .stat-fill { height: 100%; border-radius: 99px; }

  /* section label */
  .section-label { font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 12px; }

  /* test cards */
  .tests-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }

  .cds-filter-bar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .cds-filter-btn {
    padding: 8px 18px; border-radius: 8px; font-size: .8rem; font-weight: 600;
    cursor: pointer; border: 1px solid var(--paper-3); background: white; color: var(--ink-3);
    font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .cds-filter-btn:hover { border-color: var(--gold); color: var(--ink); }
  .cds-filter-btn.active { background: var(--ink); color: white; border-color: var(--ink); }

  .test-card {
    background: white; border-radius: var(--radius); border: 1.5px solid var(--paper-3);
    padding: 20px 22px; display: flex; justify-content: space-between; align-items: center;
    box-shadow: var(--shadow); transition: all .18s; position: relative; overflow: hidden; gap: 16px;
  }
  .test-card::before {
    content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 4px;
    background: var(--gold); transform: scaleY(0); transition: transform .2s;
  }
  .test-card:hover::before, .test-card.active::before { transform: scaleY(1); }
  .test-card:hover { border-color: var(--gold); box-shadow: var(--shadow-lg); }
  .test-card.active { border-color: var(--gold); background: #fffbeb; box-shadow: var(--shadow-lg); }

  .card-icon {
    width: 44px; height: 44px; border-radius: 11px; background: var(--paper);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: background .18s;
  }
  .test-card.active .card-icon { background: var(--gold-light); }

  .card-body { flex: 1; min-width: 0; }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--ink); margin-bottom: 3px; }
  .card-subject { font-size: .75rem; color: var(--ink-3); font-weight: 500; margin-bottom: 10px; }
  .card-pills { display: flex; gap: 8px; margin-top: 8px; }
  .card-duration { font-size: .75rem; color: var(--ink-3); font-weight: 500; margin-top: 4px; }
  .pill {
    font-size: .68rem; font-weight: 600; padding: 3px 10px; border-radius: 6px;
    background: var(--paper); color: var(--ink-3); border: 1px solid var(--paper-3);
  }
  .pill-neg { color: #991b1b; border-color: #fca5a5; background: #fff1f2; }

  .card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }

  .start-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--ink); color: white; border: none; border-radius: 8px;
    padding: 9px 20px; font-size: .82rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: .02em; transition: all .18s;
    white-space: nowrap;
  }
  .start-btn:hover { background: var(--gold); color: var(--ink); }

  .loading-box {
    background: white; border-radius: var(--radius); border: 1px solid var(--paper-3);
    box-shadow: var(--shadow); padding: 48px 24px; text-align: center; margin-bottom: 24px;
  }
  .loading-box p { font-size: .85rem; color: var(--ink-3); font-weight: 500; margin-top: 12px; }
  .spinner {
    display: inline-block; width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid var(--paper-3); border-top-color: var(--gold);
    animation: spin .75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty-box {
    background: white; border-radius: var(--radius); border: 2px dashed var(--paper-3);
    padding: 52px 24px; text-align: center; margin-bottom: 24px;
  }
  .empty-box h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--ink-2); margin-bottom: 6px; }
  .empty-box p { font-size: .78rem; color: var(--ink-3); }

  /* instructions */
  .instr-box {
    background: white; border-radius: var(--radius); border: 1px solid var(--paper-3);
    box-shadow: var(--shadow); overflow: hidden; margin-bottom: 24px;
  }
  .instr-head { background: var(--paper); padding: 14px 20px; border-bottom: 1px solid var(--paper-3); }
  .instr-head-title { font-family: 'Playfair Display', serif; font-size: .95rem; color: var(--ink); }
  .instr-body { padding: 18px 20px; }
  .instr-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 14px; }
  .instr-meta-item { font-size: .8rem; color: var(--ink-2); font-weight: 500; }
  .instr-meta-val { font-weight: 700; color: var(--ink); }
  .instr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
  .instr-item { display: flex; align-items: flex-start; gap: 9px; font-size: .78rem; color: var(--ink-2); line-height: 1.5; font-weight: 500; }
  .instr-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; margin-top: 7px; }

  .marking { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
  .marking-pill { font-size: .72rem; font-weight: 700; padding: 5px 12px; border-radius: 6px; display: flex; align-items: center; gap: 5px; }
  .marking-correct { background: #d1fae5; color: #065f46; }
  .marking-wrong   { background: #fee2e2; color: #991b1b; }
  .marking-skip    { background: var(--paper-2); color: var(--ink-3); }

  .cta { text-align: center; padding-bottom: 8px; }
  .cta-hint { font-size: .78rem; color: var(--ink-3); font-weight: 500; margin-bottom: 14px; }

  /* Modal Overlay */
  .cds-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .cds-modal-box {
    background: white; border-radius: 16px; max-width: 560px; width: 100%;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  }
  .cds-modal-head {
    background: var(--ink); padding: 20px 24px; border-radius: 16px 16px 0 0;
  }
  .cds-modal-head-title {
    font-family: 'Playfair Display', serif; font-size: 1.1rem; color: white;
  }
  .cds-modal-body { padding: 24px; }
  .cds-modal-footer {
    padding: 16px 24px 24px; display: flex; gap: 12px; justify-content: flex-end;
  }
  .cds-modal-btn {
    padding: 12px 24px; border-radius: 10px; font-size: .9rem; font-weight: 700;
    cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .cds-modal-btn-cancel {
    background: var(--paper); color: var(--ink-2); border: 1px solid var(--paper-3);
  }
  .cds-modal-btn-cancel:hover { background: var(--paper-2); }
  .cds-modal-btn-primary {
    background: var(--gold); color: var(--ink);
  }
  .cds-modal-btn-primary:hover { background: var(--gold-light); }

  .proceed-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--ink); color: white; border: none; border-radius: 10px;
    padding: 13px 48px; font-size: .92rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: .02em; transition: all .18s;
  }
  .proceed-btn:hover { background: var(--gold); color: var(--ink); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .animate { animation: fadeUp .4s ease both; }
  .delay-1 { animation-delay: .07s; }
  .delay-2 { animation-delay: .14s; }
  .delay-3 { animation-delay: .21s; }
  
  /* RESPONSIVE */
  @media (max-width: 900px) {
    .content { padding: 20px; max-width: 95%; }
    .page-header { padding: 20px; flex-direction: column; align-items: flex-start; }
    .stats { grid-template-columns: 1fr 1fr; gap: 12px; }
  }
  @media (max-width: 600px) {
    .topbar { padding: 0 16px; }
    .content { padding: 16px; max-width: 100%; }
    .page-header { padding: 16px; }
    .ph-title { font-size: 1.2rem; }
    .ph-sub { font-size: 0.85rem; }
    .stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .stat-card { padding: 12px; }
    .stat-val { font-size: 1.3rem; }
    .tests-list { grid-template-columns: 1fr; }
    .cds-filter-select { min-width: 150px; }
  }
`;

const GENERAL_INSTRUCTIONS = [
  "Do not refresh or close the browser during the test",
  "Timer auto-submits the test when it reaches zero",
  "All questions are MCQ with 4 options",
  "Unanswered questions carry no penalty",
  "You can mark questions for review and revisit them",
  "Navigate freely between any question",
];

export default function CDSMockTestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  
  // Stats state
  const [testsAttempted, setTestsAttempted] = useState(0);
  const [totalTestsAvailable, setTotalTestsAvailable] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Load tests
  useEffect(() => {
    getMockTestsByExam("CDS")
      .then((data) => {
        setTests(data);
        setTotalTestsAvailable(data.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load user attempts from Firestore
  useEffect(() => {
    if (!user) return;
    
    const loadAttempts = async () => {
      try {
        const attemptsQuery = query(
          collection(db, `users/${user.id}/mockTestAttempts`),
          orderBy('completedAt', 'desc'),
          limit(50)
        );
        
        const snapshot = await getDocs(attemptsQuery);
        const attempts: any[] = [];
        
        snapshot.forEach(doc => {
          attempts.push({ id: doc.id, ...doc.data() });
        });
        
        // Filter attempts for CDS exam
        const cdsAttempts = attempts.filter(a => 
          a.examName === 'CDS' || 
          (a.testTitle && a.testTitle.toLowerCase().includes('cds')) ||
          (a.testId && a.testId.toLowerCase().includes('cds'))
        );
        
        if (cdsAttempts.length > 0) {
          setTestsAttempted(cdsAttempts.length);
          
          // Calculate average score - handle both cases:
          // 1. score is already a percentage (e.g., 75 for 75%)
          // 2. score is raw marks and needs calculation
          const validAttempts = cdsAttempts.filter(a => a.score != null);
          
          if (validAttempts.length > 0) {
            // Check if score is already a percentage or raw marks
            const scores = validAttempts.map(a => {
              // If score > 100, it's likely raw marks, calculate percentage
              if (a.score > 100 && a.totalMarks && a.totalMarks > 0) {
                return (a.score / a.totalMarks) * 100;
              }
              // Otherwise treat as percentage
              return a.score || 0;
            });
            
            const avg = scores.reduce((acc, s) => acc + s, 0) / scores.length;
            setAverageScore(Math.round(avg));
            setBestScore(Math.round(Math.max(...scores)));
          }
        }
      } catch (error) {
        console.log('No attempts found or error loading:', error);
      }
    };
    
    loadAttempts();
  }, [user]);

  const handleStartTest = (test: MockTest) => {
    setSelectedTest(test);
  };

  const handleViewAnalysis = () => {
    navigate("/mock-test/cds/analysis");
  };

  const handleProceedToTest = () => {
    if (!selectedTest) return;
    navigate(`/mock-test/cds/test?testId=${selectedTest.id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Dashboard
            </button>
            <div>
              <div className="topbar-title">CDS Mock Test</div>
              <div className="topbar-sub">Combined Defence Services Examination</div>
            </div>
          </div>
          <div className="avatar">A</div>
        </header>

        <div className="content">

          {/* Page Header */}
          <div className="page-header animate">
            <div className="ph-pattern" />
            <div className="ph-glow" />
            <div style={{ position: "relative" }}>
              <div className="ph-title">◷ CDS Mock Test Series</div>
              <div className="ph-sub">UPSC Combined Defence Services — Simulate real exam conditions</div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats animate delay-1">
            {[
              { val: totalTestsAvailable.toString(), label: "Total Available", fill: "#6366f1", pct: 0 },
              { val: testsAttempted > 0 ? testsAttempted.toString() : "0", label: "Tests Attempted", fill: "#c9a84c", pct: 0 },
              { val: testsAttempted > 0 ? `${averageScore}%` : "—", label: "Average Score", fill: "#f59e0b", pct: 0 },
              { val: testsAttempted > 0 ? `${bestScore}%` : "—", label: "Best Score", fill: "#10b981", pct: 0 },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-bar">
                  <div className="stat-fill" style={{ width: `${s.pct}%`, background: s.fill }} />
                </div>
              </div>
            ))}
          </div>

          {/* View Analysis Button */}
          {testsAttempted > 0 && (
            <div style={{ marginBottom: 24 }}>
              <button 
                onClick={handleViewAnalysis}
                style={{ 
                  background: '#c9a84c', 
                  color: '#0f1923', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: 8, 
                  fontWeight: 700, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                View Test Analysis
              </button>
            </div>
          )}

          {/* Test List */}
          <div className="animate delay-2">
            <div className="section-label">Available Tests</div>

            {/* Subject Filter */}
            <div className="cds-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>Filter by Subject:</label>
              <select 
                className="cds-filter-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                  fontSize: '13px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
              >
                <option value="all">All Subjects</option>
                <option value="English">English</option>
                <option value="Elementary Mathematics">Elementary Mathematics</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Indian Polity">Indian Polity</option>
                <option value="Economics">Economics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Environment & Ecology">Environment & Ecology</option>
                <option value="Current Affairs">Current Affairs</option>
                <option value="Defence & Military Awareness">Defence & Military Awareness</option>
                <option value="Complete mock test">Complete mock test</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-box">
                <div className="spinner" />
                <p>Loading available tests…</p>
              </div>
            ) : tests.length === 0 ? (
              <div className="empty-box">
                <h3>No tests available yet</h3>
                <p>CDS mock tests will appear here once the admin uploads them.</p>
              </div>
            ) : (
              <div className="tests-list">
                {(subjectFilter === 'all' ? tests : tests.filter(t => 
                  t.subject?.toLowerCase().includes(subjectFilter.toLowerCase()) ||
                  (subjectFilter === 'Full Test' && (!t.subject || t.subject === 'Full Test'))
                )).map((test) => {
                  const isActive = selectedTest?.id === test.id;
                  return (
                    <div
                      key={test.id}
                      className={`test-card${isActive ? " active" : ""}`}
                    >
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" width="20" height="20">
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="1" />
                          <path d="M9 12h6M9 16h4" />
                        </svg>
                      </div>
                      <div className="card-body">
                        <div className="card-title">{test.title}</div>
                        <div className="card-subject">{test.subject} &nbsp;·&nbsp; {test.examName}</div>
                        <div className="card-pills">
                          <span className="pill">{test.totalQuestions} Questions</span>
                          <span className="pill">{test.totalMarks} Marks</span>
                        </div>
                        <div className="card-duration">{test.duration} Minutes</div>
                        <button
                          className="start-btn"
                          style={{ width: '100%', marginTop: '12px', background: 'var(--ink)', color: 'white' }}
                          onClick={() => handleStartTest(test)}
                        >
                          Start Test →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instructions Modal — shown after clicking Start Test */}
          {selectedTest && (
            <div className="cds-modal-overlay">
              <div className="cds-modal-box">
                <div className="cds-modal-head">
                  <div className="cds-modal-head-title">⚡ Before You Begin — {selectedTest.title}</div>
                </div>
                <div className="cds-modal-body">
                  <div className="instr-meta">
                    <span className="instr-meta-item">
                      Questions: <span className="instr-meta-val">{selectedTest.totalQuestions}</span>
                    </span>
                    <span className="instr-meta-item">
                      Duration: <span className="instr-meta-val">{selectedTest.duration} min</span>
                    </span>
                    <span className="instr-meta-item">
                      Total Marks: <span className="instr-meta-val">{selectedTest.totalMarks}</span>
                    </span>
                    <span className="instr-meta-item">
                      Subject: <span className="instr-meta-val">{selectedTest.subject}</span>
                    </span>
                  </div>
                  <div className="instr-grid">
                    {GENERAL_INSTRUCTIONS.map((text) => (
                      <div key={text} className="instr-item">
                        <div className="instr-dot" />
                        {text}
                      </div>
                    ))}
                  </div>
                  <div className="marking">
                    <span className="marking-pill marking-correct">
                      ✓ Correct: +{selectedTest.positiveMarking}
                    </span>
                    <span className="marking-pill marking-wrong">
                      ✕ Wrong: −{selectedTest.negativeMarking}
                    </span>
                    <span className="marking-pill marking-skip">— Skipped: 0</span>
                  </div>
                </div>
                <div className="cds-modal-footer">
                  <button className="cds-modal-btn cds-modal-btn-cancel" onClick={() => setSelectedTest(null)}>
                    Cancel
                  </button>
                  <button className="cds-modal-btn cds-modal-btn-primary" onClick={handleProceedToTest}>
                    Proceed to Test →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom hint */}
          {!selectedTest && !loading && tests.length > 0 && (
            <div className="cta animate delay-3">
              <p className="cta-hint">Click "Start Test" on any test above to view instructions</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
