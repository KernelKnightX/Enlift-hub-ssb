import { CheckCircle2, X } from 'lucide-react';

// ============= DATA =============
const COMPARISON_DATA = [
  { feature: 'Real SSB Timing', us: true, youtube: false, coaching: true },
  { feature: 'Unlimited Practice', us: true, youtube: false, coaching: false },
  { feature: 'Practice Anytime', us: true, youtube: true, coaching: false },
  { feature: '150+ Practice Sets', us: true, youtube: false, coaching: false },
  { feature: 'Track Progress', us: true, youtube: false, coaching: true },
  { feature: 'No Selling Pressure', us: true, youtube: true, coaching: false },
];

export function ComparisonSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Why not just watch YouTube videos?
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Here's how we compare to other preparation methods
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="text-center p-4 font-semibold text-green-600">Enlift hub</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">YouTube</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">
                  Coaching
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, i) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  <td className="p-4">{row.feature}</td>
                  <td className="text-center p-4">
                    {row.us ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="text-center p-4">
                    {row.youtube ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="text-center p-4">
                    {row.coaching ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">The bottom line:</strong> YouTube teaches
            theory. Coaching is expensive. We give you unlimited practice with real SSB format
            and timing.
          </p>
        </div>
      </div>
    </section>
  );
}
