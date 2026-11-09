import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_EXAM_THEMES, MOCK_LISTING_EXAMS } from '@/components/mock-test/examThemes';
import { LANDING_FAQS } from '@/content/landingFaqs';
import { ExamLogo } from '@/components/ExamLogo';
import { BrandLogo } from '@/components/BrandLogo';

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  LayoutGrid,
  Shield,
} from 'lucide-react';

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

function examEntryPath(route: string) {
  return route;
}

const steps = [
  { n: '01', title: 'Create account', text: 'Register with email — your attempts stay on your profile.' },
  { n: '02', title: 'Choose exam', text: 'Open CDS or AFCAT from your dashboard. NDA mock tests are coming soon.' },
  { n: '03', title: 'Read instructions', text: 'Duration, marking, and rules — same flow as a formal CBT.' },
  { n: '04', title: 'Attempt & review', text: 'Timed paper with palette; review answers after submit.' },
];

const features = [
  { icon: Clock, label: 'Exam-duration timer with auto-submit' },
  { icon: LayoutGrid, label: 'Question palette & navigation' },
  { icon: ClipboardList, label: 'Instruction sheet before each paper' },
  { icon: CheckCircle2, label: 'Score summary and attempt history' },
];

const css = `
  .lp-root {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #f4f6f9;
    color: #0f172a;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .lp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: url('/landing/hero-officers.jpg');
    background-size: cover;
    background-position: center 20%;
    opacity: 0.06;
  }
  .lp-root > * { position: relative; z-index: 1; }

  .lp-hero {
    position: relative;
    padding: 104px 24px 56px;
    background: linear-gradient(165deg, rgba(15,31,61,0.94) 0%, rgba(22,42,82,0.92) 45%, rgba(15,31,61,0.95) 100%);
    overflow: hidden;
  }
  .lp-hero-photo {
    position: absolute;
    inset: 0;
    background-image: url('/landing/hero-officers.jpg');
    background-size: cover;
    background-position: center 25%;
    opacity: 0.18;
    pointer-events: none;
  }
  .lp-hero-tint {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15,31,61,0.55) 0%, rgba(15,31,61,0.88) 70%);
    pointer-events: none;
  }
  .lp-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
  }
  .lp-hero-brand-wrap {
    display: inline-block;
    margin-bottom: 18px;
    padding: 10px 18px;
    border-radius: 12px;
    background: rgba(255,255,255,0.96);
    box-shadow: 0 8px 32px rgba(15,23,42,0.12);
  }
  .lp-h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    line-height: 1.15;
    color: #fff;
    letter-spacing: -0.02em;
  }
  .lp-lead {
    margin-top: 16px;
    font-size: 1.05rem;
    line-height: 1.65;
    color: rgba(255,255,255,0.72);
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }
  .lp-cta-row {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
  .lp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 8px;
    background: #c8a84b;
    color: #0f1f3d;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: filter 0.2s;
  }
  .lp-btn-primary:hover { filter: brightness(1.06); }
  .lp-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }
  .lp-btn-ghost:hover { border-color: #c8a84b; color: #c8a84b; }
  .lp-disclaimer {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(255,255,255,0.45);
  }
  .lp-hero-logos {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    gap: 20px 28px;
  }
  .lp-hero-logo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 72px;
  }
  .lp-hero-logo-wrap {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    backdrop-filter: blur(4px);
  }
  .lp-hero-logo-wrap img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
  }
  .lp-hero-logo-caption {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
  }

  .lp-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px;
    width: 100%;
  }
  .lp-section-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }
  .lp-section-sub {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 28px;
    max-width: 520px;
  }

  .lp-exam-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .lp-exam-card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #fff;
    padding: 20px;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .lp-exam-card:hover {
    box-shadow: 0 12px 32px rgba(15,31,61,0.1);
    transform: translateY(-2px);
  }
  .lp-exam-logo-wrap {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }
  .lp-exam-logo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .lp-exam-name { margin-top: 14px; font-size: 1.1rem; font-weight: 700; }
  .lp-exam-sub { margin-top: 4px; font-size: 13px; color: #64748b; line-height: 1.45; }
  .lp-exam-go {
    margin-top: 16px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .lp-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .lp-step {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 18px 16px;
  }
  .lp-step-n { font-size: 11px; font-weight: 800; color: #94a3b8; }
  .lp-step-t { margin-top: 8px; font-size: 14px; font-weight: 700; }
  .lp-step-d { margin-top: 6px; font-size: 13px; color: #64748b; line-height: 1.5; }

  .lp-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .lp-feat {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
  }
  .lp-feat-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #eff6ff;
    color: #0f1f3d;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lp-faq { display: flex; flex-direction: column; gap: 8px; }
  .lp-faq-item {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
  }
  .lp-faq-q {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }
  .lp-faq-a {
    padding: 0 18px 16px;
    font-size: 14px;
    line-height: 1.6;
    color: #64748b;
  }

  @media (max-width: 900px) {
    .lp-exam-grid { grid-template-columns: 1fr; }
    .lp-steps { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .lp-steps { grid-template-columns: 1fr; }
    .lp-features { grid-template-columns: 1fr; }
    .lp-hero { padding-top: 88px; }
  }
`;

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    trackEvent('landing_page_view');
  }, []);

  const primaryCta = isAuthenticated
    ? { to: '/dashboard', label: 'Open dashboard' }
    : { to: '/mock-tests', label: 'Browse mock tests' };

  return (
    <>
      <style>{css}</style>

      <div className="lp-root">
        <NavbarSection />

        <section className="lp-hero">
          <div className="lp-hero-photo" aria-hidden="true" />
          <div className="lp-hero-tint" aria-hidden="true" />
          <div className="lp-hero-inner">
            <div className="lp-hero-brand-wrap">
              <BrandLogo variant="hero" loading="eager" fetchPriority="high" />
            </div>
            <h1 className="lp-h1">CDS &amp; AFCAT mock tests</h1>
            <p className="lp-lead">
              Practice in a timed CBT-style environment — instructions, question palette, and review after you submit.
              Built for aspirants who want exam-day familiarity.
            </p>
            <div className="lp-cta-row">
              <Link
                to={primaryCta.to}
                className="lp-btn-primary"
                onClick={() => trackEvent('cta_hero_primary')}
              >
                {primaryCta.label} <ArrowRight size={16} />
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="lp-btn-ghost">Log in</Link>
              )}
            </div>
            <p className="lp-disclaimer">Independent platform · Not affiliated with UPSC, IAF, or the Indian Armed Forces</p>
            <div className="lp-hero-logos" aria-label="Examinations covered">
              {MOCK_LISTING_EXAMS.map((examId) => {
                const t = MOCK_EXAM_THEMES[examId];
                return (
                  <div key={examId} className="lp-hero-logo-item">
                    <div className="lp-hero-logo-wrap">
                      <ExamLogo src={t.logoSrc} alt={t.logoAlt} size={44} loading="lazy" />
                    </div>
                    <span className="lp-hero-logo-caption">{t.shortLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="exams-heading">
          <h2 id="exams-heading" className="lp-section-title">Choose your examination</h2>
          <p className="lp-section-sub">Open a hub to see practice papers and marking rules — sign in when you are ready to attempt.</p>
          <div className="lp-exam-grid">
            {MOCK_LISTING_EXAMS.map((examId) => {
              const theme = MOCK_EXAM_THEMES[examId];
              const href = examEntryPath(theme.route);
              return (
                <Link
                  key={examId}
                  to={href}
                  className="lp-exam-card"
                  onClick={() => trackEvent('landing_exam_card', { exam: examId })}
                >
                  <div className="lp-exam-logo-wrap">
                    <ExamLogo src={MOCK_EXAM_THEMES[examId].logoSrc} alt="" size={56} loading="lazy" />
                  </div>
                  <div className="lp-exam-name">{theme.title}</div>
                  <p className="lp-exam-sub">{theme.subtitle}</p>
                  <span className="lp-exam-go" style={{ color: theme.primary }}>
                    View papers <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="lp-section" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="lp-section-title">How it works</h2>
          <p className="lp-section-sub">Same path you follow inside the portal — from account to analysis.</p>
          <div className="lp-steps">
            {steps.map((s) => (
              <div key={s.n} className="lp-step">
                <div className="lp-step-n">{s.n}</div>
                <div className="lp-step-t">{s.title}</div>
                <p className="lp-step-d">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section" aria-labelledby="features-heading">
          <h2 id="features-heading" className="lp-section-title">What you get</h2>
          <p className="lp-section-sub">Focused on mock papers — no clutter, no unrelated modules.</p>
          <div className="lp-features">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="lp-feat">
                  <div className="lp-feat-icon"><Icon size={18} /></div>
                  {f.label}
                </div>
              );
            })}
          </div>
        </section>

        <section className="lp-section" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="lp-section-title">FAQ</h2>
          <p className="lp-section-sub">Quick answers before you register.</p>
          <div className="lp-faq">
            {LANDING_FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="lp-faq-item">
                  <button
                    type="button"
                    className="lp-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {item.q}
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-slate-400 transition-transform"
                      style={{ transform: open ? 'rotate(180deg)' : undefined }}
                    />
                  </button>
                  {open && <p className="lp-faq-a">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="lp-section" style={{ paddingTop: 24, paddingBottom: 56 }}>
          <div
            className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
            style={{ background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }}
          >
            <Shield className="mx-auto h-10 w-10 text-[#0f1f3d]" strokeWidth={1.5} />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Ready to attempt a mock?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {isAuthenticated
                ? 'Head to your dashboard and pick CDS or AFCAT. NDA mock tests are coming soon.'
                : 'Create an account in under a minute, then choose your first paper.'}
            </p>
            <Link
              to={primaryCta.to}
              className="lp-btn-primary mt-6 inline-flex"
              style={{ background: '#0f1f3d', color: '#fff' }}
            >
              {primaryCta.label} <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <FooterSection />
      </div>
    </>
  );
}
