import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { WhatsAppFloatButton } from '@/components/WhatsAppFloatButton';
import { ArrowRight, ChevronRight, LayoutDashboard, BookOpen, ClipboardList } from 'lucide-react';

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

const quickLinks = [
  {
    title: 'Practice dashboard',
    blurb: 'Psychology, screening aptitude, timed sets.',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'SSB preparation',
    blurb: 'Guides for interview, GTO, and conference.',
    to: '/ssb-preparation',
    icon: BookOpen,
  },
  {
    title: 'Mock tests',
    blurb: 'NDA, CDS, and AFCAT CBT-style papers.',
    to: '/mock-tests',
    icon: ClipboardList,
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --gold: #C8A84B;
    --gold-light: #E2C26A;
    --ink: #0D1710;
    --cream: #F5F0E8;
  }

  .lp-progress { position: fixed; top: 0; left: 0; width: 100%; height: 3px; background: rgba(0,0,0,0.1); z-index: 9999; }
  .lp-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light)); transition: width 0.15s; }

  .lp-page { font-family: 'DM Sans', system-ui, sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; display: flex; flex-direction: column; }

  .lp-hero {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 96px 24px 40px;
    background: var(--ink);
    overflow: hidden;
    min-height: min(520px, 72vh);
  }
  .lp-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.35; }
  .lp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,23,16,0.95) 0%, rgba(13,23,16,0.55) 100%); }
  .lp-hero-inner { position: relative; z-index: 1; max-width: 640px; text-align: center; }

  .lp-kicker {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 14px; border: 1px solid var(--gold); margin-bottom: 20px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold);
  }
  .lp-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }

  .lp-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.8rem, 8vw, 4.25rem);
    line-height: 1;
    letter-spacing: 0.04em;
    color: #fff;
    margin-bottom: 16px;
  }
  .lp-lead {
    font-size: 1.05rem;
    line-height: 1.65;
    color: rgba(255,255,255,0.62);
    margin-bottom: 28px;
  }
  .lp-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  .lp-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--ink);
    font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 14px 28px; text-decoration: none; transition: background 0.2s;
  }
  .lp-btn-primary:hover { background: var(--gold-light); }
  .lp-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    color: #fff; border: 1px solid rgba(255,255,255,0.35);
    font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
    padding: 14px 24px; text-decoration: none; transition: border-color 0.2s, color 0.2s;
  }
  .lp-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

  .lp-links { padding: 32px 24px 24px; max-width: 960px; margin: 0 auto; width: 100%; }
  .lp-links-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .lp-link-card {
    display: flex; flex-direction: column; gap: 8px;
    padding: 20px 18px; background: #fff; border: 1px solid rgba(13,23,16,0.08);
    text-decoration: none; color: inherit; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lp-link-card:hover { border-color: rgba(200,168,75,0.45); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .lp-link-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .lp-link-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(200,168,75,0.12); color: #9a7b2a; }
  .lp-link-title { font-size: 15px; font-weight: 700; color: var(--ink); }
  .lp-link-blurb { font-size: 13px; line-height: 1.5; color: #5c6b5e; }
  .lp-link-go { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9a7b2a; display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; }

  @media (max-width: 768px) {
    .lp-links-grid { grid-template-columns: 1fr; }
    .lp-hero { min-height: auto; padding-top: 88px; padding-bottom: 32px; }
  }
`;

export default function LandingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setProgress(Math.min((window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    trackEvent('landing_page_view');
  }, []);

  return (
    <>
      <title>Enlift hub — SSB practice</title>
      <meta
        name="description"
        content="Timed SSB psychology practice, screening tests, and NDA/CDS/AFCAT mocks. Register and open your dashboard."
      />
      <style>{css}</style>

      <div className="lp-page">
        <div className="lp-progress">
          <div className="lp-bar" style={{ width: `${progress}%` }} />
        </div>

        <NavbarSection />

        <section className="lp-hero">
          <video className="lp-hero-video" autoPlay loop muted playsInline>
            <source src="/ssb-hero.mp4" type="video/mp4" />
          </video>
          <div className="lp-hero-overlay" />
          <div className="lp-hero-inner">
            <div className="lp-kicker">
              <span className="lp-kicker-dot" />
              Independent SSB practice
            </div>
            <h1 className="lp-title">Enlift hub</h1>
            <p className="lp-lead">
              Timed psychology and screening practice, plus exam mocks and written SSB guides — not coaching, not a selection guarantee.
            </p>
            <div className="lp-actions">
              <Link to="/register" className="lp-btn-primary" onClick={() => trackEvent('cta_hero_primary')}>
                Start practicing <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="lp-btn-ghost">
                Log in
              </Link>
            </div>
          </div>
        </section>

        <section className="lp-links" aria-label="Quick links">
          <div className="lp-links-grid">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className="lp-link-card">
                  <div className="lp-link-top">
                    <div className="lp-link-icon">
                      <Icon size={18} />
                    </div>
                    <ChevronRight size={18} color="#c4c9c5" />
                  </div>
                  <div className="lp-link-title">{item.title}</div>
                  <p className="lp-link-blurb">{item.blurb}</p>
                  <span className="lp-link-go">Open <ArrowRight size={12} /></span>
                </Link>
              );
            })}
          </div>
        </section>

        <WhatsAppFloatButton />
        <FooterSection />
      </div>
    </>
  );
}
