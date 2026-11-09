import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function CalmClosingSection() {
  return (
    <section className="py-24 px-6 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Quote */}
        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
          <span className="text-slate-400">"</span>
          SSB does not test perfection.
          <br />
          It evaluates clarity, responsibility, and balance.
          <span className="text-slate-400">"</span>
        </blockquote>

        {/* Message */}
        <p className="text-slate-300 mb-10 max-w-xl mx-auto">
          Practice with structure. Improve with consistency.
          <br />
          Understand yourself. Perform naturally.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="px-8 py-5 bg-white text-slate-900 hover:bg-slate-100"
            asChild
          >
            <Link to="/register">
              Start Practice
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-5 border-slate-600 text-white hover:bg-slate-800"
            asChild
          >
            <Link to="/ssb-info">
              Learn About SSB
            </Link>
          </Button>
        </div>

        {/* Tagline */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500">
            Train the Mind. Clear the Board.
          </p>
        </div>
      </div>
    </section>
  );
}
