import { useNavigate } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

const olqs = [
  {
    factor: "Planning & Organising",
    qualities: [
      { name: "Effective Intelligence", desc: "Applying practical judgment to solve real-world, dynamic problems under operational pressure." },
      { name: "Reasoning Ability", desc: "Analysing complex situations logically, identifying patterns and drawing sound, timely conclusions." },
      { name: "Organising Ability", desc: "Planning, coordinating and executing tasks efficiently — managing resources and delegating with clarity." },
      { name: "Power of Expression", desc: "Conveying thoughts and decisions confidently — in discussions, briefings and under direct questioning." },
    ]
  },
  {
    factor: "Social Adjustment",
    qualities: [
      { name: "Social Adaptability", desc: "Adjusting seamlessly to different environments, cultures and people, especially in high-stress conditions." },
      { name: "Cooperation", desc: "Working within a team without ego — contributing, supporting and elevating those around you." },
      { name: "Sense of Responsibility", desc: "Owning tasks and outcomes fully — not deflecting blame when things go wrong, including in group failures." },
      { name: "Initiative", desc: "Acting without being told when a situation calls for it; pre-empting problems before they escalate." },
    ]
  },
  {
    factor: "Social Effectiveness",
    qualities: [
      { name: "Self Confidence", desc: "Believing in one's own judgement and projecting composure — without arrogance or aggressiveness." },
      { name: "Speed of Decision", desc: "Making clear, considered decisions under time pressure rather than freezing or deferring constantly." },
      { name: "Ability to Influence the Group", desc: "Shaping team behaviour and direction through reasoning and calm conviction, not volume or dominance." },
      { name: "Liveliness", desc: "Maintaining energy, enthusiasm and a positive disposition even under sustained fatigue or frustration." },
    ]
  },
  {
    factor: "Dynamism",
    qualities: [
      { name: "Determination", desc: "Persisting towards an objective despite setbacks — demonstrating resilience without rigidity." },
      { name: "Courage", desc: "Physical and moral bravery — including the willingness to dissent, take risks and own unpopular calls." },
      { name: "Stamina", desc: "Sustaining physical and mental performance through a demanding five-day schedule without obvious deterioration." },
    ]
  }
];

const days = [
  {
    day: "Day 1", title: "Screening",
    tests: ["Officer Intelligence Rating (OIR)", "Picture Perception & Discussion Test (PPDT)"],
    detail: `The SSB begins with a two-part screen. The OIR — a verbal and non-verbal intelligence test — gauges baseline reasoning speed and clarity. The PPDT follows: candidates are shown a hazy image for about 30 seconds, write a story around it in four minutes, then join a leaderless group discussion to arrive at a common narrative.\n\nAssessors watch for coherent thinking, confident participation and the ability to both contribute and listen. Screened-out candidates are sent home on Day 1. Those who pass proceed to Stage II.`
  },
  {
    day: "Day 2", title: "Psychological Tests",
    tests: ["TAT — Thematic Apperception Test", "WAT — Word Association Test", "SRT — Situation Reaction Test", "Self-Description (SD)"],
    detail: `The psychology battery is time-bound and fast. In TAT, candidates write twelve short stories to ambiguous pictures — assessors look for themes of responsibility, practical action and optimism, not fantasy. In WAT, sixty words appear one by one and candidates write the first meaningful sentence that comes to mind. The SRT presents sixty everyday situations requiring a short, instinctive written response.\n\nFinally, the Self-Description asks candidates to write how their parents, teachers, friends and they themselves would describe their character. Inconsistency between these five voices is a red flag. The psychologist compares all four tests to form a coherent personality picture.`
  },
  {
    day: "Days 3 & 4", title: "Group Testing Officer (GTO) Tasks",
    tests: ["Group Discussion (GD)", "Group Planning Exercise (GPE)", "Progressive Group Task (PGT)", "Half Group Task (HGT)", "Lecturette", "Command Task", "Individual Obstacles", "Final Group Task (FGT)"],
    detail: `The GTO phase is the most physically and socially demanding section. Candidates work outdoors in groups of eight to twelve, crossing obstacles, planning responses to military-style scenarios and leading each other through tasks with props like planks, ropes and oil drums.\n\nIn the Lecturette, each candidate speaks for three minutes on a self-selected topic — it tests thinking on one's feet, structure and poise. In the Command Task, a candidate becomes the leader and selects two peers to complete a task with them: an evaluation of practical leadership instinct.\n\nGTO assessors score not just outcomes but process — who stepped up, who supported silently, who bulldozed, and whether decisions made under pressure were coherent.`
  },
  {
    day: "Day 4 or 5", title: "Personal Interview",
    tests: ["One-to-one with the Interviewing Officer (IO)"],
    detail: `The personal interview is the longest sustained one-on-one evaluation in the process. The IO — a trained officer, not a psychologist — reviews the candidate's PIQ (Personal Information Questionnaire) submitted on Day 1 and uses it as the map for a wide-ranging conversation.\n\nTopics span childhood, family, schooling, hobbies, sports, failures, future plans, current affairs and the candidate's reasons for wanting a commission. The IO is not trying to trick — they are building a consistent picture of the person. Candidates who have embellished their PIQ or given rehearsed answers face immediate inconsistency.\n\nMaturity, self-awareness, clarity and honesty are the four qualities most visibly on display.`
  },
  {
    day: "Final Day", title: "Conference",
    tests: ["Board Conference with all assessors"],
    detail: `On the final morning, the Psychologist, all GTOs and the IO sit together for the Conference. Each assessor has independently scored the candidate on OLQs throughout the process. The Conference reconciles these independent observations.\n\nCandidates are called in briefly — the board may ask a short clarifying question or simply end the meeting in seconds. The recommendation is based on cumulative, consistent evidence. A single spectacular act on one task cannot override mediocre performance across the rest. Equally, a single bad day cannot disqualify a candidate who was consistently sound.`
  }
];

const mistakes = [
  { title: "Using rehearsed answers", body: "Coached templates are visible to trained assessors within minutes. The psychologist, GTO and IO compare notes — inconsistency across tests exposes memorised responses. Prepare your thinking, not your lines." },
  { title: "Writing fantasy TAT stories", body: "Rescue-the-nation stories with impossible heroes signal poor grip on reality. Assessors look for grounded, responsible protagonists who face believable problems and take practical steps. Keep heroes imperfect but action-oriented." },
  { title: "Silence in group tasks", body: "No contribution equals no data. Assessors cannot score what they cannot observe. Contribute early, concisely and relevantly — then build on others. Even a brief, useful remark beats extended silence." },
  { title: "Dominating the group", body: "Shouting, interrupting or dismissing peers is the most common reason candidates with genuine intelligence are not recommended. Influence is earned through reasoning, not volume. Summarise, clarify, support — lead without overriding." },
  { title: "Inconsistency across tests", body: "Projecting confidence in the interview while appearing withdrawn on the GTO ground raises red flags. All three assessors compare observations. Your behaviour must tell the same story across every setting and every day." },
  { title: "Embellishing the PIQ", body: "If you claim a hobby or achievement on the Personal Information Questionnaire that you cannot speak about in detail, the IO will find it in minutes. Write only what you can defend, elaborate and discuss naturally." }
];

const assessors = [
  { role: "Psychologist", observes: "Inner personality and unconscious patterns", detail: "The Psychologist never interacts with candidates directly. They work entirely from the written output of TAT, WAT, SRT and Self-Description. They look for thematic consistency — the same values, orientations and coping styles appearing across all four tests. Contradictions between tests are the primary concern." },
  { role: "Group Testing Officer (GTO)", observes: "Behaviour in group and outdoor tasks", detail: "The GTO watches how candidates actually behave when the stakes are physical and social. They score every individual within the group across eight tasks over two days. They note leadership style, physical commitment, communication under pressure, and crucially — behaviour when the group is failing or disagreeing." },
  { role: "Interviewing Officer (IO)", observes: "The whole person in conversation", detail: "The IO has the candidate's PIQ and the psychologist's early impressions. The interview is conversational but deliberately unpredictable. The IO probes inconsistencies, tests self-awareness, gauges awareness of the world, and evaluates whether the person presented in writing and in group tasks is real." }
];

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sp { min-height: 100vh; background: #fafaf8; color: #1a1a1a; font-family: Georgia, serif; }

  /* BACK */
  .sp-back { padding: 24px 48px 0; }
  .sp-back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #666; letter-spacing: 0.05em; font-family: system-ui, sans-serif; }
  .sp-back-btn:hover { color: #1a1a1a; }

  /* HERO */
  .sp-hero { padding: 56px 48px 0; }
  .sp-eyebrow { display: flex; gap: 8px; margin-bottom: 20px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui, sans-serif; }
  .sp-h1 { font-size: clamp(1.25rem, 2.4vw, 2.5rem); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 28px; }
  .sp-sub { font-size: 1.05rem; line-height: 1.8; color: #444; max-width: 680px; margin-bottom: 48px; font-style: italic; }
  .sp-hero-img-wrap { width: calc(100% + 96px); margin-left: -48px; height: 500px; overflow: hidden; position: relative; background: #ccc; }
  .sp-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .sp-hero-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(transparent, rgba(250,250,248,0.9)); }
  .sp-hero-cap { position: absolute; bottom: 20px; left: 48px; font-size: 12px; color: #666; font-family: system-ui; letter-spacing: 0.04em; }

  /* MAIN WRAP */
  .sp-main { padding: 0 48px; }

  /* INTRO */
  .sp-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-h2 { font-size: 1.75rem; font-weight: 400; margin-bottom: 24px; letter-spacing: -0.01em; }
  .sp-p { font-size: 1rem; line-height: 1.85; color: #333; margin-bottom: 18px; }
  .sp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 40px; background: #e0ddd8; }
  .sp-stat { background: #fafaf8; padding: 20px 14px; }
  .sp-stat-v { font-size: 1.5rem; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 4px; }
  .sp-stat-l { font-size: 11px; color: #888; letter-spacing: 0.04em; font-family: system-ui; }

  /* DAYS */
  .sp-days { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-days-hdr { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 52px; flex-wrap: wrap; gap: 8px; }
  .sp-days-lbl { font-size: 11px; color: #888; letter-spacing: 0.12em; text-transform: uppercase; font-family: system-ui; }
  .sp-day { display: grid; grid-template-columns: 190px 1fr; gap: 60px; padding: 40px 0; border-top: 1px solid #e8e6e1; }
  .sp-day-num { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 8px; }
  .sp-day-title { font-size: 1.2rem; font-weight: 400; margin-bottom: 18px; }
  .sp-tag { font-size: 12px; color: #555; font-family: system-ui; line-height: 1.6; border-left: 2px solid #d0cdc8; padding-left: 10px; margin-bottom: 4px; }
  .sp-para { font-size: 1rem; line-height: 1.85; color: #333; margin-bottom: 14px; }

  /* IMAGES */
  .sp-imgs { padding: 64px 0; border-bottom: 1px solid #e0ddd8; }
  .sp-imgs-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 16px; margin-bottom: 10px; }
  .sp-imgs-caps { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 16px; }
  .sp-img-box { overflow: hidden; background: #ccc; height: 300px; }
  .sp-img-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .sp-img-cap { font-size: 12px; color: #888; font-family: system-ui; }

  /* OLQs */
  .sp-olqs { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-olq-intro { font-size: 1rem; line-height: 1.85; color: #444; max-width: 760px; margin-bottom: 52px; }
  .sp-olq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #e0ddd8; }
  .sp-olq-factor { background: #fafaf8; padding: 36px 36px 28px; }
  .sp-olq-fn { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #999; font-family: system-ui; margin-bottom: 4px; }
  .sp-olq-ft { font-size: 1.05rem; font-weight: 600; margin-bottom: 24px; }
  .sp-olq-item { padding-left: 14px; border-left: 2px solid #1a1a1a; margin-bottom: 18px; }
  .sp-olq-item:last-child { margin-bottom: 0; }
  .sp-olq-name { font-size: 0.9rem; font-weight: 500; margin-bottom: 3px; }
  .sp-olq-desc { font-size: 0.85rem; line-height: 1.6; color: #555; }
  .sp-olq-note { margin-top: 36px; padding: 28px 36px; background: #f0ede8; border-left: 3px solid #1a1a1a; font-size: 0.95rem; line-height: 1.8; color: #333; }

  /* ASSESSORS */
  .sp-assessors { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-a-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0ddd8; }
  .sp-a-item { background: #fafaf8; padding: 32px 28px; }
  .sp-a-role { font-size: 0.95rem; font-weight: 600; margin-bottom: 5px; }
  .sp-a-obs { font-size: 12px; color: #888; font-family: system-ui; margin-bottom: 16px; font-style: italic; }
  .sp-a-detail { font-size: 0.875rem; line-height: 1.75; color: #444; }

  /* MISTAKES */
  .sp-mistakes { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-mis-wrap { display: grid; grid-template-columns: 240px 1fr; gap: 72px; }
  .sp-mis-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; }
  .sp-mis-h { font-size: 1.75rem; font-weight: 400; margin-top: 10px; letter-spacing: -0.01em; line-height: 1.2; }
  .sp-mis-item { display: grid; grid-template-columns: 28px 1fr; gap: 16px; padding: 22px 0; border-top: 1px solid #e8e6e1; }
  .sp-mis-num { font-size: 11px; color: #bbb; font-family: system-ui; padding-top: 3px; }
  .sp-mis-name { font-size: 0.95rem; font-weight: 500; margin-bottom: 6px; }
  .sp-mis-body { font-size: 0.9rem; line-height: 1.8; color: #444; }

  /* PREP */
  .sp-prep { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-prep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
  .sp-prep-fwt { font-size: 1.05rem; font-weight: 500; margin-bottom: 22px; color: #333; }
  .sp-prep-row { display: grid; grid-template-columns: 110px 1fr; gap: 16px; padding: 18px 0; border-top: 1px solid #e8e6e1; }
  .sp-prep-period { font-size: 12px; color: #888; font-family: system-ui; padding-top: 2px; }
  .sp-prep-action { font-size: 0.9rem; line-height: 1.7; color: #444; }

  /* PULLQUOTE */
  .sp-pq { padding: 0 0 64px; }
  .sp-pq-wrap { width: calc(100% + 96px); margin-left: -48px; height: 380px; overflow: hidden; position: relative; background: #c8c5be; }
  .sp-pq-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  .sp-pq-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(15,15,15,0.62), transparent); }
  .sp-pq-text { position: absolute; top: 50%; left: 48px; transform: translateY(-50%); color: #fff; max-width: 500px; font-size: clamp(1rem, 2.2vw, 1.55rem); font-weight: 300; line-height: 1.45; }

  /* CTA */
  .sp-cta { padding: 60px 0 80px; border-top: 1px solid #e0ddd8; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .sp-cta-h { font-size: 1.35rem; font-weight: 400; margin-bottom: 6px; }
  .sp-cta-sub { font-size: 0.9rem; color: #666; }
  .sp-cta-btns { display: flex; gap: 14px; flex-shrink: 0; }
  .sp-btn-dark { padding: 13px 26px; background: #1a1a1a; color: #fff; border: none; cursor: pointer; font-size: 13px; letter-spacing: 0.04em; font-family: system-ui; }
  .sp-btn-out { padding: 13px 26px; background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; cursor: pointer; font-size: 13px; letter-spacing: 0.04em; font-family: system-ui; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .sp-h1 { font-size: clamp(1.2rem, 2vw, 2rem); }
    .sp-intro { grid-template-columns: 1fr; gap: 48px; }
    .sp-prep-grid { grid-template-columns: 1fr; gap: 48px; }
  }

  @media (max-width: 860px) {
    .sp-back { padding: 20px 24px 0; }
    .sp-hero { padding: 40px 24px 0; }
    .sp-main { padding: 0 24px; }
    /* On tablet, allow title to wrap */
    .sp-h1 { white-space: normal; font-size: clamp(1.4rem, 4vw, 2rem); }
    .sp-hero-img-wrap { width: calc(100% + 48px); margin-left: -24px; height: 340px; }
    .sp-hero-cap { left: 24px; font-size: 11px; }
    .sp-pq-wrap { width: calc(100% + 48px); margin-left: -24px; height: 300px; }
    .sp-pq-text { left: 24px; max-width: 320px; }
    .sp-day { grid-template-columns: 1fr; gap: 18px; }
    .sp-olq-grid { grid-template-columns: 1fr; }
    .sp-a-grid { grid-template-columns: 1fr; }
    .sp-mis-wrap { grid-template-columns: 1fr; gap: 32px; }
    .sp-imgs-row { grid-template-columns: 1fr 1fr; }
    .sp-imgs-caps { grid-template-columns: 1fr 1fr; }
    .sp-img-box:first-child { grid-column: 1 / -1; }
    .sp-img-cap:first-child { grid-column: 1 / -1; }
    .sp-days-lbl { display: none; }
  }

  @media (max-width: 580px) {
    .sp-back { padding: 16px 16px 0; }
    .sp-hero { padding: 28px 16px 0; }
    .sp-main { padding: 0 16px; }
    .sp-h1 { white-space: normal; font-size: 1.4rem; line-height: 1.2; }
    .sp-sub { font-size: 0.95rem; }
    .sp-hero-img-wrap { width: calc(100% + 32px); margin-left: -16px; height: 220px; }
    .sp-hero-cap { display: none; }
    .sp-h2 { font-size: 1.3rem; }
    .sp-stats { grid-template-columns: repeat(3, 1fr); }
    .sp-stat-v { font-size: 1.1rem; }
    .sp-imgs-row { grid-template-columns: 1fr; }
    .sp-imgs-caps { grid-template-columns: 1fr; }
    .sp-img-box:first-child, .sp-img-cap:first-child { grid-column: auto; }
    .sp-img-box { height: 200px; }
    .sp-olq-factor { padding: 24px 18px; }
    .sp-olq-note { padding: 20px 18px; }
    .sp-a-item { padding: 24px 18px; }
    .sp-pq-wrap { width: calc(100% + 32px); margin-left: -16px; height: 240px; }
    .sp-pq-text { left: 18px; font-size: 1rem; max-width: 260px; }
    .sp-cta { flex-direction: column; align-items: flex-start; }
    .sp-cta-btns { flex-direction: column; width: 100%; }
    .sp-btn-dark, .sp-btn-out { width: 100%; text-align: center; }
    .sp-prep-row { grid-template-columns: 1fr; gap: 4px; }
    .sp-prep-period { color: #999; }
  }
`;

export default function SSBAboutPage() {
  const navigate = useNavigate();

  return (
    <div className="sp">
      <style>{css}</style>
      <NavbarSection />

      <div className="sp-back">
        <button className="sp-back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>

      {/* HERO */}
      <header className="sp-hero">
        <div className="sp-eyebrow">
          <span>Indian Armed Forces</span>
          <span style={{ color: '#ccc' }}>·</span>
          <span>Officer Selection</span>
        </div>
        <h1 className="sp-h1">
          The Services Selection Board: A Complete Guide to the Five-Day Assessment
        </h1>
        <p className="sp-sub">
          The SSB does not test knowledge. It tests character — observed repeatedly, across five days, by three independent assessors who never compare notes until the final conference.
        </p>
        <div className="sp-hero-img-wrap">
          <img src="public/ssb-crack.png" alt="SSB candidates" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="sp-hero-fade" />
          <div className="sp-hero-cap">SSB candidates during assessment — consistency across five days determines recommendation</div>
        </div>
      </header>

      <main className="sp-main">

        {/* INTRO */}
        <section className="sp-intro">
          <div>
            <h2 className="sp-h2">Why the SSB exists</h2>
            <p className="sp-p">The Services Selection Board was established to solve a problem that written examinations cannot: identifying people who can lead other people under stress. Academic rank and physical fitness are necessary but insufficient qualifications for an officer commission. The SSB tests the third dimension — personality.</p>
            <p className="sp-p">The board is governed by the Defence Institute of Psychological Research (DIPR), which developed the 15 Officer-Like Qualities framework — a structured definition of what a trainable leader looks like. Every test, task and conversation in the five days is calibrated to generate observable evidence of these qualities.</p>
            <p className="sp-p">Three independent assessors — a Psychologist, a Group Testing Officer (GTO) and an Interviewing Officer (IO) — observe candidates in entirely different contexts. They do not share notes. Their separate scores are reconciled only at the final Conference, making the process remarkably resistant to one-off performances, good or bad.</p>
          </div>
          <div>
            <h2 className="sp-h2">Who it selects for</h2>
            <p className="sp-p">SSB results are used for entry into the Indian Army, Navy and Air Force through programmes including NDA, CDS, TES, UES, NCC Special Entry and AFCAT, among others. The same board structure applies regardless of the service branch.</p>
            <p className="sp-p">Selection rates are typically 2–5% of those who appear at a centre. The SSB has no quota to fill and no obligation to recommend anyone. If a batch produces no recommended candidates, it recommends none. The standard is absolute, not relative.</p>
            <p className="sp-p">Multiple attempts are permitted and common. Many recommended candidates appear three or four times. Returning without significant personal growth, however, rarely changes the outcome.</p>
            <div className="sp-stats">
              {[['5 Days', 'Duration'], ['3', 'Independent assessors'], ['15 OLQs', 'Qualities evaluated']].map(([v, l]) => (
                <div className="sp-stat" key={v}>
                  <div className="sp-stat-v">{v}</div>
                  <div className="sp-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FIVE DAYS */}
        <section className="sp-days">
          <div className="sp-days-hdr">
            <h2 className="sp-h2" style={{ margin: 0 }}>The five-day assessment, stage by stage</h2>
            <span className="sp-days-lbl">Stage breakdown</span>
          </div>
          {days.map((d, i) => (
            <article className="sp-day" key={i}>
              <div>
                <div className="sp-day-num">{d.day}</div>
                <div className="sp-day-title">{d.title}</div>
                {d.tests.map((t, j) => <div className="sp-tag" key={j}>{t}</div>)}
              </div>
              <div>
                {d.detail.split('\n\n').map((para, j) => (
                  <p className="sp-para" key={j}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* IMAGES */}
        <section className="sp-imgs">
          <div className="sp-imgs-row">
            <div className="sp-img-box">
              <img src="public/screening.avif" alt="Psychology tests" onError={(e) => { e.target.parentNode.style.background = '#bbb'; e.target.remove(); }} />
            </div>
            <div className="sp-img-box">
              <img src="public/GTO.jpg" alt="GTO tasks" onError={(e) => { e.target.parentNode.style.background = '#aaa'; e.target.remove(); }} />
            </div>
            <div className="sp-img-box">
              <img src="SSBIO.jpg" alt="Personal interview" onError={(e) => { e.target.parentNode.style.background = '#b8b5ae'; e.target.remove(); }} />
            </div>
          </div>
          <div className="sp-imgs-caps">
            <div className="sp-img-cap">Day 2 — TAT, WAT, SRT and Self-Description</div>
            <div className="sp-img-cap">Days 3 & 4 — GTO outdoor tasks</div>
            <div className="sp-img-cap">Day 4/5 — Personal interview with the IO</div>
          </div>
        </section>

        {/* OLQs */}
        <section className="sp-olqs">
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', fontFamily: 'system-ui', marginBottom: '14px' }}>Assessment Framework</div>
          <h2 className="sp-h2">The 15 Officer-Like Qualities</h2>
          <p className="sp-olq-intro">Established by the Defence Institute of Psychological Research, the 15 OLQs are organised into four factors. Every test, task and interview generates evidence for or against each quality. The board does not expect perfection in all 15 — it expects balanced, consistent, authentic expression of most.</p>
          <div className="sp-olq-grid">
            {olqs.map((factor, fi) => (
              <div className="sp-olq-factor" key={fi}>
                <div className="sp-olq-fn">Factor {fi + 1}</div>
                <div className="sp-olq-ft">{factor.factor}</div>
                {factor.qualities.map((q, qi) => (
                  <div className="sp-olq-item" key={qi}>
                    <div className="sp-olq-name">{q.name}</div>
                    <div className="sp-olq-desc">{q.desc}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sp-olq-note">
            <strong>How OLQs are scored:</strong> Each of the three assessors independently rates candidates on the OLQ framework based on what they observe in their domain. At the final Conference these ratings are compared. A candidate who displays strong qualities with one assessor but not the others is not considered consistent.
          </div>
        </section>

        {/* ASSESSORS */}
        <section className="sp-assessors">
          <h2 className="sp-h2" style={{ marginBottom: '44px' }}>The three assessors and how they observe you</h2>
          <div className="sp-a-grid">
            {assessors.map((a, i) => (
              <div className="sp-a-item" key={i}>
                <div className="sp-a-role">{a.role}</div>
                <div className="sp-a-obs">{a.observes}</div>
                <p className="sp-a-detail">{a.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISTAKES */}
        <section className="sp-mistakes">
          <div className="sp-mis-wrap">
            <div>
              <span className="sp-mis-label">Preparation</span>
              <h2 className="sp-mis-h">Six mistakes that eliminate candidates</h2>
            </div>
            <div>
              {mistakes.map((m, i) => (
                <div className="sp-mis-item" key={i}>
                  <div className="sp-mis-num">0{i + 1}</div>
                  <div>
                    <div className="sp-mis-name">{m.title}</div>
                    <p className="sp-mis-body">{m.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREP */}
        <section className="sp-prep">
          <div className="sp-prep-grid">
            <div>
              <h2 className="sp-h2">How to prepare: the honest approach</h2>
              <p className="sp-p">The SSB famously rewards candidates who "are" rather than candidates who "perform." Assessors — trained psychologists and experienced officers — have seen thousands of candidates and can identify prepared responses within minutes. The board has no formula to memorise because the assessment itself is designed to defeat formulas.</p>
              <p className="sp-p">Genuine preparation means building the underlying qualities over months, not rehearsing scripts for weeks. TAT practice is valuable not because you learn which endings work but because you observe your own default thinking patterns — do your protagonists take initiative or wait? Do they accept responsibility or avoid it?</p>
              <p className="sp-p">GTO preparation is most effective when done in real group situations — sports, student unions, volunteer work, community events — where you practice contributing without dominating and leading without ego. These experiences also give the IO something real to discuss.</p>
            </div>
            <div>
              <div className="sp-prep-fwt">A realistic preparation framework</div>
              {[
                ["Months 1–3", "Self-assessment against all 15 OLQs. Identify genuine weak areas. Join group activities that exercise them — not for the SSB, but for growth."],
                ["Months 3–6", "Read widely. Practice writing — TAT stories, WAT responses, SRT answers. Time yourself. Review your default themes honestly."],
                ["Months 6 onward", "Mock interviews on your PIQ. Lecturette practice on diverse topics. Group discussions where someone gives you candid feedback."],
                ["Final month", "No new habits. Rest and consolidation. Re-read your PIQ and know every line. Clarity, not anxiety, is the final preparation."]
              ].map(([period, action], i) => (
                <div className="sp-prep-row" key={i}>
                  <div className="sp-prep-period">{period}</div>
                  <p className="sp-prep-action">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PULLQUOTE */}
        <section className="sp-pq">
          <div className="sp-pq-wrap">
            <img src="Public/FRD.png" alt="GTO obstacle course" onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="sp-pq-overlay" />
            <p className="sp-pq-text">"The SSB rewards consistent, responsible thinking under pressure — not a single spectacular act."</p>
          </div>
        </section>

        {/* CTA */}
        <section className="sp-cta">
          <div>
            <h3 className="sp-cta-h">Ready to go deeper?</h3>
            <p className="sp-cta-sub">Explore the full SSB process in detail, or begin working on your Officer-Like Qualities.</p>
          </div>
          <div className="sp-cta-btns">
            <button className="sp-btn-dark" onClick={() => navigate('/ssb-process')}>Full Process →</button>
            <button className="sp-btn-out" onClick={() => navigate('/ssb-qualities')}>OLQ Deep Dive</button>
          </div>
        </section>

      </main>
      <FooterSection />
    </div>
  );
}
