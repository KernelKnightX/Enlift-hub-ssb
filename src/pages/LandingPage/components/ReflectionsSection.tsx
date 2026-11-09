import { MessageSquare } from 'lucide-react';

const reflections = [
  {
    title: "Consistency Across Tests Matters",
    observation: "Candidates often realize that what they write in psychology tests should align with their interview responses and GTO behaviour. Inconsistency is easily noticed by assessors.",
    category: "Common Observation"
  },
  {
    title: "Calmness Under Pressure is Key",
    observation: "Many candidates report that staying calm during time-pressured tests like WAT and SRT helps them think more clearly. Panic leads to fragmented responses.",
    category: "Performance Insight"
  },
  {
    title: "Structured Thinking Helps",
    observation: "Candidates who practice structured thinking — organizing thoughts before responding — perform better in Lecturette, GD, and written tests.",
    category: "Preparation Tip"
  },
  {
    title: "Natural Responses Work Better",
    observation: "Candidates who try to be someone they are not often struggle. Authenticity in stories and responses is more easily assessed than rehearsed answers.",
    category: "Common Observation"
  },
  {
    title: "Time Management is Crucial",
    observation: "Running out of time is a common issue in psychology tests. Practice under real timing conditions helps build pace without sacrificing quality.",
    category: "Performance Insight"
  },
  {
    title: "Understanding the Process Reduces Anxiety",
    observation: "Candidates who understand what SSB is evaluating tend to perform better. Familiarity with the process removes unnecessary nervousness.",
    category: "Preparation Tip"
  }
];

export function ReflectionsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Reflections from Candidates Who Have Faced SSB
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Structured observations from candidates who have been through the SSB process. Not advice — simply what has been commonly noted.
          </p>
        </div>

        {/* Reflections Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {reflections.map((reflection, index) => (
            <div 
              key={index}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {reflection.category}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                {reflection.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {reflection.observation}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 italic">
            These are general observations compiled from candidate experiences. Individual results vary.
          </p>
        </div>
      </div>
    </section>
  );
}
