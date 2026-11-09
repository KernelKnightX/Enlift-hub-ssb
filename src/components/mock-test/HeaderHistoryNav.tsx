import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { goBackInApp } from '@/lib/appNavigation';

type Props = {
  backFallback: string;
  onBack?: () => void;
  /** Pin to top-left of a relative header. */
  corner?: boolean;
  className?: string;
  label?: string;
  /** Chevron only — avoids overlapping title in compact headers. */
  iconOnly?: boolean;
};

export function HeaderHistoryNav({
  backFallback,
  onBack,
  corner = false,
  className = '',
  label = 'Back',
  iconOnly = false,
}: Props) {
  const navigate = useNavigate();

  const btn = (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        if (onBack) onBack();
        else goBackInApp(navigate, backFallback);
      }}
      className={`inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/15 font-semibold text-white shadow-sm transition-colors hover:bg-white/25 ${
        iconOnly ? 'h-11 w-11' : corner ? 'h-11 gap-1.5 px-3 text-sm' : 'h-10 gap-1.5 px-3 text-sm'
      }`}
    >
      <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.5} />
      {!iconOnly && <span className="hidden sm:inline">{label}</span>}
    </button>
  );

  if (corner) {
    return (
      <div className={`absolute left-2 top-2 z-10 sm:left-3 sm:top-2.5 ${className}`}>{btn}</div>
    );
  }

  return <div className={`shrink-0 ${className}`}>{btn}</div>;
}
