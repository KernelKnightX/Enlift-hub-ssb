import { Check, Clock3, RadioTower, X } from 'lucide-react';
import type { PreparedEnglishQuestion } from '@/data/englishGrammarVocabularyQuestions';

interface EnglishQuestionCardProps {
  question: PreparedEnglishQuestion;
  questionIndex: number;
  totalQuestions: number;
  secondsLeft: number;
  selectedAnswer: string | null;
  locked: boolean;
  onSelectAnswer: (answer: string) => void;
}

const optionKeys = ['A', 'B', 'C', 'D'];

export function EnglishQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  secondsLeft,
  selectedAnswer,
  locked,
  onSelectAnswer,
}: EnglishQuestionCardProps) {
  const isWarning = secondsLeft <= 5;
  const timerPercent = (secondsLeft / 17) * 100;
  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <RadioTower className="h-4 w-4" />
              Verbal Aptitude Live Assessment
            </div>
            <h1 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">English Grammar & Vocabulary</h1>
          </div>
          <div className={`flex items-center gap-2 rounded-xl border px-5 py-3 ${isWarning ? 'border-red-200 bg-red-50 text-red-600' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            <Clock3 className="h-4 w-4" />
            <span className="text-2xl font-bold tabular-nums">{secondsLeft}</span>
            <span className="text-xs font-semibold">sec</span>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-500">Question {questionIndex + 1} of {totalQuestions}</div>
              <div className="mt-1 inline-flex rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                {question.category}
              </div>
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>

          <p className="min-h-28 text-xl font-semibold leading-8 text-slate-950 sm:text-2xl">{question.prompt}</p>

          <div className="mt-7 grid gap-3">
            {question.shuffledOptions.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = locked && option === question.correctAnswer;
              const isWrongSelection = locked && isSelected && option !== question.correctAnswer;

              return (
                <button
                  key={option}
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectAnswer(option)}
                  className={[
                    'group flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-left transition duration-200',
                    locked ? 'cursor-default' : 'hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md',
                    isSelected && !locked ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white',
                    isCorrect ? 'border-emerald-400 bg-emerald-50' : '',
                    isWrongSelection ? 'border-red-400 bg-red-50' : '',
                  ].join(' ')}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 bg-slate-50 text-sm font-bold text-slate-700">
                    {optionKeys[index]}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-800 sm:text-base">{option}</span>
                  {isCorrect && <Check className="h-5 w-5 text-emerald-600" />}
                  {isWrongSelection && <X className="h-5 w-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500">HUD Status</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Input Lock</div>
              <div className="mt-1 text-sm font-bold text-slate-900">{locked ? 'Locked' : 'Awaiting Response'}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Shortcut Keys</div>
              <div className="mt-1 text-sm font-bold text-slate-900">A / B / C / D</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Pause Control</div>
              <div className="mt-1 text-sm font-bold text-red-600">Disabled</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
