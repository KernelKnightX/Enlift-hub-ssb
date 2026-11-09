import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';

type Props = {
  module: PsychTestModuleConfig;
  setLabel: string;
  loading: boolean;
  /** Called when 3-2-1 finishes and data is ready. */
  onReady: () => void;
  subtitle?: string;
};

export function PsychStartCountdown({ module, setLabel, loading, onReady, subtitle }: Props) {
  const [seconds, setSeconds] = useState(3);
  const [started, setStarted] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (loading) {
      setStarted(false);
      setSeconds(3);
      finishedRef.current = false;
      return;
    }
    setStarted(true);
  }, [loading]);

  useEffect(() => {
    if (!started || loading || finishedRef.current) return;
    if (seconds <= 0) {
      finishedRef.current = true;
      onReady();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, loading, seconds, onReady]);

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-slate-50 px-6">
      <div
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        style={{ borderTopWidth: 4, borderTopColor: module.primary }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{module.code} practice</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{setLabel}</p>
        {loading ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" style={{ color: module.primary }} />
            <p className="text-sm text-slate-600">Loading set…</p>
          </div>
        ) : (
          <>
            <p
              className="mt-8 text-7xl font-bold tabular-nums leading-none sm:text-8xl"
              style={{ color: module.primary }}
            >
              {seconds > 0 ? seconds : 'Go'}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              {seconds > 0 ? 'Starting in… Keep pen and paper ready.' : subtitle ?? 'Starting now'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
