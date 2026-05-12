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
  Clock,
  Award,
  Target,
  Users,
  GraduationCap,
  Shield,
  Star,
  ChevronRight,
  Zap,
  Languages,
  Headphones,
  Radar,
} from 'lucide-react';

const practiceModules = [
  {
    id: 'ppdt',
    name: 'PPDT',
    title: 'Picture Perception',
    description: 'Story writing based on images',
    icon: Image,
    path: '/ppdt/instructions',
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
    path: '/tat/instructions',
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
    path: '/wat/instructions',
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
    path: '/srt/instructions',
    accent: '#dc2626',
    accentLight: '#fef2f2',
    stripe: 'linear-gradient(90deg, #dc2626, #f87171)',
  },
  {
    id: 'ssbprep',
    name: 'SSB PREP',
    title: 'Interview & GTO',
    description: 'Lecturette, GD & full prep',
    icon: GraduationCap,
    path: '/ssb-preparation',
    accent: '#2563eb',
    accentLight: '#eff6ff',
    stripe: 'linear-gradient(90deg, #2563eb, #60a5fa)',
  },
  {
    id: 'english',
    name: 'ENGLISH',
    title: 'Grammar & Vocabulary',
    description: 'Timed verbal aptitude test',
    icon: Languages,
    path: '/english/instructions',
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
    path: '/listening/instructions',
    accent: '#f59e0b',
    accentLight: '#fffbeb',
    stripe: 'linear-gradient(90deg, #f59e0b, #22d3ee)',
  },
  {
    id: 'paper-folding',
    name: 'PAPER FOLDING',
    title: 'Spatial Reasoning',
    description: 'Paper folding & hole punching test',
    icon: Target,
    path: '/paper-folding/instructions',
    accent: '#10b981',
    accentLight: '#ecfdf5',
    stripe: 'linear-gradient(90deg, #10b981, #34d399)',
  },
  {
    id: 'speed-recognition',
    name: 'SPEED TEST',
    title: 'Speed Recognition',
    description: 'Fast object matching test',
    icon: Radar,
    path: '/speed-recognition/instructions',
    accent: '#f59e0b',
    accentLight: '#fffbeb',
    stripe: 'linear-gradient(90deg, #f59e0b, #fb923c)',
  },
];

const mockTestModules = [
  {
    id: 'cds',
    name: 'CDS',
    title: 'Combined Defence Services',
    description: 'Full mock test practice',
    icon: Shield,
    path: '/mock-test/cds',
    accent: '#b45309',
    accentLight: '#fffbeb',
    stripe: 'linear-gradient(90deg, #b45309, #fbbf24)',
  },
  {
    id: 'afcat',
    name: 'AFCAT',
    title: 'Air Force Common Admission',
    description: 'Air Force exam practice',
    icon: Star,
    path: '/mock-test/afcat',
    accent: '#0369a1',
    accentLight: '#f0f9ff',
    stripe: 'linear-gradient(90deg, #0369a1, #38bdf8)',
  },
  {
    id: 'nda',
    name: 'NDA',
    title: 'National Defence Academy',
    description: 'NDA entrance practice',
    icon: Award,
    path: '/mock-test/nda',
    accent: '#047857',
    accentLight: '#ecfdf5',
    stripe: 'linear-gradient(90deg, #047857, #4ade80)',
  },
];

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
          min-height: 100vh;
          background: #ffffff;
          color: #0f172a;
        }

        .db-wrap * { box-sizing: border-box; }

        .db-main {
          max-width: 80%;
          margin: 0 auto;
          padding: 80px 0 48px;
        }

        /* ── Hero ── */
        .db-hero {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 36px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%);
          padding: 28px 32px 24px;
          box-shadow: 0 4px 24px rgba(15,23,42,0.14);
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
        }

        .db-hero-dots {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 260px;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 18px 18px;
          pointer-events: none;
        }

        /* Right side decorative image area */
        .db-hero-visual {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 180px;
          height: 180px;
          opacity: 0.15;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-hero-visual::before {
          content: '';
          position: absolute;
          width: 140px;
          height: 140px;
          border: 2px solid #fbbf24;
          border-radius: 50%;
          animation: dbPulse 3s infinite;
        }

        .db-hero-visual::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          opacity: 0.3;
        }

        .db-hero-visual-icon {
          position: relative;
          z-index: 1;
          color: #fbbf24;
          font-size: 48px;
        }

        @keyframes dbHeroRotate {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }

        .db-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .db-hero-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fbbf24;
          animation: dbPulse 2s infinite;
        }

        .db-hero-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(1.7rem, 3.5vw, 2.3rem);
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .db-hero-name span { color: #fbbf24; }

        .db-hero-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }

        .db-hero-date {
          font-size: 0.77rem;
          color: rgba(248,250,252,0.45);
        }

        .db-hero-time {
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.82rem;
          color: rgba(248,250,252,0.3);
          letter-spacing: 0.1em;
          border-left: 1px solid rgba(248,250,252,0.12);
          padding-left: 14px;
        }

        .db-hero-tagline {
          font-size: 0.7rem;
          color: rgba(248,250,252,0.25);
          letter-spacing: 0.08em;
          font-style: italic;
        }

        .db-prime-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          margin-left: 12px;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
        }

        .db-prime-badge svg {
          width: 12px;
          height: 12px;
        }

        /* ── Section Header ── */
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
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #0f172a;
        }

        .db-section-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #e2e8f0, transparent);
        }

        /* ── Grids ── */
        .db-grid-5 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }

        @media (min-width: 640px) {
          .db-grid-5 { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 1024px) {
          .db-grid-5 { grid-template-columns: repeat(5, 1fr); }
        }

        .db-grid-3 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }

        @media (min-width: 640px) {
          .db-grid-3 { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Module Card ── */
        .db-mod-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          text-decoration: none;
          display: block;
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-mod-card:hover {
          transform: translateY(-4px);
          border-color: var(--mc-accent);
          box-shadow: 0 10px 32px rgba(15,23,42,0.1), 0 0 0 1px var(--mc-accent);
        }

        .db-mod-card:hover .db-mod-icon-wrap {
          background: var(--mc-accent);
        }

        .db-mod-card:hover .db-mod-icon { color: #fff; }

        .db-mod-card:hover .db-mod-arrow {
          color: var(--mc-accent);
          transform: translateX(3px);
        }

        .db-mod-stripe { height: 3px; width: 100%; }

        .db-mod-body { padding: 14px 14px 12px; }

        .db-mod-badge {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.16em;
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
          transition: background 0.22s ease;
        }

        .db-mod-icon {
          width: 16px; height: 16px;
          color: var(--mc-accent);
          transition: color 0.22s ease;
        }

        .db-mod-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 3px;
          line-height: 1.35;
        }

        .db-mod-desc {
          font-size: 0.67rem;
          color: #94a3b8;
          line-height: 1.45;
          margin-bottom: 10px;
        }

        .db-mod-arrow {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.67rem;
          font-weight: 600;
          color: #cbd5e1;
          transition: color 0.22s ease, transform 0.22s ease;
        }

        /* ── Feature Cards ── */
        .db-feat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        @media (min-width: 640px) {
          .db-feat-grid { grid-template-columns: 1fr 1fr; }
        }

        .db-feat-card {
          position: relative;
          border-radius: 14px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          padding: 18px 16px;
          cursor: pointer;
          transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 14px;
          overflow: hidden;
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-feat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--fc-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s ease;
        }

        .db-feat-card:hover::before { transform: scaleX(1); }

        .db-feat-card:hover {
          border-color: var(--fc-accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.08);
        }

        .db-feat-card:hover .db-feat-chevron {
          transform: translateX(4px);
          color: var(--fc-accent);
        }

        .db-feat-icon-wrap {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: var(--fc-light);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .db-feat-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fc-accent);
          margin-bottom: 3px;
        }

        .db-feat-title {
          font-size: 0.93rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 3px;
        }

        .db-feat-desc {
          font-size: 0.71rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        .db-feat-chevron {
          margin-left: auto;
          color: #e2e8f0;
          flex-shrink: 0;
          transition: transform 0.2s, color 0.2s;
        }

        /* ── Stats Bar ── */
        .db-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
          padding: 18px 20px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          opacity: 0;
          animation: dbFadeUp 0.5s ease forwards;
        }

        .db-stat {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 500;
        }

        .db-stat svg { color: #f59e0b; }

        /* ── Animations ── */
        @keyframes dbFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes dbPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
      `}</style>

      <div className="db-wrap">

        {/* ✅ NavbarSection — untouched */}
        <NavbarSection />

        <main className="db-main">

          {/* Hero */}
          <div className="db-hero">
            <div className="db-hero-dots" />
            <div className="db-hero-visual">
              <Shield className="db-hero-visual-icon" />
            </div>
            <div className="db-hero-badge">
              <div className="db-hero-dot" />
              Active Session
            </div>
            <div className="db-hero-name">
              Welcome, <span>{firstName}!</span>
              {user?.isPremium && (
                <span className="db-prime-badge">
                  <Star fill="currentColor" />
                  Prime Member
                </span>
              )}
            </div>
            <div className="db-hero-meta">
              <span className="db-hero-date">{formattedDate}</span>
              <span className="db-hero-time">{formattedTime}</span>
            </div>
            <div className="db-hero-tagline">Train the Mind. Clear the Board.</div>
          </div>

          {/* Let's Crack SSB */}
          <div className="db-section-head" style={{ animationDelay: '0.1s' }}>
            <div className="db-section-icon"><Zap size={12} color="#fbbf24" /></div>
            <span className="db-section-title">Let's Crack SSB</span>
            <div className="db-section-rule" />
          </div>

          <div className="db-grid-5">
            {practiceModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="db-mod-card"
                  style={{
                    '--mc-accent': mod.accent,
                    '--mc-light': mod.accentLight,
                    animationDelay: `${0.15 + i * 0.07}s`,
                  } as React.CSSProperties}
                >
                  <div className="db-mod-stripe" style={{ background: mod.stripe }} />
                  <div className="db-mod-body">
                    <div className="db-mod-badge">{mod.name}</div>
                    <div className="db-mod-icon-wrap">
                      <Icon className="db-mod-icon" />
                    </div>
                    <div className="db-mod-title">{mod.title}</div>
                    <div className="db-mod-desc">{mod.description}</div>
                    <div className="db-mod-arrow">Start <ArrowRight size={11} /></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mock Tests */}
          <div className="db-section-head" style={{ animationDelay: '0.25s' }}>
            <div className="db-section-icon"><Shield size={12} color="#fbbf24" /></div>
            <span className="db-section-title">Mock Tests</span>
            <div className="db-section-rule" />
          </div>

          <div className="db-grid-3">
            {mockTestModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="db-mod-card"
                  style={{
                    '--mc-accent': mod.accent,
                    '--mc-light': mod.accentLight,
                    animationDelay: `${0.3 + i * 0.07}s`,
                  } as React.CSSProperties}
                >
                  <div className="db-mod-stripe" style={{ background: mod.stripe }} />
                  <div className="db-mod-body">
                    <div className="db-mod-badge">{mod.name}</div>
                    <div className="db-mod-icon-wrap">
                      <Icon className="db-mod-icon" />
                    </div>
                    <div className="db-mod-title">{mod.title}</div>
                    <div className="db-mod-desc">{mod.description}</div>
                    <div className="db-mod-arrow">Start <ArrowRight size={11} /></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Feature Banners */}
          <div className="db-feat-grid" style={{ animationDelay: '0.45s' }}>
            <Link
              to="/mentorship"
              className="db-feat-card"
              style={{ '--fc-accent': '#059669', '--fc-light': '#ecfdf5', animationDelay: '0.55s' } as React.CSSProperties}
            >
              <div className="db-feat-icon-wrap"><Users size={21} color="#059669" /></div>
              <div>
                <div className="db-feat-label">Mentorship</div>
                <div className="db-feat-title">One-to-One SSB Session</div>
                <div className="db-feat-desc">Personal guidance, OLQ feedback & officer-level evaluation.</div>
              </div>
              <ChevronRight size={18} className="db-feat-chevron" />
            </Link>

            <Link
              to="/ssb-preparation"
              className="db-feat-card"
              style={{ '--fc-accent': '#7c3aed', '--fc-light': '#f5f3ff', animationDelay: '0.62s' } as React.CSSProperties}
            >
              <div className="db-feat-icon-wrap"><BookOpen size={21} color="#7c3aed" /></div>
              <div>
                <div className="db-feat-label">Complete SSB</div>
                <div className="db-feat-title">Other SSB Preparation</div>
                <div className="db-feat-desc">Interview, GTO, Conference & full SSB process explained.</div>
              </div>
              <ChevronRight size={18} className="db-feat-chevron" />
            </Link>
          </div>

          {/* Stats Footer */}
          <div className="db-stats" style={{ animationDelay: '0.9s' }}>
            {[
              { icon: Award, label: 'Unlimited Practice' },
              { icon: Clock, label: 'Real SSB Timing' },
              { icon: Target, label: 'OLQ Focused' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="db-stat">
                <Icon size={14} />
                {label}
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  );
}
