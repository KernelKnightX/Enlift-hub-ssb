import { Activity, Award, Clock, RotateCcw, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ListeningAnswerRecord } from '@/pages/ListeningTest/ListeningTestPage';

interface ListeningResultCardProps {
  score: number;
  totalQuestions: number;
  accuracy: number;
  averageReactionSpeed: number;
  correctWords: number;
  totalWords: number;
  answers: ListeningAnswerRecord[];
  onRestart: () => void;
}

export function ListeningResultCard({
  score,
  totalQuestions,
  accuracy,
  averageReactionSpeed,
  correctWords,
  totalWords,
  answers,
  onRestart,
}: ListeningResultCardProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-xl border bg-white p-6 text-slate-900 shadow-sm">
        <div>
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Award className="h-8 w-8" />
          </div>
          <div className="text-xs font-semibold text-emerald-600">Listening Assessment Complete</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{score}/{totalQuestions}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Final score is based on questions where all four transmitted words were recalled correctly.
          </p>
          <Button onClick={onRestart} className="mt-7 bg-emerald-600 text-white hover:bg-emerald-700">
            <RotateCcw className="h-4 w-4" />
            Restart Test
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 text-slate-900 shadow-sm sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: 'text-sky-600' },
            { icon: Activity, label: 'Reaction Speed', value: `${averageReactionSpeed.toFixed(1)}s`, color: 'text-amber-600' },
            { icon: Award, label: 'Correct Words', value: `${correctWords}/${totalWords}`, color: 'text-emerald-600' },
            { icon: Clock, label: 'Total Questions', value: totalQuestions.toString(), color: 'text-slate-700' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg border bg-slate-50 p-4">
              <Icon className={`mb-3 h-5 w-5 ${color}`} />
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</div>
              <div className="mt-1 text-2xl font-black">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border bg-slate-50 p-3">
          <div className="mb-3 text-xs font-semibold text-slate-500">Answer Review</div>
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div key={answer.questionId} className="rounded-lg border bg-white p-3">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Question {index + 1}</span>
                  <span className={answer.isQuestionCorrect ? 'text-emerald-300' : 'text-red-300'}>
                    {answer.isQuestionCorrect ? 'Correct' : answer.timedOut ? 'Timed Out' : 'Incorrect'}
                  </span>
                </div>
                <div className="text-xs leading-5 text-slate-600">
                  <span className="font-semibold text-slate-800">Correct:</span> {answer.correctAnswers.join(', ')}
                </div>
                <div className="text-xs leading-5 text-slate-600">
                  <span className="font-semibold text-slate-800">Selected:</span> {answer.selectedWords.length ? answer.selectedWords.join(', ') : 'No selection'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
