import { MinusCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function PlatformClaritySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            What This Platform Is — And What It Is Not
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Clarity on purpose. Honest expectations. Structured approach.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* NOT */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <MinusCircle className="w-5 h-5 text-red-500" />
              What This Is Not
            </h3>
            <ul className="space-y-3 text-slate-600">
              {[
                "A coaching institute",
                "A guarantee of selection",
                "A shortcut to recommendation",
                "A place to copy model answers",
                "A psychological template to follow",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <CheckCircle className="w-5 h-5 text-green-600" />
              What This Is
            </h3>
            <ul className="space-y-3 text-slate-600">
              {[
                "A structured practice environment",
                "Real SSB-level time pressure simulation",
                "A platform for consistent repetition",
                "A tool to understand behaviour patterns",
                "Preparation before reporting day",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 italic">
            "SSB does not select rehearsed candidates. It selects natural thinkers under pressure."
          </p>
        </div>
      </div>
    </section>
  );
}
