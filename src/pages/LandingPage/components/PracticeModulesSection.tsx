import { Link } from 'react-router';
import { ArrowRight, Image, BookOpen, PenTool, MessageSquare, GraduationCap, Clock } from 'lucide-react';

const modules = [
  {
    id: 'ppdt',
    name: 'PPDT',
    fullName: 'Picture Perception & Description Test',
    description: 'Write a story based on a picture shown for 30 seconds. Story writing time: 4 minutes.',
    icon: Image,
    color: 'bg-purple-100 text-purple-700',
    timing: '30s viewing + 4min writing',
    path: '/ppdt/instructions'
  },
  {
    id: 'tat',
    name: 'TAT',
    fullName: 'Thematic Apperception Test',
    description: 'Write stories for 12 ambiguous pictures. Each picture: 30s viewing + 4min writing.',
    icon: BookOpen,
    color: 'bg-green-100 text-green-700',
    timing: '30s viewing + 4min per picture',
    path: '/tat/instructions'
  },
  {
    id: 'wat',
    name: 'WAT',
    fullName: 'Word Association Test',
    description: 'Write a meaningful sentence for each word shown. 15 seconds per word. 60 words total.',
    icon: PenTool,
    color: 'bg-orange-100 text-orange-700',
    timing: '15 seconds per word',
    path: '/wat/instructions'
  },
  {
    id: 'srt',
    name: 'SRT',
    fullName: 'Situation Reaction Test',
    description: 'Write your response to 60 practical situations. 30 seconds per situation.',
    icon: MessageSquare,
    color: 'bg-red-100 text-red-700',
    timing: '30 seconds per situation',
    path: '/srt/instructions'
  },
  {
    id: 'prep',
    name: 'SSB Prep',
    fullName: 'SSB Interview Preparation',
    description: 'Prepare for Lecturette, Interview, GD & GTO. Topic lists, question banks, and guidance.',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700',
    timing: 'Comprehensive guide',
    path: '/ssb-preparation'
  }
];

export function PracticeModulesSection() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Practice Modules
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Each module follows real SSB timing and format. Practice with structure. Build consistency.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-1">
                  {module.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2">
                  {module.fullName}
                </p>
                <p className="text-sm text-slate-600 mb-3">
                  {module.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {module.timing}
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
