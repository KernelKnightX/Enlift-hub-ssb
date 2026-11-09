import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import type { TestType, TestStatus } from '@/types/enums';
import { Clock, CheckCircle, Home, RotateCcw, ArrowRight, Zap } from 'lucide-react';
import { paperFoldingQuestions } from '@/data/paperFoldingQuestions';

export default function PaperFoldingTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const set = searchParams.get('set') || 'set1';
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(paperFoldingQuestions.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per question
  const [isCompleted, setIsCompleted] = useState(false);
  const [testStartTime, setTestStartTime] = useState(new Date());
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isTestActive, setIsTestActive] = useState(false);

  // Countdown before the timed assessment begins.
  useEffect(() => {
    if (isTestActive || isCompleted) return;

    if (countdown <= 1) {
      const timer = setTimeout(() => {
        const now = new Date();
        setTestStartTime(now);
        setQuestionStartTime(now);
        setIsTestActive(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isCompleted, isTestActive]);

  // Timer effect
  useEffect(() => {
    if (isCompleted || !isTestActive) return;

    if (timeRemaining <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isCompleted, isTestActive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isCompleted || showFeedback || !isTestActive) return;

      const key = e.key.toLowerCase();
      if (key >= 'a' && key <= 'd') {
        const optionIndex = key.charCodeAt(0) - 'a'.charCodeAt(0);
        handleAnswerSelect(optionIndex);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, showFeedback, isCompleted, isTestActive]);

  // Fullscreen effect
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(optionIndex);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = optionIndex;
    setAnswers(updatedAnswers);

    const responseTime = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
    const updatedTimes = [...responseTimes];
    updatedTimes[currentIndex] = responseTime;
    setResponseTimes(updatedTimes);

    setShowFeedback(true);

    // Auto-next after 2 seconds
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleTimeout = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = null; // No answer selected
    setAnswers(updatedAnswers);

    const responseTime = 30; // Full time
    const updatedTimes = [...responseTimes];
    updatedTimes[currentIndex] = responseTime;
    setResponseTimes(updatedTimes);

    setShowFeedback(true);

    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentIndex < paperFoldingQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeRemaining(30);
      setQuestionStartTime(new Date());
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsCompleted(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercentage = ((currentIndex + 1) / paperFoldingQuestions.length) * 100;
  const isTimeRunningOut = timeRemaining <= 5;

  if (isCompleted) {
    const testEndTime = new Date();
    const totalTime = Math.floor((testEndTime.getTime() - testStartTime.getTime()) / 1000);

    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === paperFoldingQuestions[index].answer) {
        correctCount++;
      }
    });
    const accuracy = Math.round((correctCount / paperFoldingQuestions.length) * 100);
    const avgResponseTime = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;

    // Save practice session
    if (user) {
      const session = {
        id: crypto.randomUUID(),
        userId: user.id,
        testType: 'paper-folding' as TestType,
        set,
        startTime: testStartTime.toISOString(),
        endTime: testEndTime.toISOString(),
        status: 'completed' as TestStatus,
        score: accuracy,
        totalItems: paperFoldingQuestions.length,
        answeredItems: answeredCount,
        totalTimeMinutes: Math.floor(totalTime / 60),
        responses: answers.map(a => a?.toString() || '')
      };
      savePracticeSession(session);
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full border-2">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
              <p className="text-slate-600">
                Paper Folding & Hole Punching Test Assessment
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 py-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">{accuracy}%</p>
                <p className="text-sm text-slate-500">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">{correctCount}</p>
                <p className="text-sm text-slate-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-600">{paperFoldingQuestions.length - correctCount}</p>
                <p className="text-sm text-slate-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{avgResponseTime}s</p>
                <p className="text-sm text-slate-500">Avg Time</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="font-semibold mb-4">Test Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Questions:</span>
                  <span className="font-semibold">{paperFoldingQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Attempted:</span>
                  <span className="font-semibold">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Correct Answers:</span>
                  <span className="font-semibold text-emerald-600">{correctCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Time:</span>
                  <span className="font-semibold">{Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = paperFoldingQuestions[currentIndex];

  if (!isTestActive) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
        <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center rounded-xl border bg-white p-6 text-center shadow-sm">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Starting Set {set.replace('set', '')}</div>
            <div className="mt-6 text-8xl font-bold text-slate-900">{countdown}</div>
            <p className="mt-5 text-sm text-slate-600">Get ready. The first reasoning question will appear automatically.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-lg font-semibold">Paper Folding & Hole Punching Test</h1>
              <p className="text-sm text-slate-600">Select the correct unfolded pattern</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="border-slate-200 hover:bg-slate-50"
              >
                <Zap className="w-4 h-4 mr-1" />
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                isTimeRunningOut ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <Clock className={`w-5 h-5 ${isTimeRunningOut ? 'text-red-600' : 'text-emerald-600'}`} />
                <span className={`font-bold text-lg ${isTimeRunningOut ? 'text-red-600' : 'text-emerald-600'}`}>
                  {timeRemaining}s
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex gap-4">
              <span className="text-slate-600">Answered: <strong className="text-emerald-600">{answeredCount}</strong></span>
              <span className="text-slate-600">Question {currentIndex + 1} of {paperFoldingQuestions.length}</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Folded Paper */}
          <div className="space-y-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="text-base px-4 py-1">
                    Folded Paper
                  </Badge>
                </div>
                <div className="flex justify-center">
                  <img
                    src={currentQuestion.foldedPaper}
                    alt="Folded paper with hole punches"
                    className="max-w-full h-auto rounded-lg border-2 border-slate-200"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <ArrowRight className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-600 mt-2">Select the correct unfolded pattern</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    showFeedback
                      ? index === currentQuestion.answer
                        ? 'border-emerald-400 bg-emerald-50 shadow-lg'
                        : selectedAnswer === index
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-white opacity-50'
                      : selectedAnswer === index
                      ? 'border-emerald-400 bg-emerald-50 shadow-lg'
                      : 'border-slate-200 hover:border-emerald-400/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-500 mb-2">
                      Option {String.fromCharCode(65 + index)}
                    </div>
                    <img
                      src={option}
                      alt={`Option ${String.fromCharCode(65 + index)}`}
                      className="w-full h-auto rounded border border-slate-200"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  {showFeedback && index === currentQuestion.answer && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-slate-500">
              Use keyboard: A, B, C, D or click to select
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
