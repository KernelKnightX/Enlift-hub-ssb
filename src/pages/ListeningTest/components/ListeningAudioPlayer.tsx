import { Headphones, RadioTower } from 'lucide-react';

interface ListeningAudioPlayerProps {
  progress: number;
  muted: boolean;
}

export function ListeningAudioPlayer({ progress, muted }: ListeningAudioPlayerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-white p-6 text-center shadow-sm sm:p-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
      <div className="relative">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-slate-50 text-slate-700">
          <Headphones className="h-10 w-10" />
        </div>
        <div className="text-xs font-semibold text-emerald-600">
          Audio Transmission Active
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Listen Carefully</h1>
        <p className="mt-3 text-sm text-slate-600">
          {muted ? 'Sound is muted. The transmission will still complete.' : 'Four words will be spoken once. Replay is disabled.'}
        </p>

        <div className="mx-auto mt-8 flex h-24 max-w-md items-center justify-center gap-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <span
              key={index}
              className="w-2 rounded-full bg-emerald-500"
              style={{
                height: `${22 + ((index * 17) % 58)}px`,
                animation: `listeningWave ${0.7 + (index % 5) * 0.08}s ease-in-out infinite`,
                animationDelay: `${index * 0.04}s`,
              }}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-2"><RadioTower className="h-3.5 w-3.5" /> Signal</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
