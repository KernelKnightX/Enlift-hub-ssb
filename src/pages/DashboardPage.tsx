import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Shield,
  Star,
  Award,
} from 'lucide-react';
import {
  AVAILABLE_MOCK_EXAMS,
  DASHBOARD_MOCK_EXAMS,
  MOCK_EXAM_THEMES,
  type MockExamId,
} from '@/components/mock-test/examThemes';

const EXAM_ICONS: Record<MockExamId, LucideIcon> = {
  CDS: Shield,
  AFCAT: Star,
  NDA: Award,
};

const mockTestModules = DASHBOARD_MOCK_EXAMS.map((examId) => {
  const theme = MOCK_EXAM_THEMES[examId];
  return {
    id: examId.toLowerCase(),
    name: examId,
    title: theme.subtitle,
    description: 'Formal CBT mock papers',
    icon: EXAM_ICONS[examId],
    path: theme.route,
    accent: theme.primary,
    accentLight: theme.accentSoft,
    stripe: theme.stripe,
    isAvailable: AVAILABLE_MOCK_EXAMS.includes(examId),
  };
});

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
        .db-wrap {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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

        .db-grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }

        @media (min-width: 640px) {
          .db-grid-3 { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 1024px) {
          .db-grid-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            max-width: none;
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
        .db-mod-card-disabled { cursor: not-allowed; opacity: 0.72; }
        .db-mod-card-disabled:hover {
          transform: none;
          border-color: #e2e8f0;
          box-shadow: none;
        }

        .db-mod-stripe { height: 3px; width: 100%; }
        .db-mod-body { padding: 14px 14px 12px; }

        .db-mod-badge {
          display: inline-block;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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

        .db-mock-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #0369a1;
          text-decoration: none;
          margin-bottom: 12px;
        }

        .db-mock-link:hover { text-decoration: underline; }

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
              Mock test dashboard
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
              <Shield size={12} color="#fbbf24" />
            </div>
            <span className="db-section-title">Mock exams (CBT)</span>
            <div className="db-section-rule" />
          </div>
          <div className="db-grid-3">
            {mockTestModules.map((mod, i) => {
              const Icon = mod.icon;
              const card = (
                <>
                  <div className="db-mod-stripe" style={{ background: mod.stripe }} />
                  <div className="db-mod-body">
                    <div className="db-mod-badge">{mod.name}</div>
                    <div className="db-mod-icon-wrap">
                      <Icon className="db-mod-icon" />
                    </div>
                    <div className="db-mod-title">{mod.title}</div>
                    <div className="db-mod-desc">{mod.description}</div>
                    <div className="db-mod-arrow">
                      {mod.isAvailable ? <>Start <ArrowRight size={11} /></> : 'Coming soon'}
                    </div>
                  </div>
                </>
              );
              const cardStyle = {
                '--mc-accent': mod.accent,
                '--mc-light': mod.accentLight,
                animationDelay: `${0.3 + i * 0.06}s`,
              } as React.CSSProperties;

              return mod.isAvailable ? (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="db-mod-card"
                  style={cardStyle}
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={mod.id}
                  className="db-mod-card db-mod-card-disabled"
                  style={cardStyle}
                  aria-label={`${mod.name} mock tests coming soon`}
                  role="note"
                >
                  {card}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
