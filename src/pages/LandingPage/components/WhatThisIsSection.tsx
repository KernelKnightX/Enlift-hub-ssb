import { CheckCircle2, MinusCircle } from "lucide-react";

export function WhatThisIsSection() {
  return (
    <section className="py-24 px-6 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Enlift hub Really Is
          </h2>

          <p className="text-slate-400 max-w-3xl mx-auto text-lg">
            Most candidates do not fail due to lack of knowledge.
            They struggle because of time pressure, overthinking, and
            inconsistent practice.
            <br /><br />
            Enlift exists to build calm, structured repetition — nothing more, nothing less.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* NOT COACHING */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700 transition-all">
            
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <MinusCircle className="w-6 h-6 text-red-400" />
              Not a Coaching Platform
            </h3>

            <ul className="space-y-4 text-slate-400">
              {[
                "No model answers or memorised formats",
                "No recommendation guarantees",
                "No psychological templates to copy",
                "No spoon-fed story structures",
                "No dependency on mentors"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PRACTICE PLATFORM */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-green-600/40 transition-all">
            
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              A Structured Practice Environment
            </h3>

            <ul className="space-y-4 text-slate-400">
              {[
                "Real SSB-level time pressure simulation",
                "Unlimited structured reattempts",
                "Focused repetition for clarity",
                "Preparation before reporting day",
                "150+ unique psychology practice sets"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Philosophy Line */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <p className="text-slate-500 text-lg">
            SSB does not select rehearsed candidates.
            <br />
            It selects natural thinkers under pressure.
          </p>
        </div>

      </div>
    </section>
  );
}
