import { Link } from 'react-router';
import { ArrowRight, ChevronRight, Layers, Shield } from 'lucide-react';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { BrandLogo } from '@/components/BrandLogo';
import {
  BRAND_BYLINE,
  BRAND_DISPLAY_NAME,
  BRAND_NAME,
  BRAND_TAGLINE,
  ENLIFT_PRODUCT_NAME,
  ENLIFT_TAGLINE,
  ENLIFT_URL,
} from '@/lib/siteBranding';

const screeningModules = [
  { code: 'OIR', name: 'Officer Intelligence Rating (OIR)' },
  { code: 'PPDT', name: 'Picture Perception and Discussion Test (PPDT)' },
];

const psychologicalModules = [
  { code: 'TAT', name: 'Thematic Apperception Test (TAT)' },
  { code: 'WAT', name: 'Word Association Test (WAT)' },
  { code: 'SRT', name: 'Situation Reaction Test (SRT)' },
];

const css = `
  .ab-root {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #f4f6f9;
    color: #0f172a;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .ab-hero {
    padding: 104px 24px 48px;
    background: linear-gradient(165deg, #0f1f3d 0%, #1a3568 50%, #0f1f3d 100%);
    color: #fff;
    text-align: center;
  }
  .ab-hero-inner { max-width: 720px; margin: 0 auto; }
  .ab-kicker {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 12px;
  }
  .ab-h1 {
    font-size: clamp(1.75rem, 4vw, 2.35rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  .ab-lead {
    margin-top: 16px;
    font-size: 1.05rem;
    line-height: 1.65;
    color: rgba(255,255,255,0.82);
  }
  .ab-tagline {
    margin-top: 28px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #e2c26a;
  }
  .ab-main { flex: 1; padding: 48px 24px 64px; }
  .ab-inner { max-width: 960px; margin: 0 auto; }
  .ab-section { margin-bottom: 48px; }
  .ab-section-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0f1f3d;
    margin-bottom: 8px;
  }
  .ab-section-sub {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 24px;
    max-width: 640px;
  }
  .ab-prose {
    font-size: 1rem;
    line-height: 1.75;
    color: #334155;
  }
  .ab-prose p { margin-bottom: 1rem; }
  .ab-prose strong { color: #0f172a; font-weight: 600; }
  .ab-eco-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .ab-eco-grid { grid-template-columns: 1fr 1.15fr; align-items: stretch; }
  }
  .ab-card {
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    background: #fff;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(15,23,42,0.06);
    display: flex;
    flex-direction: column;
  }
  .ab-card--parent {
    border-color: #cbd5e1;
    background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  }
  .ab-card--product {
    border-color: #0f1f3d;
    box-shadow: 0 8px 28px rgba(15,31,61,0.12);
    position: relative;
  }
  .ab-card-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 12px;
  }
  .ab-card-badge--primary { color: #0f1f3d; }
  .ab-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }
  .ab-card h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }
  .ab-card-desc {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #64748b;
    flex: 1;
  }
  .ab-module-groups { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
  .ab-module-group-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 8px;
  }
  .ab-module-list { list-style: none; padding: 0; margin: 0; }
  .ab-module-list li {
    font-size: 0.88rem;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .ab-module-list li:last-child { border-bottom: none; }
  .ab-module-code {
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: #0f1f3d;
    background: #e8f0fc;
    padding: 3px 8px;
    border-radius: 4px;
  }
  .ab-cta {
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    background: #0f1f3d;
    color: #fff;
    transition: opacity 0.15s;
  }
  .ab-cta:hover { opacity: 0.92; }
  .ab-closing {
    border-radius: 14px;
    padding: 32px 28px;
    background: #0f1f3d;
    color: #fff;
    text-align: center;
  }
  .ab-closing h2 {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.35;
    margin-bottom: 12px;
  }
  .ab-closing p {
    font-size: 0.95rem;
    line-height: 1.65;
    color: rgba(255,255,255,0.78);
    max-width: 560px;
    margin: 0 auto 20px;
  }
  .ab-closing-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
  .ab-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 11px 18px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
  }
  .ab-btn-ghost:hover { background: rgba(255,255,255,0.08); }
  .ab-btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 11px 18px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 700;
    text-decoration: none;
    background: #c8a84b;
    color: #0d1710;
  }
  .ab-btn-gold:hover { background: #e2c26a; }
`;

export default function AboutPage() {
  return (
    <>
      <style>{css}</style>
      <div className="ab-root">
        <NavbarSection />

        <header className="ab-hero">
          <div className="ab-hero-inner">
            <div className="mb-6 flex justify-center">
              <div className="rounded-xl bg-white/95 px-5 py-3 shadow-lg">
                <BrandLogo variant="hero" loading="eager" fetchPriority="high" />
              </div>
            </div>
            <p className="ab-kicker">Who we are</p>
            <h1 className="ab-h1">Building better preparation for tomorrow&apos;s officers</h1>
            <p className="ab-lead">
              {BRAND_DISPLAY_NAME} is a defence-preparation platform. Our first dedicated product,{' '}
              <strong className="font-semibold text-white">{ENLIFT_PRODUCT_NAME}</strong>, focuses on SSB
              written and psychological-test practice.
            </p>
            <p className="ab-tagline">{BRAND_DISPLAY_NAME} — {BRAND_TAGLINE}</p>
          </div>
        </header>

        <main className="ab-main">
          <div className="ab-inner">
            <section className="ab-section" aria-labelledby="story-heading">
              <h2 id="story-heading" className="ab-section-title">Our purpose</h2>
              <div className="ab-prose">
                <p>
                  <strong>{BRAND_NAME}</strong> is built to support aspirants pursuing their dream of joining the
                  Indian Armed Forces. We bring structured practice, focused learning, and accessible preparation tools
                  together under one parent brand.
                </p>
                <p>
                  We believe every aspirant deserves an organized way to practise, identify weaknesses, and improve
                  through consistent effort — not scattered resources and guesswork.
                </p>
                <p>
                  Our first initiative, <strong>{ENLIFT_PRODUCT_NAME}</strong>, addresses the written and
                  psychological-test practice associated with Services Selection Board (SSB) preparation. From
                  intelligence-test drills to psychological assessments, it helps candidates become familiar with test
                  formats, practise under time constraints, and build consistency.
                </p>
                <p>
                  We are building {BRAND_NAME} with one purpose: to make defence-exam and officer-selection preparation
                  more structured, accessible, and purposeful.
                </p>
              </div>
            </section>

            <section className="ab-section" aria-labelledby="eco-heading">
              <h2 id="eco-heading" className="ab-section-title">Explore our platforms</h2>
              <p className="ab-section-sub">Discover the {BRAND_NAME} ecosystem — parent brand and dedicated products.</p>

              <div className="ab-eco-grid">
                <article className="ab-card ab-card--parent">
                  <span className="ab-card-badge">
                    <Layers size={14} aria-hidden />
                    Parent brand
                  </span>
                  <div className="ab-card-icon" style={{ background: '#e8f0fc' }}>
                    <Shield className="h-6 w-6 text-[#0f1f3d]" strokeWidth={1.75} />
                  </div>
                  <h3>{BRAND_NAME}</h3>
                  <p className="ab-card-desc">{BRAND_BYLINE}</p>
                  <p className="ab-card-desc">
                    Defence preparation ecosystem — structured tools for aspirants at different stages of their journey.
                    Products under {BRAND_NAME} share one mission: practise with purpose and prepare like an officer.
                  </p>
                  <Link to="/" className="ab-cta" style={{ background: '#334155' }}>
                    Visit {BRAND_NAME} home <ChevronRight size={16} />
                  </Link>
                </article>

                <article className="ab-card ab-card--product">
                  <span className="ab-card-badge ab-card-badge--primary">Product · Primary platform to explore</span>
                  <div className="ab-card-icon" style={{ background: '#0f1f3d' }}>
                    <Shield className="h-6 w-6 text-[#c8a84b]" strokeWidth={1.75} />
                  </div>
                  <h3>{ENLIFT_PRODUCT_NAME}</h3>
                  <p className="ab-card-desc">{ENLIFT_TAGLINE}</p>

                  <div className="ab-module-groups">
                    <div>
                      <p className="ab-module-group-title">SSB screening stage</p>
                      <ul className="ab-module-list">
                        {screeningModules.map((m) => (
                          <li key={m.code}>
                            <span className="ab-module-code">{m.code}</span>
                            <span>{m.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="ab-module-group-title">Psychological testing</p>
                      <ul className="ab-module-list">
                        {psychologicalModules.map((m) => (
                          <li key={m.code}>
                            <span className="ab-module-code">{m.code}</span>
                            <span>{m.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={ENLIFT_URL}
                    className="ab-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore Enlift <ArrowRight size={16} />
                  </a>
                </article>
              </div>
            </section>

            <section className="ab-closing" aria-labelledby="mission-heading">
              <h2 id="mission-heading">One mission. One platform. A future in uniform.</h2>
              <p>
                {BRAND_NAME} is building tools to support aspirants at different stages of their defence-preparation
                journey. Whether you are beginning or refining your performance, our aim is to help you practise with
                purpose, stay consistent, and move forward with confidence.
              </p>
              <div className="ab-closing-actions">
                <a href={ENLIFT_URL} className="ab-btn-gold" target="_blank" rel="noopener noreferrer">
                  Start with Enlift <ArrowRight size={16} />
                </a>
                <Link to="/mock-tests" className="ab-btn-ghost">
                  CDS · AFCAT mocks on this site · NDA coming soon
                </Link>
              </div>
              <p className="mt-6 text-sm font-medium text-white/90">Start with Enlift. Prepare with purpose.</p>
            </section>
          </div>
        </main>

        <FooterSection />
      </div>
    </>
  );
}
