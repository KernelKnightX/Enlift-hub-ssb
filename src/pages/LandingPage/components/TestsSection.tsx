import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, GraduationCap } from 'lucide-react';

// ============= TYPES =============
interface Test {
  id: string;
  icon: any;
  name: string;
  full: string;
  desc: string;
  details: string;
  sets: string;
}

// ============= DATA =============
const TESTS_DATA: Test[] = [
  {
    id: 'ppdt',
    icon: ImageIcon,
    name: 'PPDT',
    full: 'Picture Perception & Description Test',
    desc: 'Story writing based on unclear image',
    details: '30 sec observation • 4 min writing',
    sets: '30+ sets',
  },
  {
    id: 'tat',
    icon: FileText,
    name: 'TAT',
    full: 'Thematic Apperception Test',
    desc: 'Story writing on ambiguous pictures',
    details: '12 images • 4 minutes each',
    sets: '40+ sets',
  },
  {
    id: 'wat',
    icon: Type,
    name: 'WAT',
    full: 'Word Association Test',
    desc: 'First thought that comes to mind',
    details: '60 words • 15 seconds each',
    sets: '50+ sets',
  },
  {
    id: 'ssbprep',
    icon: GraduationCap,
    name: 'SSB Prep',
    full: 'SSB Interview Preparation',
    desc: 'Lecturette, Interview, GD & GTO',
    details: 'Complete guide • All rounds',
    sets: 'Comprehensive',
  },
];

// ============= ICONS =============
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function Type({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
    </svg>
  );
}

// ============= COMPONENT =============
interface TestsSectionProps {
  onCTAClick: (location: string) => void;
}

export function TestsSection({ onCTAClick }: TestsSectionProps) {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          LETS CRACK SSB
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Stage I (Screening) and Stage II (Psychology) tests.
          Practice them exactly as conducted in actual SSB.
        </p>

        {/* 4 IN ONE LINE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTS_DATA.map((test) => (
            <div
              key={test.id}
              className="p-6 bg-white rounded-xl border hover:border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <test.icon className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-1">{test.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{test.full}</p>
              <p className="text-sm text-muted-foreground mb-3">{test.desc}</p>

              <div className="pt-3 border-t space-y-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {test.details}
                </p>
                <p className="text-xs font-medium text-green-600">
                  {test.sets}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 group"
            asChild
          >
            <Link to="/register" onClick={() => onCTAClick('tests_section')}>
              Start Practicing All Tests
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
