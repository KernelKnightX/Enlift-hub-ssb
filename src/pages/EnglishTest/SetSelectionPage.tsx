import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Lock,
  Star,
  FileText,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadRazorpayScript, createRazorpayOrder } from '@/lib/razorpay';
import { getSetPrice, isSetUnlocked, unlockSet } from '@/lib/setAccess';
import { getCompletedSets } from '@/utils/practiceHistory';
import { PracticeSetUnlockModal } from '@/components/practice/PracticeSetUnlockModal';
import { hasPremiumPlan } from '@/lib/premiumAccess';

export default function EnglishSetSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const FREE_SETS = 3;
  const isSetAvailable = (set: number) => set <= FREE_SETS || isSetUnlocked('english', set);
  
  // Load completed sets
  const completedSets = user ? getCompletedSets(user.id, 'english') : [];
  const isSetCompleted = (set: number) => completedSets.includes(`set${set}`);

  const handleSetClick = (set: number) => {
    if (!isSetAvailable(set)) {
      setSelectedSet(set);
      setShowPremiumModal(true);
      return;
    }
    setSelectedSet(set);
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      
      await createRazorpayOrder(
        user?.fullName || '',
        user?.email || '',
        user?.phoneNumber || '',
        'english',
        selectedSet || FREE_SETS + 1,
        getSetPrice(selectedSet || FREE_SETS + 1)
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to load payment gateway. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Test mode - unlock premium without payment (for testing only)
  const handleTestPremium = async () => {
    setLoading(true);
    try {
      unlockSet('english', selectedSet || FREE_SETS + 1);
      alert(`Set ${selectedSet || FREE_SETS + 1} unlocked for testing.`);
      setShowPremiumModal(false);
    } catch (error) {
      console.error('Test premium error:', error);
      alert('Failed to activate test premium. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
      <PracticeSetUnlockModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        testLabel="English"
        setNumber={selectedSet || FREE_SETS + 1}
        setPrice={getSetPrice(selectedSet || FREE_SETS + 1)}
        loading={loading}
        onPaySingleSet={handleRazorpayPayment}
      />

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            English Grammar Set Selection
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">SSB Screening Practice</Badge>
            <span className="text-emerald-600 font-medium">
              Select one English set
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-[#0b3d91] border-[#0b3d91] flex-1 sm:flex-none"
            onClick={() => {
              setSelectedSet(FREE_SETS + 1);
              setShowPremiumModal(true);
            }}
          >
            <Star className="w-4 h-4 mr-1" />
            {hasPremiumPlan('ssb-complete') ? 'All sets unlocked' : 'Unlock premium sets'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/english/instructions')}
            className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">

        {/* Emerald Info Box */}
        <div className="bg-emerald-100 text-emerald-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <strong>Important:</strong> Each English Grammar set contains <strong>50 questions</strong>. Total time: 25 minutes.
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">
          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Duration</p>
              <p className="text-slate-600 text-xs">25 minutes</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Questions</p>
              <p className="text-slate-600 text-xs">50 per set</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Format</p>
              <p className="text-slate-600 text-xs">MCQ</p>
            </div>
          </div>
        </div>

        {/* Set Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((setNum) => {
            const isLocked = !isSetAvailable(setNum);
            const isCompleted = isSetCompleted(setNum);

            return (
              <button
                key={setNum}
                onClick={() => handleSetClick(setNum)}
                disabled={false}
                className={`border rounded-lg p-3 sm:p-4 text-center transition relative ${
                  selectedSet === setNum
                    ? 'border-emerald-600 bg-emerald-50'
                    : isCompleted
                      ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                      : isLocked
                        ? 'bg-slate-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-emerald-400'
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
                  {isLocked ? '🔒' : isCompleted ? '✓ Completed' : '50 questions'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Set Summary */}
        {selectedSet && (
          <div className="border border-emerald-200 bg-emerald-50 rounded-md p-3 sm:p-4 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
            <p className="font-semibold mb-2 flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              Selected: Set {selectedSet}
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>50 questions in this set</li>
              <li>Grammar, vocabulary, synonyms, antonyms, and comprehension</li>
              <li>Total time: 25 minutes</li>
              <li>Submit once all answers are marked</li>
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedSet}
            onClick={() => navigate(`/english/test?set=set${selectedSet}&start=1`)}
            className="px-8 sm:px-12 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          >
            Start English Set {selectedSet}
          </Button>
          </div>

      </div>
    </div>
  );
}
