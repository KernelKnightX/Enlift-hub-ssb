import { Target, Clock, Repeat } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-28 px-6 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How You Should Use Enlift
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Structured repetition under real timing.
            Nothing complicated. Nothing artificial.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* STEP 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-600/40 transition-all">
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-500">STEP 01</span>
              <Target className="w-6 h-6 text-green-400" />
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Choose Your Test
            </h3>

            <p className="text-slate-400 leading-relaxed">
              Start with the test you find most challenging.
              If screening is near, begin with PPDT and WAT.
              Focus on one format at a time.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-600/40 transition-all">
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-500">STEP 02</span>
              <Clock className="w-6 h-6 text-green-400" />
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Practice Under Real Timing
            </h3>

            <p className="text-slate-400 leading-relaxed">
              No pause button. No editing.  
              Follow exact SSB time limits.
              Train your mind to respond clearly within seconds.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-600/40 transition-all">
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-500">STEP 03</span>
              <Repeat className="w-6 h-6 text-green-400" />
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Repeat & Refine
            </h3>

            <p className="text-slate-400 leading-relaxed">
              Review your responses objectively.
              Improve clarity, structure, and emotional stability.
              Repetition builds natural confidence.
            </p>
          </div>

        </div>

        {/* Bottom Philosophy */}
        <div className="mt-24 text-center max-w-3xl mx-auto">
          <p className="text-slate-500 text-lg">
            The goal is not to impress the psychologist.
            <br />
            The goal is to think clearly under pressure.
          </p>
        </div>

      </div>
    </section>
  );
}
