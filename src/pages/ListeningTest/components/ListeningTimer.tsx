import { Timer } from 'lucide-react';
import { LISTENING_TEST_SELECTION_SECONDS } from '@/data/listeningTestQuestions';

interface ListeningTimerProps {
  secondsLeft: number;
}

export function ListeningTimer({ secondsLeft }: ListeningTimerProps) {
  const isLow = secondsLeft <= 3;
  const percent = (secondsLeft / LISTENING_TEST_SELECTION_SECONDS) * 100;

  return (
    <div className={`rounded-xl border p-4 transition ${isLow ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Timer className={`h-4 w-4 ${isLow ? 'text-red-600' : 'text-emerald-700'}`} />
          Recall Window
        </div>
        <div className={`text-4xl font-bold tabular-nums ${isLow ? 'text-red-600' : 'text-emerald-700'}`}>
          {secondsLeft}
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
