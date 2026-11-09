import { Brain, Eye, Clock, Heart } from 'lucide-react';

export function WhyPsychologySection() {
  const points = [
    {
      icon: Brain,
      title: "Personality Consistency",
      description: "SSB evaluates whether your personality remains consistent across different tests. Psychology tests reveal your natural thinking patterns."
    },
    {
      icon: Eye,
      title: "Behaviour Under Observation",
      description: "Every response is observed — not just for content, but for how quickly you respond, what you prioritize, and your emotional balance."
    },
    {
      icon: Clock,
      title: "Time Pressure Response",
      description: "Working under time constraints reveals how you think when you cannot overthink. Natural responses matter more than perfect answers."
    },
    {
      icon: Heart,
      title: "Officer Like Qualities",
      description: "OLQs are not directly tested. They are inferred through your stories, reactions, and behaviour throughout the testing process."
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Why Psychology Tests Matter in SSB
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Understanding the role of psychology tests helps you prepare with the right mindset.
          </p>
        </div>

        {/* Points Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Insight */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 max-w-xl mx-auto">
            The psychology tests are designed to see you as you are — not as you think you should be.
          </p>
        </div>
      </div>
    </section>
  );
}
