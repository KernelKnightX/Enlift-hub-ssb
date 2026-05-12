interface ListeningProgressBarProps {
  current: number;
  total: number;
}

export function ListeningProgressBar({ current, total }: ListeningProgressBarProps) {
  const percent = (current / total) * 100;

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Question {current}</span>
        <span>{total}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
