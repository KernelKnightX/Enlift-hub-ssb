import { Check, X } from 'lucide-react';
import { LISTENING_TEST_REQUIRED_SELECTIONS } from '@/data/listeningTestQuestions';

interface ListeningWordGridProps {
  options: string[];
  selectedWords: string[];
  correctAnswers: string[];
  locked: boolean;
  onToggleWord: (word: string) => void;
}

export function ListeningWordGrid({
  options,
  selectedWords,
  correctAnswers,
  locked,
  onToggleWord,
}: ListeningWordGridProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-emerald-600">Select Heard Words</div>
          <div className="mt-1 text-sm text-slate-400">{selectedWords.length}/{LISTENING_TEST_REQUIRED_SELECTIONS} selected</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((word, index) => {
          const isSelected = selectedWords.includes(word);
          const isCorrect = correctAnswers.includes(word);
          const isWrongSelection = locked && isSelected && !isCorrect;
          const isMissed = locked && !isSelected && isCorrect;

          return (
            <button
              key={`${word}-${index}`}
              type="button"
              disabled={locked || (!isSelected && selectedWords.length >= LISTENING_TEST_REQUIRED_SELECTIONS)}
              onClick={() => onToggleWord(word)}
              className={[
                'relative min-h-20 rounded-lg border px-3 py-4 text-center text-base font-semibold transition duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
                locked ? 'cursor-default' : 'hover:border-emerald-300 hover:bg-emerald-50',
                isSelected && !locked ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-900',
                !isSelected && selectedWords.length >= LISTENING_TEST_REQUIRED_SELECTIONS && !locked ? 'opacity-50' : '',
                locked && isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : '',
                isWrongSelection ? 'border-red-300 bg-red-50 text-red-700' : '',
                isMissed ? 'ring-1 ring-emerald-300/60' : '',
              ].join(' ')}
            >
              <span>{word}</span>
              {locked && isCorrect && <Check className="absolute right-2 top-2 h-4 w-4 text-emerald-300" />}
              {isWrongSelection && <X className="absolute right-2 top-2 h-4 w-4 text-red-300" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
