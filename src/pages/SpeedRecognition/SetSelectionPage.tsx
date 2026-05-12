import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Clock, Crown, Lock, Radar, Star, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getCompletedSets } from '@/utils/practiceHistory';

export default function SpeedRecognitionSetSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const isPremium = user?.isPremium || false;
  const freeSets = 3;
  const completedSets = user ? getCompletedSets(user.id, 'speed-recognition') : [];

  const handleSetClick = (setNum: number) => {
    if (setNum > freeSets && !isPremium) return;
    setSelectedSet(setNum);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">Speed Recognition Set Selection</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Cognitive Speed Test</Badge>
            <span className="text-amber-600 font-medium">Select one speed recognition set</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {isPremium ? (
            <Badge className="bg-amber-500 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-700 border-amber-300">
              <Star className="w-3 h-3 mr-1" />
              Free Sets 1-3
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/speed-recognition/instructions')}
            className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">
        <div className="bg-amber-100 text-amber-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <strong>Important:</strong> Each Speed Recognition set contains <strong>30 targets</strong>. Total active time: 90 seconds (3 seconds per target).
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">
          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Radar className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Target</p>
              <p className="text-slate-600 text-xs">One object</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Per Target</p>
              <p className="text-slate-600 text-xs">3 seconds</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Target className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Questions</p>
              <p className="text-slate-600 text-xs">30 per set</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((setNum) => {
            const isLocked = setNum > freeSets && !isPremium;
            const isCompleted = completedSets.includes(`set${setNum}`);
            const isSelected = selectedSet === setNum;

            return (
              <button
                key={setNum}
                disabled={isLocked}
                onClick={() => handleSetClick(setNum)}
                className={`border rounded-lg p-3 sm:p-4 text-center transition relative ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50'
                    : isCompleted
                      ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                      : isLocked
                        ? 'bg-slate-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-amber-400'
                }`}
              >
                {isLocked && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                  </div>
                )}
                {isCompleted && !isLocked && (
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                )}
                <p className={`text-sm sm:text-base font-semibold ${isLocked ? 'text-slate-400' : isCompleted ? 'text-emerald-700' : 'text-slate-900'}`}>
                  Set {setNum}
                </p>
                <p className={`text-xs mt-1 ${isLocked ? 'text-slate-300' : isCompleted ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {isLocked ? '🔒' : isCompleted ? '✓ Completed' : '30 targets'}
                </p>
              </button>
            );
          })}
        </div>

        {selectedSet && (
          <div className="border border-amber-200 bg-amber-50 rounded-md p-3 sm:p-4 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
            <p className="font-semibold mb-2 flex items-center gap-2 text-amber-700">
              <CheckCircle className="w-4 h-4" />
              Selected: Set {selectedSet}
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>30 target recognition questions</li>
              <li>3 seconds per target</li>
              <li>Keyboard shortcuts: A, B, C, D</li>
              <li>Auto-submit on timeout</li>
            </ul>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedSet}
            onClick={() => navigate(`/speed-recognition/test?set=set${selectedSet}&start=1`)}
            className="px-8 sm:px-12 bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
          >
            <Zap className="w-4 h-4 mr-2" />
            Start Speed Set {selectedSet}
          </Button>
        </div>
      </div>
    </div>
  );
}
