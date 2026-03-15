import { Link } from "react-router";
import { NavbarSection } from "@/pages/navbar/NavbarSection";
import { FooterSection } from "@/pages/navbar/FooterSection";
import { ChevronRight } from "lucide-react";

const olqs = [
  { num: "01", name: "Effective Intelligence",    cat: "Planning & Organising", desc: "Understanding situations quickly and finding practical solutions under pressure." },
  { num: "02", name: "Reasoning Ability",          cat: "Planning & Organising", desc: "Logical thinking and deriving sound conclusions from available facts." },
  { num: "03", name: "Social Adaptability",        cat: "Social",                desc: "Adjusting to different environments and working well with diverse people." },
  { num: "04", name: "Initiative",                 cat: "Driving Force",         desc: "Taking action without waiting for instructions and accepting challenges." },
  { num: "05", name: "Leadership",                 cat: "Driving Force",         desc: "Guiding and motivating a group towards a common objective." },
  { num: "06", name: "Emotional Stability",        cat: "Emotional",             desc: "Remaining calm and composed in stressful or difficult situations." },
  { num: "07", name: "Organising Ability",         cat: "Planning & Organising", desc: "Planning tasks effectively and executing them with proper coordination." },
  { num: "08", name: "Power of Expression",        cat: "Social",                desc: "Communicating thoughts clearly and effectively in speech and writing." },
  { num: "09", name: "Self Confidence",            cat: "Emotional",             desc: "Belief in your ability to take decisions and handle situations." },
  { num: "10", name: "Speed of Decision",          cat: "Planning & Organising", desc: "Making timely, considered decisions after quick analysis of information." },
  { num: "11", name: "Ability to Influence",       cat: "Driving Force",         desc: "Impacting others positively through persuasion, example and personality." },
  { num: "12", name: "Cooperation",                cat: "Social",                desc: "Working together with others and contributing to shared goals." },
  { num: "13", name: "Sense of Responsibility",    cat: "Emotional",             desc: "Accepting duties fully and being accountable for your actions and decisions." },
  { num: "14", name: "Proactive Approach",         cat: "Driving Force",         desc: "Anticipating problems and taking action before being told." },
  { num: "15", name: "Physical Fitness",           cat: "Physical",              desc: "Maintaining the fitness and discipline required for military life." },
];

const catColor: Record<string, string> = {
  "Planning & Organising": "#1d4ed8",
  "Social":                "#15803d",
  "Driving Force":         "#b45309",
  "Emotional":             "#7c3aed",
  "Physical":              "#be123c",
};

const assessment = [
  { title: "Psychological Tests", text: "TAT, WAT and SRT reveal your thought patterns and personality traits before you speak a word." },
  { title: "Group Tasks (GTO)",   text: "Leadership, cooperation and initiative are observed live during PGT, GPE, GD and Command Task." },
  { title: "Personal Interview",  text: "The IO evaluates maturity, self-awareness, depth of knowledge and consistency with your PIQ." },
  { title: "Conference",          text: "All three assessors compare independent notes from five days. Consistency is what stands out." },
];

const develop = [
  { title: "Self-reflection",    text: "Regularly and honestly evaluate your strengths and weaknesses — before the board does it for you." },
  { title: "Take initiative",    text: "Lead projects, take on responsibilities and solve problems in your daily environment." },
  { title: "Team activities",    text: "Play team sports, work on group projects. OLQs are built by doing, not reading." },
  { title: "Read widely",        text: "Defence news, military biographies, current affairs. Depth of knowledge shows across all stages." },
  { title: "Physical fitness",   text: "A daily PT routine demonstrates the discipline that underpins every other OLQ." },
  { title: "Physical fitness",   text: "A daily PT routine demonstrates the discipline that underpins every other OLQ." },
];

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #111;
    background: #fff;
    line-height: 1.5;
  }

  /* ── HERO ── */
  .hero {
    padding: 100px 48px 64px;
    border-bottom: 1px solid #e8e8e8;
  }
  .hero-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 14px;
  }
  .hero h1 {
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 16px;
  }
  .hero p {
    font-size: 1rem;
    color: #555;
    line-height: 1.75;
  }

  /* ── OLQ GRID ── */
  .olq-section { padding: 48px 48px 56px; }
  .olq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1px;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
  }
  .olq-card {
    background: #fff;
    padding: 22px 20px 20px;
    transition: background 0.15s;
    cursor: default;
  }
  .olq-card:hover { background: #fafafa; }
  .olq-card-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .olq-num {
    font-size: 11px;
    font-weight: 700;
    color: #bbb;
  }
  .olq-cat-badge {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 20px;
  }
  .olq-card h3 {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .olq-card p {
    font-size: 13px;
    color: #666;
    line-height: 1.65;
  }

  /* ── DIVIDER ── */
  .divider { border: none; border-top: 1px solid #e8e8e8; margin: 0 48px; }

  /* ── SECTION ── */
  .section { padding: 56px 48px; }
  .section-header { margin-bottom: 32px; }
  .section-title {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.015em;
    margin-bottom: 8px;
  }
  .section-desc {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.7;
  }

  /* ── FEATURE GRID ── */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
  }
  .feature-card {
    background: #fff;
    padding: 22px 20px;
  }
  .feature-card h4 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #111;
  }
  .feature-card p {
    font-size: 13px;
    color: #666;
    line-height: 1.65;
  }

  .feature-grid-develop {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
  }

  /* ── QUOTE ── */
  .quote-block {
    padding: 64px 48px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
  .quote-text {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 600;
    color: #111;
    line-height: 1.5;
    letter-spacing: -0.01em;
  }
  .quote-text::before { content: '"'; }
  .quote-text::after  { content: '"'; }
  .quote-attr {
    margin-top: 12px;
    font-size: 12px;
    color: #aaa;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  /* ── CTA ── */
  .cta {
    padding: 72px 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .cta h2 {
    font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    font-weight: 800;
    letter-spacing: -0.015em;
    line-height: 1.25;
  }
  .cta p { font-size: 0.9rem; color: #666; }
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #111;
    color: #fff;
    padding: 12px 22px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .02em;
    transition: background 0.15s;
  }
  .cta-btn:hover { background: #333; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .hero        { padding: 80px 24px 48px; }
    .olq-section { padding: 36px 24px 44px; }
    .section     { padding: 44px 24px; }
    .divider     { margin: 0 24px; }
    .quote-block { padding: 48px 24px; }
    .cta         { padding: 56px 24px; }
  }

  @media (max-width: 480px) {
    .hero        { padding: 72px 16px 40px; }
    .hero p     { text-align: justify; }
    .olq-section { padding: 28px 16px 36px; }
    .section     { padding: 36px 16px; }
    .divider     { margin: 0 16px; }
    .quote-block { padding: 40px 16px; }
    .cta         { padding: 44px 16px; }
  }
`;

export default function OLQPage() {
  return (
    <div className="page">
      <style>{styles}</style>
      <NavbarSection />

      {/* HERO */}
      <section className="hero">
        <div className="hero-label">SSB Assessment</div>
        <h1>Officer Like Qualities</h1>
        <p>
          The 15 qualities defined by the Defence Institute of Psychological Research
          that determine whether a candidate has the personality required to lead
          in the Armed Forces.
        </p>
      </section>

      {/* OLQ GRID */}
      <div className="olq-section">
        <div className="olq-grid">
          {olqs.map(o => {
            const color = catColor[o.cat] || "#555";
            return (
              <div key={o.num} className="olq-card">
                <div className="olq-card-top">
                  <span className="olq-num">{o.num}</span>
                  <span
                    className="olq-cat-badge"
                    style={{ background: color + "12", color }}
                  >
                    {o.cat}
                  </span>
                </div>
                <h3>{o.name}</h3>
                <p>{o.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="divider" />

      {/* HOW ASSESSED */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">How SSB Assesses OLQs</h2>
          <p className="section-desc">
            OLQs are never tested directly. They are inferred from behaviour across five days
            by three independent assessors who never compare notes until the Conference.
          </p>
        </div>
        <div className="feature-grid">
          {assessment.map((a, i) => (
            <div key={i} className="feature-card">
              <h4>{a.title}</h4>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* HOW TO DEVELOP */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">How to Develop OLQs</h2>
          <p className="section-desc">
            OLQs cannot be memorised or faked. They develop through consistent effort
            in daily life — long before you walk into the selection centre.
          </p>
        </div>
        <div className="feature-grid-develop">
          {develop.map((d, i) => (
            <div key={i} className="feature-card">
              <h4>{d.title}</h4>
              <p>{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote-block">
        <p className="quote-text">
          OLQs don't appear on the day of SSB. They appear in how you live today.
        </p>
        <p className="quote-attr">Defence Institute of Psychological Research</p>
      </div>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to develop your Officer Like Qualities?</h2>
        <p>Start your preparation journey with Enlift Hub.</p>
        <Link to="/register" className="cta-btn">
          Start Your Journey <ChevronRight size={15} />
        </Link>
      </section>

      <FooterSection />
    </div>
  );
}