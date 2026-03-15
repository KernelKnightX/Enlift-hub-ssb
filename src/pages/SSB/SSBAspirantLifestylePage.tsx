import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { ChevronRight, Clock, BookOpen, MessageSquare, Target, BarChart2, Users, Zap, Shield, GraduationCap } from 'lucide-react';

// ─── SEO STRUCTURED DATA ─────────────────────────────────────────────────────

const structuredDataArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SSB Aspirant Lifestyle Guide – Daily Routine & Habits to Develop OLQs",
  description:
    "Complete SSB aspirant lifestyle guide with daily schedule, essential habits and key principles to develop Officer-Like Qualities for Services Selection Board selection.",
  author: { "@type": "Organization", name: "Enlift Hub" },
  publisher: { "@type": "Organization", name: "Enlift Hub" },
  datePublished: "2025-01-01",
  dateModified: "2025-03-01",
  keywords: ["SSB aspirant", "SSB daily routine", "SSB preparation", "OLQ development", "SSB lifestyle", "Services Selection Board", "NDA preparation", "CDS preparation"],
};

const structuredDataFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should be the daily routine of an SSB aspirant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An SSB aspirant's daily routine should start at 5:30 AM with physical exercise, followed by current affairs reading, psychology practice (TAT, WAT, SRT), group discussion practice, sports, self-reflection journaling, and lights out by 10 PM. Discipline and consistency are what assessors look for.",
      },
    },
    {
      "@type": "Question",
      name: "How do you develop OLQs for SSB in daily life?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OLQs are developed through daily conscious effort — leading group activities, taking initiative without being asked, journaling decisions, reading military biographies, participating in sports, and doing regular self-assessment against all 15 Officer-Like Qualities.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to prepare for SSB?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Serious SSB preparation takes 6–12 months of consistent effort. The first 3 months focus on self-assessment and joining group activities. Months 3–6 involve practice writing TAT, WAT, SRT responses. From month 6 onward, mock interviews, lecturette practice and group discussions with feedback are key.",
      },
    },
    {
      "@type": "Question",
      name: "Is physical fitness important for SSB?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Physical fitness is assessed both directly in GTO outdoor tasks and indirectly through Stamina — one of the 15 OLQs. Candidates must sustain physical and mental performance through a demanding 5-day schedule. Daily exercise is non-negotiable for SSB aspirants.",
      },
    },
  ],
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const dailySchedule = [
  { time: '5:30 AM', act: 'Wake Up & Exercise',          why: 'Physical fitness is non-negotiable. Run, do PT, or yoga. The early morning discipline sets the tone for the entire day.' },
  { time: '7:00 AM', act: 'Self-Assessment & Goal Setting', why: 'Rate yourself on each of the 15 OLQs. Write down 3 goals for the day. SSB looks for candidates with clear direction.' },
  { time: '8:00 AM', act: 'Breakfast & Current Affairs',  why: 'Read The Hindu or Indian Express. Stay updated on defence, geopolitics, and national issues. This is crucial for the interview.' },
  { time: '10:00 AM', act: 'Current Affairs Deep Dive',   why: 'Make notes on one topic deeply. Understand the why behind events. Officers need broad awareness and depth.' },
  { time: '12:00 PM', act: 'Group Discussion Practice',   why: 'Form a group or practice alone. Speak for 2–3 minutes on any topic. Record yourself and analyse.' },
  { time: '2:00 PM', act: 'Psychology Practice',          why: 'TAT, WAT, SRT — your mind\'s freshest hour is the best time to train instinctive responses under time pressure.' },
  { time: '4:00 PM', act: 'Sports / Physical Activity',   why: 'Play cricket, football, or badminton. Leadership is shown in sports. Team activities demonstrate cooperation.' },
  { time: '6:00 PM', act: 'Reading & Vocabulary',         why: 'Read newspapers, editorials, and books. Note down new words. Power of expression is an OLQ.' },
  { time: '8:00 PM', act: 'Self-Reflection Journal',      why: 'Write what you did today. Rate your OLQ demonstration. Self-awareness is itself an OLQ — Effective Intelligence.' },
  { time: '10:00 PM', act: 'Lights Out',                  why: 'Sleep early. SSB days start early. Physical and mental freshness is assessed from the moment you enter.' },
];

const habits = [
  { icon: BookOpen,      title: 'Read Military Biographies',  desc: 'Sam Manekshaw, Field Marshal Cariappa, Param Vir Chakra recipients — their stories build the officer mindset.' },
  { icon: MessageSquare, title: 'Volunteer & Lead',           desc: 'Organise events. Take initiative in group settings. Initiative is a core OLQ — practice it in daily life.' },
  { icon: Target,        title: 'Journal Your Decisions',     desc: 'Write down 3 decisions you made today and why. SSB looks for speed and quality of decision-making.' },
  { icon: BarChart2,     title: 'Track Your Growth',          desc: 'Rate yourself weekly on each OLQ. Growth in self-awareness is itself an OLQ — Effective Intelligence.' },
  { icon: Users,         title: 'Join Team Activities',       desc: 'Participate in college events, sports, NCC, or social service. Leadership and cooperation are demonstrated in teams.' },
  { icon: Zap,           title: 'Practice Extempore',         desc: 'Pick a random topic. Speak for 2 minutes. Record and review. Clear expression is crucial for SSB.' },
];

const keyTakeaways = [
  { icon: Clock,          text: 'Discipline is non-negotiable. Wake up early, sleep early, and maintain a strict routine.' },
  { icon: Target,         text: 'OLQs are developed, not faked. Work on them daily through conscious effort in everything you do.' },
  { icon: Users,          text: 'Group activities demonstrate leadership and cooperation. Participate in team sports and events.' },
  { icon: GraduationCap, text: 'Current affairs and general knowledge are essential. Read newspapers daily and make notes.' },
  { icon: Shield,         text: 'Physical fitness shows discipline. Maintain regular exercise and a healthy lifestyle.' },
  { icon: BarChart2,      text: 'Self-awareness is key. Regular journaling and self-reflection help understand your strengths and weaknesses.' },
];

const faqs = [
  {
    q: "What should be the daily routine of an SSB aspirant?",
    a: "Start at 5:30 AM with physical exercise, followed by current affairs reading, psychology practice (TAT, WAT, SRT), group discussion practice, sports, self-reflection journaling, and lights out by 10 PM. Discipline and consistency are what assessors look for.",
  },
  {
    q: "How do you develop OLQs in daily life?",
    a: "OLQs are developed through daily conscious effort — leading group activities, taking initiative without being asked, journaling decisions, reading military biographies, participating in sports, and regular self-assessment against all 15 Officer-Like Qualities.",
  },
  {
    q: "How long does SSB preparation take?",
    a: "Serious SSB preparation takes 6–12 months of consistent effort. The first 3 months focus on self-assessment and group activities. Months 3–6 involve TAT, WAT, SRT writing practice. From month 6 onward, mock interviews and lecturette practice are key.",
  },
  {
    q: "Is physical fitness important for SSB?",
    a: "Yes. Physical fitness is assessed both directly in GTO outdoor tasks and indirectly through Stamina — one of the 15 OLQs. Candidates must sustain performance across a demanding 5-day schedule. Daily exercise is non-negotiable.",
  },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  .sp { min-height: 100vh; background: #fafaf8; color: #1a1a1a; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .sp > * { box-sizing: border-box; }

  /* ── BACK ── */
  .sp-back { padding: 24px 48px 0; }
  .sp-back-btn {
    background: none; border: none; cursor: pointer;
    font-size: 14px; color: #666; letter-spacing: 0.05em;
    font-family: 'Inter', system-ui, sans-serif; transition: color 0.2s;
  }
  .sp-back-btn:hover { color: #1a1a1a; }

  /* ── HERO ── */
  .sp-hero { padding: 100px 48px 0; }
  .sp-eyebrow {
    display: flex; gap: 8px; margin-bottom: 20px;
    font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    color: #888; font-family: system-ui, sans-serif;
  }
  .sp-h1 {
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 700; line-height: 1.2; letter-spacing: -0.02em;
    margin-bottom: 20px; text-align: center;
  }
  .sp-sub {
    font-size: 1.1rem; line-height: 1.8; color: #444;
    margin-bottom: 48px; font-style: italic; width: 100%;
  }

  /* ── MAIN ── */
  .sp-main { padding: 0 48px; }

  /* ── SECTIONS ── */
  .sp-section { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-h2 { font-size: 1.75rem; font-weight: 400; margin-bottom: 24px; letter-spacing: -0.01em; text-align: center; }
  .sp-p  { font-size: 1rem; line-height: 1.85; color: #333; margin-bottom: 18px; width: 100%; }

  /* ── SCHEDULE ── */
  .sp-schedule { background: #fff; padding: 48px; margin-bottom: 48px; border-left: 4px solid #C8A84B; }
  .sp-schedule h3 { font-size: 1.5rem; font-weight: 400; margin-bottom: 24px; letter-spacing: -0.01em; }
  .sp-schedule-item {
    display: grid; grid-template-columns: 100px 1fr; gap: 24px;
    padding: 20px 0; border-bottom: 1px solid #e8e6e1;
  }
  .sp-schedule-item:last-child { border-bottom: none; }
  .sp-schedule-time { font-size: 11px; font-weight: 700; color: #C8A84B; letter-spacing: 0.08em; padding-top: 2px; }
  .sp-schedule-act  { font-size: 1rem; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
  .sp-schedule-why  { font-size: 0.9rem; color: #666; line-height: 1.5; }

  /* ── HABITS ── */
  .sp-habits { margin-bottom: 48px; }
  .sp-habits h3 { font-size: 1.5rem; font-weight: 400; margin-bottom: 24px; letter-spacing: -0.01em; text-align: center; }
  .sp-habits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .sp-habit-card { background: white; padding: 28px; border: 1px solid #e8e6e1; transition: box-shadow 0.2s; }
  .sp-habit-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .sp-habit-icon {
    width: 48px; height: 48px;
    background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #C8A84B; margin-bottom: 16px;
  }
  .sp-habit-title { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
  .sp-habit-desc  { font-size: 0.9rem; color: #666; line-height: 1.6; }

  /* ── KEY TAKEAWAYS ── */
  .sp-takeaways { background: #1a1a1a; padding: 48px; margin-bottom: 48px; }
  .sp-takeaways h3 { font-size: 1.5rem; font-weight: 400; margin-bottom: 24px; letter-spacing: -0.01em; text-align: center; color: #C8A84B; }
  .sp-takeaways-list { list-style: none; padding: 0; }
  .sp-takeaways-list li {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.8);
  }
  .sp-takeaways-list li:last-child { border-bottom: none; }
  .sp-takeaways-list li svg { color: #C8A84B; flex-shrink: 0; margin-top: 2px; }

  /* ── FAQ ── */
  .sp-faq { padding: 72px 0 64px; border-bottom: 1px solid #e0ddd8; }
  .sp-faq-lbl { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 14px; }
  .sp-faq-list { margin-top: 36px; }
  .sp-faq-item { border-top: 1px solid #e8e6e1; }
  .sp-faq-q {
    width: 100%; background: none; border: none; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    padding: 22px 0; text-align: left;
    font-family: 'Inter', system-ui, sans-serif; font-size: 1rem; font-weight: 600; color: #1a1a1a;
    transition: color 0.2s;
  }
  .sp-faq-q:hover { color: #C8A84B; }
  .sp-faq-q svg { flex-shrink: 0; transition: transform 0.3s; margin-left: 16px; }
  .sp-faq-q.open svg { transform: rotate(45deg); }
  .sp-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
  .sp-faq-a.open { max-height: 300px; }
  .sp-faq-a p { font-size: 0.95rem; line-height: 1.85; color: #444; padding-bottom: 22px; }

  /* ── CTA ── */
  .sp-cta { padding: 48px 0; text-align: center; }
  .sp-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #C8A84B; color: #0D1710;
    padding: 16px 40px; font-weight: 700; text-decoration: none;
    letter-spacing: 0.05em; text-transform: uppercase;
    font-size: 14px; font-family: system-ui; transition: all 0.2s;
  }
  .sp-cta-btn:hover { background: #E2C26A; transform: translateY(-2px); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .sp-hero  { padding: 80px 24px 0; }
    .sp-main  { padding: 0 24px; }
    .sp-schedule { padding: 28px; }
    .sp-schedule-item { grid-template-columns: 1fr; gap: 8px; }
    .sp-habits-grid { grid-template-columns: 1fr; }
    .sp-takeaways { padding: 32px 24px; }
  }

  @media (max-width: 480px) {
    .sp-hero  { padding: 72px 16px 0; }
    .sp-main  { padding: 0 16px; text-align: justify; }
    .sp-h1    { font-size: 1.4rem; }
    .sp-sub   { font-size: 0.95rem; }
    .sp-schedule { padding: 20px 16px; }
    .sp-habit-card { padding: 20px; }
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SSBAspirantLifestylePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'SSB Aspirant Lifestyle | Daily Routine & OLQ Habits | Enlift Hub';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Complete SSB aspirant lifestyle guide: daily routine, essential habits and key principles to develop all 15 Officer-Like Qualities for Services Selection Board selection.');
    }
  }, []);

  return (
    <div className="sp">
      <style>{css}</style>

      {/* ── SEO Structured Data ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataFAQ) }} />

      <NavbarSection />

      {/* ── HERO ── */}
      <header className="sp-hero">
        <h1 className="sp-h1">SSB Aspirant Lifestyle: Daily Routine &amp; Habits to Clear Selection</h1>
        <p className="sp-sub">
          Your daily routine reflects your personality. The board doesn't just evaluate you during tests — they observe how you live your life.
        </p>
      </header>

      <main className="sp-main">

        {/* ── INTRODUCTION ── */}
        <section className="sp-section" aria-label="Why daily routine matters for SSB">
          <h2 className="sp-h2">Your Daily Routine Matters</h2>
          <p className="sp-p">
            OLQs don't appear on the day of SSB. They appear in how you live today. The candidate who leads his college team,
            takes responsibility without being asked, helps a stranger without thinking twice — that candidate walks into SSB
            already halfway there. The board's job is to confirm what you already are.
          </p>
        </section>

        {/* ── DAILY SCHEDULE ── */}
        <section className="sp-section" aria-label="SSB aspirant daily schedule">
          <div className="sp-schedule">
            <h3>A Productive Day — Hour by Hour</h3>
            <div>
              {dailySchedule.map((item, i) => (
                <div className="sp-schedule-item" key={i}>
                  <div className="sp-schedule-time">{item.time}</div>
                  <div>
                    <div className="sp-schedule-act">{item.act}</div>
                    <div className="sp-schedule-why">{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DAILY HABITS ── */}
        <section className="sp-section" aria-label="Essential habits for SSB aspirants">
          <div className="sp-habits">
            <h3>Essential Habits For SSB Aspirants</h3>
            <div className="sp-habits-grid">
              {habits.map((habit, i) => (
                <div className="sp-habit-card" key={i}>
                  <div className="sp-habit-icon"><habit.icon size={24} /></div>
                  <div className="sp-habit-title">{habit.title}</div>
                  <div className="sp-habit-desc">{habit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KEY TAKEAWAYS ── */}
        <section className="sp-section" aria-label="Key principles for SSB preparation">
          <div className="sp-takeaways">
            <h3>Key Principles To Remember</h3>
            <ul className="sp-takeaways-list">
              {keyTakeaways.map((item, i) => (
                <li key={i}>
                  <item.icon size={20} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ — interactive + Google rich snippet ── */}
        <section className="sp-faq" aria-label="SSB lifestyle frequently asked questions">
          <div className="sp-faq-lbl">Common Questions</div>
          <h2 className="sp-h2">Frequently Asked Questions</h2>
          <div className="sp-faq-list">
            {faqs.map((item, i) => (
              <div className="sp-faq-item" key={i}>
                <button
                  className={`sp-faq-q${openFaq === i ? ' open' : ''}`}
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <div className={`sp-faq-a${openFaq === i ? ' open' : ''}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="sp-cta">
          <Link to="/register" className="sp-cta-btn">
            Start Your Journey <ChevronRight size={18} />
          </Link>
        </div>

      </main>

      <FooterSection />
    </div>
  );
}