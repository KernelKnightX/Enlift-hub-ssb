import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight } from 'lucide-react';

// ============= TYPES =============
interface FAQ {
  id: number;
  question: string;
  answer: string;
}

// ============= DATA =============
const FAQS_DATA: FAQ[] = [
  {
    id: 1,
    question: 'Is this officially connected to SSB?',
    answer:
      'No. We are completely independent. Not affiliated with Indian Armed Forces, any SSB board, or coaching academy. This is a pure practice tool.',
  },
  {
    id: 2,
    question: 'Will this guarantee my recommendation?',
    answer:
      "No. Nobody can guarantee recommendation. But this will ensure you don't fail because of unfamiliarity or panic. You'll perform at your natural best.",
  },
  {
    id: 3,
    question: 'How many times can I practice?',
    answer:
      "Unlimited. Take the same test 10 times, 50 times, 100 times. There's no limit. The more you practice, the more natural your responses become.",
  },
  {
    id: 4,
    question: 'Are the timings exactly like real SSB?',
    answer:
      'Yes. We follow exact SSB timings: 15 seconds for WAT, 30 seconds for SRT, 4 minutes for TAT/PPDT. This is critical for building the right pace.',
  },
  {
    id: 5,
    question: 'Is there any cost?',
    answer:
      "No. The platform is available to all registered users. We don't charge money, we don't sell courses, we don't push mentorship. Just register and practice.",
  },
  {
    id: 6,
    question: 'Can I use this on mobile?',
    answer:
      'Yes, but we recommend laptop/desktop for typing-heavy tests like WAT and SRT. The experience is better and closer to actual SSB.',
  },
  {
    id: 7,
    question: 'Do you provide model answers?',
    answer:
      "No. Psychology tests don't have 'correct answers'. We provide the questions and timing. You write what comes naturally to you.",
  },
  {
    id: 8,
    question: 'How is this different from YouTube videos?',
    answer:
      'Videos explain theory. We give practice. You can watch 100 videos about swimming, but you only learn by jumping in the water.',
  },
];

// ============= COMPONENTS =============
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-green-600 transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openFAQId, setOpenFAQId] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto bg-white">
      <h2 className="text-3xl font-bold text-center mb-4">Common Questions</h2>
      <p className="text-center text-muted-foreground mb-12">
        Straight answers. No marketing fluff.
      </p>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="space-y-1">
          {FAQS_DATA.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQId === faq.id}
              onToggle={() => {
                const newId = openFAQId === faq.id ? null : faq.id;
                setOpenFAQId(newId);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <Button variant="outline" asChild>
          <Link to="/ssb-info">
            Learn More About SSB
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
