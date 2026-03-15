import { Link } from "react-router";
import { NavbarSection } from "@/pages/navbar/NavbarSection";
import { FooterSection } from "@/pages/navbar/FooterSection";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    id: "lecturette",
    num: "01",
    title: "Lecturette",
    duration: "4–5 minutes",
    description: "A monologue on a randomly selected topic. Tests knowledge depth, structured thinking, and communication under time pressure.",
    path: "/ssb-lecturette",
    points: [
      "Speak for 4–5 minutes without interruption",
      "Structure clearly: Introduction → Body → Conclusion",
      "Use current affairs and real-world examples",
      "Maintain eye contact and confident delivery",
    ],
    tip: "Choose the topic you know best, not the one that sounds impressive. Use the 4W1H frame: What, Why, When, Where, How.",
  },
  {
    id: "interview",
    num: "02",
    title: "Personal Interview",
    duration: "45–90 minutes",
    description: "One-to-one with the Interviewing Officer. Every question originates from your PIQ — your application is the IO's entire briefing document.",
    path: "/ssb-interview",
    points: [
      "Be honest — the IO has read your PIQ in detail",
      "Know everything you've written, inside out",
      "Give specific examples, not generic answers",
      "Acknowledge what you don't know — don't bluff",
    ],
    tip: "Frame 'Tell me about yourself' as: Background → Education → Interests → Why Forces. Keep it under 2 minutes.",
  },
  {
    id: "gd",
    num: "03",
    title: "Group Discussion",
    duration: "20–30 minutes",
    description: "10–12 candidates discuss a topic without a moderator. Tests contribution quality, listening, and group influence — not volume.",
    path: "/ssb-group-discussion",
    points: [
      "Initiate only if you have a substantive point",
      "Listen and build on others' ideas",
      "Stay updated on national and international affairs",
      "Summarise when the discussion loses direction",
    ],
    tip: "The GTO watches how you facilitate others, not just how much you speak. Bringing clarity to a confused GD scores more than talking the most.",
  },
  {
    id: "gto",
    num: "04",
    title: "GTO Tasks",
    duration: "2 days",
    description: "Eight outdoor and group tasks over two days. Behaviour is the assessment — initiative, cooperation, consistency — not task completion.",
    path: "/ssb-gto",
    points: [
      "Contribute actively in every task",
      "Generate ideas; don't repeat rejected ones",
      "Help struggling group members visibly",
      "Show leadership without being authoritarian",
    ],
    tip: "Task success is secondary. A candidate who fails the obstacle but shows courage, effort and team support scores better than one who completes it silently.",
  },
  {
    id: "conference",
    num: "05",
    title: "Conference",
    duration: "2–5 minutes per candidate",
    description: "All three assessors compare five days of independent observations for the first time. A brief interaction — not a reversal opportunity.",
    path: "/ssb-conference",
    points: [
      "Walk in composed and with military bearing",
      "Answer questions briefly and honestly",
      "Don't argue or over-explain",
      "If you don't know, admit it",
    ],
    tip: "There is no preparation for the Conference. The work is already done. Composure on the final day is the only thing still in your control.",
  },
];

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sp {
    min-height: 100vh;
    background: #fff;
    color: #111;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* HERO */
  .sp-hero {
    padding: 80px 48px 40px;
    border-bottom: 2px solid #111;
  }
  .sp-hero-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 14px;
  }
  .sp-hero h1 {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin-bottom: 14px;
  }
  .sp-hero-desc {
    font-size: 0.9rem;
    line-height: 1.8;
    color: #555;
    max-width: 100%;
  }

  /* COLUMN LABELS */
  .sp-col-labels {
    display: grid;
    grid-template-columns: 280px 1fr 1fr;
    gap: 0 40px;
    padding: 12px 48px;
    border-bottom: 1px solid #eee;
    background: #fafafa;
  }
  .sp-col-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #bbb;
  }

  /* LIST */
  .sp-list { display: flex; flex-direction: column; }

  /* ROW */
  .sp-row {
    display: grid;
    grid-template-columns: 280px 1fr 1fr;
    gap: 0 40px;
    padding: 32px 48px;
    border-bottom: 1px solid #efefef;
    align-items: start;
    transition: background 0.1s;
  }
  .sp-row:hover { background: #fafafa; }

  /* LEFT COL — title + meta */
  .sp-row-left { padding-right: 8px; }
  .sp-row-top {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
  }
  .sp-row-num {
    font-size: 11px;
    font-weight: 700;
    color: #ddd;
  }
  .sp-row-duration {
    font-size: 11px;
    color: #bbb;
    font-weight: 500;
  }
  .sp-row-title {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .sp-row-desc {
    font-size: 13px;
    line-height: 1.7;
    color: #666;
    margin-bottom: 16px;
  }
  .sp-row-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    color: #111;
    text-decoration: none;
    letter-spacing: .06em;
    text-transform: uppercase;
    transition: gap 0.12s;
  }
  .sp-row-link:hover { gap: 9px; }

  /* MIDDLE COL — key points */
  .sp-row-points { display: flex; flex-direction: column; }
  .sp-row-point {
    font-size: 13px;
    color: #333;
    line-height: 1.55;
    padding: 8px 0;
    border-bottom: 1px solid #f2f2f2;
    display: grid;
    grid-template-columns: 14px 1fr;
    gap: 6px;
    align-items: baseline;
  }
  .sp-row-point:first-child { border-top: 1px solid #f2f2f2; }
  .sp-row-point-dash { color: #ccc; font-size: 11px; }

  /* RIGHT COL — tip */
  .sp-row-tip {
    border-left: 2px solid #111;
    padding: 10px 14px;
    background: #fafafa;
    height: fit-content;
  }
  .sp-row-tip-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 6px;
  }
  .sp-row-tip-text {
    font-size: 12px;
    line-height: 1.75;
    color: #444;
  }

  /* FOOTER NOTE */
  .sp-footer-note {
    padding: 18px 48px;
    border-top: 1px solid #eee;
    font-size: 12px;
    color: #aaa;
    line-height: 1.7;
  }

  /* RESPONSIVE — tablet */
  @media (max-width: 900px) {
    .sp-col-labels { display: none; }
    .sp-row {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 28px 24px;
    }
    .sp-hero { padding: 64px 24px 36px; }
    .sp-footer-note { padding: 16px 24px; }
  }

  /* RESPONSIVE — mobile */
  @media (max-width: 480px) {
    .sp-hero { padding: 56px 16px 28px; }
    .sp-row { padding: 24px 16px; gap: 20px; }
    .sp-footer-note { padding: 14px 16px; }
  }
`;

export default function SSBPreparationPage() {
  return (
    <>
      <style>{css}</style>
      <div className="sp">
        <NavbarSection />

        <header className="sp-hero">
          <div className="sp-hero-label">SSB Interview · Overview</div>
          <h1>SSB Preparation Guide</h1>
          <p className="sp-hero-desc">
            The SSB is a 5-day process that evaluates Officer Like Qualities across five stages.
            Each row below covers what is tested, what to focus on, and what assessors are watching.
          </p>
        </header>

        {/* Column headers — visible on desktop */}
        <div className="sp-col-labels">
          <span className="sp-col-label">Stage</span>
          <span className="sp-col-label">Key points</span>
          <span className="sp-col-label">Note</span>
        </div>

        <div className="sp-list">
          {sections.map((s) => (
            <div key={s.id} className="sp-row">

              {/* LEFT — title, desc, link */}
              <div className="sp-row-left">
                <div className="sp-row-top">
                  <span className="sp-row-num">{s.num}</span>
                  <span className="sp-row-duration">{s.duration}</span>
                </div>
                <div className="sp-row-title">{s.title}</div>
                <p className="sp-row-desc">{s.description}</p>
                <Link to={s.path} className="sp-row-link">
                  Full guide <ArrowRight size={12} />
                </Link>
              </div>

              {/* MIDDLE — key points */}
              <div className="sp-row-points">
                {s.points.map((pt, i) => (
                  <div key={i} className="sp-row-point">
                    <span className="sp-row-point-dash">—</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* RIGHT — tip */}
              <div className="sp-row-tip">
                <div className="sp-row-tip-label">Note</div>
                <p className="sp-row-tip-text">{s.tip}</p>
              </div>

            </div>
          ))}
        </div>

        <p className="sp-footer-note">
          Topics, questions and tasks vary across boards and over time. Use these as frameworks for building genuine knowledge — not lists to memorise.
        </p>

        <FooterSection />
      </div>
    </>
  );
}