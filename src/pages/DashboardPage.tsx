import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import {
  Image,
  MessageSquare,
  PenTool,
  BookOpen,
  ArrowRight,
  Star,
  Target,
  Zap,
  // Languages,
  // Headphones,
  // Radar,
} from 'lucide-react';

type DashModule = {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: typeof Image;
  path: string;
  accent: string;
  accentLight: string;
  stripe: string;
};

const psychModules: DashModule[] = [
  {
    id: 'ppdt',
    name: 'PPDT',
    title: 'Picture Perception',
    description: 'Story writing based on images',
    icon: Image,
    path: '/ppdt/sets',
    accent: '#7c3aed',
    accentLight: '#f5f3ff',
    stripe: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
  },
  {
    id: 'tat',
    name: 'TAT',
    title: 'Thematic Apperception',
    description: 'Imagination & attitude test',
    icon: BookOpen,
    path: '/tat/sets',
    accent: '#059669',
    accentLight: '#ecfdf5',
    stripe: 'linear-gradient(90deg, #059669, #34d399)',
  },
  {
    id: 'wat',
    name: 'WAT',
    title: 'Word Association',
    description: 'Spontaneous word responses',
    icon: PenTool,
    path: '/wat/sets',
    accent: '#ea580c',
    accentLight: '#fff7ed',
    stripe: 'linear-gradient(90deg, #ea580c, #fb923c)',
  },
  {
    id: 'srt',
    name: 'SRT',
    title: 'Situation Reaction',
    description: 'Practical judgment scenarios',
    icon: MessageSquare,
    path: '/srt/sets',
    accent: '#dc2626',
    accentLight: '#fef2f2',
    stripe: 'linear-gradient(90deg, #dc2626, #f87171)',
  },
  {
    id: 'opam',
    name: 'OPAM',
    title: 'Officer Potential',
    description: '120 OLQ statements (CSSS-style)',
    icon: Target,
    path: '/opam/sets',
    accent: '#8b5cf6',
    accentLight: '#f5f3ff',
    stripe: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
  },
];

/*
const aptitudeModules: DashModule[] = [
  {
    id: 'english',
    name: 'ENGLISH',
    title: 'Grammar & Vocabulary',
    description: 'Timed verbal aptitude test',
    icon: Languages,
    path: '/english/sets',
    accent: '#0891b2',
    accentLight: '#ecfeff',
    stripe: 'linear-gradient(90deg, #0891b2, #22d3ee)',
  },
  {
    id: 'listening',
    name: 'LISTEN',
    title: 'Listening Recall',
    description: 'Audio memory assessment',
    icon: Headphones,
    path: '/listening/sets',
    accent: '#d97706',
    accentLight: '#fffbeb',
    stripe: 'linear-gradient(90deg, #d97706, #fbbf24)',
  },
  {
    id: 'paper-folding',
    name: 'PAPER FOLD',
    title: 'Spatial Reasoning',
    description: 'Paper folding & hole punching',
    icon: Target,
    path: '/paper-folding/sets',
    accent: '#10b981',
    accentLight: '#ecfdf5',
    stripe: 'linear-gradient(90deg, #10b981, #34d399)',
  },
  {
    id: 'speed-recognition',
    name: 'SPEED',
    title: 'Speed Recognition',
    description: 'Fast object matching test',
    icon: Radar,
    path: '/speed-recognition/sets',
    accent: '#6366f1',
    accentLight: '#eef2ff',
    stripe: 'linear-gradient(90deg, #6366f1, #818cf8)',
  },
];
*/

function ModuleGrid({
  modules,
  baseDelay,
  gridClass = 'db-grid-5',
}: {
  modules: DashModule[];
  baseDelay: number;
  gridClass?: string;
}) {
  return (
    <div className={gridClass}>
      {modules.map((mod, i) => {
        const Icon = mod.icon;
        return (
          <Link
            key={mod.id}
            to={mod.path}
            className="db-mod-card"
            style={
              {
                '--mc-accent': mod.accent,
                '--mc-light': mod.accentLight,
                animationDelay: `${baseDelay + i * 0.06}s`,
              } as React.CSSProperties
            }
          >
            <div className="db-mod-stripe" style={{ background: mod.stripe }} />
            <div className="db-mod-body">
              <div className="db-mod-badge">{mod.name}</div>
              <div className="db-mod-icon-wrap">
                <Icon className="db-mod-icon" />
              </div>
              <div className="db-mod-title">{mod.title}</div>
              <div className="db-mod-desc">{mod.description}</div>
              <div className="db-mod-arrow">
                Start <ArrowRight size={11} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Candidate';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .db-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
        }

        .db-wrap * { box-sizing: border-box; }

        .db-main {
          width: 100%;
          margin: 0;
          padding: 88px 32px 48px;
        }

        @media (max-width: 1024px) {
          .db-main { padding: 88px 16px 48px; }
        }

        @media (max-width: 480px) {
          .db-main { padding: 72px 12px 32px; }
        }

        .db-hero {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 28px;
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 24px 28px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06);
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0f172a, #334155);
        }

        .db-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .db-hero-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #22c55e;
        }

        .db-hero-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.03em;
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .db-hero-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 0.78rem;
          color: #64748b;
        }

        .db-prime-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fef3c7;
          color: #92400e;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          margin-left: 10px;
          vertical-align: middle;
        }

        .db-section-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-section-icon {
          width: 26px; height: 26px;
          background: #0f172a;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .db-section-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0f172a;
        }

        .db-section-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #e2e8f0, transparent);
        }

        .db-grid-5 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        /*
        .db-grid-4 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        */

        @media (min-width: 640px) {
          .db-grid-5 { grid-template-columns: repeat(3, 1fr); }
          /* .db-grid-4 { grid-template-columns: repeat(2, 1fr); } */
        }

        /* @media (min-width: 900px) {
          .db-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        } */

        @media (min-width: 1024px) {
          .db-grid-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }

        .db-mod-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          display: block;
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-mod-card:hover {
          transform: translateY(-3px);
          border-color: var(--mc-accent);
          box-shadow: 0 8px 24px rgba(15,23,42,0.08);
        }

        .db-mod-card:hover .db-mod-icon-wrap { background: var(--mc-accent); }
        .db-mod-card:hover .db-mod-icon { color: #fff; }
        .db-mod-card:hover .db-mod-arrow { color: var(--mc-accent); }

        .db-mod-stripe { height: 3px; width: 100%; }
        .db-mod-body { padding: 14px 14px 12px; }

        .db-mod-badge {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--mc-accent);
          background: var(--mc-light);
          padding: 2px 8px;
          border-radius: 3px;
          margin-bottom: 10px;
        }

        .db-mod-icon-wrap {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: var(--mc-light);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
          transition: background 0.2s ease;
        }

        .db-mod-icon {
          width: 16px; height: 16px;
          color: var(--mc-accent);
          transition: color 0.2s ease;
        }

        .db-mod-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 3px;
        }

        .db-mod-desc {
          font-size: 0.67rem;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 10px;
        }

        .db-mod-arrow {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.67rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .db-fauji-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          overflow: hidden;
          margin: 8px 0 28px;
          padding: 22px 24px;
          border: 1px solid #1e293b;
          border-radius: 12px;
          background: linear-gradient(115deg, #0f172a, #1e293b);
          color: #fff;
          opacity: 0;
          animation: dbFadeUp 0.5s ease 0.24s forwards;
        }

        .db-fauji-banner::before {
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: linear-gradient(180deg, #fbbf24, #f97316);
          content: '';
        }

        .db-fauji-copy {
          position: relative;
        }

        .db-fauji-eyebrow {
          margin-bottom: 5px;
          color: #fbbf24;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .db-fauji-title {
          margin: 0 0 5px;
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(1.2rem, 3vw, 1.55rem);
          font-weight: 700;
          line-height: 1.15;
        }

        .db-fauji-description {
          margin: 0;
          color: #cbd5e1;
          font-size: 0.8rem;
          line-height: 1.55;
        }

        .db-fauji-cta {
          flex-shrink: 0;
          padding: 10px 14px;
          border: 1px solid rgba(251, 191, 36, 0.45);
          border-radius: 7px;
          background: rgba(251, 191, 36, 0.1);
          color: #fcd34d;
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
        }

        @media (max-width: 560px) {
          .db-fauji-banner {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
            padding: 18px;
          }
        }

        @keyframes dbFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="db-wrap">
        <NavbarSection />

        <main className="db-main">
          <div className="db-hero">
            <div className="db-hero-badge">
              <div className="db-hero-dot" />
              Practice dashboard
            </div>
            <div className="db-hero-name">
              Welcome, {firstName}
              {user?.isPremium && (
                <span className="db-prime-badge">
                  <Star fill="currentColor" size={12} />
                  Premium
                </span>
              )}
            </div>
            <div className="db-hero-meta">
              <span>{formattedDate}</span>
              <span>{formattedTime}</span>
            </div>
          </div>

          <div className="db-section-head" style={{ animationDelay: '0.12s' }}>
            <div className="db-section-icon">
              <Zap size={12} color="#fbbf24" />
            </div>
            <span className="db-section-title">Psychology practice</span>
            <div className="db-section-rule" />
          </div>
          <ModuleGrid modules={psychModules} baseDelay={0.15} />

          <section className="db-fauji-banner" aria-labelledby="db-fauji-title">
            <div className="db-fauji-copy">
              <div className="db-fauji-eyebrow">Fauji Grid by Enlift Hub</div>
              <h2 className="db-fauji-title" id="db-fauji-title">
                Looking for mock tests?
              </h2>
              <p className="db-fauji-description">
                CDS, NDA and AFCAT mock tests are coming to Fauji Grid. The link will be shared soon.
              </p>
            </div>
            <span className="db-fauji-cta">Coming soon</span>
          </section>

          {/*
          <div className="db-section-head" style={{ animationDelay: '0.2s' }}>
            <div className="db-section-icon">
              <Languages size={12} color="#fbbf24" />
            </div>
            <span className="db-section-title">CSS & aptitude tests</span>
            <div className="db-section-rule" />
          </div>
          <ModuleGrid modules={aptitudeModules} baseDelay={0.22} gridClass="db-grid-4" />
          */}

        </main>
      </div>
    </>
  );
}
