import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
  onCTAClick: (location: string) => void;
}

export function FinalCTASection({ onCTAClick }: FinalCTASectionProps) {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-b from-white to-slate-50">
      <h2 className="text-3xl font-bold mb-4">Practice first. Decide later.</h2>

      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Don't wait until your SSB date is near. Start now. Build the habit. Make it natural.
        <br />
        <span className="text-sm">
          No payment. No pressure. No mentorship push. Just practice.
        </span>
      </p>

      <Button
        size="lg"
        className="bg-green-600 hover:bg-green-700 px-12 py-6 text-lg group shadow-lg hover:shadow-xl transition-all"
        asChild
      >
        <Link to="/register" onClick={() => onCTAClick('final_cta')}>
          Start Practicing Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>

      <p className="text-sm text-muted-foreground mt-6">
        Takes 30 seconds to register. Start practicing immediately.
      </p>
    </section>
  );
}
