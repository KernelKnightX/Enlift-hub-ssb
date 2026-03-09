import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useTATImages } from '@/hooks/useTestData';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import { Clock, Eye, PenTool, Coffee, CheckCircle, Loader2, XCircle } from 'lucide-react';

type TestPhase = 'countdown' | 'viewing' | 'writing' | 'break' | 'completed';

export default function TATTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';

  // TAT has 11 pictures per set (plus 1 blank slide)
  const TOTAL_PICTURES = 11;

  // Images fetched from backend (admin-controlled)
  const { data: images, loading } = useTATImages(set, TOTAL_PICTURES);
  const { user } = useAuth();
  const startTimeRef = useRef<Date>(new Date());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<TestPhase>('countdown');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [countdown, setCountdown] = useState(3);

  const VIEW_TIME = 30;
  const WRITE_TIME = 240;
  const BREAK_TIME = 5;

  /* ---------------- COUNTDOWN TIMER ---------------- */
  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (phase === 'countdown' && countdown === 0) {
      setPhase('viewing');
    }
  }, [phase, countdown]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (phase === 'completed' || phase === 'countdown') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, currentIndex]);

  /* ---------------- PHASE TRANSITION ---------------- */
  const handlePhaseTransition = () => {
    if (phase === 'viewing') {
      setPhase('writing');
      setTimeRemaining(WRITE_TIME);
    } 
    else if (phase === 'writing') {
      setPhase('break');
      setTimeRemaining(BREAK_TIME);
    } 
    else if (phase === 'break') {
      if (currentIndex < TOTAL_PICTURES - 1) {
        setCurrentIndex(currentIndex + 1);
        setPhase('viewing');
        setTimeRemaining(VIEW_TIME);
      } else {
        setPhase('completed');
      }
    }
  };

  /* ================= QUIT TEST ================= */
  const handleQuit = () => {
    if (confirm('Are you sure you want to quit this test? Your progress will be saved.')) {
      if (user && currentIndex > 0) {
        const endTime = new Date();
        const totalTimeMinutes = (endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60);
        savePracticeSession({
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          testType: 'tat',
          set: set,
          startTime: startTimeRef.current.toISOString(),
          endTime: endTime.toISOString(),
          status: 'quit',
          score: 0,
          totalItems: TOTAL_PICTURES,
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

  if (phase === 'completed') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="max-w-xl w-full text-center p-8 border">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            TAT Set Completed
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You have successfully completed all {TOTAL_PICTURES} pictures in this set.
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
  const progress = ((currentIndex + 1) / TOTAL_PICTURES) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const phaseConfig = {
    countdown: {
      label: 'Get Ready',
      icon: <Clock className="w-5 h-5" />,
      note: 'Test will start soon',
    },
    viewing: {
      label: 'Picture Viewing',
      icon: <Eye className="w-5 h-5" />,
      note: 'Observe carefully. Picture will disappear automatically.',
    },
    writing: {
      label: 'Story Writing',
      icon: <PenTool className="w-5 h-5" />,
      note: 'Write your story on paper. No typing allowed.',
    },
    break: {
      label: 'Break Time',
      icon: <Coffee className="w-5 h-5" />,
      note: 'Relax, change paper, prepare for next picture.',
    },
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
            Observe the picture carefully when it appears
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
              Thematic Apperception Test (TAT)
            </h1>
            <p className="text-sm text-slate-600">
              Picture {currentIndex + 1} of {TOTAL_PICTURES}
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

        {/* Phase Indicator */}
        <div className="flex justify-center gap-4 mb-6">
          {(['viewing', 'writing', 'break'] as const).map((p) => (
            <div
              key={p}
              className={`px-5 py-2 rounded-md border text-sm font-medium flex items-center gap-2 ${
                phase === p
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              {phaseConfig[p].icon}
              {phaseConfig[p].label}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="border p-8 text-center">

          {/* Timer */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 px-8 py-4 border rounded-xl bg-slate-50">
              <Clock className="w-7 h-7 text-slate-700" />
              <div>
                <p className="text-xs text-slate-500">
                  {phaseConfig[phase].label}
                </p>
                <p className="text-3xl font-bold">
                  {phase === 'viewing' || phase === 'break'
                    ? `${timeRemaining}s`
                    : `${minutes}:${seconds.toString().padStart(2, '0')}`}
                </p>
              </div>
            </div>
          </div>

          {/* Picture */}
          {phase === 'viewing' && images[currentIndex] && (
            <div>
              <img
                src={images[currentIndex].url}
                alt="TAT"
                className="max-h-[420px] mx-auto rounded-lg border"
              />
            </div>
          )}

          {/* Writing / Break Text */}
          {phase !== 'viewing' && (
            <div className="text-sm text-slate-600 mt-6">
              {phaseConfig[phase].note}
            </div>
          )}

        </Card>

      </div>
    </div>
  );
}
