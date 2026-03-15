import { useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

const conferenceProcess = [
  { step: "01", title: "Assessors meet for the first time", detail: "The Psychologist, all GTOs and the Interviewing Officer sit together on the final morning and compare notes for the very first time. No assessor has seen another's observations until this moment. This independence is the foundation of the board's reliability." },
  { step: "02", title: "OLQ ratings are presented", detail: "Each assessor presents their OLQ ratings for every candidate. Candidates where all three assessors agree — positively or negatively — are decided quickly. Those where assessors disagree are discussed at length." },
  { step: "03", title: "Consistency is the deciding factor", detail: "A candidate who appeared confident with the GTO but evasive in the IO's interview will face pointed discussion. The board specifically looks for consistency across all five days and all three independent views." },
  { step: "04", title: "Candidates are called in one by one", detail: "After internal discussion, candidates are called in by chest number. The board president may ask a brief question, or may simply observe and dismiss in under a minute. Duration of the interaction does not indicate outcome." },
  { step: "05", title: "Results announced same day", detail: "After all candidates have appeared, results are announced by chest number. Recommended candidates receive instructions for the medical examination. The medical is conducted at a specified military hospital and is a separate, thorough process." },
];

const whatBoardAsks = [
  { trigger: "Performance inconsistency", example: "You appeared very decisive during the Command Task but hesitated considerably in the GPE group discussion. Can you explain that?" },
  { trigger: "PIQ gap or contradiction", example: "You mentioned in your PIQ that you captained the college football team, but in the interview you said you prefer individual sports. Tell me about that." },
  { trigger: "Specific incident during tasks", example: "During the PGT on Day 3, there was a moment when the group was stuck. Walk me through your thinking at that point." },
  { trigger: "Motivation verification", example: "You've mentioned wanting to join the Air Force since school. What specifically about the Air Force — not the Armed Forces generally?" },
  { trigger: "Simple check (most common)", example: "No question — candidate is observed briefly, given a nod, and dismissed. This is the most frequent outcome and means nothing either way." },
];

const outcomes = [
  { outcome: "Recommended", detail: "Candidate proceeds to a medical examination at a specified military hospital. The medical is rigorous — eyesight, hearing, orthopaedic, dental, and general health standards are all checked to military specifications. Passing the medical leads to merit listing." },
  { outcome: "Not Recommended", detail: "The board does not recommend the candidate for this attempt. Candidates may re-attempt the SSB — the number of permitted attempts depends on the entry and the number of previous attempts recorded. Feedback is not formally provided." },
  { outcome: "Held", detail: "Rare. The candidate is held pending a medical review, administrative clarification, or a decision deferred to a later board. This is uncommon and usually relates to a medical borderline case or documentation issue." },
];

const meritProcess = [
  { stage: "Medical examination", detail: "At a designated military hospital. Thorough assessment across all medical categories. Candidates who pass proceed; those who are medically unfit are informed separately." },
  { stage: "Merit listing", detail: "Final merit list combines the qualifying written exam score (UPSC/NDA/CDS/AFCAT) and the SSB recommendation score. The SSB score is not disclosed." },
  { stage: "Academy allocation", detail: "Merit rank and the number of vacancies in each academy determine final allocation. Candidates may be allocated to IMA, OTA, AFA or NA depending on merit, service preference and vacancies." },
  { stage: "Joining instruction", detail: "Selected candidates receive a joining letter with a reporting date. Medical unfit candidates or those not making the merit cutoff are informed by post and may re-apply in subsequent cycles." },
];

const finalDayDos = [
  "Sleep well on the last night — composure is the only thing still in your control",
  "Dress formally and maintain military bearing from the moment you wake",
  "Walk in when called — straight posture, calm face, greet the board clearly",
  "Answer any question briefly and honestly — do not volunteer unrequested information",
  "If you don't know or remember something, say so directly without apology",
  "Leave when dismissed — do not linger or attempt to make a final impression",
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
  .lp-content { padding: 0 48px 80px; max-width: 1600px; }
  .lp-section { padding: 56px 0 0; }
  .lp-section-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #bbb; margin-bottom: 8px; }
  .lp-section-title { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 10px; }
  .lp-section-desc { font-size: 0.875rem; line-height: 1.75; color: #555; max-width: 100%; margin-bottom: 28px; }
  .lp-divider { border: none; border-top: 1px solid #efefef; margin: 56px 0 0; }

  /* PROCESS */
  .lp-process { display: flex; flex-direction: column; border: 1px solid #eee; border-radius: 3px; overflow: hidden; }
  .lp-process-step { display: grid; grid-template-columns: 56px 1fr; border-bottom: 1px solid #eee; }
  .lp-process-step:last-child { border-bottom: none; }
  .lp-process-num { font-size: 11px; font-weight: 800; color: #ddd; padding: 20px 0 18px 20px; }
  .lp-process-body { padding: 18px 20px; }
  .lp-process-title { font-size: 14px; font-weight: 700; margin-bottom: 5px; }
  .lp-process-detail { font-size: 13px; color: #555; line-height: 1.7; }

  /* BOARD QUESTIONS */
  .lp-q-row { display: grid; grid-template-columns: 200px 1fr; gap: 20px; padding: 14px 0; border-bottom: 1px solid #f2f2f2; align-items: start; }
  .lp-q-row:first-child { border-top: 1px solid #f2f2f2; }
  .lp-q-trigger { font-size: 13px; font-weight: 700; color: #111; line-height: 1.4; }
  .lp-q-example { font-size: 12px; color: #555; line-height: 1.65; font-style: italic; }

  /* OUTCOMES */
  .lp-outcomes { display: flex; flex-direction: column; gap: 1px; background: #eee; border: 1px solid #eee; }
  .lp-outcome { background: #fff; display: grid; grid-template-columns: 160px 1fr; gap: 24px; padding: 18px 20px; }
  .lp-outcome-name { font-size: 13px; font-weight: 800; }
  .lp-outcome-detail { font-size: 13px; color: #555; line-height: 1.65; }

  /* MERIT PROCESS */
  .lp-merit { display: flex; flex-direction: column; }
  .lp-merit-row { display: grid; grid-template-columns: 24px 180px 1fr; gap: 12px 20px; padding: 13px 0; border-bottom: 1px solid #f2f2f2; align-items: baseline; }
  .lp-merit-row:last-child { border-bottom: none; }
  .lp-merit-num { font-size: 11px; color: #ccc; font-weight: 700; }
  .lp-merit-stage { font-size: 13px; font-weight: 700; color: #111; }
  .lp-merit-detail { font-size: 13px; color: #555; line-height: 1.6; }

  /* DOS LIST */
  .lp-dos { display: flex; flex-direction: column; }
  .lp-do { display: grid; grid-template-columns: 20px 1fr; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; align-items: baseline; font-size: 13px; color: #222; line-height: 1.6; }
  .lp-do:first-child { border-top: 1px solid #f5f5f5; }
  .lp-do-tick { color: #111; font-weight: 700; }

  .lp-assessor { display: flex; gap: 0; margin-top: 32px; border: 1px solid #e8e8e8; overflow: hidden; border-radius: 3px; }
  .lp-assessor-tag { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); font-size: 9px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; background: #111; color: #fff; padding: 14px 8px; white-space: nowrap; flex-shrink: 0; }
  .lp-assessor-body { padding: 16px 20px; font-size: 13px; line-height: 1.8; color: #333; background: #fafafa; }

  .lp-cta { margin-top: 56px; padding: 36px 0 72px; border-top: 2px solid #111; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .lp-cta-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 5px; }
  .lp-cta-sub { font-size: 13px; color: #666; }
  .lp-cta-btns { display: flex; gap: 10px; flex-shrink: 0; }
  .lp-btn-dark { background: #111; color: #fff; padding: 11px 22px; border: none; font-size: 13px; font-weight: 600; border-radius: 4px; text-decoration: none; display: inline-block; }
  .lp-btn-dark:hover { background: #333; }
  .lp-btn-light { background: #fff; color: #111; padding: 10px 20px; border: 1px solid #ddd; font-size: 13px; font-weight: 600; border-radius: 4px; text-decoration: none; display: inline-block; }
  .lp-btn-light:hover { border-color: #111; }

  @media (max-width: 900px) {
    .lp-hero { padding: 64px 24px 40px; } .lp-nav { padding: 12px 24px; } .lp-content { padding: 0 24px 64px; }
    .lp-outcome { grid-template-columns: 1fr; gap: 6px; }
    .lp-q-row { grid-template-columns: 1fr; gap: 4px; }
    .lp-merit-row { grid-template-columns: 24px 1fr; }
    .lp-merit-detail { grid-column: 2; }
  }
  @media (max-width: 520px) {
    .lp-hero { padding: 56px 16px 32px; } .lp-nav { padding: 10px 16px; } .lp-content { padding: 0 16px 56px; }
    .lp-stats { flex-wrap: wrap; } .lp-stat { flex: 1 1 45%; border-bottom: 1px solid #eee; }
    .lp-cta { flex-direction: column; align-items: flex-start; } .lp-cta-btns { flex-direction: column; width: 100%; }
    .lp-btn-dark, .lp-btn-light { text-align: center; width: 100%; }
  }
`;

export default function SSBConferencePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="lp">
      <style>{css}</style>
      <NavbarSection />
      <header className="lp-hero">
        <div className="lp-hero-label">SSB Assessment · Final Stage</div>
        <h1>Conference — Complete Guide</h1>
        <p className="lp-hero-desc">
          The Conference is the final morning of a five-day process — not a standalone test.
          Three assessors who have never shared notes compare their independent observations
          for the first time. By this point, the work is done. Composure is all that remains.
        </p>
        <div className="lp-stats">
          <div className="lp-stat"><div className="lp-stat-val">Final</div><div className="lp-stat-label">Day 5</div></div>
          <div className="lp-stat"><div className="lp-stat-val">3</div><div className="lp-stat-label">Independent assessors</div></div>
          <div className="lp-stat"><div className="lp-stat-val">2–5 min</div><div className="lp-stat-label">Per candidate</div></div>
          <div className="lp-stat"><div className="lp-stat-val">Same day</div><div className="lp-stat-label">Results announced</div></div>
        </div>
      </header>

      <nav className="lp-nav">
        <Link to="/ssb-preparation">← Overview</Link>
        <Link to="/ssb-lecturette">Lecturette</Link>
        <Link to="/ssb-interview">Interview</Link>
        <Link to="/ssb-group-discussion">Group Discussion</Link>
        <Link to="/ssb-gto">GTO Tasks</Link>
        <Link to="/ssb-conference" className="active">Conference</Link>
      </nav>

      <div className="lp-content">

        <section className="lp-section" id="process">
          <div className="lp-section-label">Section 01</div>
          <h2 className="lp-section-title">How the Conference works — step by step</h2>
          <p className="lp-section-desc">Understanding the Conference removes the anxiety most candidates feel about it. It is not a new test — it is a reconciliation of five days of independent observation.</p>
          <div className="lp-process">
            {conferenceProcess.map((s, i) => (
              <div key={i} className="lp-process-step">
                <div className="lp-process-num">{s.step}</div>
                <div className="lp-process-body">
                  <div className="lp-process-title">{s.title}</div>
                  <div className="lp-process-detail">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-assessor">
            <div className="lp-assessor-tag">Assessor note</div>
            <div className="lp-assessor-body">
              A single spectacular act on one task cannot override mediocre performance across the rest. Equally, a single bad day cannot disqualify a candidate who was consistently sound throughout. The Conference is a cumulative, five-day judgement — not a snapshot.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="questions">
          <div className="lp-section-label">Section 02</div>
          <h2 className="lp-section-title">What the board might ask — and why</h2>
          <p className="lp-section-desc">Questions in the Conference are not random. They arise from specific triggers identified during the five days. Here are the most common triggers and what they sound like.</p>
          {whatBoardAsks.map((q, i) => (
            <div key={i} className="lp-q-row">
              <div className="lp-q-trigger">{q.trigger}</div>
              <div className="lp-q-example">"{q.example}"</div>
            </div>
          ))}
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="outcomes">
          <div className="lp-section-label">Section 03</div>
          <h2 className="lp-section-title">Possible outcomes — what happens next</h2>
          <p className="lp-section-desc">There are three outcomes. Each is announced by chest number on the same day.</p>
          <div className="lp-outcomes">
            {outcomes.map((o, i) => (
              <div key={i} className="lp-outcome">
                <div className="lp-outcome-name">{o.outcome}</div>
                <div className="lp-outcome-detail">{o.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="merit">
          <div className="lp-section-label">Section 04</div>
          <h2 className="lp-section-title">After recommendation — the merit process</h2>
          <p className="lp-section-desc">Being recommended is not the final step. The path from recommendation to joining a training academy involves several more stages.</p>
          <div className="lp-merit">
            {meritProcess.map((m, i) => (
              <div key={i} className="lp-merit-row">
                <span className="lp-merit-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lp-merit-stage">{m.stage}</span>
                <span className="lp-merit-detail">{m.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="finalday">
          <div className="lp-section-label">Section 05</div>
          <h2 className="lp-section-title">The final day — what to do</h2>
          <p className="lp-section-desc">There is no preparation for the Conference itself. But there are six things a candidate should do on the final morning.</p>
          <div className="lp-dos">
            {finalDayDos.map((d, i) => (
              <div key={i} className="lp-do">
                <span className="lp-do-tick">✓</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
          <div className="lp-assessor">
            <div className="lp-assessor-tag">Final note</div>
            <div className="lp-assessor-body">
              There is no preparation for the Conference itself. The board has five days of independent observation — it has already formed its view. The brief candidate interaction is a final check, not a reversal opportunity. Walk in composed, answer briefly and honestly if questioned, and trust that five days of genuine effort will speak for itself. Whatever the outcome — the experience of having gone through the full SSB process honestly is itself the preparation for the next attempt, if there is one.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        <div className="lp-cta">
          <div>
            <div className="lp-cta-title">Complete preparation guide</div>
            <p className="lp-cta-sub">You have covered all five stages. Review any section or start practising.</p>
          </div>
          <div className="lp-cta-btns">
            <Link to="/register" className="lp-btn-dark">Start Practising →</Link>
            <Link to="/ssb-preparation" className="lp-btn-light">Back to Overview</Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}