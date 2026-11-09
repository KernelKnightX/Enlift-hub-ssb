import { CheckCircle2, Lock } from 'lucide-react';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';

type Props = {
  module: PsychTestModuleConfig;
  total: number;
  selectedSet: number | null;
  onSelect: (set: number) => void;
  statusLabel: (set: number) => string;
  isLocked: (set: number) => boolean;
};

export function PsychSetRunwayGrid({ module, total, selectedSet, onSelect, statusLabel, isLocked }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((setNum) => {
        const locked = isLocked(setNum);
        const selected = selectedSet === setNum;
        const label = statusLabel(setNum);
        const done = label === 'Completed';
        const partial = label.includes('Partial') || label.toLowerCase().includes('quit');

        return (
          <button
            key={setNum}
            type="button"
            onClick={() => onSelect(setNum)}
            className={`relative flex min-h-[72px] flex-col items-center justify-center rounded-lg border bg-white px-1 py-2 text-center transition-colors sm:min-h-[80px] ${
              selected
                ? 'border-2 shadow-sm'
                : locked
                  ? 'border-slate-200 bg-slate-50 text-slate-400'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
            style={
              selected
                ? {
                    borderColor: module.primary,
                    background: module.accentSoft,
                  }
                : undefined
            }
          >
            {locked && <Lock className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-slate-400" />}
            {!locked && done && (
              <CheckCircle2 className="absolute right-1.5 top-1.5 h-4 w-4 text-emerald-600" />
            )}
            <span
              className="text-[10px] font-semibold uppercase tracking-wide text-slate-500"
              style={selected ? { color: module.primaryDark } : undefined}
            >
              Set
            </span>
            <span className="text-2xl font-bold tabular-nums leading-none text-slate-900">{setNum}</span>
            <span
              className={`mt-1 line-clamp-2 w-full text-[10px] font-medium leading-tight ${
                locked ? 'text-slate-400' : partial ? 'text-amber-800' : done ? 'text-emerald-700' : 'text-slate-600'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
