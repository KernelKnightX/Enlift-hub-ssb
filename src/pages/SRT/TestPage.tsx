import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useSRTSituations } from '@/hooks/useTestData';
import { Clock, FileText, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';

type TestPhase = 'countdown' | 'situation' | 'completed';

export default function SRTTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';

  // SRT: 30 minutes for 60 situations = 30 seconds per situation
  const TOTAL_SITUATIONS = 60;
  const SITUATION_TIME = 30; // 30 seconds per situation

  // Situations fetched from backend (admin-controlled)
  const { data: situations, loading } = useSRTSituations(set, TOTAL_SITUATIONS);
  const { user } = useAuth();
  const startTimeRef = useRef<Date>(new Date());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(SITUATION_TIME);
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<TestPhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [testCompleted, setTestCompleted] = useState(false); // Separate flag to prevent 61

  /* ---------------- COUNTDOWN TIMER ---------------- */
  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (phase === 'countdown' && countdown === 0) {
      setPhase('situation');
      setTimeRemaining(SITUATION_TIME);
    }
  }, [phase, countdown]);

  /* ---------------- SITUATION TIMER ---------------- */
  useEffect(() => {
    // Don't run timer if test is already completed
    if (testCompleted || completed || phase !== 'situation') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - advance to next situation
          handleNextSituation();
          return SITUATION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, completed, currentIndex, testCompleted]);

  /* ---------------- NEXT SITUATION ---------------- */
  const handleNextSituation = useCallback(() => {
    // Prevent advancing if already completed
    if (testCompleted || completed) return;
    
    if (currentIndex < TOTAL_SITUATIONS - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeRemaining(SITUATION_TIME);
    } else {
      // All situations completed
      setTestCompleted(true);
      setCompleted(true);
      setPhase('completed');
      saveCompletedSession();
    }
  }, [currentIndex, testCompleted, completed]);

  /* ---------------- SAVE COMPLETED SESSION ---------------- */
  const saveCompletedSession = () => {
    if (user) {
      const endTime = new Date();
      const totalTimeMinutes = (endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60);
      
      savePracticeSession({
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        testType: 'srt',
        set: set,
        startTime: startTimeRef.current.toISOString(),
        endTime: endTime.toISOString(),
        status: 'completed',
        score: 100,
        totalItems: TOTAL_SITUATIONS,
        answeredItems: TOTAL_SITUATIONS,
        totalTimeMinutes,
        responses: []
      });
    }
  };

  /* ---------------- QUIT TEST ---------------- */
  const handleQuit = () => {
    if (confirm('Are you sure you want to quit this test? Your progress will be saved.')) {
      if (user && currentIndex > 0) {
        const endTime = new Date();
        const totalTimeMinutes = (endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60);
        
        savePracticeSession({
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          testType: 'srt',
          set: set,
          startTime: startTimeRef.current.toISOString(),
          endTime: endTime.toISOString(),
          status: 'quit',
          score: 0,
          totalItems: TOTAL_SITUATIONS,
          answeredItems: currentIndex,
          totalTimeMinutes,
          responses: []
        });
      }
      navigate('/dashboard');
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600">Loading test data...</p>
        </div>
      </div>
    );
  }

  /* ---------------- COMPLETED STATE ---------------- */
  if (completed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="max-w-xl w-full text-center p-8 border">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {set} Completed!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You have successfully completed all {TOTAL_SITUATIONS} situations in {set}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/srt/sets')}
              className="px-6 py-3 bg-rose-600 text-white rounded-md font-medium hover:bg-rose-700"
            >
              Select Another Set
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50"
            >
              Back to Dashboard
            </button>
          </div>
        </Card>
      </div>
    );
  }

  /* ---------------- UI HELPERS ---------------- */
  const progress = ((currentIndex + 1) / TOTAL_SITUATIONS) * 100;

  /* ---------------- COUNTDOWN SCREEN ---------------- */
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl font-bold text-white mb-4 animate-pulse">
            {countdown}
          </div>
          <p className="text-xl text-slate-300">
            Get ready! Test will start soon...
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Write your responses on paper • 30 seconds per situation
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN TEST SCREEN ---------------- */
  return (
    <div className="min-h-screen bg-white px-6 py-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              Situation Reaction Test (SRT)
            </h1>
            <p className="text-sm text-slate-600">
              Situation {currentIndex + 1} of {TOTAL_SITUATIONS}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 mr-2">
              Set: {set}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleQuit}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Quit Test
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2 mb-6" />

        {/* Main Card */}
        <Card className="border p-8 text-center">

          {/* Timer */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 px-10 py-5 border rounded-xl bg-slate-50">
              <Clock className="w-8 h-8 text-slate-700" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Time Remaining
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {timeRemaining}s
                </p>
              </div>
            </div>
          </div>

          {/* Situation Display - Large and Clear */}
          <div className="mb-8">
            <FileText className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 leading-relaxed">
              {situations[currentIndex]?.situation || 'Loading...'}
            </h2>
          </div>

          {/* Instructions */}
          <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4 inline-block">
            <p>
              <strong>Write your response on paper</strong> • Be concise, practical, and show leadership
            </p>
          </div>

        </Card>

        {/* Timer Progress Bar */}
        <div className="mt-4">
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${timeRemaining <= 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${(timeRemaining / SITUATION_TIME) * 100}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
