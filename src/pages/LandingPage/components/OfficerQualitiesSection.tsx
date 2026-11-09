import { Link } from 'react-router';

const olqs = [
  {
    factor: "Planning & Organising",
    items: [
      { name: "Effective Intelligence", desc: "Applying practical judgment to solve dynamic problems under operational pressure — not academic intelligence, but situational." },
      { name: "Reasoning Ability", desc: "Analysing complex situations logically, identifying patterns and drawing sound conclusions under time pressure." },
      { name: "Organising Ability", desc: "Coordinating resources, planning tasks systematically and delegating with clarity and efficiency." },
      { name: "Power of Expression", desc: "Conveying thoughts and decisions confidently — in group discussions, briefings and direct questioning." },
    ]
  },
  {
    factor: "Social Adjustment",
    items: [
      { name: "Social Adaptability", desc: "Adjusting seamlessly to different people, environments and conditions — especially under stress or unfamiliar situations." },
      { name: "Cooperation", desc: "Working within a team without ego — contributing, supporting and elevating those around you." },
      { name: "Sense of Responsibility", desc: "Owning tasks and outcomes fully — not deflecting blame when things go wrong, including in group failures." },
      { name: "Initiative", desc: "Acting without being told when a situation calls for it; pre-empting problems before they escalate." },
    ]
  },
  {
    factor: "Social Effectiveness",
    items: [
      { name: "Self Confidence", desc: "Projecting composure and belief in one's own judgement — without arrogance or aggressiveness." },
      { name: "Speed of Decision", desc: "Making clear, considered decisions under time pressure rather than freezing or deferring constantly." },
      { name: "Ability to Influence", desc: "Shaping team behaviour and direction through reasoning and calm conviction, not volume or dominance." },
      { name: "Liveliness", desc: "Maintaining energy and a positive disposition even under sustained fatigue or frustration." },
    ]
  },
  {
    factor: "Dynamism",
    items: [
      { name: "Determination", desc: "Persisting towards an objective despite setbacks — demonstrating resilience without rigidity." },
      { name: "Courage", desc: "Physical and moral bravery — including the willingness to dissent, take risks and own unpopular decisions." },
      { name: "Stamina", desc: "Sustaining physical and mental performance through a demanding five-day schedule without obvious deterioration." },
    ]
  }
];

const css = `
  .oq { padding: 80px 48px; background: #fafaf8; border-top: 1px solid #e0ddd8; }
  .oq-hdr { margin-bottom: 56px; }
  .oq-eyebrow { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui, sans-serif; margin-bottom: 16px; }
  .oq-h { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 400; letter-spacing: -0.02em; color: #1a1a1a; font-family: Georgia, serif; margin-bottom: 16px; }
  .oq-sub { font-size: 1rem; line-height: 1.8; color: #555; max-width: 600px; font-family: Georgia, serif; font-style: italic; }

  .oq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #e0ddd8; }
  .oq-factor { background: #fafaf8; padding: 36px 36px 28px; }
  .oq-factor-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #bbb; font-family: system-ui; margin-bottom: 4px; }
  .oq-factor-title { font-size: 0.95rem; font-weight: 600; color: #1a1a1a; font-family: system-ui, sans-serif; margin-bottom: 24px; }
  .oq-item { padding: 14px 0; border-top: 1px solid #eeebe6; }
  .oq-item:first-of-type { border-top: none; padding-top: 0; }
  .oq-item-name { font-size: 0.9rem; font-weight: 500; color: #1a1a1a; font-family: system-ui, sans-serif; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .oq-item-name::before { content: ''; display: block; width: 4px; height: 4px; border-radius: 50%; background: #1a1a1a; flex-shrink: 0; }
  .oq-item-desc { font-size: 0.82rem; line-height: 1.6; color: #666; font-family: Georgia, serif; padding-left: 12px; }

  .oq-note { margin-top: 1px; background: #f0ede8; padding: 20px 36px; font-size: 0.875rem; line-height: 1.75; color: #444; font-family: Georgia, serif; border-top: 1px solid #e0ddd8; }

  .oq-cta { margin-top: 40px; display: flex; align-items: center; gap: 8px; }
  .oq-cta a { font-size: 13px; letter-spacing: 0.06em; font-family: system-ui, sans-serif; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #1a1a1a; padding-bottom: 1px; }
  .oq-cta a:hover { color: #555; border-color: #555; }

  @media (max-width: 860px) {
    .oq { padding: 64px 24px; }
    .oq-grid { grid-template-columns: 1fr; }
    .oq-factor { padding: 28px 24px; }
    .oq-note { padding: 18px 24px; }
  }

  @media (max-width: 520px) {
    .oq { padding: 48px 16px; }
    .oq-factor { padding: 24px 16px; }
    .oq-note { padding: 16px 16px; }
    .oq-h { font-size: 1.5rem; }
  }
`;

export function OfficerQualitiesSection() {
  return (
    <section className="oq">
      <style>{css}</style>

      <div className="oq-hdr">
        <div className="oq-eyebrow">SSB Assessment Framework</div>
        <h2 className="oq-h">The 15 Officer-Like Qualities</h2>
        <p className="oq-sub">
          OLQs are never tested directly — they are inferred through behaviour, responses and interaction across five days. The board expects balanced, consistent, authentic expression of most — not perfection in all.
        </p>
      </div>

      <div className="oq-grid">
        {olqs.map((factor, fi) => (
          <div className="oq-factor" key={fi}>
            <div className="oq-factor-label">Factor {fi + 1}</div>
            <div className="oq-factor-title">{factor.factor}</div>
            {factor.items.map((item, ii) => (
              <div className="oq-item" key={ii}>
                <div className="oq-item-name">{item.name}</div>
                <div className="oq-item-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="oq-note">
        <strong>How OLQs are scored:</strong> Each of the three assessors — Psychologist, GTO and IO — independently rates candidates on this framework based on what they observe in their domain. Ratings are compared only at the final Conference. A candidate who displays strong qualities with one assessor but not the others is not considered consistent.
      </div>

      <div className="oq-cta">
        <Link to="/ssb-info">Learn more about OLQs and how they are assessed →</Link>
      </div>
    </section>
  );
}