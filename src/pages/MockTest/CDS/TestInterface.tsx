import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  Circle,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Timer,
  Award,
  XCircle,
  Check,
  Menu,
} from 'lucide-react';

// CDS Questions - English, GK, Elementary Mathematics
const cdsQuestions = [
  // English
  { id: 1, section: 'English', question: 'Choose the correct spelling:', options: [{ id: 'a', text: 'Accommodate' }, { id: 'b', text: 'Acommodate' }, { id: 'c', text: 'Acomodate' }, { id: 'd', text: 'Accomadate' }], correctAnswer: 'a', explanation: 'The correct spelling is Accommodate - it has two c\'s and two m\'s.' },
  { id: 2, section: 'English', question: 'The synonym of "Benevolent" is:', options: [{ id: 'a', text: 'Cruel' }, { id: 'b', text: 'Kind' }, { id: 'c', text: 'Angry' }, { id: 'd', text: 'Sad' }], correctAnswer: 'b', explanation: 'Benevolent means well-meaning and kind.' },
  { id: 3, section: 'English', question: 'The antonym of "Ancient" is:', options: [{ id: 'a', text: 'Modern' }, { id: 'b', text: 'Old' }, { id: 'c', text: 'Antique' }, { id: 'd', text: 'Historic' }], correctAnswer: 'a', explanation: 'Ancient means very old, Modern is the opposite.' },
  { id: 4, section: 'English', question: 'Fill in the blank: The chef ___ delicious food every day.', options: [{ id: 'a', text: 'cook' }, { id: 'b', text: 'cooks' }, { id: 'c', text: 'cooking' }, { id: 'd', text: 'cooked' }], correctAnswer: 'b', explanation: 'Third person singular - cooks' },
  { id: 5, section: 'English', question: 'Which is a proper noun?', options: [{ id: 'a', text: 'London' }, { id: 'b', text: 'city' }, { id: 'c', text: 'town' }, { id: 'd', text: 'village' }], correctAnswer: 'a', explanation: 'London is a proper noun (specific place name).' },
  // General Knowledge
  { id: 6, section: 'General Knowledge', question: 'Who is the current Chief of Army Staff of India?', options: [{ id: 'a', text: 'General Manoj Mukund Naravane' }, { id: 'b', text: 'General Manoj Pande' }, { id: 'c', text: 'General Bipin Rawat' }, { id: 'd', text: 'General Dalbir Singh Suhag' }], correctAnswer: 'b', explanation: 'General Manoj Pande is the current Chief of Army Staff.' },
  { id: 7, section: 'General Knowledge', question: 'Which country won the 2022 FIFA World Cup?', options: [{ id: 'a', text: 'France' }, { id: 'b', text: 'Argentina' }, { id: 'c', text: 'Brazil' }, { id: 'd', text: 'Germany' }], correctAnswer: 'b', explanation: 'Argentina won the 2022 FIFA World Cup in Qatar.' },
  { id: 8, section: 'General Knowledge', question: 'The National Highway 1 connects:', options: [{ id: 'a', text: 'Delhi and Mumbai' }, { id: 'b', text: 'Delhi and Kolkata' }, { id: 'c', text: 'Delhi and Chennai' }, { id: 'd', text: 'Delhi and Amritsar' }], correctAnswer: 'd', explanation: 'NH1 connects Delhi to Amritsar via Punjab.' },
  { id: 9, section: 'General Knowledge', question: 'Who wrote the Indian National Anthem?', options: [{ id: 'a', text: 'Bankim Chandra Chatterjee' }, { id: 'b', text: 'Rabindranath Tagore' }, { id: 'c', text: 'Mahatma Gandhi' }, { id: 'd', text: 'Jawaharlal Nehru' }], correctAnswer: 'b', explanation: 'Rabindranath Tagore wrote the Indian National Anthem.' },
  { id: 10, section: 'General Knowledge', question: 'Which is the largest desert in India?', options: [{ id: 'a', text: 'Thar Desert' }, { id: 'b', text: 'Rann of Kutch' }, { id: 'c', text: 'Spiti Valley' }, { id: 'd', text: 'Cold Desert' }], correctAnswer: 'a', explanation: 'Thar Desert in Rajasthan is the largest in India.' },
  // Elementary Mathematics
  { id: 11, section: 'Elementary Mathematics', question: 'If 3x + 7 = 22, then x = ?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '5' }, { id: 'c', text: '7' }, { id: 'd', text: '15' }], correctAnswer: 'b', explanation: '3x + 7 = 22 → 3x = 15 → x = 5' },
  { id: 12, section: 'Elementary Mathematics', question: 'What is 25% of 200?', options: [{ id: 'a', text: '25' }, { id: 'b', text: '50' }, { id: 'c', text: '75' }, { id: 'd', text: '100' }], correctAnswer: 'b', explanation: '25% of 200 = (25/100) × 200 = 50' },
  { id: 13, section: 'Elementary Mathematics', question: 'The ratio of 45 to 60 is:', options: [{ id: 'a', text: '3:4' }, { id: 'b', text: '4:5' }, { id: 'c', text: '5:6' }, { id: 'd', text: '2:3' }], correctAnswer: 'a', explanation: '45:60 = divide by 15 → 3:4' },
  { id: 14, section: 'Elementary Mathematics', question: 'A train covers 300 km in 5 hours. Its speed is:', options: [{ id: 'a', text: '50 km/h' }, { id: 'b', text: '60 km/h' }, { id: 'c', text: '70 km/h' }, { id: 'd', text: '80 km/h' }], correctAnswer: 'b', explanation: 'Speed = Distance/Time = 300/5 = 60 km/h' },
  { id: 15, section: 'Elementary Mathematics', question: 'What is the square root of 144?', options: [{ id: 'a', text: '10' }, { id: 'b', text: '11' }, { id: 'c', text: '12' }, { id: 'd', text: '13' }], correctAnswer: 'c', explanation: '√144 = 12 (12 × 12 = 144)' },
];

// CDS Config
const cdsConfig = {
  title: 'CDS Mock Test',
  exam: 'Combined Defence Services',
  duration: 180,
  totalQuestions: 15,
  totalMarks: 300,
  negativeMarking: 0.33,
  passingScore: 35,
  sections: [
    { id: 'english', name: 'English', questionIds: [1, 2, 3, 4, 5] },
    { id: 'general-knowledge', name: 'General Knowledge', questionIds: [6, 7, 8, 9, 10] },
    { id: 'elementary-mathematics', name: 'Elementary Mathematics', questionIds: [11, 12, 13, 14, 15] },
  ],
};

type Screen = 'card' | 'instructions' | 'exam' | 'result' | 'review';

interface Answer {
  questionId: number;
  optionId: string;
}

export default function CDSTestInterface() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const sectionParam = searchParams.get('section');
  
  // Filter questions based on section
  const getFilteredQuestions = () => {
    if (!sectionParam || sectionParam === 'full') return cdsQuestions;
    const section = cdsConfig.sections.find(s => s.id === sectionParam);
    if (!section) return cdsQuestions;
    return cdsQuestions.filter(q => section.questionIds.includes(q.id));
  };

  const sampleQuestions = getFilteredQuestions();
  const config = cdsConfig;
  
  const [screen, setScreen] = useState<Screen>('card');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [activeSection, setActiveSection] = useState(config.sections[0]?.id || '');
  const [result, setResult] = useState<{
    score: number;
    totalMarks: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    accuracy: number;
    timeTaken: number;
  } | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    if (screen !== 'exam') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  const currentQuestionData = sampleQuestions[currentQuestion];
  const getAnswer = (questionId: number) => answers.find(a => a.questionId === questionId)?.optionId;

  const selectAnswer = (optionId: string) => {
    const qId = currentQuestionData?.id;
    if (!qId) return;
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === qId);
      if (existing) {
        return prev.map(a => a.questionId === qId ? { ...a, optionId } : a);
      }
      return [...prev, { questionId: qId, optionId }];
    });
  };

  const toggleMark = () => {
    const qId = currentQuestionData?.id;
    if (!qId) return;
    setMarkedQuestions(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const getQuestionStatus = (qId: number) => {
    if (markedQuestions.includes(qId)) return 'marked';
    if (answers.find(a => a.questionId === qId)) return 'answered';
    return 'not-visited';
  };

  const handleSubmit = async () => {
    let correct = 0;
    let incorrect = 0;
    let score = 0;
    
    sampleQuestions.forEach(q => {
      const answer = answers.find(a => a.questionId === q.id);
      if (answer) {
        if (answer.optionId === q.correctAnswer) {
          correct++;
          score += 1;
        } else {
          incorrect++;
          score -= config.negativeMarking;
        }
      }
    });

    const unanswered = sampleQuestions.length - correct - incorrect;
    const accuracy = (correct / (correct + incorrect)) * 100 || 0;
    const timeTaken = (config.duration * 60) - timeLeft;

    const resultData = {
      score: Math.max(0, score),
      totalMarks: config.totalMarks,
      correct,
      incorrect,
      unanswered,
      accuracy,
      timeTaken,
    };

    setResult(resultData);

    if (user) {
      try {
        await addDoc(collection(db, `users/${user.id}/mockTestAttempts`), {
          testId: 'cds',
          testTitle: config.title,
          ...resultData,
          answers: answers,
          completedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error saving attempt:', error);
      }
    }

    setScreen('result');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card Screen
  if (screen === 'card') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate('/mock-tests')} 
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6 font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Tests
          </button>
          
          <Card className="border-2 border-amber-200 shadow-lg">
            <CardHeader className="bg-amber-500 text-white pb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-amber-400 text-amber-900">Mock Test</Badge>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-serif">{config.title}</CardTitle>
              <p className="text-amber-100 mt-2">Combined Defence Services Examination - Practice tests for CDS entrance</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{config.duration}</div>
                  <div className="text-xs text-amber-600 uppercase font-medium">Minutes</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{sampleQuestions.length}</div>
                  <div className="text-xs text-amber-600 uppercase font-medium">Questions</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{config.totalMarks}</div>
                  <div className="text-xs text-amber-600 uppercase font-medium">Total Marks</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">-{config.negativeMarking}</div>
                  <div className="text-xs text-amber-600 uppercase font-medium">Negative</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-lg">Sections</h3>
                {config.sections.map(section => (
                  <div key={section.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div>
                      <div className="font-medium text-amber-900">{section.name}</div>
                      <div className="text-sm text-amber-600">{section.questionIds.length} Questions</div>
                    </div>
                    <Badge variant="outline" className="border-amber-300 text-amber-700">{section.questionIds.length} Qs</Badge>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setScreen('instructions')} 
                className="w-full py-6 text-lg font-semibold bg-amber-600 hover:bg-amber-700"
              >
                Start Test <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (screen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">CDS Test Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Test Format</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Total Questions: {sampleQuestions.length}</li>
                  <li>• Duration: {config.duration} minutes</li>
                  <li>• Total Marks: {config.totalMarks}</li>
                  <li>• Passing Score: {config.passingScore}%</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Marking Scheme</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Correct Answer: <strong>+1 mark</strong></li>
                  <li>• Wrong Answer: <strong>-{config.negativeMarking} marks</strong></li>
                  <li>• Unattempted: <strong>0 marks</strong></li>
                </ul>
              </div>

              <Button 
                onClick={() => setScreen('exam')} 
                className="w-full py-6 text-lg font-semibold mt-6 bg-amber-600 hover:bg-amber-700"
              >
                I am Ready to Begin <Check className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Result Screen
  if (screen === 'result' && result) {
    const passed = (result.score / result.totalMarks) * 100 >= config.passingScore;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-amber-200">
            <CardHeader className={`text-center pb-2 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {passed ? (
                  <Award className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl">{passed ? 'Congratulations!' : 'Keep Trying!'}</CardTitle>
              <p className="text-slate-600">
                {passed ? 'You have passed the CDS test' : 'You did not meet the passing criteria'}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-amber-700 mb-2">{result.score}</div>
                <div className="text-slate-500">out of {result.totalMarks} marks</div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{result.correct}</div>
                  <div className="text-xs text-green-700">Correct</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">{result.incorrect}</div>
                  <div className="text-xs text-red-700">Wrong</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-600">{result.unanswered}</div>
                  <div className="text-xs text-gray-700">Skipped</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{result.accuracy.toFixed(1)}%</div>
                  <div className="text-xs text-blue-700">Accuracy</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/mock-tests')}
                >
                  Back to Tests
                </Button>
                <Button 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    setScreen('review');
                    setReviewIndex(0);
                  }}
                >
                  Review Answers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Review Screen
  if (screen === 'review') {
    const question = sampleQuestions[reviewIndex];
    const userAnswer = answers.find(a => a.questionId === question.id);
    const isCorrect = userAnswer?.optionId === question.correctAnswer;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Review Answers</h2>
            <div className="text-sm text-slate-500">
              Question {reviewIndex + 1} of {sampleQuestions.length}
            </div>
          </div>

          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={isCorrect ? 'bg-green-500' : userAnswer ? 'bg-red-500' : 'bg-gray-500'}>
                  {isCorrect ? 'Correct' : userAnswer ? 'Wrong' : 'Skipped'}
                </Badge>
                <Badge variant="outline">{question.section}</Badge>
              </div>
              
              <div className="text-lg font-medium mb-4">{question.question}</div>
              
              <div className="space-y-2">
                {question.options.map(opt => {
                  const isUserAnswer = userAnswer?.optionId === opt.id;
                  const isCorrectAnswer = question.correctAnswer === opt.id;
                  
                  return (
                    <div 
                      key={opt.id} 
                      className={`p-3 rounded-lg border ${
                        isCorrectAnswer 
                          ? 'bg-green-50 border-green-300' 
                          : isUserAnswer 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{opt.id.toUpperCase()}.</span>
                        <span>{opt.text}</span>
                        {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                        {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600 ml-auto" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-blue-800 mb-1">Explanation</div>
                <div className="text-sm text-blue-700">{question.explanation}</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              disabled={reviewIndex === 0}
              onClick={() => setReviewIndex(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button 
              disabled={reviewIndex === sampleQuestions.length - 1}
              onClick={() => setReviewIndex(prev => prev + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Screen
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-amber-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/mock-tests')} className="hover:text-amber-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="font-medium">{config.title}</div>
            <div className="text-xs text-amber-200">{config.exam}</div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500' : 'bg-amber-600'}`}>
          <Timer className="w-4 h-4" />
          <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
        </div>

        <Button onClick={() => setScreen('result')} className="bg-white text-amber-700 hover:bg-amber-100">
          Submit
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="flex">
          {config.sections.map(section => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setCurrentQuestion(0);
              }}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeSection === section.id
                  ? 'border-amber-700 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-amber-700'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentQuestionData && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-700">Q{currentQuestion + 1}</Badge>
                    <Badge variant="outline">{currentQuestionData.section}</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleMark}
                    className={markedQuestions.includes(currentQuestionData.id) ? 'text-orange-500' : ''}
                  >
                    <Flag className="w-4 h-4 mr-1" /> 
                    {markedQuestions.includes(currentQuestionData.id) ? 'Marked' : 'Mark'}
                  </Button>
                </div>

                <div className="text-lg font-medium mb-6">{currentQuestionData.question}</div>

                <div className="space-y-3">
                  {currentQuestionData.options.map(opt => {
                    const isSelected = getAnswer(currentQuestionData.id) === opt.id;
                    
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectAnswer(opt.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                            isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                          }`}>
                            {opt.id.toUpperCase()}
                          </div>
                          <span>{opt.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <Button
                    disabled={currentQuestion === sampleQuestions.length - 1}
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Question Palette */}
        <div className="hidden md:block w-72 bg-white border-l p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Question Palette</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-6">
            {sampleQuestions.map((q, idx) => {
              const status = getQuestionStatus(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center ${
                    currentQuestion === idx 
                      ? 'ring-2 ring-amber-600 ring-offset-2' 
                      : ''
                  } ${status === 'answered' ? 'bg-green-500 text-white' : status === 'marked' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Answered ({sampleQuestions.filter(q => getQuestionStatus(q.id) === 'answered').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span>Marked ({markedQuestions.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-200"></div>
              <span>Not Visited ({sampleQuestions.filter(q => getQuestionStatus(q.id) === 'not-visited').length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
