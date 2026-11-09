import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import type { TestType, TestStatus } from '@/types/enums';
import { Clock, CheckCircle, Home, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useVIITQuestions } from '@/hooks/useTestData';

export default function VIITTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const count = parseInt(searchParams.get('count') || '40');
  const set = searchParams.get('set') || 'set1';

  const { data: questions, loading: questionsLoading } = useVIITQuestions(set, count);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(count).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [testStartTime] = useState(new Date());
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  // Timer effect
  useEffect(() => {
    if (isCompleted || timeRemaining <= 0) {
      if (timeRemaining <= 0 && !isCompleted) {
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, timeRemaining]);

  const handleAnswerSelect = (optionIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < count - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentIndex)) {
      newMarked.delete(currentIndex);
    } else {
      newMarked.add(currentIndex);
    }
    setMarkedForReview(newMarked);
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSubmit = () => {
    setIsCompleted(true);
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const unansweredCount = count - answeredCount;
  const progressPercentage = (answeredCount / count) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isTimeRunningOut = timeRemaining <= 300; // 5 minutes

  if (isCompleted) {
    const testEndTime = new Date();
    const totalTime = Math.floor((testEndTime.getTime() - testStartTime.getTime()) / 1000 / 60);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / count) * 100);

    // Save practice session
    if (user) {
      const session = {
        id: crypto.randomUUID(),
        userId: user.id,
        testType: 'viit' as TestType,
        set,
        startTime: testStartTime.toISOString(),
        endTime: testEndTime.toISOString(),
        status: 'completed' as TestStatus,
        score,
        totalItems: count,
        answeredItems: answeredCount,
        totalTimeMinutes: totalTime,
        responses: answers.map(a => a?.toString() || '')
      };
      savePracticeSession(session);
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full border-2">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>

            <div>
              <h2 className="heading-lg mb-2">Test Completed!</h2>
              <p className="body-md text-muted-foreground">
                You have successfully completed the Verbal Intelligence Test
              </p>
            </div>

            <Separator />

            <div className="grid md:grid-cols-4 gap-6 py-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{score}%</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{correctCount}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{count - correctCount}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalTime}m</p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Test Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attempted:</span>
                  <span className="font-semibold">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correct Answers:</span>
                  <span className="font-semibold text-success">{correctCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incorrect Answers:</span>
                  <span className="font-semibold text-destructive">{count - correctCount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="heading-md">Verbal Intelligence Test</h1>
              <p className="text-sm text-muted-foreground">Select the most appropriate answer</p>
            </div>
            <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isTimeRunningOut ? 'bg-destructive/10 border-2 border-destructive' : 'bg-primary/5'
              }`}>
                <Clock className={`w-5 h-5 ${isTimeRunningOut ? 'text-destructive' : 'text-primary'}`} />
                <span className={`font-bold text-lg ${isTimeRunningOut ? 'text-destructive' : 'text-primary'}`}>
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <span className="text-muted-foreground">Answered: <strong className="text-success">{answeredCount}</strong></span>
              <span className="text-muted-foreground">Unanswered: <strong className="text-warning">{unansweredCount}</strong></span>
              <span className="text-muted-foreground">Marked: <strong className="text-primary">{markedForReview.size}</strong></span>
            </div>
            <span className="text-muted-foreground">Question {currentIndex + 1} of {count}</span>
          </div>
          <Progress value={progressPercentage} className="mt-3 h-2" />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="border-2">
              <CardContent className="p-6">
                {/* Question Number */}
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="outline" className="text-base px-4 py-1">
                    Question {currentIndex + 1}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkForReview}
                    className={markedForReview.has(currentIndex) ? 'border-primary bg-primary/5' : ''}
                  >
                    <Flag className={`w-4 h-4 mr-2 ${markedForReview.has(currentIndex) ? 'fill-primary' : ''}`} />
                    {markedForReview.has(currentIndex) ? 'Marked' : 'Mark for Review'}
                  </Button>
                </div>

                <Separator className="mb-6" />

                {/* Question Text */}
                <div className="mb-6">
                  <p className="text-lg font-medium leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold mb-3">Select your answer:</p>
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        answers[currentIndex] === index
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          answers[currentIndex] === index
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {answers[currentIndex] === index && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={currentIndex === count - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Palette */}
          <div className="lg:col-span-1">
            <Card className="border-2 sticky top-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">Question Palette</h3>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                        index === currentIndex
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : answers[index] !== null
                          ? 'bg-success/20 text-success border-2 border-success'
                          : markedForReview.has(index)
                          ? 'bg-primary/10 text-primary border-2 border-primary'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-success/20 border-2 border-success" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 border-2 border-primary" />
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-muted" />
                    <span>Not Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                      •
                    </div>
                    <span>Current</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSubmit}
                >
                  Submit Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}