import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';
import { PracticeStepNav } from '@/components/practice/PracticeStepNav';
import { HeaderHistoryNav } from '@/components/practice/HeaderHistoryNav';

type Props = {
  module: PsychTestModuleConfig;
  step: 'instructions' | 'sets';
  pageTitle: string;
  headerExtra?: ReactNode;
  backFallback?: string;
  children: ReactNode;
};

export function SsbPracticeShell({
  module,
  step,
  pageTitle,
  headerExtra,
  backFallback = '/dashboard',
  children,
}: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-slate-50 text-slate-900">
      <header
        className="relative shrink-0"
        style={{ background: `linear-gradient(180deg, ${module.primary} 0%, ${module.primaryDark} 100%)` }}
      >
        <HeaderHistoryNav backFallback={backFallback} corner iconOnly />
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-3 py-2.5 pl-14 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:pl-16">
          <div className="min-w-0 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <span className="text-white/40"> · </span>
              {module.code}
            </p>
            <h1 className="truncate text-base font-bold sm:text-lg">
              {pageTitle}
            </h1>
          </div>
          {headerExtra}
        </div>
        <div className="border-t border-white/10 px-3 pb-1.5 sm:px-4">
          <PracticeStepNav module={module} current={step} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-4">
        {children}
      </main>
    </div>
  );
}
