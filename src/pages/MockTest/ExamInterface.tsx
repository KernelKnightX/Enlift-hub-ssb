import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Save,
  XCircle,
  Timer,
  Award,
  BarChart3,
  BookOpen,
  Check,
  X,
  Menu,
  Star,
} from 'lucide-react';

// NDA Questions
const ndaQuestions = [
  { id: 1, section: 'Mathematics', question: 'If a train travels 360 km in 4 hours, what is its speed in m/s?', options: [{ id: 'a', text: '25 m/s' }, { id: 'b', text: '30 m/s' }, { id: 'c', text: '20 m/s' }, { id: 'd', text: '35 m/s' }], correctAnswer: 'a', explanation: 'Speed = Distance/Time = 360/4 = 90 km/h = 90 × (1000/3600) = 25 m/s' },
  { id: 2, section: 'Mathematics', question: 'The sum of the first 20 natural numbers is:', options: [{ id: 'a', text: '190' }, { id: 'b', text: '200' }, { id: 'c', text: '210' }, { id: 'd', text: '220' }], correctAnswer: 'c', explanation: 'Using formula S = n(n+1)/2 = 20×21/2 = 210' },
  { id: 3, section: 'Mathematics', question: 'If x² − 5x + 6 = 0, then values of x are:', options: [{ id: 'a', text: '1, 6' }, { id: 'b', text: '2, 3' }, { id: 'c', text: '−2, −3' }, { id: 'd', text: '1, 5' }], correctAnswer: 'b', explanation: 'Factorising: (x-2)(x-3)=0, so x=2 or x=3' },
  { id: 4, section: 'Mathematics', question: 'The area of a circle with radius 7cm is (π=22/7):', options: [{ id: 'a', text: '154 cm²' }, { id: 'b', text: '144 cm²' }, { id: 'c', text: '164 cm²' }, { id: 'd', text: '134 cm²' }], correctAnswer: 'a', explanation: 'Area = πr² = (22/7)×7×7 = 154 cm²' },
  { id: 5, section: 'Mathematics', question: 'What is the LCM of 12, 15, and 20?', options: [{ id: 'a', text: '60' }, { id: 'b', text: '120' }, { id: 'c', text: '180' }, { id: 'd', text: '240' }], correctAnswer: 'a', explanation: 'Prime factorisation gives LCM = 60' },
  { id: 6, section: 'General Ability', question: 'Which planet is known as the Red Planet?', options: [{ id: 'a', text: 'Venus' }, { id: 'b', text: 'Mars' }, { id: 'c', text: 'Jupiter' }, { id: 'd', text: 'Saturn' }], correctAnswer: 'b', explanation: 'Mars is known as the Red Planet due to iron oxide on its surface' },
  { id: 7, section: 'General Ability', question: 'The capital of Australia is:', options: [{ id: 'a', text: 'Sydney' }, { id: 'b', text: 'Melbourne' }, { id: 'c', text: 'Canberra' }, { id: 'd', text: 'Perth' }], correctAnswer: 'c', explanation: 'Canberra is the capital of Australia' },
  { id: 8, section: 'General Ability', question: 'Who wrote "Romeo and Juliet"?', options: [{ id: 'a', text: 'Charles Dickens' }, { id: 'b', text: 'William Shakespeare' }, { id: 'c', text: 'Jane Austen' }, { id: 'd', text: 'Mark Twain' }], correctAnswer: 'b', explanation: 'William Shakespeare wrote Romeo and Juliet' },
  { id: 9, section: 'General Ability', question: 'The chemical symbol for Gold is:', options: [{ id: 'a', text: 'Go' }, { id: 'b', text: 'Gd' }, { id: 'c', text: 'Au' }, { id: 'd', text: 'Ag' }], correctAnswer: 'c', explanation: 'Au comes from Latin word Aurum' },
  { id: 10, section: 'General Ability', question: 'Which is the largest ocean on Earth?', options: [{ id: 'a', text: 'Atlantic Ocean' }, { id: 'b', text: 'Indian Ocean' }, { id: 'c', text: 'Pacific Ocean' }, { id: 'd', text: 'Arctic Ocean' }], correctAnswer: 'c', explanation: 'Pacific Ocean is the largest' },
];

// CDS Questions
const cdsQuestions = [
  { id: 1, section: 'English', question: 'Choose the correct spelling:', options: [{ id: 'a', text: 'Accommodate' }, { id: 'b', text: 'Acommodate' }, { id: 'c', text: 'Acomodate' }, { id: 'd', text: 'Accomadate' }], correctAnswer: 'a', explanation: 'Correct spelling is Accommodate' },
  { id: 2, section: 'English', question: 'The synonym of "Benevolent" is:', options: [{ id: 'a', text: 'Cruel' }, { id: 'b', text: 'Kind' }, { id: 'c', text: 'Angry' }, { id: 'd', text: 'Sad' }], correctAnswer: 'b', explanation: 'Benevolent means kind and generous' },
  { id: 3, section: 'General Knowledge', question: 'Who is the current Chief of Army Staff of India?', options: [{ id: 'a', text: 'General Manoj Mukund Naravane' }, { id: 'b', text: 'General Manoj Pande' }, { id: 'c', text: 'General Bipin Rawat' }, { id: 'd', text: 'General Dalbir Singh Suhag' }], correctAnswer: 'b', explanation: 'General Manoj Pande is the current COAS' },
  { id: 4, section: 'General Knowledge', question: 'Which country won the 2022 FIFA World Cup?', options: [{ id: 'a', text: 'France' }, { id: 'b', text: 'Argentina' }, { id: 'c', text: 'Brazil' }, { id: 'd', text: 'Germany' }], correctAnswer: 'b', explanation: 'Argentina won the 2022 FIFA World Cup' },
  { id: 5, section: 'Elementary Mathematics', question: 'If 3x + 7 = 22, then x = ?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '5' }, { id: 'c', text: '7' }, { id: 'd', text: '15' }], correctAnswer: 'b', explanation: '3x + 7 = 22 → 3x = 15 → x = 5' },
];

// AFCAT Questions
const afcatQuestions = [
  { id: 1, section: 'English', question: 'Choose the correct preposition: "The cat is ____ the table."', options: [{ id: 'a', text: 'in' }, { id: 'b', text: 'on' }, { id: 'c', text: 'at' }, { id: 'd', text: 'by' }], correctAnswer: 'b', explanation: 'The cat is on the table' },
  { id: 2, section: 'Numerical Ability', question: 'What is 25% of 200?', options: [{ id: 'a', text: '25' }, { id: 'b', text: '50' }, { id: 'c', text: '75' }, { id: 'd', text: '100' }], correctAnswer: 'b', explanation: '25% of 200 = (25/100)×200 = 50' },
  { id: 3, section: 'Reasoning', question: 'Complete the series: 2, 4, 8, 16, ?', options: [{ id: 'a', text: '24' }, { id: 'b', text: '32' }, { id: 'c', text: '28' }, { id: 'd', text: '30' }], correctAnswer: 'b', explanation: 'Each number is multiplied by 2' },
  { id: 4, section: 'General Awareness', question: 'Which planet is known as the Morning Star?', options: [{ id: 'a', text: 'Mars' }, { id: 'b', text: 'Venus' }, { id: 'c', text: 'Jupiter' }, { id: 'd', text: 'Mercury' }], correctAnswer: 'b', explanation: 'Venus is known as the Morning Star' },
];

// Exam Configurations
const examConfigs: Record<string, { title: string; exam: string; duration: number; totalQuestions: number; totalMarks: number; negativeMarking: number; passingScore: number; sections: { id: string; name: string; questionIds: number[] }[] }> = {
  'nda-mathematics': { title: 'NDA Mathematics Mock Test', exam: 'National Defence Academy', duration: 150, totalQuestions: 120, totalMarks: 300, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'mathematics', name: 'Mathematics', questionIds: [1, 2, 3, 4, 5] }] },
  'nda-general-ability': { title: 'NDA General Ability Test', exam: 'National Defence Academy', duration: 150, totalQuestions: 150, totalMarks: 600, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'general-ability', name: 'General Ability', questionIds: [6, 7, 8, 9, 10] }] },
  'nda-full': { title: 'NDA Full Mock Test', exam: 'National Defence Academy', duration: 300, totalQuestions: 270, totalMarks: 900, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'mathematics', name: 'Mathematics', questionIds: [1, 2, 3, 4, 5] }, { id: 'general-ability', name: 'General Ability', questionIds: [6, 7, 8, 9, 10] }] },
  'cds-english': { title: 'CDS English Mock Test', exam: 'Combined Defence Services', duration: 60, totalQuestions: 50, totalMarks: 100, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'english', name: 'English', questionIds: [1, 2] }] },
  'cds-general-knowledge': { title: 'CDS General Knowledge Mock Test', exam: 'Combined Defence Services', duration: 60, totalQuestions: 50, totalMarks: 100, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'general-knowledge', name: 'General Knowledge', questionIds: [3, 4] }] },
  'cds-elementary-mathematics': { title: 'CDS Elementary Mathematics Mock Test', exam: 'Combined Defence Services', duration: 60, totalQuestions: 50, totalMarks: 100, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'elementary-mathematics', name: 'Elementary Mathematics', questionIds: [5] }] },
  'afcat-english': { title: 'AFCAT English Mock Test', exam: 'Air Force Common Admission Test', duration: 30, totalQuestions: 25, totalMarks: 75, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'english', name: 'English', questionIds: [1] }] },
  'afcat-general-awareness': { title: 'AFCAT General Awareness Mock Test', exam: 'Air Force Common Admission Test', duration: 30, totalQuestions: 25, totalMarks: 75, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'general-awareness', name: 'General Awareness', questionIds: [4] }] },
  'afcat-numerical-ability': { title: 'AFCAT Numerical Ability Mock Test', exam: 'Air Force Common Admission Test', duration: 30, totalQuestions: 25, totalMarks: 75, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'numerical-ability', name: 'Numerical Ability', questionIds: [2] }] },
  'afcat-reasoning': { title: 'AFCAT Reasoning & Military Aptitude Mock Test', exam: 'Air Force Common Admission Test', duration: 30, totalQuestions: 25, totalMarks: 75, negativeMarking: 0.33, passingScore: 35, sections: [{ id: 'reasoning', name: 'Reasoning & Military Aptitude', questionIds: [3] }] },
};

type Screen = 'card' | 'instructions' | 'exam' | 'submit-confirm' | 'result' | 'review';

interface Answer {
  questionId: number;
  optionId: string;
}

export default function ExamInterface() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const testParam = searchParams.get('test') || 'nda-mathematics';
  
  // Get questions and config based on test type
  const getExamQuestions = () => {
    if (testParam.startsWith('cds')) return cdsQuestions;
    if (testParam.startsWith('afcat')) return afcatQuestions;
    return ndaQuestions;
  };
  
  const sampleQuestions = getExamQuestions();
  const config = examConfigs[testParam] || examConfigs['nda-mathematics'];
  
  const [screen, setScreen] = useState<Screen>('card');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [activeSection, setActiveSection] = useState(config.sections[0]?.id || '');
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalMarks: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    accuracy: number;
    timeTaken: number;
    sectionWise: { name: string; correct: number; total: number }[];
  } | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  // Timer
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

  // Filter questions by section
  const getSectionQuestions = (sectionId: string) => {
    const section = config.sections.find(s => s.id === sectionId);
    if (!section) return sampleQuestions;
    return sampleQuestions.filter(q => section.questionIds.includes(q.id));
  };

  const sectionQuestions = getSectionQuestions(activeSection);
  const currentQuestionData = sectionQuestions[currentQuestion];

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

  const getSectionStats = (sectionId: string) => {
    const sq = getSectionQuestions(sectionId);
    return {
      answered: sq.filter(q => answers.some(a => a.questionId === q.id)).length,
      total: sq.length,
    };
  };

  // Submit test
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

    const sectionWise = config.sections.map(section => {
      const sectionQuestionsFiltered = sampleQuestions.filter(q => q.section === section.name);
      const sectionCorrect = sectionQuestionsFiltered.filter(q => {
        const answer = answers.find(a => a.questionId === q.id);
        return answer && answer.optionId === q.correctAnswer;
      }).length;
      return {
        name: section.name,
        correct: sectionCorrect,
        total: sectionQuestionsFiltered.length,
      };
    });

    const resultData = {
      score: Math.max(0, score),
      totalMarks: config.totalMarks,
      correct,
      incorrect,
      unanswered,
      accuracy,
      timeTaken,
      sectionWise,
    };

    setResult(resultData);

    if (user) {
      try {
        await addDoc(collection(db, `users/${user.id}/mockTestAttempts`), {
          testId: testParam,
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

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get question status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500';
      case 'marked': return 'bg-orange-500';
      default: return 'bg-gray-200';
    }
  };

  // Render based on screen
  if (screen === 'card') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate('/mock-tests')} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Tests
          </button>
          
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader className="bg-slate-900 text-white pb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-500">Mock Test</Badge>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-serif">{config.title}</CardTitle>
              <p className="text-slate-300 mt-2">Prepare yourself. Attempt all sections carefully. Best of luck!</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{config.duration}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">Minutes</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{sampleQuestions.length}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">Questions</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{config.totalMarks}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">Total Marks</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">-{config.negativeMarking}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">Negative</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-lg">Sections</h3>
                {config.sections.map(section => {
                  const stats = getSectionStats(section.id);
                  return (
                    <div key={section.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div className="text-sm text-slate-500">{stats.total} Questions</div>
                      </div>
                      <Badge variant="outline">{section.questionIds.length} Qs</Badge>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Important:</strong> Each correct answer awards <strong>+1 mark</strong>. Each wrong answer deducts <strong>-{config.negativeMarking} marks</strong>. Unattempted questions carry no marks.
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setScreen('instructions')} 
                className="w-full py-6 text-lg font-semibold"
              >
                Start Test <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (screen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Instructions</CardTitle>
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

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Important Rules</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Timer cannot be paused once started</li>
                  <li>• Auto-submit when time expires</li>
                  <li>• You can mark questions for review</li>
                </ul>
              </div>

              <Button 
                onClick={() => setScreen('exam')} 
                className="w-full py-6 text-lg font-semibold mt-6"
              >
                I am Ready to Begin <Check className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (screen === 'result' && result) {
    const passed = (result.score / result.totalMarks) * 100 >= config.passingScore;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
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
                {passed ? 'You have passed the test' : 'You did not meet the passing criteria'}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-slate-900 mb-2">{result.score}</div>
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

              {result.sectionWise.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Section-wise Performance</h3>
                  {result.sectionWise.map((section, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{section.name}</span>
                        <span className="font-medium">{section.correct}/{section.total}</span>
                      </div>
                      <Progress value={(section.correct / section.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/mock-tests')}
                >
                  Back to Tests
                </Button>
                <Button 
                  className="flex-1"
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

  if (screen === 'review') {
    const question = sampleQuestions[reviewIndex];
    const userAnswer = answers.find(a => a.questionId === question.id);
    const isCorrect = userAnswer?.optionId === question.correctAnswer;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/mock-tests')} className="hover:text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="font-medium">{config.title}</div>
            <div className="text-xs text-slate-400">{config.exam}</div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500' : 'bg-slate-700'}`}>
          <Timer className="w-4 h-4" />
          <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
        </div>

        <Button onClick={() => setScreen('submit-confirm')} className="bg-white text-slate-900 hover:bg-slate-100">
          Submit
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="flex">
          {config.sections.map(section => {
            const stats = getSectionStats(section.id);
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setCurrentQuestion(0);
                }}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeSection === section.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {section.name}
                <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                  {stats.answered}/{stats.total}
                </span>
              </button>
            );
          })}
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
                    <Badge className="bg-slate-900">Q{currentQuestion + 1}</Badge>
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
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                            isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'
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
                    disabled={currentQuestion === sectionQuestions.length - 1}
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
            {sectionQuestions.map((q, idx) => {
              const status = getQuestionStatus(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center ${
                    currentQuestion === idx 
                      ? 'ring-2 ring-slate-900 ring-offset-2' 
                      : ''
                  } ${getStatusColor(status)} text-white`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Answered ({sectionQuestions.filter(q => getQuestionStatus(q.id) === 'answered').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span>Marked ({markedQuestions.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-200"></div>
              <span>Not Visited ({sectionQuestions.filter(q => getQuestionStatus(q.id) === 'not-visited').length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {screen === 'submit-confirm' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Submit Test?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Answered</span>
                  <span className="font-medium">{answers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Unanswered</span>
                  <span className="font-medium">{sampleQuestions.length - answers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Marked for Review</span>
                  <span className="font-medium">{markedQuestions.length}</span>
                </div>
              </div>
              
              {sampleQuestions.length - answers.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-800">
                  ⚠️ You have {sampleQuestions.length - answers.length} unanswered question(s). They will be marked as incorrect.
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setScreen('exam')}
                >
                  Go Back
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmit}
                >
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
