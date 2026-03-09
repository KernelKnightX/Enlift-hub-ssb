import { Shield, Users, Award, Target, CheckCircle2, UserCheck, Building2, Heart } from 'lucide-react';

const impactStats = [
  { value: "500+", label: "Candidates Recommended", description: "across NDA, CDS, AFCAT, and TES entries" },
  { value: "85%", label: "Success Rate", description: "through personalized approach and commitment to growth" },
  { value: "12+", label: "Years Experience", description: "shaping future officers of Indian Armed Forces" },
];

const features = [
  {
    icon: Shield,
    title: "Trained by Ex-Defense Officers",
    description: "Learn directly from officers who've cleared SSB themselves and served in the Armed Forces. They know exactly what assessors look for because they've been on both sides of the table.",
  },
  {
    icon: Users,
    title: "Personalized Attention to Every Candidate",
    description: "We maintain a strict batch size of maximum 15 students. This ensures each candidate receives individual feedback, customized improvement plans, and one-on-one mentoring sessions regularly.",
  },
  {
    icon: Building2,
    title: "Full-Scale SSB Infrastructure",
    description: "Practice in real SSB conditions with our full-sized GTO ground, psychology testing lab, conference room, and dedicated interview chambers. Experience the actual pressure before you face it.",
  },
  {
    icon: Heart,
    title: "Focus on Personality, Not Just Preparation",
    description: "We don't teach tricks or rehearsed answers. Our approach is to develop genuine Officer Like Qualities through continuous assessment, feedback, and real personality transformation over time.",
  },
];

export function AboutUsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            About Enlift hub
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-6" />
        </div>

        {/* Who We Are */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  We Are a Team of Ex-Defense Officers
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We are a team of ex-defense officers who have successfully cleared SSB and served the nation. We understand the selection process inside out because we've lived it.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Our academy was founded with one mission: to bridge the gap between aspirants and their dream of wearing the uniform. We don't believe in shortcuts or tricks—we focus on genuine personality development and OLQ enhancement.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Impact */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Our Impact
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {impactStats.map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-center text-white shadow-lg"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-green-100 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Why Choose Us
          </h3>
          <h4 className="text-lg text-slate-600 text-center mb-8">
            What sets us apart from other coaching institutes
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
