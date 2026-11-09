import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Lock,
  Star,
  Crown,
  BookOpen,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadRazorpayScript, createRazorpayOrder } from '@/lib/razorpay';
import { getCompletedSets } from '@/utils/practiceHistory';

export default function SRTSetSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedSets, setCompletedSets] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const refreshKeyRef = useRef(0); // Force refresh on navigation

  const isPremium = user?.isPremium || false;
  const FREE_SETS = 5;

  // Load completed sets - refresh when navigating back from test
  useEffect(() => {
    loadCompletedSets();
  }, [user, refreshKeyRef.current]);

  const loadCompletedSets = () => {
    if (user) {
      setRefreshing(true);
      const completed = getCompletedSets(user.id, 'srt');
      setCompletedSets(completed);
      // Small delay to show refresh animation
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  // Refresh when page becomes visible (user returns from test)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCompletedSets();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSetClick = (set: number) => {
    if (set > FREE_SETS && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setSelectedSet(set);
  };

  const handleStartTest = () => {
    if (selectedSet) {
      refreshKeyRef.current++; // Increment to force refresh on next mount
      navigate(`/srt/test?set=set${selectedSet}`);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      
      if (!user) {
        alert('Please login first');
        setShowPremiumModal(false);
        navigate('/login');
        return;
      }

      await createRazorpayOrder(
        user.fullName,
        user.email,
        user.phoneNumber || ''
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
    if (!user) {
      alert('Please login first');
      setShowPremiumModal(false);
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const { upgradeUserToPremium } = await import('@/lib/razorpay');
      await upgradeUserToPremium('test_payment_' + Date.now());
      alert('🎉 Premium activated for testing! All sets are now unlocked.');
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

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Unlock All 10 Sets</h2>
              <p className="text-slate-600 mb-4 sm:mb-6 text-sm">
                Get access to Sets 6-10 and practice with all SRT scenarios!
              </p>
              
              <div className="bg-amber-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
                <p className="font-semibold text-amber-800 mb-2 text-sm">Premium Benefits:</p>
                <ul className="text-xs sm:text-sm text-amber-700 space-y-1">
                  <li>✓ Access to Sets 6-10</li>
                  <li>✓ All WAT, TAT, PPDT sets</li>
                  <li>✓ Priority support</li>
                  <li>✓ No advertisements</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPremiumModal(false)}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Pay ₹1'}
                </Button>
              </div>
              <p className="text-xs text-center text-slate-500 mt-3">
                Test mode: QR payment may not work. Use "Pay ₹1" card payment or click below to test.
              </p>
              <Button
                variant="link"
                className="w-full mt-2 text-xs text-blue-600"
                onClick={handleTestPremium}
                disabled={loading}
              >
                🧪 Test Premium (No Payment)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            SRT Set Selection
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">SSB Psychological Test</Badge>
            <span className="text-rose-600 font-medium">
              Select one SRT set
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={loadCompletedSets}
            className="flex items-center gap-2 flex-1 sm:flex-none justify-center mr-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

          {isPremium ? (
            <Badge className="bg-amber-500 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-amber-600 border-amber-300 flex-1 sm:flex-none"
              onClick={() => setShowPremiumModal(true)}
            >
              <Star className="w-4 h-4 mr-1" />
              Upgrade - ₹1
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/srt/instructions')}
            className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">

        {/* Rose Info Box */}
        <div className="bg-rose-100 text-rose-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <strong>Important:</strong> Each SRT set contains <strong>60 situations</strong>. Total time: 30 minutes (30 seconds per situation).
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Per Situation</p>
              <p className="text-slate-600 text-xs">30 seconds</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Total Time</p>
              <p className="text-slate-600 text-xs">30 minutes</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Situations</p>
              <p className="text-slate-600 text-xs">60 per set</p>
            </div>
          </div>

        </div>

        {/* Set Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((setNum) => {
            const setKey = `set${setNum}`;
            const isCompleted = completedSets.includes(setKey);
            const isLocked = setNum > FREE_SETS && !isPremium;
            const isSelected = selectedSet === setNum;
            
            return (
              <button
                key={setNum}
                onClick={() => handleSetClick(setNum)}
                disabled={isLocked}
                className={`border rounded-lg p-3 sm:p-4 text-center transition relative ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50'
                    : isCompleted
                      ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                      : isLocked
                        ? 'bg-slate-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-rose-400'
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
                
                <p className={`text-sm sm:text-base font-semibold ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                  Set {setNum}
                </p>
                <p className={`text-xs mt-1 ${isLocked ? 'text-slate-300' : isCompleted ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {isLocked ? '🔒' : isCompleted ? '✓ Completed' : '60 situations'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Set Summary */}
        {selectedSet && (
          <div className="border border-rose-200 bg-rose-50 rounded-md p-3 sm:p-4 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
            <p className="font-semibold mb-2 flex items-center gap-2 text-rose-700">
              <CheckCircle className="w-4 h-4" />
              Selected: Set {selectedSet}
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>60 situations in this set</li>
              <li>30 seconds per situation</li>
              <li>Total time: 30 minutes</li>
              <li>Timer auto-advances to next situation</li>
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedSet}
            onClick={handleStartTest}
            className="px-8 sm:px-12 bg-rose-600 hover:bg-rose-700 w-full sm:w-auto"
          >
            Start SRT Set {selectedSet}
          </Button>
        </div>

      </div>
    </div>
  );
}
