import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';
import { setPsychBriefingAck } from '@/lib/psychBriefingStorage';

type Props = {
  module: PsychTestModuleConfig;
  open: boolean;
  onClose: () => void;
};

type Beat = { kicker: string; headline: string; sub?: string };

function buildBeats(module: PsychTestModuleConfig): Beat[] {
  const chips = module.setStatChips.slice(0, 3).map((c) => `${c.value} ${c.label.toLowerCase()}`).join(' · ');
  return [
    {
      kicker: 'Offline mission',
      headline: module.code,
      sub: module.noticeLead.length > 120 ? `${module.noticeLead.slice(0, 117)}…` : module.noticeLead,
    },
    {
      kicker: 'Rules of engagement',
      headline: module.rules[0] ?? 'Follow timed phases.',
      sub: module.rules.slice(1, 3).join(' · '),
    },
    {
      kicker: 'Examiner lens',
      headline: module.tip.length > 90 ? `${module.tip.slice(0, 87)}…` : module.tip,
      sub: chips,
    },
    {
      kicker: 'Green light',
      headline: 'Pen ready. Calm pace. OLQs on.',
      sub: 'You will pick a set on the bay — locked sets stay unlockable.',
    },
  ];
}

export function PsychBriefingStoryOverlay({ module, open, onClose }: Props) {
  const beats = buildBeats(module);
  const [index, setIndex] = useState(0);

  if (!open) return null;

  const beat = beats[index];
  const last = index >= beats.length - 1;

  const finish = () => {
    setPsychBriefingAck(module.id);
    setIndex(0);
    onClose();
  };

  const next = () => {
    if (last) finish();
    else setIndex((i) => i + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col text-white"
      style={{
        background: `radial-gradient(120% 80% at 50% 0%, ${module.primary}44 0%, #0a0e14 45%, #050608 100%)`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mission briefing"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">Briefing · {index + 1}/{beats.length}</p>
        <button
          type="button"
          onClick={finish}
          className="rounded-full border border-white/20 bg-white/5 p-2 text-white/80 hover:bg-white/10"
          aria-label="Skip briefing"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center"
        onClick={next}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: module.primary }}>
          {beat.kicker}
        </p>
        <h2 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">{beat.headline}</h2>
        {beat.sub && <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{beat.sub}</p>}
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-widest text-white/35">Tap anywhere to continue</p>
      </button>

      <div className="relative shrink-0 space-y-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-center gap-1.5">
          {beats.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === index ? 28 : 6,
                background: i === index ? module.primary : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
        <Button
          type="button"
          className="h-12 w-full gap-2 text-base font-bold text-white"
          style={{ background: `linear-gradient(90deg, ${module.primary}, ${module.primaryDark})` }}
          onClick={next}
        >
          {last ? 'Enter set bay' : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
