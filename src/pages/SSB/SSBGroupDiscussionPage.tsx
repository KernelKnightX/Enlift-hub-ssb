import { useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

const gdProcess = [
  { step: "01", title: "Two rounds are held", detail: "Round 1 is typically a concrete topic — social, political or current affairs. Round 2 is usually abstract — a concept, metaphor or hypothetical. The same group sits together for both." },
  { step: "02", title: "No moderator", detail: "There is no teacher, no chairman, no one to manage the discussion. The group of 8–12 candidates runs it entirely. This is deliberate — the GTO watches how the group self-organises." },
  { step: "03", title: "20 minutes per round", detail: "The GTO times each discussion. Candidates are not told when 10 minutes are up. Managing the group's time and not letting it derail is itself assessed." },
  { step: "04", title: "No consensus required", detail: "Unlike PPDT, there is no requirement to reach a common conclusion. Candidates can disagree till the end. The GTO is watching the quality of thinking and interaction — not the outcome." },
];

const whatGTOWatches = [
  { quality: "Contribution quality", detail: "Are your points substantive, analytical and specific? Generic statements ('social media has pros and cons') score far less than those anchored in facts or mechanism." },
  { quality: "Listening behaviour", detail: "Do you genuinely hear what others say — and build on it? Or do you just wait for a gap to speak? GTOs watch eye contact when others speak, not just when you do." },
  { quality: "Group influence", detail: "Can you change the group's direction without dominating? Candidates who bring a drifting discussion back on track or introduce a new angle score significantly." },
  { quality: "Initiation", detail: "Initiating with a strong, structured opening sets a positive tone. But initiating with an empty statement to be first is worse than waiting for a better moment." },
  { quality: "Handling disagreement", detail: "Do you accept a contrary view with grace, or do you dig in? Officers work with people who disagree with them. Mature disagreement — 'I see your point, however...' — is a positive signal." },
  { quality: "Summarising", detail: "Candidates who can summarise where a GD has reached — especially when it is getting circular — demonstrate leadership and analytical clarity without requiring air time." },
];

const gdTopics = [
  {
    cat: "Current Affairs & Defence",
    note: "Know both sides — assessors test whether you can present nuance, not just a position.",
    topics: [
      { topic: "Agniveer scheme — has it strengthened or weakened the armed forces?", angle: "Tour of duty model pros/cons, youth employability, veteran welfare concerns, long-term force structure impact." },
      { topic: "Women in combat roles — readiness and implications", angle: "Current status (fighter pilots, CDS ruling), physical standards debate, operational effectiveness vs inclusion arguments." },
      { topic: "India's defence modernisation — is it fast enough?", angle: "Tejas, BrahMos, HAL delays, import dependence, DRDO track record, private sector entry — specific examples over generalities." },
      { topic: "Cybersecurity as the fifth domain of warfare", angle: "Critical infrastructure vulnerability, Chinese incursions, data sovereignty, CERT-In role, international cyber norms." },
    ]
  },
  {
    cat: "Social Issues",
    note: "These test composure and fairness — not your personal view.",
    topics: [
      { topic: "Reservation: still relevant or overdue for reform?", angle: "Deliberate controversy test. Present creational intent, data on social mobility, economic criteria argument — all with equal clarity." },
      { topic: "Is social media doing more harm than good to Indian democracy?", angle: "Attention economy, WhatsApp misinformation, political mobilisation, censorship risk — mechanisms over symptoms." },
      { topic: "Unemployment: structural failure or individual accountability?", angle: "Skill gap, education mismatch, manufacturing growth needed, gig economy reality — avoid purely blaming government or youth." },
      { topic: "Corruption — systemic problem or individual moral failure?", angle: "Incentive structures, transparency mechanisms, Jan Lokpal, RTI impact — analytical frame beats moral condemnation." },
    ]
  },
  {
    cat: "Abstract & Leadership",
    note: "Abstract topics reward original thinking. Anchor your points with specific real-world examples — do not stay philosophical.",
    topics: [
      { topic: "Discipline vs freedom: where is the line?", angle: "Anchor in specific contexts: military discipline, academic freedom, democratic rights, parenting. Avoid pure philosophy." },
      { topic: "Leadership: born or made?", angle: "Psychological research supports both. Cite developed military leaders alongside natural ones. The answer is 'both' — argue it well." },
      { topic: "Individual excellence vs team performance", angle: "Armed forces angle natural: collective mission over individual glory. Sports and organisational examples both work." },
      { topic: "Is rapid development worth the environmental cost?", angle: "India's development imperative vs climate commitments. Solar push, coal dependency, Paris Agreement — specific policy anchors." },
    ]
  },
];

const mistakes = [
  { mistake: "Initiating with an empty statement just to speak first", fix: "Only initiate if you have a strong, structured opening. A well-timed entry 30 seconds in beats a weak opener." },
  { mistake: "Speaking the most to appear engaged", fix: "Quality over quantity. The GTO counts meaningful contributions — not words. Three strong points outperform ten weak ones." },
  { mistake: "Ignoring what others say and pushing your own points", fix: "The GTO is watching your listening behaviour as carefully as your speaking. Reference other candidates by name: 'As Ravi pointed out...'" },
  { mistake: "Using aggressive language when disagreeing", fix: "Use 'I see your perspective, however...' or 'That's a valid concern, but consider...' Maturity under disagreement is an explicit OLQ." },
  { mistake: "Going off-topic to display knowledge", fix: "Every contribution should serve the discussion. Tangential knowledge displays signal poor focus — even when the content is good." },
  { mistake: "Staying silent for long stretches then bursting in", fix: "Contribute in small, consistent doses throughout. Entering late with a grand statement reads as calculation — not leadership." },
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
  .lp-process { display: flex; flex-direction: column; border: 1px solid #eee; border-radius: 3px; overflow: hidden; }
  .lp-process-step { display: grid; grid-template-columns: 56px 1fr; border-bottom: 1px solid #eee; }
  .lp-process-step:last-child { border-bottom: none; }
  .lp-process-num { font-size: 11px; font-weight: 800; color: #ddd; padding: 20px 0 18px 20px; }
  .lp-process-body { padding: 18px 20px; }
  .lp-process-title { font-size: 14px; font-weight: 700; margin-bottom: 5px; }
  .lp-process-detail { font-size: 13px; color: #555; line-height: 1.7; }
  .lp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #eee; border: 1px solid #eee; }
  .lp-grid2-item { background: #fff; padding: 18px 20px; }
  .lp-grid2-title { font-size: 13px; font-weight: 700; margin-bottom: 5px; }
  .lp-grid2-body { font-size: 13px; color: #555; line-height: 1.65; }
  .lp-cat-group { margin-bottom: 36px; }
  .lp-cat-hdr { display: flex; align-items: baseline; gap: 14px; padding-bottom: 8px; border-bottom: 2px solid #111; margin-bottom: 8px; }
  .lp-cat-title { font-size: 14px; font-weight: 800; }
  .lp-cat-note { font-size: 12px; color: #888; }
  .lp-topic-row { display: grid; grid-template-columns: 260px 1fr; gap: 20px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; align-items: baseline; }
  .lp-topic-row:last-child { border-bottom: none; }
  .lp-topic-name { font-size: 13px; font-weight: 600; color: #111; line-height: 1.4; }
  .lp-topic-angle { font-size: 12px; color: #555; line-height: 1.65; }
  .lp-mistake { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 14px 0; border-bottom: 1px solid #f2f2f2; }
  .lp-mistake:first-child { border-top: 1px solid #f2f2f2; }
  .lp-mistake-bad { font-size: 13px; color: #111; line-height: 1.6; }
  .lp-mistake-bad::before { content: '✗  '; color: #c00; font-weight: 700; }
  .lp-mistake-fix { font-size: 13px; color: #333; line-height: 1.6; }
  .lp-mistake-fix::before { content: '→  '; color: #555; font-weight: 700; }
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
    .lp-grid2 { grid-template-columns: 1fr; } .lp-mistake { grid-template-columns: 1fr; gap: 8px; }
    .lp-topic-row { grid-template-columns: 1fr; gap: 4px; }
  }
  @media (max-width: 520px) {
    .lp-hero { padding: 56px 16px 32px; } .lp-nav { padding: 10px 16px; } .lp-content { padding: 0 16px 56px; }
    .lp-stats { flex-wrap: wrap; } .lp-stat { flex: 1 1 45%; border-bottom: 1px solid #eee; }
    .lp-cta { flex-direction: column; align-items: flex-start; } .lp-cta-btns { flex-direction: column; width: 100%; }
    .lp-btn-dark, .lp-btn-light { text-align: center; width: 100%; }
  }
`;

export default function SSBGroupDiscussionPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="lp">
      <style>{css}</style>
      <NavbarSection />
      <header className="lp-hero">
        <div className="lp-hero-label">GTO Tasks · Group Discussion</div>
        <h1>Group Discussion — Complete Guide</h1>
        <p className="lp-hero-desc">
          The GD is the first GTO task — and the one where most candidates misunderstand what is being
          assessed. It is not a debate to be won. It is a collective exercise where the GTO watches
          how you think, how you listen, and how you influence — not how much you speak.
        </p>
        <div className="lp-stats">
          <div className="lp-stat"><div className="lp-stat-val">2</div><div className="lp-stat-label">Rounds</div></div>
          <div className="lp-stat"><div className="lp-stat-val">20 min</div><div className="lp-stat-label">Per round</div></div>
          <div className="lp-stat"><div className="lp-stat-val">8–12</div><div className="lp-stat-label">Candidates per group</div></div>
          <div className="lp-stat"><div className="lp-stat-val">No</div><div className="lp-stat-label">Moderator</div></div>
        </div>
      </header>

      <nav className="lp-nav">
        <Link to="/ssb-preparation">← Overview</Link>
        <Link to="/ssb-lecturette">Lecturette</Link>
        <Link to="/ssb-interview">Interview</Link>
        <Link to="/ssb-group-discussion" className="active">Group Discussion</Link>
        <Link to="/ssb-gto">GTO Tasks</Link>
        <Link to="/ssb-conference">Conference</Link>
      </nav>

      <div className="lp-content">
        <section className="lp-section" id="process">
          <div className="lp-section-label">Section 01</div>
          <h2 className="lp-section-title">How the GD works</h2>
          <p className="lp-section-desc">Four things every candidate should understand about the GD format before walking into it.</p>
          <div className="lp-process">
            {gdProcess.map((s, i) => (
              <div key={i} className="lp-process-step">
                <div className="lp-process-num">{s.step}</div>
                <div className="lp-process-body">
                  <div className="lp-process-title">{s.title}</div>
                  <div className="lp-process-detail">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="assessment">
          <div className="lp-section-label">Section 02</div>
          <h2 className="lp-section-title">What the GTO is actually watching</h2>
          <p className="lp-section-desc">Six dimensions scored in the GD — in roughly this order of weight.</p>
          <div className="lp-grid2">
            {whatGTOWatches.map((w, i) => (
              <div key={i} className="lp-grid2-item">
                <div className="lp-grid2-title">{w.quality}</div>
                <div className="lp-grid2-body">{w.detail}</div>
              </div>
            ))}
          </div>
          <div className="lp-assessor">
            <div className="lp-assessor-tag">Assessor note</div>
            <div className="lp-assessor-body">
              The candidate who brings clarity to a confused discussion scores more than the one who speaks most often. If the GD is going in circles, summarising where it has reached and proposing a new angle is worth more than three additional points on the original topic. Officers redirect — they do not just add to noise.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="topics">
          <div className="lp-section-label">Section 03</div>
          <h2 className="lp-section-title">Practice topics by category</h2>
          <p className="lp-section-desc">Topics are chosen to generate disagreement. The right column shows the analytical angle that separates a substantive contribution from a generic one.</p>
          {gdTopics.map((cat, i) => (
            <div key={i} className="lp-cat-group">
              <div className="lp-cat-hdr">
                <span className="lp-cat-title">{cat.cat}</span>
                <span className="lp-cat-note">{cat.note}</span>
              </div>
              {cat.topics.map((t, j) => (
                <div key={j} className="lp-topic-row">
                  <div className="lp-topic-name">{t.topic}</div>
                  <div className="lp-topic-angle">{t.angle}</div>
                </div>
              ))}
            </div>
          ))}
        </section>

        <hr className="lp-divider" />

        <section className="lp-section" id="mistakes">
          <div className="lp-section-label">Section 04</div>
          <h2 className="lp-section-title">Common mistakes — and how to fix them</h2>
          <p className="lp-section-desc">These patterns appear consistently across GD failures.</p>
          {mistakes.map((m, i) => (
            <div key={i} className="lp-mistake">
              <div className="lp-mistake-bad">{m.mistake}</div>
              <div className="lp-mistake-fix">{m.fix}</div>
            </div>
          ))}
        </section>

        <hr className="lp-divider" />

        <div className="lp-cta">
          <div>
            <div className="lp-cta-title">Continue your preparation</div>
            <p className="lp-cta-sub">Move to GTO Tasks or return to the overview.</p>
          </div>
          <div className="lp-cta-btns">
            <Link to="/ssb-gto" className="lp-btn-dark">Next: GTO Tasks →</Link>
            <Link to="/ssb-preparation" className="lp-btn-light">Back to Overview</Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}