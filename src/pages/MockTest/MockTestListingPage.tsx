import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Award,
  BarChart3,
  Filter,
  Search,
  TrendingUp,
  Target,
  Users,
  Calendar,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MockTest {
  id: string;
  title: string;
  description?: string;
  examName: string;
  examType: string;
  subject: string;
  difficulty: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  negativeMarking: number;
  passingScore: number;
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
}

interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number;
  timeTaken: number;
  completedAt: string;
}

// Sample mock tests for demo
const sampleMockTests: MockTest[] = [
  {
    id: '1',
    title: 'CDS General Knowledge Mock Test 1',
    description: 'Complete GK test covering all topics',
    examName: 'CDS',
    examType: 'prelims',
    subject: 'General Knowledge',
    difficulty: 'medium',
    duration: 120,
    totalQuestions: 120,
    totalMarks: 300,
    negativeMarking: 0.33,
    passingScore: 35,
    isPublished: true,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  },
  {
    id: '2',
    title: 'AFCAT Mock Test 1',
    description: 'Full AFCAT practice test',
    examName: 'AFCAT',
    examType: 'prelims',
    subject: 'General Ability',
    difficulty: 'medium',
    duration: 120,
    totalQuestions: 100,
    totalMarks: 300,
    negativeMarking: 0.33,
    passingScore: 35,
    isPublished: true,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  },
  {
    id: '3',
    title: 'NDA Mathematics Mock Test 1',
    description: 'Complete Mathematics for NDA',
    examName: 'NDA',
    examType: 'prelims',
    subject: 'Mathematics',
    difficulty: 'hard',
    duration: 150,
    totalQuestions: 120,
    totalMarks: 300,
    negativeMarking: 0.33,
    passingScore: 35,
    isPublished: true,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  },
];

export default function MockTestListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState<MockTest[]>(sampleMockTests);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'attempted'>('all');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load attempts from Firestore
  useEffect(() => {
    loadAttempts();
  }, [user]);

  const loadAttempts = async () => {
    if (!user) return;
    
    try {
      const attemptsQuery = query(
        collection(db, `users/${user.id}/mockTestAttempts`),
        orderBy('completedAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(attemptsQuery);
      const attemptData: TestAttempt[] = [];
      
      snapshot.forEach(doc => {
        attemptData.push({ id: doc.id, ...doc.data() } as TestAttempt);
      });
      
      setAttempts(attemptData);
    } catch (error) {
      console.log('Using demo attempts');
      // Demo data
      setAttempts([
        {
          id: '1',
          testId: '1',
          testTitle: 'CDS General Knowledge Mock Test 1',
          score: 210,
          totalMarks: 300,
          correct: 72,
          incorrect: 18,
          unanswered: 30,
          accuracy: 80,
          timeTaken: 95 * 60,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter tests
  const filteredTests = tests.filter(test => {
    if (examFilter !== 'all' && test.examName !== examFilter) return false;
    if (difficultyFilter !== 'all' && test.difficulty !== difficultyFilter) return false;
    if (searchTerm && !test.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Get attempted test IDs
  const attemptedTestIds = new Set(attempts.map(a => a.testId));

  // Stats
  const totalTestsTaken = attempts.length;
  const averageScore = attempts.length > 0 
    ? (attempts.reduce((acc, a) => acc + (a.score / a.totalMarks) * 100, 0) / attempts.length).toFixed(1)
    : '0';
  const bestScore = attempts.length > 0 
    ? Math.max(...attempts.map(a => (a.score / a.totalMarks) * 100)).toFixed(1)
    : '0';

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Mock Tests</h1>
              <p className="text-sm text-gray-500">Practice with real exam pattern</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tests.length}</p>
                  <p className="text-sm text-gray-500">Tests Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTestsTaken}</p>
                  <p className="text-sm text-gray-500">Tests Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                  <p className="text-sm text-gray-500">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bestScore}%</p>
                  <p className="text-sm text-gray-500">Best Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            All Tests
          </Button>
          <Button
            variant={activeTab === 'available' ? 'default' : 'outline'}
            onClick={() => setActiveTab('available')}
          >
            Available
          </Button>
          <Button
            variant={activeTab === 'attempted' ? 'default' : 'outline'}
            onClick={() => setActiveTab('attempted')}
          >
            My Attempts
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Exams</option>
            <option value="CDS">CDS</option>
            <option value="AFCAT">AFCAT</option>
            <option value="NDA">NDA</option>
            <option value="CAPF">CAPF</option>
          </select>
          
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Test Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => {
            const attempt = attempts.find(a => a.testId === test.id);
            const isAttempted = !!attempt;
            
            return (
              <Card key={test.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{test.examName}</Badge>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{test.title}</CardTitle>
                  {test.description && (
                    <p className="text-sm text-gray-500">{test.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Questions</span>
                      <span className="font-medium">{test.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Marks</span>
                      <span className="font-medium">{test.totalMarks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Negative</span>
                      <span className="font-medium">-{test.negativeMarking}</span>
                    </div>
                    
                    {isAttempted && (
                      <div className="pt-3 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Your Score</span>
                          <span className="font-bold text-green-600">
                            {attempt.score}/{attempt.totalMarks}
                          </span>
                        </div>
                        <Progress value={(attempt.score / attempt.totalMarks) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      variant={isAttempted ? 'outline' : 'default'}
                      onClick={() => {
                        // Navigate to the specific exam interface based on exam name
                        const examPath = test.examName.toLowerCase();
                        if (examPath === 'nda') {
                          navigate('/mock-test/nda');
                        } else if (examPath === 'cds') {
                          navigate('/mock-test/cds');
                        } else if (examPath === 'afcat') {
                          navigate('/mock-test/afcat');
                        } else {
                          navigate('/mock-test/nda');
                        }
                      }}
                    >
                      {isAttempted ? 'Retake Test' : 'Start Test'}
                    </Button>
                    {isAttempted && (
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/mock-test/nda')}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tests found matching your criteria</p>
          </div>
        )}

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Attempts
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {attempts.slice(0, 5).map(attempt => (
                    <div key={attempt.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{attempt.testTitle}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(attempt.completedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {attempt.score}/{attempt.totalMarks}
                        </p>
                        <p className="text-sm text-gray-500">
                          {attempt.correct} correct • {attempt.incorrect} wrong
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
