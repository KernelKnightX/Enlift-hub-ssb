import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PenLine, Shield, Sparkles } from 'lucide-react';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';

type Props = { module: PsychTestModuleConfig };

const slideMeta = [
  { id: 'prep', title: 'Before you start', icon: PenLine },
  { id: 'rules', title: 'During the test', icon: Shield },
  { id: 'olq', title: 'Examiner lens', icon: Sparkles },
];

export function PsychBriefingSlides({ module }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const slides = [
    {
      items: [
        'Pen & paper ready (offline writing).',
        module.noticeLead.split('.')[0] + '.',
        ...module.setStatChips.slice(0, 2).map((c) => `${c.label}: ${c.value}`),
      ],
    },
    {
      items: module.rules.slice(0, 4),
    },
    {
      items: [module.tip, ...module.keyPoints.slice(0, 2)],
    },
  ];

  const scrollTo = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.max(0, Math.min(index, slides.length - 1));
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setActive(i);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Swipe briefing</p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => scrollTo(active - 1)}
            className="rounded-full border border-slate-200 bg-white p-1 disabled:opacity-30"
            disabled={active === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => scrollTo(active + 1)}
            className="rounded-full border border-slate-200 bg-white p-1 disabled:opacity-30"
            disabled={active === slides.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={() => {
          const el = scroller.current;
          if (!el || !el.clientWidth) return;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, idx) => {
          const meta = slideMeta[idx];
          const Icon = meta.icon;
          return (
            <div
              key={meta.id}
              className="flex w-full shrink-0 snap-center flex-col p-4 sm:p-5"
              style={{ background: idx === 1 ? module.accentSoft : undefined }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                  style={{ background: module.primary }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">{meta.title}</h3>
              </div>
              <ul className="space-y-2.5 text-sm leading-snug text-slate-700">
                {slide.items.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: module.primary }} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? 20 : 6,
              background: i === active ? module.primary : '#cbd5e1',
            }}
          />
        ))}
      </div>
    </div>
  );
}
