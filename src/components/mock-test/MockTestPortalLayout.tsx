import type { CSSProperties, ReactNode } from 'react';
import { Bell, ChevronRight, HelpCircle, Home, Lock } from 'lucide-react';
import { ExamLogo } from '@/components/ExamLogo';
import { BRAND_NAME } from '@/lib/siteBranding';
import { SUPPORT_EMAIL } from '@/lib/siteSeo';
import { Link, useNavigate } from 'react-router';
export type PortalNavId = 'dashboard' | 'practice' | 'analysis' | 'syllabus';

type Crumb = { label: string; to?: string };

type Props = {
  pageTitle: string;
  conductingLabel?: string;
  breadcrumbs: Crumb[];
  primaryColor?: string;
  primaryDark?: string;
  titleLogoSrc?: string;
  titleLogoAlt?: string;
  headerExtra?: ReactNode;
  backFallback?: string;
  dashboardHref?: string;
  activeNav?: PortalNavId;
  onNavSelect?: (id: PortalNavId) => void;
  children: ReactNode;
};

const NAV_ITEMS: { id: PortalNavId; label: string; href?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'practice', label: 'Practice Tests' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'syllabus', label: 'Syllabus' },
];

export function MockTestPortalLayout({
  pageTitle,
  conductingLabel = 'UPSC pattern · Practice CBT',
  breadcrumbs,
  primaryColor = '#0b3d91',
  primaryDark = '#062a66',
  titleLogoSrc,
  titleLogoAlt = '',
  headerExtra,
  backFallback = '/dashboard',
  dashboardHref = '/dashboard',
  activeNav = 'practice',
  onNavSelect,
  children,
}: Props) {
  const navigate = useNavigate();

  const shellStyle = { ['--portal-primary' as string]: primaryColor } as CSSProperties;

  return (
    <div className="flex min-h-screen flex-col bg-[#e8ecf1] text-slate-900" style={shellStyle}>
      <header style={{ background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryDark} 100%)` }}>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(backFallback)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <span aria-hidden="true">←</span> Back to Hub
            </button>
            <div className="flex min-w-0 items-center gap-2.5 border-l border-white/20 pl-3 sm:gap-3 sm:pl-4">
              {titleLogoSrc ? (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 p-1"
                  aria-hidden={titleLogoAlt ? undefined : true}
                >
                  <ExamLogo
                    src={titleLogoSrc}
                    alt={titleLogoAlt}
                    size={32}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">
                  {BRAND_NAME} · CBT Portal
                </p>
                <p className="truncate text-sm font-bold text-white sm:text-base">{pageTitle}</p>
              </div>
            </div>
          </div>

          <nav className="order-3 flex w-full flex-wrap items-center gap-1 border-t border-white/15 pt-3 sm:order-2 sm:w-auto sm:border-0 sm:pt-0" aria-label="Portal sections">
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              if (item.href && item.id === 'dashboard') {
                return (
                  <Link
                    key={item.id}
                    to={dashboardHref}
                    className={`rounded px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                      active ? 'bg-white/15 text-white underline decoration-2 underline-offset-4' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavSelect?.(item.id)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                    active ? 'bg-white/15 text-white underline decoration-2 underline-offset-4' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:order-3">
            <button type="button" className="rounded p-2 text-white/80 hover:bg-white/10" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <button type="button" className="rounded p-2 text-white/80 hover:bg-white/10" aria-label="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
            {headerExtra}
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-center gap-1 text-xs text-slate-600">
            <Link
              to={dashboardHref}
              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-[var(--portal-primary)]"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="inline-flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="font-medium text-slate-600 hover:text-[var(--portal-primary)] hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600">
            <strong className="font-semibold text-slate-800">Notice:</strong> {conductingLabel}
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>

      <footer className="mt-auto border-t border-slate-300 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME} · National Defence Examination Portal. Utilitarian CBT Interface.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/terms" className="font-medium hover:text-[var(--portal-primary)]">Exam Guidelines</Link>
            <button
              type="button"
              className="font-medium hover:text-[var(--portal-primary)]"
              onClick={() => onNavSelect?.('syllabus')}
            >
              Marking Scheme
            </button>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium hover:text-[var(--portal-primary)]">
              Technical Support
            </a>
            <Link to="/privacy" className="font-medium hover:text-[var(--portal-primary)]">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PortalUnlockAllButton({
  unlocked,
  onClick,
  primaryColor,
}: {
  unlocked: boolean;
  onClick: () => void;
  primaryColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110 sm:text-sm"
      style={{ background: primaryColor }}
    >
      {unlocked ? (
        'Premium active'
      ) : (
        <>
          <Lock className="h-3.5 w-3.5" />
          Unlock all papers
        </>
      )}
    </button>
  );
}
