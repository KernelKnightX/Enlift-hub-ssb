import { Link } from 'react-router';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';

type Props = {
  module: PsychTestModuleConfig;
  current: 'instructions' | 'sets';
};

const steps = [
  {
    key: 'instructions' as const,
    label: 'Instructions',
    path: (m: PsychTestModuleConfig) => `${m.routes.sets}?instructions=1`,
  },
  { key: 'sets' as const, label: 'Sets', path: (m: PsychTestModuleConfig) => m.routes.sets },
  { key: 'live' as const, label: 'Test', path: null },
];

export function PracticeStepNav({ module, current }: Props) {
  return (
    <nav className="flex items-center justify-center gap-2 py-1">
      {steps.map((step, index) => {
        const isCurrent = step.key === current;
        const isFuture = step.key === 'live';
        const stepIndex = index + 1;

        if (isFuture) {
          return (
            <span key={step.key} className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/40">
                {stepIndex}
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-white/40 sm:inline">
                {step.label}
              </span>
            </span>
          );
        }

        const inner = (
          <>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                isCurrent ? 'bg-white text-slate-900' : 'bg-white/20 text-white'
              }`}
            >
              {stepIndex}
            </span>
            <span
              className={`hidden text-[10px] font-semibold uppercase tracking-wide sm:inline ${
                isCurrent ? 'text-white' : 'text-white/70'
              }`}
            >
              {step.label}
            </span>
          </>
        );

        if (isCurrent) {
          return (
            <span key={step.key} className="flex items-center gap-2">
              {inner}
            </span>
          );
        }

        return (
          <Link key={step.key} to={step.path!(module)} className="flex items-center gap-2 hover:opacity-90">
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
