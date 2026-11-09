import { Users, BookOpen, Zap } from 'lucide-react';

export function WhoShouldUseSection() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Who should use this platform?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              color: 'blue',
              title: 'First-time candidates',
              desc: `You've never seen SSB psychology tests before. You need to know what to expect so you don't freeze on Day 1.`,
            },
            {
              icon: BookOpen,
              color: 'green',
              title: 'Repeaters',
              desc: `You got screened out or didn't perform well in psychology. You need structured practice to improve your thought process.`,
            },
            {
              icon: Zap,
              color: 'purple',
              title: 'Anxious candidates',
              desc: 'You know the theory but panic under pressure. Practice reduces anxiety and builds muscle memory.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl border hover:border-green-500 hover:shadow-lg transition-all"
            >
              <item.icon className={`w-8 h-8 text-${item.color}-600 mb-3`} />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
