import { useRef, useEffect } from 'react';
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

export function PsychSetCarousel({ module, total, selectedSet, onSelect, statusLabel, isLocked }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedSet || !scroller.current) return;
    const card = scroller.current.querySelector(`[data-set="${selectedSet}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedSet]);

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center">
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Swipe to pick a set · tap to select
      </p>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[12vw] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8"
      >
        {Array.from({ length: total }, (_, i) => i + 1).map((setNum) => {
          const locked = isLocked(setNum);
          const selected = selectedSet === setNum;
          const label = statusLabel(setNum);
          const done = label === 'Completed';
          const partial = label.includes('Partial') || label.includes('quit');

          return (
            <button
              key={setNum}
              type="button"
              data-set={setNum}
              onClick={() => onSelect(setNum)}
              className={`relative flex w-[68vw] max-w-[220px] shrink-0 snap-center flex-col items-center justify-center rounded-2xl border-2 px-4 py-6 text-center transition-transform sm:w-[180px] ${
                selected ? 'scale-[1.02] shadow-lg' : 'scale-100 shadow-md'
              } ${locked ? 'border-slate-200 bg-slate-100/90' : 'border-white bg-white'}`}
              style={
                selected
                  ? {
                      borderColor: module.primary,
                      boxShadow: `0 12px 40px -12px ${module.primary}55`,
                      background: `linear-gradient(160deg, ${module.accentSoft} 0%, #fff 55%)`,
                    }
                  : undefined
              }
            >
              {locked && <Lock className="absolute right-3 top-3 h-4 w-4 text-slate-400" />}
              {!locked && done && (
                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />
              )}
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: selected ? module.primary : '#64748b' }}
              >
                Practice set
              </span>
              <span className="mt-1 text-4xl font-black tabular-nums text-slate-900">{setNum}</span>
              <span
                className={`mt-2 max-w-full truncate text-xs font-semibold ${
                  locked ? 'text-slate-400' : partial ? 'text-amber-800' : done ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                {locked ? 'Premium · tap to unlock' : label}
              </span>
              {!locked && (
                <span className="mt-1 text-[10px] text-slate-500">{module.sets.unitLabel}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
