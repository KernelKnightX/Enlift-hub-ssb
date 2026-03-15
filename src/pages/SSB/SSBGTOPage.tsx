import { useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

const gtoRules = [
  { rule: "Colour Rule", detail: "Areas marked in red or a specific colour cannot be touched or stepped on. Violating this disqualifies the attempt for that obstacle." },
  { rule: "Distance Rule", detail: "Candidates cannot jump or step across gaps beyond the prescribed distance. Props must be used to bridge the gap." },
  { rule: "Group Rule", detail: "The load (usually a wooden block or equipment) must travel with the group at all times — it cannot be left behind or thrown." },
  { rule: "No touching the GTO ground", detail: "Between two marked points, the ground itself is out of bounds. Only props, other candidates' bodies, and permitted surfaces can be used." },
];

const tasks = [
  {
    name: "Group Discussion (GD)",
    type: "Indoor",
    duration: "20 min × 2 rounds",
    assessed: "Communication · Reasoning · Group influence · Listening",
    detail: "Two rounds — one concrete, one abstract. No moderator. The GTO scores contribution quality, reasoning, listening behaviour and whether you influence the group's direction without dominating. Speak early, build on others' points, summarise when the discussion drifts.",
    tip: "The candidate who brings clarity to a confused GD scores more than the one who speaks most. Three strong contributions outperform ten weak ones."
  },
  {
    name: "Group Planning Exercise (GPE)",
    type: "Indoor",
    duration: "~45 min",
    assessed: "Planning intelligence · Prioritisation · Collaborative decision-making",
    detail: "A military-style scenario is presented on a map or model — simultaneous problems, limited resources, competing priorities. Candidates write individual plans, then discuss as a group and present one collective solution. The GTO watches whether you listen to the group or push your plan regardless of merit.",
    tip: "If another candidate's plan is objectively better than yours, support it openly. The GTO is not scoring whose plan wins — they are scoring how well you collaborate."
  },
  {
    name: "Progressive Group Task (PGT)",
    type: "Outdoor",
    duration: "~45 min",
    assessed: "Initiative · Physical contribution · Idea quality · Team support",
    detail: "The group crosses a series of obstacles using props — planks, ropes, barrels, poles — under strict colour and distance rules. Tasks increase in difficulty. The GTO watches who generates viable ideas, who acts when others lead, who retreats when their suggestion is rejected, and who helps struggling teammates.",
    tip: "Don't repeat an idea that was already tried and failed. Generate alternatives, support what is working, and keep the group physically moving. Visible effort counts even when ideas don't succeed."
  },
  {
    name: "Half Group Task (HGT)",
    type: "Outdoor",
    duration: "~25 min",
    assessed: "Individual contribution with nowhere to hide",
    detail: "The group is split into two halves of 4–6. Each half attempts the same obstacle simultaneously but separately. With fewer candidates, every person's contribution — and absence of contribution — is immediately visible. Candidates who blended into the background in PGT are now fully exposed.",
    tip: "This is the GTO's best opportunity to see quieter candidates clearly. If you have been passive so far, this is your most important window. Contribute consistently — not dramatically."
  },
  {
    name: "Lecturette",
    type: "Indoor",
    duration: "3 min per candidate",
    assessed: "Knowledge depth · Structure · Communication poise",
    detail: "Each candidate privately selects one topic from a card of four and speaks to the group for exactly three minutes. One minute is given to collect thoughts — no writing. Pick the topic you actually know most about. The GTO scores genuine knowledge and structured delivery — not performance.",
    tip: "You need 5 minutes of material to deliver 3 comfortably. If you cannot speak for 5 minutes on a topic in practice, don't pick it on the day."
  },
  {
    name: "Command Task",
    type: "Outdoor",
    duration: "~10 min per candidate",
    assessed: "Leadership clarity · Decisiveness · Command presence",
    detail: "Each candidate is designated Commander and privately briefed on an obstacle task. They choose two subordinates from the group, brief them, and then lead the attempt. The GTO observes briefing quality, decisiveness during execution, and how the commander manages subordinates who offer suggestions.",
    tip: "A commander who incorporates good subordinate suggestions is thoughtful. A commander who defers entirely to subordinates has not led. The distinction is critical — and the GTO knows it well."
  },
  {
    name: "Individual Obstacles",
    type: "Outdoor",
    duration: "~3 min per candidate",
    assessed: "Physical courage · Determination · Strategic awareness",
    detail: "Ten numbered obstacles, each with a different point value (1–10). Candidates attempt them in any order within the time limit. Higher-numbered obstacles carry more points but take more time. Strategic route planning — not sequential completion — is the smarter approach.",
    tip: "Attempt every obstacle even if you fail — attempting and failing scores more than skipping. Show courage and commitment. A fall with determination reads better than a skip."
  },
  {
    name: "Final Group Task (FGT)",
    type: "Outdoor",
    duration: "~30 min",
    assessed: "Consistency · Synthesis of all earlier observations",
    detail: "Structurally similar to the PGT but conducted after all other tasks. The GTO uses this as a final synthesising observation — confirming or revising impressions formed over two days. Candidates who revert to passive or dominant behaviour at this late stage are noted.",
    tip: "The FGT is a final data point, not a reversal opportunity. Do not suddenly change your style. Behave consistently with how you've behaved across two days — that consistency is itself an OLQ."
  },
];

const olqsObserved = [
  { olq: "Initiative", how: "Who starts? Who generates the first viable idea in PGT? Who steps forward in Command Task without being asked?" },
  { olq: "Leadership", how: "Who structures the GPE discussion? Who gives a clear brief in Command Task? Who coordinates the group without being aggressive?" },
  { olq: "Cooperation", how: "Who helps a struggling teammate in PGT? Who supports another candidate's idea even when they had a different one?" },
  { olq: "Effective Intelligence", how: "Who spots the practical solution fastest in GPE? Who identifies a smarter route in Individual Obstacles?" },
  { olq: "Physical Fitness", how: "Who brings energy and stamina across two days of outdoor tasks? Fitness is visibly observed throughout the GTO series." },
  { olq: "Emotional Stability", how: "Who stays composed when their idea fails? Who recovers quickly after a fall on Individual Obstacles?" },
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

  /* RULES */
  .lp-rules { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #eee; border: 1px solid #eee; margin-bottom: 0; }
  .lp-rule { background: #fff; padding: 16px 20px; }
  .lp-rule-name { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .lp-rule-detail { font-size: 13px; color: #555; line-height: 1.65; }

  /* TASK LIST */
  .lp-task { padding: 24px 0; border-bottom: 1px solid #eee; }
  .lp-task:last-child { border-bottom: none; }
  .lp-task-header { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 10px; }
  .lp-task-name { font-size: 1rem; font-weight: 800; letter-spacing: -0.01em; }
  .lp-task-type { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #aaa; background: #f2f2f2; padding: 2px 8px; border-radius: 20px; }
  .lp-task-dur { font-size: 12px; color: #aaa; }
  .lp-task-assessed { font-size: 11px; color: #bbb; margin-left: auto; }
  .lp-task-detail { font-size: 13px; line-height: 1.8; color: #333; margin-bottom: 10px; }
  .lp-task-tip { font-size: 12px; line-height: 1.7; color: #333; background: #f7f7f7; border-left: 3px solid #111; padding: 9px 14px; }

  /* OLQ TABLE */
  .lp-table { width: 100%; border-collapse: collapse; }
  .lp-table thead tr { border-bottom: 2px solid #111; }
  .lp-table th { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #888; padding: 0 16px 10px 0; text-align: left; }
  .lp-table tbody tr { border-bottom: 1px solid #f2f2f2; }
  .lp-table tbody tr:last-child { border-bottom: none; }
  .lp-table td { padding: 12px 16px 12px 0; vertical-align: top; font-size: 13px; line-height: 1.6; color: #333; }
  .lp-table td:first-child { font-weight: 700; color: #111; width: 180px; }

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
    .lp-rules { grid-template-columns: 1fr; } .lp-task-assessed { margin-left: 0; width: 100%; }
  }
  @media (max-width: 520px) {
    .lp-hero { padding: 56px 16px 32px; } .lp-nav { padding: 10px 16px; } .lp-content { padding: 0 16px 56px; }
    .lp-stats { flex-wrap: wrap; } .lp-stat { flex: 1 1 45%; border-bottom: 1px solid #eee; }
    .lp-cta { flex-direction: column; align-items: flex-start; } .lp-cta-btns { flex-direction: column; width: 100%; }
    .lp-btn-dark, .lp-btn-light { text-align: center; width: 100%; }
  }
`;

export default function SSBGTOPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="lp">
      <style>{css}</style>
      <NavbarSection />
      <header className="lp-hero">
        <div className="lp-hero-label">SSB Assessment · Stage II</div>
        <h1>GTO Tasks — Complete Guide</h1>
        <p className="lp-hero-desc">
          The GTO series runs across Days 3 and 4 — eight tasks that together give the Group Testing Officer
          the most comprehensive behavioural observation in the entire SSB. These tasks are not about physical
          prowess or task completion. They are about how you think, lead, cooperate, and recover under pressure.
        </p>
        <div className="lp-stats">
          <div className="lp-stat"><div className="lp-stat-val">8</div><div className="lp-stat-label">Tasks total</div></div>
          <div className="lp-stat"><div className="lp-stat-val">2 days</div><div className="lp-stat-label">Days 3 & 4</div></div>
          <div className="lp-stat"><div className="lp-stat-val">8–12</div><div className="lp-stat-label">Candidates per group</div></div>
          <div className="lp-stat"><div className="lp-stat-val">15</div><div className="lp-stat-label">OLQs being observed</div></div>
        </div>
      </header>

      <nav className="lp-nav">
        <Link to="/ssb-preparation">← Overview</Link>
        <Link to="/ssb-lecturette">Lecturette</Link>
        <Link to="/ssb-interview">Interview</Link>
        <Link to="/ssb-group-discussion">Group Discussion</Link>
        <Link to="/ssb-gto" className="active">GTO Tasks</Link>
        <Link to="/ssb-conference">Conference</Link>
      </nav>

      <div className="lp-content">

        <section className="lp-section" id="rules">
          <div className="lp-section-label">Section 01</div>
          <h2 className="lp-section-title">GTO ground rules — know before Day 3</h2>
          <p className="lp-section-desc">Breaking a ground rule during an outdoor task is an immediate failure for that attempt. Understand these before the GTO explains them.</p>
          <div className="lp-rules">
            {gtoRules.map((r, i) => (
              <div key={i} className="lp-rule">
                <div className="lp-rule-name">{r.rule}</div>
                <div className="lp-rule-detail">{r.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="tasks">
          <div className="lp-section-label">Section 02</div>
          <h2 className="lp-section-title">All 8 tasks — what is assessed in each</h2>
          <p className="lp-section-desc">What the GTO watches in each task is different from what the task appears to be about on the surface. That distinction is the most important GTO preparation.</p>
          {tasks.map((t, i) => (
            <div key={i} className="lp-task">
              <div className="lp-task-header">
                <span className="lp-task-name">{t.name}</span>
                <span className="lp-task-type">{t.type}</span>
                <span className="lp-task-dur">{t.duration}</span>
                <span className="lp-task-assessed">{t.assessed}</span>
              </div>
              <p className="lp-task-detail">{t.detail}</p>
              <div className="lp-task-tip">{t.tip}</div>
            </div>
          ))}
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="olqs">
          <div className="lp-section-label">Section 03</div>
          <h2 className="lp-section-title">Which OLQs are observed — and how</h2>
          <p className="lp-section-desc">Six of the 15 OLQs are most directly observable during GTO tasks. This is what the assessor is noting against each.</p>
          <table className="lp-table">
            <thead><tr><th>OLQ</th><th>How it shows up in GTO tasks</th></tr></thead>
            <tbody>
              {olqsObserved.map((r, i) => (
                <tr key={i}><td>{r.olq}</td><td>{r.how}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="lp-assessor">
            <div className="lp-assessor-tag">Assessor note</div>
            <div className="lp-assessor-body">
              Task success is not what is being scored. The GTO has watched thousands of candidates fail every obstacle on the PGT and get recommended — because their behaviour throughout demonstrated initiative, cooperation and composure. Equally, candidates who complete every obstacle while ignoring their team often fail. The process is the assessment. The obstacle is just the medium.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        <div className="lp-cta">
          <div>
            <div className="lp-cta-title">Continue your preparation</div>
            <p className="lp-cta-sub">Move to the Conference or return to the overview.</p>
          </div>
          <div className="lp-cta-btns">
            <Link to="/ssb-conference" className="lp-btn-dark">Next: Conference →</Link>
            <Link to="/ssb-preparation" className="lp-btn-light">Back to Overview</Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}