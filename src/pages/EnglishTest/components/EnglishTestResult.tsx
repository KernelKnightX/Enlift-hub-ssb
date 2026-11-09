import { Award, Clock, RotateCcw, ShieldCheck, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EnglishQuestionCategory } from '@/data/englishGrammarVocabularyQuestions';

interface EnglishTestResultProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeTaken: string;
  strongestCategory: EnglishQuestionCategory | 'N/A';
  weakestCategory: EnglishQuestionCategory | 'N/A';
  onRestart: () => void;
}

export function EnglishTestResult({
  score,
  totalQuestions,
  correctCount,
  incorrectCount,
  unansweredCount,
  accuracy,
  timeTaken,
  strongestCategory,
  weakestCategory,
  onRestart,
}: EnglishTestResultProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-xl border bg-white p-6 text-slate-900 shadow-sm">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div className="text-xs font-semibold text-emerald-600">Assessment Complete</div>
        <h1 className="mt-2 text-3xl font-bold sm:text-5xl">{score}/{totalQuestions}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your English grammar and vocabulary performance has been computed with timed accuracy and category profiling.
        </p>
        <Button onClick={onRestart} className="mt-7 bg-emerald-600 text-white hover:bg-emerald-700">
          <RotateCcw className="h-4 w-4" />
          Restart Test
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Target, label: 'Accuracy', value: `${accuracy}%`, tone: 'text-cyan-700', bg: 'bg-cyan-50' },
            { icon: Clock, label: 'Time Taken', value: timeTaken, tone: 'text-slate-700', bg: 'bg-slate-50' },
            { icon: Award, label: 'Correct', value: correctCount.toString(), tone: 'text-emerald-700', bg: 'bg-emerald-50' },
            { icon: TrendingDown, label: 'Incorrect', value: incorrectCount.toString(), tone: 'text-red-700', bg: 'bg-red-50' },
          ].map(({ icon: Icon, label, value, tone, bg }) => (
            <div key={label} className={`rounded-lg border border-slate-200 p-4 ${bg}`}>
              <Icon className={`mb-3 h-5 w-5 ${tone}`} />
              <div className="text-xs font-bold text-slate-500">{label}</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-500">Unanswered</div>
            <div className="mt-1 text-xl font-bold text-slate-950">{unansweredCount}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-emerald-50 p-4">
            <TrendingUp className="mb-2 h-4 w-4 text-emerald-700" />
            <div className="text-xs font-bold text-slate-500">Strongest Category</div>
            <div className="mt-1 text-sm font-bold text-slate-950">{strongestCategory}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-red-50 p-4">
            <TrendingDown className="mb-2 h-4 w-4 text-red-700" />
            <div className="text-xs font-bold text-slate-500">Weakest Category</div>
            <div className="mt-1 text-sm font-bold text-slate-950">{weakestCategory}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
