import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOIRQuestions } from '@/hooks/useTestData';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Grid,
  Home,
  Loader2,
  Menu,
  XCircle,
} from 'lucide-react';

export default function OIRTestPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();

  const setId = params.get('set') || 'set1';
  const count = parseInt(params.get('count') || '40');

  const { data: questions, loading } = useOIRQuestions(setId, count);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(count).fill(null));
  const [marked, setMarked] = useState(new Set());
  const [showPalette, setShowPalette] = useState(false);
  const [timeLeft, setTimeLeft] = useState(count * 30); // 30 seconds per question
  const [completed, setCompleted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const startTime = useState(new Date())[0];

  /* ================= COUNTDOWN TIMER ================= */
  useEffect(() => {
    if (!testStarted || countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [testStarted, countdown]);

  const startTest = () => {
    setTestStarted(true);
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (completed || timeLeft <= 0 || testStarted) return;
    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, completed]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const danger = timeLeft <= 300;

  const answeredCount = answers.filter(a => a !== null).length;
  const q = questions[current] || {};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto" />
          <p className="text-slate-600 text-sm sm:text-base">Loading test data...</p>
        </div>
      </div>
    );
  }

  // Countdown screen
  if (testStarted && countdown > 0) {
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
            Answer all questions to the best of your ability
          </p>
        </div>
      </div>
    );
  }

  // Start button (before countdown)
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <h2 className="text-xl font-semibold mb-4">OIR Test Ready</h2>
          <p className="text-sm text-slate-600 mb-6">
            You are about to start the OIR test with {count} questions.
          </p>
          <Button size="lg" onClick={() => setTestStarted(true)} className="w-full">
            Start Test
          </Button>
        </Card>
      </div>
    );
  }

  const handleAnswer = (idx: number) => {
    const copy = [...answers];
    copy[current] = idx;
    setAnswers(copy);

    // Auto-advance for OIR
    if (current < count - 1) {
      setTimeout(() => setCurrent(c => c + 1), 500);
    }
  };

  const handleSubmit = () => {
    setCompleted(true);
    const endTime = new Date();
    const totalTimeMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    // Calculate score (mock scoring - in real app, this would compare with correct answers)
    const score = Math.round((answeredCount / count) * 100);

    if (user) {
      savePracticeSession({
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        testType: 'oir',
        set: setId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'completed',
        score,
        totalItems: count,
        answeredItems: answeredCount,
        totalTimeMinutes,
        responses: answers.map(a => a?.toString() || '')
      });
    }

    navigate('/dashboard', {
      state: {
        testResult: {
          type: 'oir',
          score,
          totalQuestions: count,
          answeredQuestions: answeredCount,
          timeSpent: totalTimeMinutes
        }
      }
    });
  };

  /* ================= QUIT TEST ================= */
  const handleQuit = () => {
    if (confirm('Are you sure you want to quit this test? Your progress will be saved.')) {
      if (user && current > 0) {
        const endTime = new Date();
        const totalTimeMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        const score = Math.round((answeredCount / count) * 100);
        savePracticeSession({
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          testType: 'oir',
          set: setId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: 'quit',
          score: score,
          totalItems: count,
          answeredItems: answeredCount,
          totalTimeMinutes,
          responses: answers.map(a => a?.toString() || '')
        });
      }
      navigate('/dashboard');
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Test Completed!</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your OIR test has been submitted successfully.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center gap-2">
          <div>
            <p className="text-sm font-semibold">OIR Test</p>
            <p className="text-xs text-muted-foreground">
              Q {current + 1} / {count}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-1 rounded flex items-center gap-1 sm:gap-2 ${
                danger ? 'bg-red-100 text-red-600' : 'bg-muted'
              }`}
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-sm font-semibold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleQuit}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Quit</span>
            </Button>
          </div>

          {/* Mobile palette toggle */}
          <button
            className="sm:hidden p-2 bg-muted rounded"
            onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        <Progress value={(answeredCount / count) * 100} className="h-1" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4 grid lg:grid-cols-4 gap-4 sm:gap-6">

        {/* MAIN AREA */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">

              <Badge variant="outline" className="text-xs sm:text-sm">
                Question {current + 1}
              </Badge>

              {/* IMAGE */}
              <div className="border rounded p-2 bg-white">
                <img
                  src={q.imageUrl || 'https://via.placeholder.com/600x400'}
                  alt="Question"
                  className="w-full max-h-48 sm:max-h-64 object-contain"
                />
              </div>

              {/* OPTIONS */}
              <div className="space-y-2 sm:space-y-3">
                {(q.options || ['Option A', 'Option B', 'Option C', 'Option D'])
                  .map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full p-3 sm:p-4 border rounded text-left text-sm sm:text-base transition-colors ${
                        answers[current] === i
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
              </div>

              <Separator className="my-4" />

              {/* NAVIGATION */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <Button
                  variant="outline"
                  disabled={current === 0}
                  onClick={() => setCurrent(c => c - 1)}
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const m = new Set(marked);
                      m.has(current) ? m.delete(current) : m.add(current);
                      setMarked(m);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    <span className="sm:hidden">{marked.has(current) ? 'Marked' : 'Mark'}</span>
                  </Button>

                  {current === count - 1 ? (
                    <Button
                      onClick={() => setShowSubmitDialog(true)}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrent(c => c + 1)}
                      className="flex-1 sm:flex-none text-sm sm:text-base"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* PALETTE DESKTOP */}
        <div className="hidden lg:block">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Question Palette</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPalette(!showPalette)}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>

              {showPalette && (
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: count }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-8 h-8 rounded text-xs font-semibold ${
                        i === current
                          ? 'bg-primary text-white'
                          : answers[i] !== null
                          ? 'bg-green-100 text-green-800'
                          : marked.has(i)
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Not visited</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Palette Modal */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <Card className="w-full max-w-lg mx-4 mb-4 sm:mb-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Question Palette</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobilePaletteOpen(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                {Array.from({ length: count }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrent(i);
                      setMobilePaletteOpen(false);
                    }}
                    className={`w-full aspect-square rounded text-xs font-semibold ${
                      i === current
                        ? 'bg-primary text-white'
                        : answers[i] !== null
                        ? 'bg-green-100 text-green-800'
                        : marked.has(i)
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Not visited</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm sm:max-w-md">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Submit Test?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have answered {answeredCount} out of {count} questions.
                {marked.size > 0 && ` ${marked.size} questions are marked for review.`}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1"
                >
                  Continue Test
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Submit Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
