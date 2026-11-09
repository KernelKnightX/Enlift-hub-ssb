import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import { Clock, ChevronLeft, ChevronRight, Flag, Grid } from 'lucide-react';
import { useTestQuestions, useTestConfig } from '@/hooks/useTestData';
import type { TestType } from '@/types/enums';

interface TestEngineProps {
  testType: TestType;
  setId: string;
  count: number;
}

export default function TestEngine({ testType, setId, count }: TestEngineProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const config = useTestConfig(testType);
  const questions = useTestQuestions(testType, setId, count);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(count).fill(null));
  const [marked, setMarked] = useState(new Set());
  const [showPalette, setShowPalette] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.totalTime * 60 || count * (config.timerPerQuestion || 0));
  const [completed, setCompleted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const startTime = useState(new Date())[0];

  /* ================= TIMER ================= */
  useEffect(() => {
    if (completed || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, completed]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const danger = timeLeft <= 300;

  const handleAnswer = (idx: number) => {
    const copy = [...answers];
    copy[current] = idx;
    setAnswers(copy);

    // Auto-advance for certain test types
    if (config.autoAdvance && current < count - 1) {
      setTimeout(() => setCurrent(c => c + 1), 500);
    }
  };

  const handleTextAnswer = (text: string) => {
    const copy = [...answers];
    copy[current] = text;
    setAnswers(copy);
  };

  const toggleMark = () => {
    const m = new Set(marked);
    m.has(current) ? m.delete(current) : m.add(current);
    setMarked(m);
  };

  const handleSubmit = () => setShowSubmitDialog(true);

  const confirmSubmit = () => {
    setCompleted(true);
    setShowSubmitDialog(false);
  };

  /* ================= COMPLETION ================= */
  if (completed) {
    const end = new Date();
    let correct = 0;
    let score = 0;

    if (config.hasCorrectAnswer) {
      (questions.data as any[]).forEach((q, i) => {
        if ('correctAnswer' in q && answers[i] === q.correctAnswer) correct++;
      });
      score = Math.round((correct / count) * 100);
    }

    if (user) {
      savePracticeSession({
        id: crypto.randomUUID(),
        userId: user.id,
        testType,
        set: setId,
        startTime: startTime.toISOString(),
        endTime: end.toISOString(),
        status: 'completed',
        score: config.hasCorrectAnswer ? score : undefined,
        totalItems: count,
        answeredItems: answers.filter(a => a !== null && a !== '').length,
        totalTimeMinutes: Math.floor((end.getTime() - startTime.getTime()) / 60000),
        responses: answers.map(a => a ?? '')
      });
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="max-w-xl w-full text-center">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Test Completed</h2>
            {config.hasCorrectAnswer && (
              <p className="text-muted-foreground">Score: <strong>{score}%</strong></p>
            )}
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = (questions.data as any[])[current];
  const answeredCount = answers.filter(a => a !== null && a !== '').length;

  const renderQuestionContent = () => {
    switch (config.layout) {
      case 'image-options':
        return (
          <>
            <img
              src={(q as any).imageUrl}
              alt=""
              className="w-full max-h-96 object-contain border rounded"
            />
            <div className="space-y-3">
              {(q as any).options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 border rounded text-left ${
                    answers[current] === i
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        );

      case 'word-input':
        return (
          <>
            <div className="text-center py-8">
              <p className="text-2xl font-bold mb-4">{(q as any).word}</p>
              <input
                type="text"
                value={answers[current] || ''}
                onChange={(e) => handleTextAnswer(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded text-center text-lg"
                placeholder="Your response..."
                autoFocus
              />
            </div>
          </>
        );

      case 'situation-textarea':
        return (
          <>
            <div className="bg-muted p-4 rounded mb-4">
              <p className="text-sm font-medium mb-2">Situation:</p>
              <p className="text-base">{(q as any).situation}</p>
            </div>
            <textarea
              value={answers[current] || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              className="w-full p-4 border rounded min-h-32"
              placeholder="Your response..."
            />
          </>
        );

      case 'image-input':
        return (
          <>
            <img
              src={(q as any).url}
              alt={(q as any).alt}
              className="w-full max-h-96 object-contain border rounded"
            />
            <textarea
              value={answers[current] || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              className="w-full p-4 border rounded min-h-32"
              placeholder="Write your story..."
            />
          </>
        );

      case 'text-options':
        return (
          <>
            <div className="bg-muted p-4 rounded mb-4">
              <p className="text-base">{(q as any).question}</p>
            </div>
            <div className="space-y-3">
              {(q as any).options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 border rounded text-left ${
                    answers[current] === i
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        );

      default:
        return <p>Unsupported layout</p>;
    }
  };

  return (
    <div className="min-h-screen bg-muted">

      {/* ================= STICKY HEADER ================= */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{config.name}</p>
            <p className="text-xs text-muted-foreground">
              Question {current + 1} / {count}
            </p>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1 rounded ${
            danger ? 'bg-red-100 text-red-600' : 'bg-muted'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-semibold">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <Progress value={(answeredCount / count) * 100} className="h-1" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-4 gap-6">

        {/* MAIN */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6 space-y-6">
              {renderQuestionContent()}

              {/* NAV */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  disabled={current === 0}
                  onClick={() => setCurrent(c => c - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                </Button>

                <div className="flex gap-2">
                  {config.allowMarkForReview && (
                    <Button variant="outline" onClick={toggleMark}>
                      <Flag className="w-4 h-4 mr-2" />
                      {marked.has(current) ? 'Marked' : 'Mark'}
                    </Button>
                  )}

                  <Button
                    disabled={current === count - 1}
                    onClick={() => setCurrent(c => c + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PALETTE (DESKTOP) */}
        {config.showPalette && (
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <p className="font-semibold mb-3 text-sm">Question Palette</p>
                <div className="grid grid-cols-5 gap-2">
                  {(questions.data as any[]).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-9 rounded text-sm ${
                        i === current
                          ? 'bg-primary text-white'
                          : answers[i] !== null && answers[i] !== ''
                          ? 'bg-green-100 text-green-700'
                          : marked.has(i)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-muted'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Separator className="my-4" />

                <Button variant="destructive" className="w-full" onClick={handleSubmit}>
                  Submit Test
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* MOBILE PALETTE */}
      {config.showPalette && (
        <div className="fixed bottom-4 right-4 lg:hidden">
          <Button size="icon" onClick={() => setShowPalette(true)}>
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      )}

      {showPalette && config.showPalette && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4 max-h-[70vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <p className="font-semibold">Question Palette</p>
              <Button size="sm" variant="outline" onClick={() => setShowPalette(false)}>Close</Button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(questions.data as any[]).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrent(i);
                    setShowPalette(false);
                  }}
                  className={`h-10 rounded ${
                    i === current
                      ? 'bg-primary text-white'
                      : answers[i] !== null && answers[i] !== ''
                      ? 'bg-green-100 text-green-700'
                      : marked.has(i)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={handleSubmit}
            >
              Submit Test
            </Button>
          </div>
        </div>
      )}

      {/* SUBMIT CONFIRMATION DIALOG */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Confirm Submission</h3>
              <p className="text-muted-foreground">
                You have answered {answeredCount} out of {count} questions.
                {marked.size > 0 && ` ${marked.size} questions are marked for review.`}
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Are you sure you want to submit?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmSubmit}>
                  Submit Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}