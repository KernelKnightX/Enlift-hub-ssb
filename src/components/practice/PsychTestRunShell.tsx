import type { ReactNode } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HeaderHistoryNav } from '@/components/practice/HeaderHistoryNav';
import { getPsychModule, type PsychTestModuleId } from '@/data/psychTestModules';

export type RunPhaseChip = {
  id: string;
  label: string;
  icon?: ReactNode;
};

type Props = {
  moduleId: PsychTestModuleId;
  set: string;
  progress: number;
  itemLine: string;
  timerLabel: string;
  timerDisplay: string;
  phases?: RunPhaseChip[];
  activePhaseId?: string;
  onQuit: () => void;
  children: ReactNode;
  footerNote?: string;
};

/** Full-viewport live test chrome — matches SSB set-selection header, no page scroll. */
export function PsychTestRunShell({
  moduleId,
  set,
  progress,
  itemLine,
  timerLabel,
  timerDisplay,
  phases,
  activePhaseId,
  onQuit,
  children,
  footerNote,
}: Props) {
  const module = getPsychModule(moduleId);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#eef2f7]">
      <header
        className="relative flex shrink-0 items-center justify-between gap-3 px-3 py-2.5 pl-14 sm:px-4 sm:pl-16"
        style={{ background: `linear-gradient(180deg, ${module.primary} 0%, ${module.primaryDark} 100%)` }}
      >
        <HeaderHistoryNav backFallback={module.routes.sets} onBack={onQuit} corner iconOnly />
        <div className="min-w-0 flex-1 text-white">
          <p className="truncate text-sm font-bold sm:text-base">
            {module.code} · {set.replace('set', 'Set ')}
          </p>
          <p className="truncate text-[11px] text-white/80">{itemLine}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onQuit}
          className="h-8 shrink-0 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <XCircle className="mr-1 h-3.5 w-3.5" />
          Quit
        </Button>
      </header>

      <Progress value={progress} className="h-1 shrink-0 rounded-none" />

      {phases && phases.length > 0 && (
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 py-1.5">
          {phases.map((p) => {
            const active = p.id === activePhaseId;
            return (
              <span
                key={p.id}
                className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold sm:text-xs ${
                  active ? 'text-white' : 'bg-slate-100 text-slate-600'
                }`}
                style={active ? { background: module.primary } : undefined}
              >
                {p.icon}
                {p.label}
              </span>
            );
          })}
        </div>
      )}

      <main className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-slate-300 bg-white">
          <div className="flex shrink-0 items-center justify-center gap-2 border-b border-slate-100 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{timerLabel}</span>
            <span className="text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">{timerDisplay}</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-2 sm:p-4">
            {children}
          </div>
          {footerNote && (
            <p className="shrink-0 border-t border-slate-100 px-3 py-2 text-center text-[11px] text-slate-500">
              {footerNote}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
