import type { EnglishQuestionCategory } from '@/data/englishGrammarVocabularyQuestions';

export interface EnglishTestAttemptPayload {
  userId: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeTakenSeconds: number;
  strongestCategory: EnglishQuestionCategory | 'N/A';
  weakestCategory: EnglishQuestionCategory | 'N/A';
  answers: Array<{
    questionId: string;
    category: EnglishQuestionCategory;
    selectedAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    timedOut: boolean;
    answeredAtSecond: number;
  }>;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function saveEnglishTestAttempt(payload: EnglishTestAttemptPayload) {
  const localAttempt = {
    ...payload,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  };

  const existingAttempts = JSON.parse(localStorage.getItem('english-test-attempts') || '[]');
  localStorage.setItem('english-test-attempts', JSON.stringify([localAttempt, ...existingAttempts]));

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return localAttempt;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/english_test_attempts`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      user_id: payload.userId,
      score: payload.score,
      correct_count: payload.correctCount,
      incorrect_count: payload.incorrectCount,
      unanswered_count: payload.unansweredCount,
      accuracy: payload.accuracy,
      time_taken_seconds: payload.timeTakenSeconds,
      strongest_category: payload.strongestCategory,
      weakest_category: payload.weakestCategory,
      answers: payload.answers,
    }),
  });

  if (!response.ok) {
    throw new Error('Unable to save English test attempt to Supabase');
  }

  return response.json();
}
