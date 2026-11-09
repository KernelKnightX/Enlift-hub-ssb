import { Link } from 'react-router';
import { ArrowRight, MessageSquare, Brain, Users, Mic, Award } from 'lucide-react';

const days = [
  {
    day: "Day 1",
    name: "Screening",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-700",
    tests: ["PPDT - Picture Perception & Description Test", "Group Discussion"],
    whatObserved: "Your ability to form a story quickly and communicate it in a group setting."
  },
  {
    day: "Day 2",
    name: "Psychology",
    icon: Brain,
    color: "bg-green-100 text-green-700",
    tests: ["TAT - Thematic Apperception Test", "WAT - Word Association Test", "SRT - Situation Reaction Test", "Self Description"],
    whatObserved: "Your natural thinking patterns, emotional stability, and response to situations."
  },
  {
    day: "Day 3-4",
    name: "GTO Tasks",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
    tests: ["Group Discussion", "Group Planning Exercise", "Progressive Group Task", "Command Task", "Lecturette", "Individual Obstacles"],
    whatObserved: "Your leadership, teamwork, initiative, and ability to handle challenges."
  },
  {
    day: "Day 4-5",
    name: "Interview",
    icon: Mic,
    color: "bg-orange-100 text-orange-700",
    tests: ["Personal Interview with IO"],
    whatObserved: "Your background, motivations, general awareness, and personality depth."
  },
  {
    day: "Day 5",
    name: "Conference",
    icon: Award,
    color: "bg-slate-100 text-slate-700",
    tests: ["Final Board Conference"],
    whatObserved: "Overall assessment by all assessors together. Final recommendation decision."
  }
];

export function SSBOverviewSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            The SSB 5-Day Assessment Overview
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A structured breakdown of what happens at SSB and what is being evaluated at each stage.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {days.map((day, index) => {
            const Icon = day.icon;
            return (
              <div 
                key={index}
                className="flex flex-col md:flex-row gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200"
              >
                {/* Day Badge */}
                <div className="md:w-32 shrink-0">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${day.color}`}>
                    <Icon className="w-4 h-4" />
                    {day.day}
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-2">{day.name}</h3>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Tests Conducted
                    </p>
                    <p className="text-sm text-slate-700">
                      {day.tests.join(" • ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      What is Observed
                    </p>
                    <p className="text-sm text-slate-600">
                      {day.whatObserved}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/ssb-info"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium"
          >
            View detailed SSB process
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
