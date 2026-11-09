import type { ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router';
import { HeaderHistoryNav } from '@/components/practice/HeaderHistoryNav';

type Crumb = { label: string; to?: string };

type Props = {
  portalTitle?: string;
  pageTitle: string;
  conductingLabel?: string;
  breadcrumbs: Crumb[];
  primaryColor?: string;
  primaryDark?: string;
  headerExtra?: ReactNode;
  backFallback?: string;
  children: ReactNode;
  footerNote?: string;
};

export function MockTestPortalLayout({
  portalTitle = 'Enlift · Computer Based Test Portal',
  pageTitle,
  conductingLabel = 'Practice environment · Not an official UPSC / IAF portal',
  breadcrumbs,
  primaryColor = '#0b3d91',
  primaryDark = '#062a66',
  headerExtra,
  backFallback = '/mock-tests',
  children,
  footerNote = 'This is a practice portal for defence exam preparation. Interface patterns are inspired by formal CBT systems for familiarity only.',
}: Props) {
  return (
    <div className="min-h-screen bg-[#eef2f7] text-slate-900">
      <header style={{ background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryDark} 100%)` }} className="relative">
        <HeaderHistoryNav backFallback={backFallback} corner />
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 pl-[4.5rem] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pl-[5.5rem]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-xs">{portalTitle}</p>
            <h1 className="text-lg font-bold text-white sm:text-xl">{pageTitle}</h1>
          </div>
          {headerExtra}
        </div>
        <div className="border-t border-white/15 bg-black/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-2 text-xs text-white/85 sm:px-6">
            <Link to="/dashboard" className="inline-flex items-center gap-1 hover:text-white">
              <Home className="h-3.5 w-3.5" /> Dashboard
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="inline-flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-white/50" />
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="border-b border-slate-300 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-2 text-xs text-slate-600 sm:px-6">
          <strong className="font-semibold text-slate-800">Notice:</strong> {conductingLabel}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">{children}</main>

      <footer className="border-t border-slate-300 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-[11px] leading-relaxed text-slate-500 sm:px-6">
          {footerNote}
        </div>
      </footer>
    </div>
  );
}
