import { useState } from "react";
import { useNavigate } from "react-router";
import { NavbarSection } from "@/pages/navbar/NavbarSection";
import { FooterSection } from "@/pages/navbar/FooterSection";

type TabType = "lecturette" | "interview" | "gd" | "gto" | "conference";

const tabs: { key: TabType; label: string; meta: string }[] = [
  { key: "lecturette", label: "Lecturette", meta: "24 Topics" },
  { key: "interview", label: "Personal Interview", meta: "50+ Questions" },
  { key: "gd", label: "Group Discussion", meta: "25 Topics" },
  { key: "gto", label: "GTO Tasks", meta: "8 Exercises" },
  { key: "conference", label: "Conference", meta: "" },
];

/* ─── DATA ─── */
const lectCategories = [
  {
    title: "Nation & Society",
    topics: [
      { topic: "Role of youth in nation building", tip: "Frame around specific examples — NCC, startups, civic engagement. Avoid abstract patriotism." },
      { topic: "Women empowerment in India", tip: "Reference legal, economic and social dimensions. Mention military integration (Agniveer, women fighter pilots)." },
      { topic: "National integration", tip: "Historical context helps. Focus on what unites — language, constitution, armed forces — not what divides." },
      { topic: "Population: challenge or resource?", tip: "Demographic dividend framing is strong. Cite skilled workforce potential vs resource strain." },
      { topic: "Brain drain — threat or opportunity?", tip: "Nuanced position scores well. Diaspora remittances and return migration are valid counterpoints." },
    ]
  },
  {
    title: "Technology & Digital",
    topics: [
      { topic: "Social media: boon or bane?", tip: "Avoid the obvious bane argument. Explore misinformation, mental health and democratic discourse." },
      { topic: "Artificial intelligence and employment", tip: "Job displacement vs job creation debate. Mention India's IT sector positioning." },
      { topic: "Cybersecurity as national security", tip: "Increasingly relevant. Link to critical infrastructure, defence networks and data sovereignty." },
      { topic: "Digital India — progress and gaps", tip: "Balanced view: rural connectivity gaps, UPI success, digital literacy needs." },
      { topic: "Atmanirbhar Bharat in defence manufacturing", tip: "Strong SSB topic. Cite DRDO, Tejas, BrahMos, HAL — specifics impress." },
    ]
  },
  {
    title: "Environment & Security",
    topics: [
      { topic: "Climate change and national security", tip: "Military angle: Himalayan glacier retreat, water conflicts, disaster response — all OLQ-relevant." },
      { topic: "Disaster management in India", tip: "NDRF, NDMA, armed forces role in relief. Uttarakhand 2013 and Odisha cyclone responses are good examples." },
      { topic: "Border security challenges", tip: "Stick to publicly known issues. LAC, Line of Control, coastal security. Avoid speculative statements." },
    ]
  },
  {
    title: "Social Issues",
    topics: [
      { topic: "Unemployment among youth", tip: "Link skill gap, education mismatch and manufacturing to solutions. Avoid pure criticism." },
      { topic: "Drug abuse among youth", tip: "Causes, consequences and rehabilitation. Punjab as case study. Role of family and community." },
      { topic: "Corruption: causes and solutions", tip: "Systemic framing is stronger than moral framing. Technology, transparency, accountability." },
      { topic: "Reservation: relevance today", tip: "Present multiple perspectives calmly. This is specifically tested as a controversial GD topic." },
    ]
  },
  {
    title: "Leadership & Development",
    topics: [
      { topic: "Importance of discipline in life", tip: "Personal examples strengthen this. Distinguish discipline from conformity." },
      { topic: "Leadership in times of crisis", tip: "Cite military leaders, political leaders, crisis managers. Keep it analytical not hagiographic." },
      { topic: "Stress management for youth", tip: "Mental health is now openly discussed in the forces. Acknowledge, don't stigmatise." },
      { topic: "Teamwork vs individual brilliance", tip: "Armed forces angle: collective mission over individual glory. Easy to deliver with conviction." },
    ]
  },
  {
    title: "Defence & Foreign Policy",
    topics: [
      { topic: "Role of armed forces beyond warfare", tip: "HADR, UN peacekeeping, civil disaster response, infrastructure development in border areas." },
      { topic: "India's foreign policy — balancing powers", tip: "Stick to strategic principles: non-alignment 2.0, quad, SCO. Avoid partisan framing." },
      { topic: "Agniveer scheme — pros and cons", tip: "Highly likely topic. Understand both sides. Tour of duty model, youth employability, veterans." },
    ]
  },
];

const interviewSections = [
  {
    title: "About Yourself",
    guidance: "The IO has read your PIQ before you enter. Every answer here will be probed in depth — especially hobbies, achievements and role models. Be specific and honest.",
    questions: [
      { q: "Tell me about yourself.", note: "Not a biography — frame it as: where you're from, what shaped you, what you're pursuing and why." },
      { q: "Why do you want to join the Armed Forces?", note: "The most important question. Generic patriotism scores poorly. A personal, specific answer rooted in real experience is what works." },
      { q: "What are your strengths and weaknesses?", note: "Name a genuine weakness and explain what you've done about it. Pretend-weaknesses ('I work too hard') are immediately obvious." },
      { q: "Who is your role model and why?", note: "Choose someone you genuinely know about — not a famous name you can't elaborate on. Military leaders, scientists, teachers all work." },
      { q: "Describe a situation where you showed leadership.", note: "Specific, real, modest. The IO will probe the details — vague answers unravel quickly." },
    ]
  },
  {
    title: "Family & Background",
    guidance: "The IO reads the PIQ family section carefully. Inconsistencies between what you've written and what you say are immediately noted.",
    questions: [
      { q: "Tell me about your family.", note: "Brief, warm, factual. Know what each family member does in detail — the IO will follow up on anything you mention." },
      { q: "How does your family feel about you joining the forces?", note: "Be honest. Families have concerns. Acknowledging them and explaining how you've addressed them shows maturity." },
      { q: "Who has influenced you most in life?", note: "Could be a parent, teacher, coach. Explain the specific quality and moment — not just the name." },
      { q: "What are your family's views on discipline, responsibility and service?", note: "This question probes values absorbed at home. Authentic answers are more convincing than ideal ones." },
    ]
  },
  {
    title: "Education & Interests",
    guidance: "Whatever you've written in your PIQ about academics, sports, books and hobbies — the IO will ask you to go deep on it. Never list something you can't speak about for three minutes.",
    questions: [
      { q: "Why did you choose your academic stream?", note: "A genuine reason — curiosity, aptitude, influence — is more convincing than 'good career prospects'." },
      { q: "Which subject interests you most, and what do you know about it beyond your syllabus?", note: "This question specifically tests intellectual curiosity. Have a genuine answer prepared." },
      { q: "Tell me about a book you've read recently.", note: "Name a book you actually read. The IO may ask about themes, characters, what you disagreed with." },
      { q: "What sports have you played and at what level?", note: "Be precise about level — inter-school, district, state. The IO can verify and will probe." },
      { q: "What are your future plans if not selected for the forces?", note: "Have a real plan. It shows maturity and self-awareness. It does not reduce your apparent commitment." },
    ]
  },
  {
    title: "Current Affairs & General Awareness",
    guidance: "The IO expects awareness proportional to your background. An engineering graduate is expected to know more defence technology than an arts graduate. Read for understanding, not for facts.",
    questions: [
      { q: "What are the major security challenges India faces today?", note: "Internal and external. Cite specific theatres, not vague generalisations." },
      { q: "Tell me about a recent defence development you found significant.", note: "Demonstrate genuine interest. Agni-V, Tejas Mk2, aircraft carrier, DRDO projects — pick one and speak with depth." },
      { q: "What is your view on India's foreign policy stance on [current issue]?", note: "Present a structured view. Acknowledge complexity. The IO is not looking for a particular answer — they want coherent reasoning." },
      { q: "What does Atmanirbhar Bharat mean for defence?", note: "Know the domestic defence manufacturing push — HAL, DRDO, private sector, FDI in defence." },
    ]
  },
];

const gdTopics = [
  { topic: "Is social media making youth less productive?", angle: "Attention economy, comparison culture, filter bubbles — explore mechanisms, not just symptoms." },
  { topic: "Role of youth in politics", angle: "Voter turnout data, young MPs, political apathy — use facts. Avoid partisan positioning." },
  { topic: "Reservation: still relevant or needing reform?", angle: "This is a deliberate controversy test. Present both views clearly. Don't take an extreme position." },
  { topic: "Education vs skill development", angle: "Not an either-or. Frame as integration. NEP 2020 is directly relevant." },
  { topic: "Technology: blessing or curse?", angle: "Too broad — narrow it quickly in the GD. Agricultural tech, medical tech, and surveillance are distinct sub-topics." },
  { topic: "Women in combat roles in the Indian Armed Forces", angle: "Current affairs (women fighter pilots, Agniveer, CDS ruling). Balanced, evidence-based contribution." },
  { topic: "Corruption: systemic or individual?", angle: "Systemic framing (incentive structures, transparency mechanisms) is more analytical than moral condemnation." },
  { topic: "Unemployment: government's failure or individual's?", angle: "Skill gap, education mismatch, job creation rate — structural vs behavioural framing." },
  { topic: "Role of media in a democracy", angle: "Fourth estate function, paid news, social media disruption of traditional media." },
  { topic: "Urbanisation: opportunity or crisis?", angle: "Migration, infrastructure stress, satellite city models — avoid generic smart city talk without substance." },
  { topic: "Digital dependence: are we too reliant on technology?", angle: "Cybersecurity risk, skill atrophy, privacy — concrete examples carry this discussion." },
  { topic: "Discipline vs freedom: where is the balance?", angle: "Classic abstract GD. Anchor with specific contexts — military, education, public life." },
  { topic: "Work-life balance in a competitive world", angle: "Mental health, productivity research, organisational culture. Personal examples resonate." },
  { topic: "Climate change: individual or government responsibility?", angle: "Both — but policy leverage is far greater. Carbon tax, renewable transitions, international agreements." },
  { topic: "Leadership in crisis: born or made?", angle: "Psychological research supports both. Cite military leaders who were developed, not just natural." },
];

const gtoTasks = [
  {
    name: "Group Discussion (GD)",
    duration: "20 min × 2 rounds",
    assessed: "Communication · Reasoning · Group influence · Listening",
    body: "Two rounds are held — typically one concrete topic and one abstract. There is no moderator; the group runs itself. The GTO scores contribution quality, reasoning, how you handle disagreement and whether you influence the group's direction without dominating it. Speak early, build on others' points, summarise when the discussion drifts.",
    tip: "The candidate who brings clarity to a confused discussion scores more than the one who speaks most often."
  },
  {
    name: "Group Planning Exercise (GPE)",
    duration: "~45 min",
    assessed: "Analytical planning · Communication · Collaborative decision-making",
    body: "A scenario with simultaneous problems across a geographic area is presented — limited resources, multiple priorities, time pressure. Candidates individually write their plan first, then discuss as a group to reach a common solution which one candidate presents. The GTO watches whether you listen to others' plans or push yours regardless.",
    tip: "If another candidate's plan is better, support it. The GTO is not scoring whose plan wins — they are scoring how well you collaborate."
  },
  {
    name: "Progressive Group Task (PGT)",
    duration: "~45 min",
    assessed: "Initiative · Physical contribution · Idea quality · Team support",
    body: "The group crosses a series of outdoor obstacles using props — planks, ropes, barrels — under specific rules (no touching prohibited zones, load must travel with the group). Tasks increase in difficulty. The GTO watches who generates viable ideas, who acts on others' ideas, who retreats when their suggestion fails, and who helps struggling teammates.",
    tip: "Don't repeat an idea that was already rejected. Generate alternatives, support what's working, and keep the group moving forward."
  },
  {
    name: "Half Group Task (HGT)",
    duration: "~25 min",
    assessed: "Individual contribution in a smaller, more visible setting",
    body: "The group is halved — typically 4–6 candidates — and attempts the same task simultaneously but separately. With fewer people, every individual's contribution and absence of contribution is magnified. Candidates who were quiet in the full group tasks are watched closely here.",
    tip: "This is the GTO's opportunity to see quieter candidates clearly. Contribute consistently — this is not the moment to step back."
  },
  {
    name: "Lecturette",
    duration: "3 min per candidate",
    assessed: "Knowledge depth · Structure · Communication poise",
    body: "Each candidate privately selects one topic from a card of four and speaks to the rest of the group for exactly three minutes. A minute is given to collect thoughts — no writing permitted. Topics span current affairs, science, social issues and abstract concepts. Pick the topic you actually know most about, not the one that sounds impressive.",
    tip: "Run out of content at 90 seconds and the remaining time destroys your impression. Know your chosen topic for 5 minutes so the 3 flows naturally."
  },
  {
    name: "Command Task",
    duration: "~10 min per candidate",
    assessed: "Leadership clarity · Decisiveness · Command presence",
    body: "Each candidate is designated Commander and privately briefed on an obstacle task. They then choose two subordinates from the group and brief them on the task before attempting it. The GTO observes briefing quality, decisiveness during execution and how the commander manages subordinates who may offer suggestions.",
    tip: "A commander who takes subordinate suggestions is thoughtful. A commander who defers entirely to subordinates has not led — the distinction matters."
  },
  {
    name: "Individual Obstacles",
    duration: "~3 min per candidate",
    assessed: "Physical courage · Determination · Tactical awareness",
    body: "Ten numbered obstacles of varying point values. Candidates attempt them in any order within the time limit. Higher-numbered obstacles carry more points — but also take more time and energy. Candidates who plan their route — attempting high-value obstacles while ensuring they don't run out of time — score better than those who attempt sequentially.",
    tip: "Attempt every obstacle even if you fail — attempting and failing scores more than skipping. Show courage, not just success."
  },
  {
    name: "Final Group Task (FGT)",
    duration: "~30 min",
    assessed: "Consistency · Synthesis of earlier observations",
    body: "Structurally similar to the PGT but conducted after all other tasks. The GTO uses the FGT as a final synthesising observation — confirming or revising impressions formed over two days. Candidates who have learned the group's dynamics often perform better. Those who revert to passive or aggressive behaviour at this late stage are noted.",
    tip: "The FGT is a final data point, not a reversal opportunity. Behave consistently with how you've behaved across two days."
  },
];

const conferenceFacts = [
  {
    title: "What the Conference actually is",
    body: "The Psychologist, all Group Testing Officers and the Interviewing Officer meet together for the first time on the final morning. They have each independently scored the candidate throughout the process and not seen each other's notes. The Conference is the first moment all three assessors compare their observations.\n\nEach assessor presents their OLQ ratings. Candidates about whom assessors strongly agree — positively or negatively — are decided quickly. Those where assessors disagree are discussed at length. The board seeks consistency: a candidate who appeared confident with the GTO but evasive in the IO's interview generates discussion."
  },
  {
    title: "What happens when you're called in",
    body: "Candidates are called in by chest number, one at a time. The board president may ask a brief question — about a specific incident during the tasks, a gap in the PIQ, or a topic from the interview — or may simply dismiss the candidate in under a minute.\n\nThe duration of the interaction does not indicate the outcome. A candidate dismissed in 30 seconds may be recommended; one questioned for five minutes may not be. Walk in composed, answer briefly and honestly, and leave without over-explaining."
  },
  {
    title: "Possible outcomes",
    body: "Candidates receive one of three outcomes: Recommended, Not Recommended, or — rarely — Held (pending medical or administrative review). Results are announced by chest number the same day after all conferences are complete.\n\nRecommended candidates proceed to a medical examination at a specified military hospital. Those who pass the medical are merit-listed based on their qualifying exam score and SSB score combined. Final allocation to training academies depends on merit rank and vacancies."
  },
  {
    title: "How to approach the Conference",
    body: "There is no meaningful preparation for the Conference itself. The board has five days of independent observation — it has already formed its view. The brief candidate interaction is a final check, not an opportunity to reverse an impression formed over the week.\n\nThe only thing a candidate controls on the final day is their composure. Walk in smartly, greet the board, answer any question with brief honesty, and leave with dignity regardless of how you feel the week went. Candidates who perform well under that mild final pressure tend to do so because they've been themselves throughout the five days."
  },
];

/* ─── CSS ─── */
const css = `
  .pp { min-height: 100vh; background: #fafaf8; color: #1a1a1a; font-family: Georgia, serif; }
  .pp > * { box-sizing: border-box; }

  .pp-back { padding: 24px 48px 0; }
  .pp-back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #666; letter-spacing: 0.05em; font-family: system-ui, sans-serif; }
  .pp-back-btn:hover { color: #1a1a1a; }

  /* HERO */
  .pp-hero { padding: 56px 48px 40px; border-bottom: 1px solid #e0ddd8; }
  .pp-eyebrow { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 20px; }
  .pp-h1 { font-size: clamp(1.9rem, 3.5vw, 3.2rem); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; max-width: 680px; }
  .pp-lead { font-size: 1.05rem; line-height: 1.85; color: #444; max-width: 900px; }

  /* TAB NAV */
  .pp-tabnav { 
    display: flex; 
    flex-wrap: wrap;
    gap: 12px;
    padding: 24px 48px; 
    background: linear-gradient(180deg, #fafaf8 0%, #f5f4f1 100%);
    border-bottom: 1px solid #e8e5e0;
  }
  .pp-tab { 
    background: #fff; 
    border: 2px solid #e8e5e0; 
    border-radius: 12px;
    cursor: pointer; 
    font-family: system-ui, sans-serif;
    color: #555; 
    padding: 16px 24px;
    flex-shrink: 0; 
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 140px;
  }
  .pp-tab:hover { 
    background: #fff; 
    border-color: #c8a84c;
    color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .pp-tab.active { 
    background: #1a2a1b; 
    border-color: #1a2a1b;
    color: #fff; 
    box-shadow: 0 4px 16px rgba(26,42,27,0.3);
  }
  .pp-tab-label { font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
  .pp-tab-meta { 
    font-size: 11px; 
    color: #888;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #f0ede8;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .pp-tab.active .pp-tab-meta { 
    background: rgba(255,255,255,0.2); 
    color: #fff;
  }

  /* MAIN */
  .pp-main { padding: 64px 48px 80px; }

  /* SECTION HEADER */
  .pp-sec-hdr { margin-bottom: 40px; }
  .pp-sec-h { font-size: 1.9rem; font-weight: 400; letter-spacing: -0.01em; margin-bottom: 10px; }
  .pp-sec-sub { font-size: 1rem; line-height: 1.75; color: #555; max-width: 900px; }

  /* ── LECTURETTE ──
     Two-column grid. Each category is a card with its topics listed cleanly inside.
     No 1px gap grid trick — just border separation within each card. */
  .pp-lect-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .pp-lect-cat { background: #f5f3f0; border-radius: 4px; padding: 28px; }
  .pp-lect-cat-title { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #999; font-family: system-ui; margin-bottom: 20px; }
  .pp-lect-item { padding: 14px 0; border-top: 1px solid #e8e4de; }
  .pp-lect-topic { font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; line-height: 1.3; }
  .pp-lect-tip { font-size: 0.8rem; line-height: 1.6; color: #777; }

  /* ── INTERVIEW ──
     Section title + guidance as a plain paragraph. Questions as clean rows — no box grid. */
  .pp-int-section { margin-bottom: 52px; }
  .pp-int-section:last-child { margin-bottom: 0; }
  .pp-int-title { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; font-family: system-ui; margin-bottom: 8px; }
  .pp-int-guidance { font-size: 0.9rem; line-height: 1.7; color: #555; margin-bottom: 24px; max-width: 680px; }
  .pp-int-item { display: grid; grid-template-columns: 2fr 3fr; gap: 32px; padding: 18px 0; border-top: 1px solid #e8e4de; align-items: baseline; }
  .pp-int-q { font-size: 0.9rem; font-weight: 600; line-height: 1.4; }
  .pp-int-note { font-size: 0.855rem; line-height: 1.65; color: #555; }

  /* ── GROUP DISCUSSION ──
     Clean numbered list — no box tiles, no grey fills. Topic bold, angle beneath in muted colour. */
  .pp-gd-list { display: flex; flex-direction: column; }
  .pp-gd-item { display: grid; grid-template-columns: 28px 2fr 3fr; gap: 20px 28px; padding: 18px 0; border-top: 1px solid #e8e4de; align-items: baseline; }
  .pp-gd-num { font-size: 11px; color: #bbb; font-family: system-ui; padding-top: 2px; }
  .pp-gd-topic { font-size: 0.9rem; font-weight: 600; line-height: 1.4; }
  .pp-gd-angle { font-size: 0.855rem; line-height: 1.65; color: #555; }

  /* ── GTO ──
     Each task as a contained card. No 1px gap grid — proper spacing. */
  .pp-gto-list { display: flex; flex-direction: column; gap: 16px; }
  .pp-gto-item { background: #f5f3f0; border-radius: 4px; padding: 28px 32px; }
  .pp-gto-top { display: flex; align-items: baseline; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
  .pp-gto-name { font-size: 1rem; font-weight: 700; }
  .pp-gto-dur { font-size: 12px; color: #888; font-family: system-ui; }
  .pp-gto-assessed { font-size: 11px; color: #aaa; font-family: system-ui; margin-left: auto; }
  .pp-gto-body { font-size: 0.875rem; line-height: 1.8; color: #333; margin-bottom: 14px; }
  .pp-gto-tip { font-size: 0.855rem; line-height: 1.65; color: #333; padding: 12px 16px; background: #eceae5; border-left: 2px solid #1a1a1a; font-style: italic; border-radius: 0 2px 2px 0; }

  /* ── CONFERENCE ──
     Simple flowing sections, no heavy boxes. */
  .pp-conf-list { display: flex; flex-direction: column; gap: 0; }
  .pp-conf-item { padding: 36px 0; border-top: 1px solid #e8e4de; }
  .pp-conf-item:first-child { padding-top: 0; border-top: none; }
  .pp-conf-title { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; font-family: system-ui; margin-bottom: 16px; }
  .pp-conf-body { font-size: 0.925rem; line-height: 1.85; color: #333; }
  .pp-conf-body + .pp-conf-body { margin-top: 14px; }

  /* NOTE */
  .pp-note { margin-top: 56px; padding: 24px 32px; background: #f5f4f1; border-left: 4px solid #c8a84c; font-size: 0.9rem; line-height: 1.75; color: #555; border-radius: 0 8px 8px 0; max-width: 900px; margin-left: auto; margin-right: auto; }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .pp-lect-grid { grid-template-columns: 1fr; }
    .pp-int-item { grid-template-columns: 1fr; gap: 6px; }
    .pp-gd-item { grid-template-columns: 24px 1fr; }
    .pp-gd-angle { grid-column: 2; }
    .pp-gto-assessed { margin-left: 0; }
  }

  @media (max-width: 760px) {
    .pp-back { padding: 20px 24px 0; }
    .pp-hero { padding: 40px 24px 32px; }
    .pp-tabnav { padding: 16px 24px; gap: 6px; }
    .pp-main { padding: 48px 24px 64px; }
    .pp-tab { padding: 9px 14px; }
    .pp-tab-label { font-size: 12px; }
    .pp-tab-meta { font-size: 10px; }
  }

  @media (max-width: 520px) {
    .pp-back { padding: 16px 16px 0; }
    .pp-hero { padding: 28px 16px 28px; }
    .pp-tabnav { padding: 12px 16px; gap: 6px; }
    .pp-main { padding: 36px 16px 56px; }
    .pp-h1 { font-size: 1.5rem; }
    .pp-lead { font-size: 0.95rem; }
    .pp-sec-h { font-size: 1.4rem; }
    .pp-lect-cat { padding: 20px 16px; }
    .pp-gto-item { padding: 20px 16px; }
    .pp-gd-item { grid-template-columns: 1fr; gap: 6px; }
    .pp-gd-num { display: none; }
    .pp-tab { padding: 8px 12px; }
    .pp-tab-label { font-size: 11px; }
    .pp-tab-meta { font-size: 10px; padding: 1px 6px; }
  }
`;

export default function SSBPreparationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("lecturette");

  return (
    <>
      <NavbarSection />
      <div className="pp">
        <style>{css}</style>

        <div className="pp-back pt-16">
          <button className="pp-back-btn" onClick={() => navigate("/")}>← Back to Home</button>
        </div>

        {/* HERO */}
        <header className="pp-hero">
          <div className="pp-eyebrow">Indian Armed Forces · SSB Preparation</div>
          <h1 className="pp-h1">SSB Interview Preparation</h1>
          <p className="pp-lead">
            Detailed guidance across all five areas of SSB assessment — Lecturette, Personal Interview, Group Discussion, GTO Tasks and the Conference. Each section covers what is tested, what assessors are watching, and how to prepare authentically.
          </p>
        </header>

        {/* TAB NAV */}
        <nav className="pp-tabnav">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`pp-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span className="pp-tab-label">{t.label}</span>
              <span className="pp-tab-meta">{t.meta}</span>
            </button>
          ))}
        </nav>

        <main className="pp-main">
          {activeTab === "lecturette" && <LecturetteSection />}
          {activeTab === "interview" && <InterviewSection />}
          {activeTab === "gd" && <GDSection />}
          {activeTab === "gto" && <GTOSection />}
          {activeTab === "conference" && <ConferenceSection />}

          <div className="pp-note">
            <strong>Note:</strong> Topics and questions vary across boards and over time. This material is based on recurring patterns across recent SSB experiences. Use it as a framework for building genuine knowledge — not as a list to memorise.
          </div>
        </main>
        <FooterSection />
      </div>
    </>
  );
}

/* ── SECTIONS ── */

function LecturetteSection() {
  return (
    <section>
      <div className="pp-sec-hdr">
        <h2 className="pp-sec-h">Lecturette Topics</h2>
        <p className="pp-sec-sub">
          24 topic areas frequently appearing across SSB boards, with a note on how assessors judge each. The Lecturette tests knowledge depth, structure and communication poise — not performance. Choose the topic you know best, not the one that sounds impressive.
        </p>
      </div>
      <div className="pp-lect-grid">
        {lectCategories.map(cat => (
          <div className="pp-lect-cat" key={cat.title}>
            <div className="pp-lect-cat-title">{cat.title}</div>
            {cat.topics.map((item, i) => (
              <div className="pp-lect-item" key={i}>
                <div className="pp-lect-topic">{item.topic}</div>
                <div className="pp-lect-tip">{item.tip}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function InterviewSection() {
  return (
    <section>
      <div className="pp-sec-hdr">
        <h2 className="pp-sec-h">Personal Interview Questions</h2>
        <p className="pp-sec-sub">
          The IO reads your PIQ before you enter. Every question originates from something you have written. The right side of each row shows what the IO is actually probing — not just what to say, but why the question is being asked.
        </p>
      </div>
      {interviewSections.map(sec => (
        <div className="pp-int-section" key={sec.title}>
          <div className="pp-int-title">{sec.title}</div>
          <p className="pp-int-guidance">{sec.guidance}</p>
          <div>
            {sec.questions.map((item, i) => (
              <div className="pp-int-item" key={i}>
                <div className="pp-int-q">{item.q}</div>
                <div className="pp-int-note">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function GDSection() {
  return (
    <section>
      <div className="pp-sec-hdr">
        <h2 className="pp-sec-h">Group Discussion Topics</h2>
        <p className="pp-sec-sub">
          GD topics are chosen to generate disagreement and complexity — not to test knowledge of a right answer. The right column shows the analytical angle that makes a contribution substantive rather than generic.
        </p>
      </div>
      <div className="pp-gd-list">
        {gdTopics.map((item, i) => (
          <div className="pp-gd-item" key={i}>
            <div className="pp-gd-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="pp-gd-topic">{item.topic}</div>
            <div className="pp-gd-angle">{item.angle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GTOSection() {
  return (
    <section>
      <div className="pp-sec-hdr">
        <h2 className="pp-sec-h">GTO Tasks</h2>
        <p className="pp-sec-sub">
          Eight tasks across two days. What assessors are watching in each task is different from what the task appears to be about on the surface. Understanding the distinction is the most valuable GTO preparation.
        </p>
      </div>
      <div className="pp-gto-list">
        {gtoTasks.map((task, i) => (
          <div className="pp-gto-item" key={i}>
            <div className="pp-gto-top">
              <div className="pp-gto-name">{task.name}</div>
              <div className="pp-gto-dur">{task.duration}</div>
              <div className="pp-gto-assessed">{task.assessed}</div>
            </div>
            <p className="pp-gto-body">{task.body}</p>
            <div className="pp-gto-tip">{task.tip}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConferenceSection() {
  return (
    <section>
      <div className="pp-sec-hdr">
        <h2 className="pp-sec-h">The Conference</h2>
        <p className="pp-sec-sub">
          The final stage where three independent assessors compare five days of separate observations for the first time. There is no preparation for the Conference itself — but understanding how it works removes unnecessary anxiety.
        </p>
      </div>
      <div className="pp-conf-list">
        {conferenceFacts.map((item, i) => (
          <div className="pp-conf-item" key={i}>
            <div className="pp-conf-title">{item.title}</div>
            {item.body.split('\n\n').map((para, j) => (
              <p className="pp-conf-body" key={j}>{para}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}