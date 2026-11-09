import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  Coffee,
  CheckCircle,
  Lock,
  Star,
  Brain,
  FileQuestion,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadRazorpayScript, createRazorpayOrder } from '@/lib/razorpay';
import { getSetPrice, isSetUnlocked, unlockSet } from '@/lib/setAccess';
import { PracticeSetUnlockModal } from '@/components/practice/PracticeSetUnlockModal';
import { hasPremiumPlan } from '@/lib/premiumAccess';

export default function OIRSetSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const FREE_SETS = 5;
  const isSetAvailable = (set: number) => set <= FREE_SETS || isSetUnlocked('oir', set);

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
        'oir',
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
      unlockSet('oir', selectedSet || FREE_SETS + 1);
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
        testLabel="OIR"
        setNumber={selectedSet || FREE_SETS + 1}
        setPrice={getSetPrice(selectedSet || FREE_SETS + 1)}
        loading={loading}
        onPaySingleSet={handleRazorpayPayment}
      />

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            OIR Set Selection
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">SSB Psychological Test</Badge>
            <span className="text-teal-600 font-medium">
              Select one OIR set
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
            onClick={() => navigate('/oir/instructions')}
            className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">

        {/* Teal Info Box */}
        <div className="bg-teal-100 text-teal-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <strong>Important:</strong> Each OIR set contains <strong>40 questions</strong> (20 verbal + 20 non-verbal) with
          automatic progression.
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <FileQuestion className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Questions</p>
              <p className="text-slate-600 text-xs">40 total</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Brain className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Options</p>
              <p className="text-slate-600 text-xs">4 per question</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Coffee className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Auto Flow</p>
              <p className="text-slate-600 text-xs">Auto-advance</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Duration</p>
              <p className="text-slate-600 text-xs">~27 minutes</p>
            </div>
          </div>

        </div>

        {/* Set Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((set) => {
            const isLocked = !isSetAvailable(set);
            
            return (
              <button
                key={set}
                onClick={() => handleSetClick(set)}
                disabled={false}
                className={`border rounded-lg p-3 sm:p-4 text-center transition relative ${
                  selectedSet === set
                    ? 'border-teal-600 bg-teal-50'
                    : isLocked
                      ? 'bg-slate-50 cursor-not-allowed'
                      : 'border-slate-200 hover:border-teal-400'
                }`}
              >
                {isLocked && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                  </div>
                )}
                
                <p className={`text-sm sm:text-base font-semibold ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                  Set {set}
                </p>
                <p className={`text-xs mt-1 ${isLocked ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isLocked ? '🔒' : '40 Q'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Set Summary */}
        {selectedSet && (
          <div className="border border-teal-200 bg-teal-50 rounded-md p-3 sm:p-4 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
            <p className="font-semibold mb-2 flex items-center gap-2 text-teal-700">
              <CheckCircle className="w-4 h-4" />
              Selected: Set {selectedSet}
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>40 questions (20 verbal + 20 non-verbal)</li>
              <li>40 seconds per question</li>
              <li>Select answer (A, B, C, or D)</li>
              <li>Automatic progression</li>
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedSet}
            onClick={() => navigate(`/oir/test?set=set${selectedSet}`)}
            className="px-8 sm:px-12 bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
          >
            Start OIR Set {selectedSet}
          </Button>
        </div>

      </div>
    </div>
  );
}
