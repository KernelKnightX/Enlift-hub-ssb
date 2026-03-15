import { useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

const piqSections = [
  { field: "Personal details", what: "Full name, date of birth, address, religion, native place. Must match all certificates exactly — any discrepancy is noted." },
  { field: "Educational background", what: "Class 10 onwards. Institution name, board, year, percentage, subjects, achievements. Full names — no abbreviations." },
  { field: "Family details", what: "Parents' full names, occupation (specific — not just 'government employee'), education. Siblings. Family's view on your joining the forces." },
  { field: "Hobbies & interests", what: "Be specific. Not 'reading' — 'reading military biographies, currently reading Sam Manekshaw by Lionel Cartridge'. IO will ask you to elaborate on every single entry." },
  { field: "Sports & activities", what: "Level matters: inter-school, district, state. Include regular physical activity even if not competitive. Fitness signals discipline." },
  { field: "Achievements", what: "Academic, sports, leadership roles — class representative, event organiser, team captain. Use STAR method in interview: Situation → Task → Action → Result." },
  { field: "Why Armed Forces", what: "The most important field. Write a specific, personal reason — not a patriotic cliché. IO will probe this deeply. Your written answer and spoken answer must match." },
];

const ciqDomains = [
  {
    domain: "Education & Background",
    note: "IO builds the foundation here. They want to understand your choices, not just your results.",
    questions: [
      "Tell me about your education from Class 10 onwards — percentage, subjects chosen, achievements.",
      "Why did you choose this academic stream?",
      "What subject did you find most difficult? How did you handle it?",
      "Did you face any financial difficulty in your education?",
      "What are your future career plans if not selected this time?",
    ]
  },
  {
    domain: "Family & Values",
    note: "IO is probing values absorbed at home — not testing family facts. Authentic answers matter more than ideal ones.",
    questions: [
      "Tell me about your family members — their education and occupation.",
      "Who are you closest to in the family, and why?",
      "Whom do you go to when you have a serious problem?",
      "How does your family feel about you joining the armed forces?",
      "What has your family taught you about discipline and responsibility?",
    ]
  },
  {
    domain: "Hobbies & Interests",
    note: "Whatever you wrote in the PIQ — the IO will ask you to go deep. Never write anything you cannot speak about for 3 minutes.",
    questions: [
      "Tell me about your hobby of [X]. How long have you been doing it?",
      "What is the most recent book you have read? What did you take from it?",
      "What sports have you played and at what level?",
      "How do you spend a typical Sunday?",
      "What is something you have learned outside of formal education?",
    ]
  },
  {
    domain: "Leadership & Self-Awareness",
    note: "IO is building a character portrait — not checking if you've memorised the right answers.",
    questions: [
      "Describe a situation where you showed leadership.",
      "What are your three strongest qualities? Give an example of each.",
      "What is your most significant weakness? What have you done about it?",
      "Tell me about your biggest failure and what you learned from it.",
      "Who is your role model and why — specifically?",
    ]
  },
  {
    domain: "Why Armed Forces",
    note: "The single most important domain. Generic patriotism fails immediately. Personal, specific, and rooted in real experience is the only answer that works.",
    questions: [
      "Why do you want to join the Armed Forces?",
      "Why specifically the [Army / Navy / Air Force]?",
      "Why this entry — NDA / CDS / TES / AFCAT?",
      "What if you are not selected? What will you do?",
      "Who or what inspired you to pursue a commission?",
    ]
  },
  {
    domain: "Current Affairs & General Awareness",
    note: "IO expects awareness proportional to your background. Read for understanding — not for facts to recite.",
    questions: [
      "Give me 5 current national news stories and 5 international ones.",
      "Tell me about a recent defence development you found significant.",
      "What are the major security challenges India faces today?",
      "What is India's foreign policy on [current bilateral issue]?",
      "What does Atmanirbhar Bharat mean for the defence sector?",
    ]
  },
];

const whatIOAssesses = [
  { quality: "Authenticity", detail: "Is this person genuinely who they say they are? Inconsistency between PIQ entries and spoken answers is immediately flagged." },
  { quality: "Maturity", detail: "Can you acknowledge limitations without self-pity? A candidate who says 'I don't know, but my understanding is...' scores more than one who bluffs." },
  { quality: "Self-awareness", detail: "Do you know yourself — your strengths, failures, what shaped you? Vague self-descriptions reveal a candidate who hasn't reflected." },
  { quality: "Composure", detail: "CIQ questions (5–10 rapid-fire in sequence) are designed to stress your working memory. Staying organised and calm under that pressure is itself an OLQ." },
  { quality: "Depth of knowledge", detail: "Breadth alone is not enough. IO will dig into any topic you mention. Genuine depth on a few areas beats surface knowledge across many." },
  { quality: "Consistency with psychology", detail: "IO cross-references what you say against the psychologist's Day 2 assessment. A confident self-description that contradicts passive TAT stories will be challenged." },
];

const mistakes = [
  { mistake: "Writing entries in PIQ you cannot elaborate on", fix: "Every entry in the PIQ will be questioned. Only write what you can speak about for 3 minutes minimum." },
  { mistake: "Giving a rehearsed answer to 'Tell me about yourself'", fix: "Practise the structure — Background → Education → Interests → Why Forces — not the words. Rehearsed delivery is immediately obvious." },
  { mistake: "Generic motivation: 'I love my country / I want to serve the nation'", fix: "Connect your motivation to a specific personal experience, moment or person. The IO has heard the generic answer a thousand times." },
  { mistake: "Confidently stating an incorrect fact", fix: "Say 'I'm not certain, but my understanding is...' Intellectual honesty scores higher than confident incorrectness." },
  { mistake: "Being inconsistent with your PIQ or psychology tests", fix: "Before the interview, re-read your PIQ carefully. Ensure your spoken self aligns with your written self and your SD test answers." },
  { mistake: "Answering CIQ questions out of sequence", fix: "In rapid-fire CIQ, IO asks multiple questions at once. Answer in the same order they were asked — it shows listening ability and organising skill." },
  { mistake: "Over-explaining or rambling", fix: "Answer the question, then stop. The IO will probe further if they want more. Unprompted rambling signals anxiety and poor focus." },
];

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .lp { min-height: 100vh; background: #fff; color: #111; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

  .lp-hero { padding: 80px 48px 48px; border-bottom: 2px solid #111; }
  .lp-hero-label { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #999; margin-bottom: 14px; }
  .lp-hero h1 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 14px; }
  .lp-hero-desc { font-size: 0.9rem; line-height: 1.8; color: #555; max-width: 100%; margin-bottom: 32px; }
  .lp-stats { display: flex; border-top: 1px solid #eee; }
  .lp-stat { flex: 1; padding: 16px 20px; border-right: 1px solid #eee; }
  .lp-stat:last-child { border-right: none; }
  .lp-stat-val { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 3px; }
  .lp-stat-label { font-size: 11px; color: #999; font-weight: 500; }

  .lp-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 14px 48px; border-bottom: 1px solid #eee; background: #fafafa; position: sticky; top: 0; z-index: 10; }
  .lp-nav a { font-size: 12px; font-weight: 500; color: #666; text-decoration: none; padding: 6px 12px; border: 1px solid #e0e0e0; border-radius: 3px; transition: all 0.1s; white-space: nowrap; }
  .lp-nav a:hover { color: #111; border-color: #999; }
  .lp-nav a.active { background: #111; color: #fff; border-color: #111; }

  .lp-content { padding: 0 48px 80px; max-width: 1400px; }
  .lp-section { padding: 56px 0 0; }
  .lp-section-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #bbb; margin-bottom: 8px; }
  .lp-section-title { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 10px; }
  .lp-section-desc { font-size: 0.875rem; line-height: 1.75; color: #555; max-width: 100%; margin-bottom: 28px; }
  .lp-divider { border: none; border-top: 1px solid #efefef; margin: 56px 0 0; }

  /* PIQ TABLE */
  .lp-table { width: 100%; border-collapse: collapse; }
  .lp-table thead tr { border-bottom: 2px solid #111; }
  .lp-table th { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #888; padding: 0 16px 10px 0; text-align: left; }
  .lp-table tbody tr { border-bottom: 1px solid #f2f2f2; }
  .lp-table tbody tr:last-child { border-bottom: none; }
  .lp-table td { padding: 13px 16px 13px 0; vertical-align: top; font-size: 13px; line-height: 1.6; color: #333; }
  .lp-table td:first-child { font-weight: 700; color: #111; width: 200px; white-space: nowrap; }

  /* CIQ DOMAINS */
  .lp-domain { margin-bottom: 36px; }
  .lp-domain-hdr { display: flex; align-items: baseline; gap: 14px; padding-bottom: 8px; border-bottom: 2px solid #111; margin-bottom: 8px; }
  .lp-domain-title { font-size: 14px; font-weight: 800; }
  .lp-domain-note { font-size: 12px; color: #888; }
  .lp-q-row { display: grid; grid-template-columns: 24px 1fr; gap: 8px; padding: 9px 0; border-bottom: 1px solid #f5f5f5; align-items: baseline; }
  .lp-q-row:last-child { border-bottom: none; }
  .lp-q-num { font-size: 11px; color: #ccc; font-weight: 700; }
  .lp-q-text { font-size: 13px; color: #222; line-height: 1.55; }

  /* WHAT IO ASSESSES */
  .lp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #eee; border: 1px solid #eee; }
  .lp-grid2-item { background: #fff; padding: 18px 20px; }
  .lp-grid2-title { font-size: 13px; font-weight: 700; margin-bottom: 5px; }
  .lp-grid2-body { font-size: 13px; color: #555; line-height: 1.65; }

  /* MISTAKES */
  .lp-mistake { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 14px 0; border-bottom: 1px solid #f2f2f2; }
  .lp-mistake:first-child { border-top: 1px solid #f2f2f2; }
  .lp-mistake-bad { font-size: 13px; color: #111; line-height: 1.6; }
  .lp-mistake-bad::before { content: '✗  '; color: #c00; font-weight: 700; }
  .lp-mistake-fix { font-size: 13px; color: #333; line-height: 1.6; }
  .lp-mistake-fix::before { content: '→  '; color: #555; font-weight: 700; }

  /* ASSESSOR NOTE */
  .lp-assessor { display: flex; gap: 0; margin-top: 32px; border: 1px solid #e8e8e8; overflow: hidden; border-radius: 3px; }
  .lp-assessor-tag { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); font-size: 9px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; background: #111; color: #fff; padding: 14px 8px; white-space: nowrap; flex-shrink: 0; }
  .lp-assessor-body { padding: 16px 20px; font-size: 13px; line-height: 1.8; color: #333; background: #fafafa; }

  /* CTA */
  .lp-cta { margin-top: 56px; padding: 36px 0 72px; border-top: 2px solid #111; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .lp-cta-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 5px; }
  .lp-cta-sub { font-size: 13px; color: #666; }
  .lp-cta-btns { display: flex; gap: 10px; flex-shrink: 0; }
  .lp-btn-dark { background: #111; color: #fff; padding: 11px 22px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; border-radius: 4px; text-decoration: none; display: inline-block; }
  .lp-btn-dark:hover { background: #333; }
  .lp-btn-light { background: #fff; color: #111; padding: 10px 20px; border: 1px solid #ddd; font-size: 13px; font-weight: 600; border-radius: 4px; text-decoration: none; display: inline-block; }
  .lp-btn-light:hover { border-color: #111; }

  @media (max-width: 900px) {
    .lp-hero { padding: 64px 24px 40px; }
    .lp-nav { padding: 12px 24px; }
    .lp-content { padding: 0 24px 64px; }
    .lp-grid2 { grid-template-columns: 1fr; }
    .lp-mistake { grid-template-columns: 1fr; gap: 8px; }
  }
  @media (max-width: 520px) {
    .lp-hero { padding: 56px 16px 32px; }
    .lp-nav { padding: 10px 16px; }
    .lp-content { padding: 0 16px 56px; }
    .lp-stats { flex-wrap: wrap; }
    .lp-stat { flex: 1 1 45%; border-bottom: 1px solid #eee; }
    .lp-table td:first-child { white-space: normal; width: auto; }
    .lp-cta { flex-direction: column; align-items: flex-start; }
    .lp-cta-btns { flex-direction: column; width: 100%; }
    .lp-btn-dark, .lp-btn-light { text-align: center; width: 100%; }
  }
`;

export default function SSBInterviewPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="lp">
      <style>{css}</style>
      <NavbarSection />
      <header className="lp-hero">
        <div className="lp-hero-label">SSB Assessment · Stage II</div>
        <h1>Personal Interview — Complete Guide</h1>
        <p className="lp-hero-desc">
          The Personal Interview is the most individual stage of SSB. There is no group to blend into —
          it is entirely you and the IO for 45 to 90 minutes. Every question originates from your PIQ.
          The IO is not an adversary; they are a senior officer trying to understand who you genuinely are.
        </p>
        <div className="lp-stats">
          <div className="lp-stat"><div className="lp-stat-val">45–90</div><div className="lp-stat-label">Minutes duration</div></div>
          <div className="lp-stat"><div className="lp-stat-val">PIQ</div><div className="lp-stat-label">IO's entire briefing</div></div>
          <div className="lp-stat"><div className="lp-stat-val">CIQ</div><div className="lp-stat-label">Rapid-fire question style</div></div>
          <div className="lp-stat"><div className="lp-stat-val">6</div><div className="lp-stat-label">Key domains covered</div></div>
        </div>
      </header>

      <nav className="lp-nav">
        <Link to="/ssb-preparation">← Overview</Link>
        <Link to="/ssb-lecturette">Lecturette</Link>
        <Link to="/ssb-interview" className="active">Interview</Link>
        <Link to="/ssb-group-discussion">Group Discussion</Link>
        <Link to="/ssb-gto">GTO Tasks</Link>
        <Link to="/ssb-conference">Conference</Link>
      </nav>

      <div className="lp-content">

        <section className="lp-section" id="piq">
          <div className="lp-section-label">Section 01</div>
          <h2 className="lp-section-title">The PIQ — your most important document</h2>
          <p className="lp-section-desc">
            The Personal Information Questionnaire is filled on Day 1. The IO reads it before meeting you.
            Every interview question traces back to something you wrote here. Fill it with care — not speed.
          </p>
          <table className="lp-table">
            <thead><tr><th>PIQ Field</th><th>What the IO does with it</th></tr></thead>
            <tbody>
              {piqSections.map((r, i) => (
                <tr key={i}><td>{r.field}</td><td>{r.what}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="lp-assessor">
            <div className="lp-assessor-tag">Assessor note</div>
            <div className="lp-assessor-body">
              The IO studies your PIQ and prepares personalised questions before you walk in. Candidates who fill the PIQ hurriedly — with vague entries, poor handwriting, or entries they cannot substantiate — hand the IO easy ammunition. A well-filled PIQ makes the interview a conversation. A poorly-filled one makes it a cross-examination.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="ciq">
          <div className="lp-section-label">Section 02</div>
          <h2 className="lp-section-title">CIQ — question domains with examples</h2>
          <p className="lp-section-desc">
            The IO uses Comprehensive Information Questions — often 5 to 10 rapid-fire questions in one go.
            Answer in the same sequence they were asked. This tests listening, composure and organising ability simultaneously.
          </p>
          {ciqDomains.map((d, i) => (
            <div key={i} className="lp-domain">
              <div className="lp-domain-hdr">
                <span className="lp-domain-title">{d.domain}</span>
                <span className="lp-domain-note">{d.note}</span>
              </div>
              {d.questions.map((q, j) => (
                <div key={j} className="lp-q-row">
                  <span className="lp-q-num">{String(j + 1).padStart(2, '0')}</span>
                  <span className="lp-q-text">{q}</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="assessment">
          <div className="lp-section-label">Section 03</div>
          <h2 className="lp-section-title">What the IO is actually assessing</h2>
          <p className="lp-section-desc">The IO is not marking answers right or wrong. They are building a character portrait across six dimensions.</p>
          <div className="lp-grid2">
            {whatIOAssesses.map((w, i) => (
              <div key={i} className="lp-grid2-item">
                <div className="lp-grid2-title">{w.quality}</div>
                <div className="lp-grid2-body">{w.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="mistakes">
          <div className="lp-section-label">Section 04</div>
          <h2 className="lp-section-title">Common mistakes — and how to fix them</h2>
          <p className="lp-section-desc">These are the patterns that appear most consistently across interview failures.</p>
          {mistakes.map((m, i) => (
            <div key={i} className="lp-mistake">
              <div className="lp-mistake-bad">{m.mistake}</div>
              <div className="lp-mistake-fix">{m.fix}</div>
            </div>
          ))}
          <div className="lp-assessor">
            <div className="lp-assessor-tag">Key reminder</div>
            <div className="lp-assessor-body">
              The best preparation for the personal interview is a well-filled PIQ and genuine self-knowledge. Know your hobbies deeply, your failures honestly, and your reasons for wanting a commission with clarity. Candidates who know themselves well need very little rehearsal. Candidates who do not know themselves cannot rehearse their way out of it.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        <div className="lp-cta">
          <div>
            <div className="lp-cta-title">Continue your preparation</div>
            <p className="lp-cta-sub">Move to the next stage or go back to the overview.</p>
          </div>
          <div className="lp-cta-btns">
            <Link to="/ssb-group-discussion" className="lp-btn-dark">Next: Group Discussion →</Link>
            <Link to="/ssb-preparation" className="lp-btn-light">Back to Overview</Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}