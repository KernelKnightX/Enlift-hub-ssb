import { BookOpenCheck, Clock, Headphones, Maximize2, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnglishTestStartProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenInstructions: () => void;
  onStart: () => void;
  onFullscreen: () => void;
}

export function EnglishTestStart({
  soundEnabled,
  onToggleSound,
  onOpenInstructions,
  onStart,
  onFullscreen,
}: EnglishTestStartProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900">
            <Shield className="h-3.5 w-3.5" />
            Defence Aptitude Module
          </div>
          <h1 className="max-w-2xl text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
            English Grammar & Vocabulary Test
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            A timed verbal assessment built for quick judgement, grammar control, vocabulary recall, and pressure accuracy.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Target, label: '60 Questions', value: 'MCQ format' },
              { icon: Clock, label: '17 Seconds', value: 'per question' },
              { icon: BookOpenCheck, label: '7 Categories', value: 'mixed order' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border bg-slate-50 p-4 text-center">
                <Icon className="mx-auto mb-3 h-5 w-5 text-slate-700" />
                <div className="text-sm font-semibold text-slate-900">{label}</div>
                <div className="mt-1 text-xs text-slate-600">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onStart} className="bg-emerald-600 px-7 text-white hover:bg-emerald-700">
              Start Test
            </Button>
            <Button onClick={onOpenInstructions} variant="outline">
              Instructions
            </Button>
          </div>
        </div>
      </div>

      <aside className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-600">Mission Controls</div>
            <h2 className="mt-1 text-lg font-bold text-slate-950">Ready Check</h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p>Use A, B, C, D keys to answer faster. Pause is disabled once the assessment starts.</p>
          <p>The test auto-submits unanswered questions when the timer reaches zero.</p>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-slate-800">
              <Headphones className="h-4 w-4 text-slate-500" />
              Sound Effects
            </span>
            <span className="text-xs font-bold text-amber-700">{soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onFullscreen}
            className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-slate-800">
              <Maximize2 className="h-4 w-4 text-slate-500" />
              Fullscreen Mode
            </span>
            <span className="text-xs font-bold text-cyan-700">OPEN</span>
          </button>
        </div>
      </aside>
    </section>
  );
}
