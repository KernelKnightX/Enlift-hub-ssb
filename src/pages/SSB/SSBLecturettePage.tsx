import { useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

/* ─── DATA ─── */

const process = [
  {
    step: "01",
    title: "Card is handed out",
    detail: "The GTO gives each candidate a small card with four topics printed on it. Topics are a mix — usually one current affairs, one social issue, one abstract concept, one defence-related."
  },
  {
    step: "02",
    title: "3 minutes to prepare",
    detail: "You have exactly 3 minutes to choose one topic and collect your thoughts. No writing is allowed. While Candidate 1 speaks, Candidate 2 is preparing — and so on in sequence."
  },
  {
    step: "03",
    title: "3 minutes to speak",
    detail: "You stand up, face the group, and speak for exactly 3 minutes. The GTO times you. Speaking significantly under or over time both affect your score. Aim for 2 min 45 sec to 3 min."
  },
  {
    step: "04",
    title: "No questions, no interruptions",
    detail: "Unlike a GD, there is no back and forth. This is your solo stage. The group listens. The GTO watches your delivery, structure, eye contact, voice and confidence — not just content."
  },
];

const speechStructure = [
  {
    part: "Hook (15–20 sec)",
    purpose: "Grab attention immediately",
    howTo: "Open with a striking fact, a short quote, a rhetorical question, or a brief scenario. Avoid 'Today I am going to speak about...' — it wastes your strongest seconds.",
    example: "Topic: Climate Change\n\"In 2023, India recorded its hottest February in 122 years. The Himalayan glaciers feeding the Ganga are retreating at 22 metres a year. Climate change is not a future threat — it is an ongoing operational reality for our armed forces.\""
  },
  {
    part: "Definition / Context (20–25 sec)",
    purpose: "Frame the topic clearly",
    howTo: "One or two sentences that establish what you mean by the topic. This shows the assessor your thinking is structured and you are not going to ramble.",
    example: "Topic: Atmanirbhar Bharat in Defence\n\"Atmanirbhar Bharat in defence means reducing India's dependence on foreign weapons systems by developing indigenous capability — in design, manufacturing and maintenance.\""
  },
  {
    part: "Main Body — 2–3 points (90–100 sec)",
    purpose: "Core of the speech",
    howTo: "Make 2 or 3 distinct, connected points. Each one sentence to introduce, one to explain, one example or fact. Do not try to cover everything — depth on two points is better than surface on five.",
    example: "Point structure:\n1. The problem / current situation\n2. What is being done / progress made\n3. What remains / what you believe should happen"
  },
  {
    part: "Conclusion (20–25 sec)",
    purpose: "End with conviction",
    howTo: "Summarise in one sentence. Then close with a forward-looking statement or your personal view. Avoid trailing off — your last sentence should sound like a last sentence.",
    example: "Topic: Role of Youth in Nation Building\n\"Youth cannot build a nation by waiting for opportunity — they must create it. The strongest nations in history were built by young people who acted before they were ready.\""
  },
];

const whatGTOWatches = [
  {
    quality: "Confidence",
    detail: "Do you look and sound like someone who believes what they are saying? Eye contact, posture, and voice steadiness all signal confidence. Nervousness is expected — visible panic is not."
  },
  {
    quality: "Knowledge depth",
    detail: "Do you understand the topic or just know the words? Specific facts, examples, real events and precise language show genuine knowledge. Vague generalisations do not."
  },
  {
    quality: "Structure",
    detail: "Can you organise thoughts under pressure? A speech that has a clear beginning, middle and end — even a simple one — scores better than a rambling speech with good content."
  },
  {
    quality: "Language command",
    detail: "You do not need to be eloquent. You need to be clear. Avoid long pauses, fillers (um, uh, so basically), and repetition. Speak at a pace the group can follow."
  },
  {
    quality: "Time management",
    detail: "Officers work under time pressure. Finishing significantly early or running over both signal poor self-regulation. Practice until you can reliably land at 2:45–3:00."
  },
  {
    quality: "Relevance",
    detail: "Do not go off-topic. Every sentence should serve the speech. Candidates who drift into unrelated territory — even interesting territory — signal poor focus."
  },
];

const commonMistakes = [
  { mistake: "Picking the impressive-sounding topic you don't know", fix: "Always pick the topic you know most about. A strong speech on a simple topic beats a weak speech on a complex one." },
  { mistake: "Starting with 'Today I am going to speak about...'", fix: "Start with your hook directly. The GTO knows what you're going to speak about — they gave you the card." },
  { mistake: "Memorising a speech and freezing mid-way", fix: "Prepare a skeleton — hook, 2 points, conclusion — not word-for-word. If you lose the script, a skeleton keeps you moving." },
  { mistake: "Speaking too fast to fill the time", fix: "Speed reads as anxiety. Slow down. Pause between points. Deliberate pacing signals confidence." },
  { mistake: "Running out of content at 90 seconds", fix: "You need 5 minutes of material to deliver 3 comfortably. If you can't speak for 5 minutes on a topic in practice, don't pick it." },
  { mistake: "Ending abruptly without a conclusion", fix: "Prepare a conclusion line for every topic you practise. The last sentence is what lingers." },
  { mistake: "Looking only at the GTO", fix: "Speak to the whole group. Move your eye contact around the circle. You are addressing the group, not reporting to the GTO." },
];

const lectCategories = [
  {
    title: "Defence & Security",
    note: "High-probability category. Assessors expect deeper knowledge here — be specific.",
    topics: [
      { topic: "Role of armed forces beyond warfare", angle: "HADR, UN peacekeeping, border infrastructure, disaster response. Specific examples: Uttarakhand 2013, Operation Maitri in Nepal." },
      { topic: "Agniveer scheme — pros and cons", angle: "Almost certain to appear. Understand both sides genuinely: tour of duty model, youth employability, veteran welfare concerns." },
      { topic: "Atmanirbhar Bharat in defence manufacturing", angle: "Cite specifics: Tejas, BrahMos, INS Vikrant, DRDO projects, private sector FDI in defence." },
      { topic: "Cybersecurity as national security", angle: "Critical infrastructure attacks, data sovereignty, CERT-In, National Cyber Security Policy. Concrete incidents strengthen this." },
      { topic: "Border security challenges", angle: "Stick to publicly known issues — LAC, LoC, coastal security. Avoid speculation. Facts over opinions." },
    ]
  },
  {
    title: "Nation & Society",
    note: "Broad topics — the stronger your specific examples, the more you stand out.",
    topics: [
      { topic: "Role of youth in nation building", angle: "NCC, startups, civic engagement, voter participation. Avoid vague patriotism — frame around concrete examples." },
      { topic: "Women empowerment in India", angle: "Legal, economic, social dimensions. Military integration: Agniveer, women fighter pilots, CDS ruling on permanent commission." },
      { topic: "Brain drain — threat or opportunity?", angle: "Nuanced positions score higher. Diaspora remittances, return migration, India's growing pull factors." },
      { topic: "Population: challenge or resource?", angle: "Demographic dividend framing. Skilled workforce potential vs resource strain, youth unemployment, skilling mission." },
      { topic: "National integration", angle: "Focus on what unites — constitution, armed forces, language policy — not what divides. Balanced, constructive framing." },
    ]
  },
  {
    title: "Technology & Digital",
    note: "Fast-moving area — recent examples from the last 12 months carry weight.",
    topics: [
      { topic: "Artificial intelligence and employment", angle: "Job displacement vs job creation. India's IT sector positioning. Reskilling and the global race for AI talent." },
      { topic: "Social media: boon or bane?", angle: "Avoid the obvious bane argument. Explore attention economy, misinformation, mental health and democratic discourse mechanisms." },
      { topic: "Digital India — progress and gaps", angle: "UPI success, rural connectivity gaps, digital literacy. Balance genuine achievement with honest gaps." },
      { topic: "Electric vehicles and India's future", angle: "EV policy, FAME scheme, charging infrastructure, battery manufacturing — India's opportunity vs dependency risk." },
    ]
  },
  {
    title: "Environment & Geopolitics",
    note: "Climate and geopolitics have a direct military angle — make that connection explicit.",
    topics: [
      { topic: "Climate change and national security", angle: "Himalayan glacier retreat, water conflicts, disaster response operations — all OLQ-relevant. Link to operational impact." },
      { topic: "India's foreign policy — balancing powers", angle: "Strategic autonomy, non-alignment 2.0, Quad, SCO membership. Avoid partisan framing — present strategic logic." },
      { topic: "India-China relations", angle: "Economic interdependence vs strategic competition. LAC standoff context. Stick to publicly known positions." },
      { topic: "Disaster management in India", angle: "NDRF, NDMA, armed forces role. Uttarakhand 2013, Odisha cyclone responses, COVID military deployment." },
    ]
  },
  {
    title: "Social Issues",
    note: "These test your ability to present multiple perspectives calmly — not your personal position.",
    topics: [
      { topic: "Reservation: relevance today", angle: "Present multiple perspectives with equal clarity. This is specifically tested as a controversial topic. No extreme positions." },
      { topic: "Drug abuse among youth", angle: "Causes, consequences, rehabilitation. Punjab case study. Role of family, community and policy." },
      { topic: "Unemployment among youth", angle: "Skill gap, education mismatch, manufacturing growth needed. Solution-oriented framing over criticism." },
      { topic: "Corruption: causes and solutions", angle: "Systemic framing — incentive structures, transparency mechanisms — is more analytical than moral condemnation." },
    ]
  },
  {
    title: "Leadership & Abstract",
    note: "Abstract topics are specifically chosen to test original thinking — avoid clichés.",
    topics: [
      { topic: "Leadership in times of crisis", angle: "Cite specific leaders and specific crises. Analytical, not hagiographic. What made them effective, not just that they were great." },
      { topic: "Teamwork vs individual brilliance", angle: "Armed forces angle natural here: collective mission over individual glory. Real historical examples carry this." },
      { topic: "Discipline vs freedom", angle: "Classic abstract topic. Anchor with specific contexts: military discipline, academic freedom, democratic rights. Avoid clichés." },
      { topic: "Stress management for youth", angle: "Mental health is openly discussed in the forces now. Acknowledge the issue, propose practical approaches. Don't stigmatise." },
    ]
  },
];

const practicePlan = [
  { week: "Week 1", focus: "Foundation", tasks: "Read one newspaper daily. Pick one topic each day and speak for 3 minutes aloud alone. Don't judge the content — just build the habit of speaking." },
  { week: "Week 2", focus: "Structure", tasks: "Apply the Hook → Context → 2 Points → Conclusion structure to every practice topic. Time yourself strictly. Record audio to hear your pace and fillers." },
  { week: "Week 3", focus: "Depth", tasks: "For each category in the topic list, prepare at least 5 minutes of material. Practice in front of a mirror or friend. Work on eye contact and pausing deliberately." },
  { week: "Week 4", focus: "Pressure simulation", tasks: "Random topic practice: open any newspaper, pick any headline, speak on it in 3 minutes with only 1 minute of prep. This simulates real SSB conditions most accurately." },
];

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp {
    min-height: 100vh;
    background: #fff;
    color: #111;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* HERO */
  .lp-hero { padding: 80px 48px 48px; border-bottom: 2px solid #111; }
  .lp-hero-label { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #999; margin-bottom: 14px; }
  .lp-hero h1 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 14px; }
  .lp-hero-desc { font-size: 0.9rem; line-height: 1.8; color: #555; max-width: 100%; margin-bottom: 32px; }

  /* QUICK STATS */
  .lp-stats { display: flex; border-top: 1px solid #eee; }
  .lp-stat { flex: 1; padding: 16px 20px; border-right: 1px solid #eee; }
  .lp-stat:last-child { border-right: none; }
  .lp-stat-val { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 3px; }
  .lp-stat-label { font-size: 11px; color: #999; font-weight: 500; }

  /* SUBNAV */
  .lp-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 14px 48px; border-bottom: 1px solid #eee; background: #fafafa; position: sticky; top: 0; z-index: 10; }
  .lp-nav a { font-size: 12px; font-weight: 500; color: #666; text-decoration: none; padding: 6px 12px; border: 1px solid #e0e0e0; border-radius: 3px; transition: all 0.1s; white-space: nowrap; }
  .lp-nav a:hover { color: #111; border-color: #999; }
  .lp-nav a.active { background: #111; color: #fff; border-color: #111; }

  /* CONTENT */
  .lp-content { padding: 0 48px 80px; max-width: 1400px; }

  /* SECTION */
  .lp-section { padding: 56px 0 0; }
  .lp-section-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #bbb; margin-bottom: 8px; }
  .lp-section-title { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 10px; }
  .lp-section-desc { font-size: 0.875rem; line-height: 1.75; color: #555; max-width: 100%; margin-bottom: 28px; }

  /* PROCESS STEPS */
  .lp-process { display: flex; flex-direction: column; border: 1px solid #eee; border-radius: 3px; overflow: hidden; }
  .lp-process-step { display: grid; grid-template-columns: 56px 1fr; border-bottom: 1px solid #eee; }
  .lp-process-step:last-child { border-bottom: none; }
  .lp-process-num { font-size: 11px; font-weight: 800; color: #ddd; padding: 18px 0 18px 20px; display: flex; align-items: flex-start; padding-top: 20px; }
  .lp-process-body { padding: 18px 20px; }
  .lp-process-title { font-size: 14px; font-weight: 700; margin-bottom: 5px; }
  .lp-process-detail { font-size: 13px; color: #555; line-height: 1.7; }

  /* SPEECH STRUCTURE */
  .lp-structure { display: flex; flex-direction: column; gap: 1px; background: #eee; border: 1px solid #eee; }
  .lp-struct-row { background: #fff; display: grid; grid-template-columns: 160px 1fr 1fr; gap: 0; }
  .lp-struct-cell { padding: 18px 20px; border-right: 1px solid #eee; }
  .lp-struct-cell:last-child { border-right: none; }
  .lp-struct-part { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 3px; }
  .lp-struct-purpose { font-size: 11px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
  .lp-struct-how { font-size: 13px; color: #333; line-height: 1.65; }
  .lp-struct-example { font-size: 12px; color: #666; line-height: 1.65; font-style: italic; background: #fafafa; padding: 10px 12px; border-left: 2px solid #ddd; white-space: pre-line; }
  .lp-struct-header { display: grid; grid-template-columns: 160px 1fr 1fr; background: #fafafa; border-bottom: 2px solid #111; }
  .lp-struct-header-cell { padding: 10px 20px; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #aaa; border-right: 1px solid #eee; }
  .lp-struct-header-cell:last-child { border-right: none; }

  /* GTO WATCHES */
  .lp-watches { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #eee; border: 1px solid #eee; }
  .lp-watch { background: #fff; padding: 18px 20px; }
  .lp-watch-quality { font-size: 13px; font-weight: 700; margin-bottom: 5px; }
  .lp-watch-detail { font-size: 13px; color: #555; line-height: 1.65; }

  /* MISTAKES */
  .lp-mistakes { display: flex; flex-direction: column; }
  .lp-mistake { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 16px 0; border-bottom: 1px solid #f2f2f2; align-items: start; }
  .lp-mistake:first-child { border-top: 1px solid #f2f2f2; }
  .lp-mistake-bad { font-size: 13px; color: #111; line-height: 1.6; }
  .lp-mistake-bad::before { content: '✗ '; color: #e00; font-weight: 700; }
  .lp-mistake-fix { font-size: 13px; color: #333; line-height: 1.6; }
  .lp-mistake-fix::before { content: '→ '; color: #555; font-weight: 700; }

  /* TOPIC CATEGORIES */
  .lp-cat-group { margin-bottom: 40px; }
  .lp-cat-header { display: flex; align-items: baseline; gap: 14px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 2px solid #111; }
  .lp-cat-title { font-size: 14px; font-weight: 800; }
  .lp-cat-note { font-size: 12px; color: #888; }
  .lp-topic-row { display: grid; grid-template-columns: 240px 1fr; gap: 20px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; align-items: baseline; }
  .lp-topic-row:last-child { border-bottom: none; }
  .lp-topic-name { font-size: 13px; font-weight: 600; color: #111; line-height: 1.4; }
  .lp-topic-angle { font-size: 12px; color: #555; line-height: 1.65; }

  /* PRACTICE PLAN */
  .lp-plan { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #eee; border: 1px solid #eee; }
  .lp-plan-row { background: #fff; padding: 20px; }
  .lp-plan-week { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #bbb; margin-bottom: 4px; }
  .lp-plan-focus { font-size: 14px; font-weight: 800; margin-bottom: 8px; }
  .lp-plan-tasks { font-size: 13px; color: #555; line-height: 1.7; }

  /* ASSESSOR NOTE */
  .lp-assessor {
    display: flex;
    gap: 0;
    margin-top: 32px;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    border-radius: 3px;
  }
  .lp-assessor-tag {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
    background: #111;
    color: #fff;
    padding: 14px 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .lp-assessor-body {
    padding: 16px 20px;
    font-size: 13px;
    line-height: 1.8;
    color: #333;
    background: #fafafa;
  }

  /* DIVIDER */
  .lp-divider { border: none; border-top: 1px solid #efefef; margin: 56px 0 0; }

  /* CTA */
  .lp-cta { padding: 40px 0 0; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .lp-cta-title { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 5px; }
  .lp-cta-sub { font-size: 13px; color: #666; }
  .lp-cta-btns { display: flex; gap: 10px; flex-shrink: 0; }
  .lp-btn-dark { background: #111; color: #fff; padding: 11px 22px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; border-radius: 4px; text-decoration: none; display: inline-block; }
  .lp-btn-dark:hover { background: #333; }
  .lp-btn-light { background: #fff; color: #111; padding: 10px 20px; border: 1px solid #ddd; cursor: pointer; font-size: 13px; font-weight: 600; border-radius: 4px; text-decoration: none; display: inline-block; }
  .lp-btn-light:hover { border-color: #111; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .lp-hero { padding: 64px 24px 40px; }
    .lp-nav { padding: 12px 24px; }
    .lp-content { padding: 0 24px 64px; }
    .lp-structure, .lp-struct-row, .lp-struct-header { display: block; }
    .lp-struct-cell { border-right: none; border-bottom: 1px solid #eee; }
    .lp-struct-cell:last-child { border-bottom: none; }
    .lp-struct-header-cell { display: none; }
    .lp-watches { grid-template-columns: 1fr; }
    .lp-plan { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .lp-hero { padding: 56px 16px 32px; }
    .lp-nav { padding: 10px 16px; }
    .lp-content { padding: 0 16px 56px; }
    .lp-stats { flex-wrap: wrap; }
    .lp-stat { flex: 1 1 40%; border-bottom: 1px solid #eee; }
    .lp-topic-row { grid-template-columns: 1fr; gap: 4px; }
    .lp-mistake { grid-template-columns: 1fr; gap: 8px; }
    .lp-process-step { grid-template-columns: 44px 1fr; }
    .lp-cta { flex-direction: column; align-items: flex-start; }
    .lp-cta-btns { width: 100%; flex-direction: column; }
    .lp-btn-dark, .lp-btn-light { text-align: center; width: 100%; }
  }
`;

export default function SSBLecturettePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="lp">
      <style>{css}</style>
      <NavbarSection />

      {/* HERO */}
      <header className="lp-hero">
        <div className="lp-hero-label">GTO Tasks · Lecturette</div>
        <h1>Lecturette — Complete Guide</h1>
        <p className="lp-hero-desc">
          The Lecturette is your solo stage in the GTO series. Unlike group tasks where you can blend in,
          here there is nowhere to hide. It tests knowledge, structure, language and confidence in exactly
          3 minutes — and those 3 minutes are entirely yours to own.
        </p>

        {/* Quick stats */}
        <div className="lp-stats">
          <div className="lp-stat">
            <div className="lp-stat-val">3 min</div>
            <div className="lp-stat-label">Speaking time</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-val">3 min</div>
            <div className="lp-stat-label">Preparation time</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-val">4</div>
            <div className="lp-stat-label">Topics on the card</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-val">1</div>
            <div className="lp-stat-label">Topic you choose</div>
          </div>
        </div>
      </header>

      {/* SUBNAV */}
      <nav className="lp-nav">
        <Link to="/ssb-preparation">← Overview</Link>
        <Link to="/ssb-lecturette" className="active">Lecturette</Link>
        <Link to="/ssb-interview">Interview</Link>
        <Link to="/ssb-group-discussion">Group Discussion</Link>
        <Link to="/ssb-gto">GTO Tasks</Link>
        <Link to="/ssb-conference">Conference</Link>
      </nav>

      <div className="lp-content">

        {/* SECTION 1 — HOW IT WORKS */}
        <section className="lp-section" id="process">
          <div className="lp-section-label">Section 01</div>
          <h2 className="lp-section-title">How the Lecturette works</h2>
          <p className="lp-section-desc">
            Understanding the exact sequence matters — especially that you prepare while someone else is speaking,
            and that the GTO is watching from the moment you stand up, not just when you start talking.
          </p>
          <div className="lp-process">
            {process.map((s, i) => (
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
              The GTO's assessment begins when your name is called — not when your first sentence comes out.
              How you stand up, how you position yourself, whether you look at the group or at the floor
              before you start — all of it is observed. Take a breath, make eye contact with the group,
              then begin.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        {/* SECTION 2 — SPEECH STRUCTURE */}
        <section className="lp-section" id="structure">
          <div className="lp-section-label">Section 02</div>
          <h2 className="lp-section-title">Speech structure — with examples</h2>
          <p className="lp-section-desc">
            A 3-minute speech has four parts. Knowing what each part must do — and how long to spend on it —
            lets you build any speech on any topic in 3 minutes of prep time.
          </p>

          <div className="lp-structure">
            <div className="lp-struct-header">
              <div className="lp-struct-header-cell">Part</div>
              <div className="lp-struct-header-cell">How to do it</div>
              <div className="lp-struct-header-cell">Example</div>
            </div>
            {speechStructure.map((row, i) => (
              <div key={i} className="lp-struct-row">
                <div className="lp-struct-cell">
                  <div className="lp-struct-part">{row.part}</div>
                  <div className="lp-struct-purpose">{row.purpose}</div>
                </div>
                <div className="lp-struct-cell">
                  <div className="lp-struct-how">{row.howTo}</div>
                </div>
                <div className="lp-struct-cell">
                  <div className="lp-struct-example">{row.example}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        {/* SECTION 3 — WHAT GTO WATCHES */}
        <section className="lp-section" id="assessment">
          <div className="lp-section-label">Section 03</div>
          <h2 className="lp-section-title">What the GTO is actually assessing</h2>
          <p className="lp-section-desc">
            The Lecturette is not primarily a knowledge test. It is a communication and composure test.
            These are the six dimensions the GTO scores — in roughly this order of weight.
          </p>
          <div className="lp-watches">
            {whatGTOWatches.map((w, i) => (
              <div key={i} className="lp-watch">
                <div className="lp-watch-quality">{w.quality}</div>
                <div className="lp-watch-detail">{w.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        {/* SECTION 4 — COMMON MISTAKES */}
        <section className="lp-section" id="mistakes">
          <div className="lp-section-label">Section 04</div>
          <h2 className="lp-section-title">Common mistakes — and how to fix them</h2>
          <p className="lp-section-desc">
            These are the mistakes that appear most consistently across candidates. Most of them are correctable
            with 2 weeks of deliberate practice.
          </p>
          <div className="lp-mistakes">
            {commonMistakes.map((m, i) => (
              <div key={i} className="lp-mistake">
                <div className="lp-mistake-bad">{m.mistake}</div>
                <div className="lp-mistake-fix">{m.fix}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        {/* SECTION 5 — TOPICS */}
        <section className="lp-section" id="topics">
          <div className="lp-section-label">Section 05</div>
          <h2 className="lp-section-title">Practice topics by category</h2>
          <p className="lp-section-desc">
            Topics are drawn from all six categories below. The right column shows the analytical angle
            that separates a strong speech from a generic one on each topic.
          </p>
          {lectCategories.map((cat, i) => (
            <div key={i} className="lp-cat-group">
              <div className="lp-cat-header">
                <span className="lp-cat-title">{cat.title}</span>
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

        {/* SECTION 6 — PRACTICE PLAN */}
        <section className="lp-section" id="practice">
          <div className="lp-section-label">Section 06</div>
          <h2 className="lp-section-title">4-week practice plan</h2>
          <p className="lp-section-desc">
            Lecturette cannot be prepared in one sitting. It is a skill built over repetition.
            This is a minimum viable plan for candidates with 4 weeks before their SSB date.
          </p>
          <div className="lp-plan">
            {practicePlan.map((p, i) => (
              <div key={i} className="lp-plan-row">
                <div className="lp-plan-week">{p.week}</div>
                <div className="lp-plan-focus">{p.focus}</div>
                <div className="lp-plan-tasks">{p.tasks}</div>
              </div>
            ))}
          </div>

          <div className="lp-assessor">
            <div className="lp-assessor-tag">Key reminder</div>
            <div className="lp-assessor-body">
              You need 5 minutes of material to deliver 3 minutes comfortably. The extra 2 minutes
              gives you the confidence to slow down, pause, and choose your words — rather than
              racing to fill the time. If you can't speak for 5 minutes on a topic in practice,
              don't pick it on the day.
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        {/* CTA */}
        <div className="lp-cta">
          <div>
            <div className="lp-cta-title">Continue your preparation</div>
            <p className="lp-cta-sub">Move to the next stage — or start practising with mock topics.</p>
          </div>
          <div className="lp-cta-btns">
            <Link to="/ssb-interview" className="lp-btn-dark">Next: Personal Interview →</Link>
            <Link to="/ssb-preparation" className="lp-btn-light">Back to Overview</Link>
          </div>
        </div>

      </div>
      <FooterSection />
    </div>
  );
}