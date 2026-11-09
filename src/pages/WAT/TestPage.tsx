import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useWATWords } from '@/hooks/useTestData';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import { Clock, FileText, CheckCircle, Loader2, XCircle } from 'lucide-react';

type TestPhase = 'countdown' | 'word' | 'completed';

export default function WATTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';

  // WAT typically has 60 words per set
  const TOTAL_WORDS = 60;

  // Words fetched from backend (admin-controlled)
  const { user } = useAuth();
  const { data: words, loading } = useWATWords(set, TOTAL_WORDS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<TestPhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const startTimeRef = useRef<Date>(new Date());

  const WORD_TIME = 15;

  /* ---------------- COUNTDOWN TIMER ---------------- */
  useEffect(() => {
    if (phase !== 'countdown') return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('word');
    }
  }, [phase, countdown]);
  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (completed || phase !== 'word') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextWord();
          return WORD_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, completed, phase]);

  /* ---------------- NEXT WORD ---------------- */
  const handleNextWord = () => {
    if (currentIndex < TOTAL_WORDS - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeRemaining(WORD_TIME);
    } else {
      saveCompletedSession();
      setCompleted(true);
    }
  };

  /* ---------------- SAVE COMPLETED SESSION ---------------- */
  const saveCompletedSession = () => {
    if (user) {
      const endTime = new Date();
      const totalTimeMinutes = (endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60);
      savePracticeSession({
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        testType: 'wat',
        set: set,
        startTime: startTimeRef.current.toISOString(),
        endTime: endTime.toISOString(),
        status: 'completed',
        score: 100,
        totalItems: TOTAL_WORDS,
        answeredItems: TOTAL_WORDS,
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
          testType: 'wat',
          set: set,
          startTime: startTimeRef.current.toISOString(),
          endTime: endTime.toISOString(),
          status: 'quit',
          score: 0,
          totalItems: TOTAL_WORDS,
          answeredItems: currentIndex,
          totalTimeMinutes,
          responses: []
        });
      }
      navigate('/dashboard');
    }
  };

  /* ---------------- COMPLETED ---------------- */

  // Loading state
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

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="max-w-xl w-full text-center p-8 border">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            WAT Set Completed
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You have successfully completed all {TOTAL_WORDS} words in this set.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  /* ---------------- UI HELPERS ---------------- */
  const progress = ((currentIndex + 1) / TOTAL_WORDS) * 100;
  
  // Timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 5) return 'text-red-600';
    if (timeRemaining <= 10) return 'text-amber-600';
    return 'text-emerald-600';
  };
  
  const getTimerBgColor = () => {
    if (timeRemaining <= 5) return 'bg-red-50 border-red-200';
    if (timeRemaining <= 10) return 'bg-amber-50 border-amber-200';
    return 'bg-emerald-50 border-emerald-200';
  };

  /* ---------------- MAIN RENDER ---------------- */
  // Countdown screen
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
            Write your responses on paper
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              Word Association Test (WAT)
            </h1>
            <p className="text-sm text-slate-600">
              Word {currentIndex + 1} of {TOTAL_WORDS}
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
          <div className={`flex justify-center mb-6 transition-colors duration-300`}>
            <div className={`flex items-center gap-3 px-8 py-4 border-2 rounded-2xl ${getTimerBgColor()} transition-colors duration-300`}>
              <Clock className={`w-8 h-8 ${getTimerColor()} transition-colors duration-300`} />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Time Remaining
                </p>
                <p className={`text-5xl font-bold ${getTimerColor()} transition-colors duration-300 tabular-nums`}>
                  {timeRemaining}
                </p>
              </div>
            </div>
          </div>

          {/* Word Display */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                Word {currentIndex + 1} of {TOTAL_WORDS}
              </span>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-12 mb-6 border-2 border-slate-200 shadow-sm">
              <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                {words[currentIndex]?.word || '...'}
              </h2>
            </div>
            <p className="text-lg text-slate-600 font-medium">
              Write a complete sentence using this word
            </p>
          </div>


          {/* Instructions */}
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Use word meaningfully
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Show positive thinking
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Timer auto-advances
            </span>
          </div>

        </Card>

      </div>
    </div>
  );
}
