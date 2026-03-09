import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { usePPDTImages } from '@/hooks/useTestData';
import { useAuth } from '@/contexts/AuthContext';
import { savePracticeSession } from '@/utils/practiceHistory';
import type { TestType, TestStatus } from '@/types/enums';
import { Clock, CheckCircle, Home, Loader2, Eye } from 'lucide-react';

type TestPhase = 'countdown' | 'viewing' | 'writing' | 'completed';

export default function PPDTTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const count = parseInt(searchParams.get('count') || '5');
  const set = searchParams.get('set') || 'set1';

  const { data: images, loading } = usePPDTImages(set, count);
  
  const [phase, setPhase] = useState<TestPhase>('countdown');
  const [countdownValue, setCountdownValue] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [responses, setResponses] = useState<string[]>(Array(count).fill(''));
  const [testStartTime] = useState(new Date());
  
  // PPDT: 30 seconds observation, then 4 minutes for perception/discussion on paper
  const viewingTime = 30; // seconds
  const writingTime = 240; // 4 minutes in seconds

  // Countdown effect
  useEffect(() => {
    if (phase === 'countdown' && countdownValue > 0) {
      const timer = setInterval(() => {
        setCountdownValue(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (phase === 'countdown' && countdownValue === 0) {
      setPhase('viewing');
      setTimeRemaining(viewingTime);
    }
  }, [phase, countdownValue]);

  // Timer effect for viewing
  useEffect(() => {
    if (phase !== 'viewing') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setPhase('writing');
          return writingTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Timer effect for writing
  useEffect(() => {
    if (phase !== 'writing') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleNextPicture();
          return viewingTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, currentIndex]);

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will not be saved.')) {
      navigate('/dashboard');
    }
  };

  const handleNextPicture = () => {
    // Mark current as written (students write on paper)
    const updatedResponses = [...responses];
    updatedResponses[currentIndex] = 'written';
    setResponses(updatedResponses);

    if (currentIndex < count - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhase('viewing');
      setTimeRemaining(viewingTime);
    } else {
      setPhase('completed');
    }
  };

  const progressPercentage = ((currentIndex + 1) / count) * 100;
  const isTimeRunningOut = (phase === 'viewing' && timeRemaining <= 10) || (phase === 'writing' && timeRemaining <= 30);
  const currentImage = images[currentIndex];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto" />
          <p className="text-slate-600">Loading test data...</p>
        </div>
      </div>
    );
  }

  // Countdown screen
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-600 to-amber-800 flex items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center border-0 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Picture Perception and Discussion Test
              </h2>
              <p className="text-slate-600">
                Get ready! Test will start in...
              </p>
            </div>
            
            <div className="text-8xl font-bold text-amber-600 mb-8 animate-pulse">
              {countdownValue}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-6">
              <p className="font-semibold mb-2">📝 Instructions:</p>
              <ul className="text-left space-y-1">
                <li>• Picture shown for 30 seconds - observe carefully</li>
                <li>• Then 4 minutes to write on paper</li>
                <li>• Write what you see, story, and discussion</li>
                <li>• Show leadership, maturity, and positive thinking</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completed screen
  if (phase === 'completed') {
    const testEndTime = new Date();
    const totalTime = Math.floor((testEndTime.getTime() - testStartTime.getTime()) / 1000 / 60);
    const answeredCount = responses.filter(r => r.length > 0).length;

    // Save practice session
    if (user) {
      const session = {
        id: crypto.randomUUID(),
        userId: user.id,
        testType: 'ppdt' as TestType,
        set,
        startTime: testStartTime.toISOString(),
        endTime: testEndTime.toISOString(),
        status: 'completed' as TestStatus,
        totalItems: count,
        answeredItems: answeredCount,
        totalTimeMinutes: totalTime,
        responses
      };
      savePracticeSession(session);
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full border-2">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            
            <div>
              <h2 className="heading-lg mb-2">Test Completed!</h2>
              <p className="body-md text-muted-foreground">
                You have successfully completed the Picture Perception and Discussion Test
              </p>
            </div>

            <Separator />

            <div className="grid md:grid-cols-3 gap-6 py-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground">Total Pictures</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{answeredCount}</p>
                <p className="text-sm text-muted-foreground">Perceptions Written on Paper</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalTime}m</p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-lg p-6 text-left max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-4 sticky top-0 bg-muted/50 pb-2">Pictures:</h3>
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={image.id} className="flex gap-4 border-b border-border pb-4">
                    <div className="flex-shrink-0">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-24 h-20 object-cover rounded-lg border-2 border-border"
                        />
                      ) : (
                        <div className="w-24 h-20 bg-muted rounded-lg border-2 border-border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Picture {index + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {responses[index] ? '✅ Perception written on paper' : '⏳ Not attempted'}
                      </p>
                    </div>
                  </div>
                ))}
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

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="heading-md">Picture Perception and Discussion Test</h1>
            <p className="text-sm text-muted-foreground">Write perceptions on paper based on pictures</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold">{currentIndex + 1} / {count}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="mb-8 h-2" />

        {/* Phase Indicator */}
        <div className="flex gap-4 mb-6 justify-center">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
            phase === 'viewing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Eye className="w-5 h-5" />
            <span className="font-semibold">Viewing (30s)</span>
          </div>
          <div className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
            phase === 'writing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Writing (4min)</span>
          </div>
        </div>

        {/* Exit Button */}
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={handleExit}>
            Exit Test
          </Button>
        </div>

        {/* Main Test Card */}
        <Card className="border-2">
          <CardContent className="p-8">
            {/* Timer */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all ${
                isTimeRunningOut 
                  ? 'bg-warning/10 border-2 border-warning animate-pulse' 
                  : 'bg-primary/5 border-2 border-primary/20'
              }`}>
                <Clock className={`w-8 h-8 ${isTimeRunningOut ? 'text-warning' : 'text-primary'}`} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {phase === 'viewing' ? 'Observation Time' : 'Writing Time'}
                  </p>
                  <p className={`text-4xl font-bold ${isTimeRunningOut ? 'text-warning' : 'text-primary'}`}>
                    {phase === 'viewing' 
                      ? `${timeRemaining}s` 
                      : `${minutes}:${seconds.toString().padStart(2, '0')}`
                    }
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Picture Display - Viewing Phase */}
            {phase === 'viewing' && (
              <div className="text-center">
                <p className="text-sm font-semibold text-muted-foreground mb-4">
                  Observe this picture carefully
                </p>
                
                {currentImage?.url ? (
                  <div className="relative inline-block">
                    <img 
                      src={currentImage.url} 
                      alt={currentImage.alt}
                      className="max-w-full h-auto max-h-[400px] rounded-xl border-4 border-primary/20 shadow-lg"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                      <p className="text-lg font-bold">{timeRemaining}s</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto h-[300px] bg-gradient-to-br from-muted to-muted/50 rounded-xl border-4 border-primary/20 shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-semibold text-muted-foreground mb-2">No Image Available</p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mt-6">
                  Note all characters, relationships, emotions, and the situation
                </p>
              </div>
            )}

            {/* Writing Phase - Blank screen with timer */}
            {phase === 'writing' && (
              <div className="text-center">
                <p className="text-sm font-semibold text-muted-foreground mb-4">
                  Write your perception on paper
                </p>
                
                <div className="max-w-xl mx-auto h-[300px] bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-4 border-amber-200 shadow-lg flex items-center justify-center mb-6">
                  <div className="text-center text-amber-700">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">Write on paper now!</p>
                    <p className="text-sm mt-2">Picture will appear again when time is up</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 max-w-xl mx-auto">
                  <p className="font-semibold mb-2">📝 Write about:</p>
                  <ul className="text-left space-y-1">
                    <li>• What do you see in the picture?</li>
                    <li>• What's happening? What led to this?</li>
                    <li>• What might happen next?</li>
                    <li>• Show leadership and positive thinking</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Picture Counter */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {currentIndex > 0 && `${currentIndex} ${currentIndex === 1 ? 'picture' : 'pictures'} completed • `}
            {count - currentIndex - 1} remaining
          </p>
        </div>
      </div>
    </div>
  );
}
