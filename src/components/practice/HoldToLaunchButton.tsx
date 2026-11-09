import { useRef, useState } from 'react';
import { Rocket } from 'lucide-react';

type Props = {
  disabled?: boolean;
  label: string;
  holdMs?: number;
  gradient: string;
  onLaunch: () => void;
};

export function HoldToLaunchButton({ disabled, label, holdMs = 900, gradient, onLaunch }: Props) {
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = useRef(0);

  const clear = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    start.current = 0;
    setProgress(0);
  };

  const beginHold = () => {
    if (disabled) return;
    start.current = Date.now();
    timer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - start.current) / holdMs);
      setProgress(p);
      if (p >= 1) {
        clear();
        onLaunch();
      }
    }, 16);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className="relative h-12 w-full overflow-hidden rounded-xl text-base font-bold text-white shadow-lg disabled:opacity-40"
      style={{ background: gradient }}
      onPointerDown={beginHold}
      onPointerUp={clear}
      onPointerLeave={clear}
      onPointerCancel={clear}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-0 bg-white/25 transition-[width] duration-75"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative flex items-center justify-center gap-2">
        <Rocket className="h-5 w-5" />
        {progress > 0.15 ? 'Release to cancel · keep holding…' : label}
      </span>
      {!disabled && progress === 0 && (
        <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-semibold uppercase tracking-widest text-white/70">
          Hold to launch
        </span>
      )}
    </button>
  );
}
