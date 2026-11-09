import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { MockTest, MockTestAttempt, ExamType, Difficulty } from '@/types/schema';

// Collection names
const MOCK_TESTS_COLLECTION = 'mockTests';
const USER_MOCK_TEST_ATTEMPTS_COLLECTION = 'mockTestAttempts';

// Get all mock tests
export async function getMockTests(): Promise<MockTest[]> {
  const q = query(
    collection(db, MOCK_TESTS_COLLECTION),
    where('isPublished', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MockTest[];
}

// Get mock tests by exam name
export async function getMockTestsByExam(examName: string): Promise<MockTest[]> {
  const q = query(
    collection(db, MOCK_TESTS_COLLECTION),
    where('examName', '==', examName),
    where('isPublished', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MockTest[];
}

// Get mock test by ID
export async function getMockTestById(testId: string): Promise<MockTest | null> {
  const docRef = doc(db, MOCK_TESTS_COLLECTION, testId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as MockTest;
  }
  return null;
}

// Create mock test (admin)
export async function createMockTest(test: Omit<MockTest, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, MOCK_TESTS_COLLECTION), {
    ...test,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Update mock test (admin)
export async function updateMockTest(testId: string, test: Partial<MockTest>): Promise<void> {
  const docRef = doc(db, MOCK_TESTS_COLLECTION, testId);
  await updateDoc(docRef, test);
}

// Delete mock test (admin)
export async function deleteMockTest(testId: string): Promise<void> {
  const docRef = doc(db, MOCK_TESTS_COLLECTION, testId);
  await deleteDoc(docRef);
}

// Save user mock test attempt
export async function saveMockTestAttempt(
  userId: string, 
  attempt: Omit<MockTestAttempt, 'id'>
): Promise<string> {
  const docRef = await addDoc(
    collection(db, `users/${userId}/${USER_MOCK_TEST_ATTEMPTS_COLLECTION}`),
    {
      ...attempt,
      completedAt: serverTimestamp()
    }
  );
  return docRef.id;
}

// Get user's mock test attempts
export async function getUserMockTestAttempts(userId: string): Promise<MockTestAttempt[]> {
  const q = query(
    collection(db, `users/${userId}/${USER_MOCK_TEST_ATTEMPTS_COLLECTION}`),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MockTestAttempt[];
}

// Get user's attempts for a specific test
export async function getUserTestAttempts(userId: string, testId: string): Promise<MockTestAttempt[]> {
  const q = query(
    collection(db, `users/${userId}/${USER_MOCK_TEST_ATTEMPTS_COLLECTION}`),
    where('testId', '==', testId),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MockTestAttempt[];
}

// Get user's best score for a test
export async function getUserBestScore(userId: string, testId: string): Promise<number> {
  const attempts = await getUserTestAttempts(userId, testId);
  if (attempts.length === 0) return 0;
  return Math.max(...attempts.map(a => a.score));
}

// Calculate mock test score
export function calculateMockTestScore(
  answers: MockTestAttempt['answers'],
  positiveMarking: number,
  negativeMarking: number
): {
  score: number;
  rawScore: number;
  correct: number;
  incorrect: number;
  totalUnanswered: number;
  negativeMarks: number;
} {
  let correct = 0;
  let incorrect = 0;
  let totalUnanswered = 0;
  let negativeMarks = 0;

  answers.forEach(answer => {
    if (answer.isUnanswered) {
      totalUnanswered++;
    } else if (answer.isCorrect) {
      correct++;
    } else {
      incorrect++;
      negativeMarks += negativeMarking;
    }
  });

  const rawScore = (correct * positiveMarking) - negativeMarks;
  const totalQuestions = answers.length;
  const score = Math.max(0, Math.round((rawScore / (totalQuestions * positiveMarking)) * 100));

  return {
    score,
    rawScore,
    correct,
    incorrect,
    totalUnanswered,
    negativeMarks
  };
}

// Filter mock tests
export function filterMockTests(
  tests: MockTest[],
  filters: {
    examName?: string;
    examType?: ExamType;
    subject?: string;
    difficulty?: Difficulty;
  }
): MockTest[] {
  return tests.filter(test => {
    if (filters.examName && test.examName !== filters.examName) return false;
    if (filters.examType && test.examType !== filters.examType) return false;
    if (filters.subject && test.subject !== filters.subject) return false;
    if (filters.difficulty && test.difficulty !== filters.difficulty) return false;
    return true;
  });
}

// Get unique exam names from tests
export function getUniqueExamNames(tests: MockTest[]): string[] {
  return [...new Set(tests.map(t => t.examName))];
}

// Get unique subjects from tests
export function getUniqueSubjects(tests: MockTest[]): string[] {
  return [...new Set(tests.map(t => t.subject))];
}
