import {
  getSpeedRecognitionQuestions,
  saveSpeedRecognitionAttempt,
} from '@/lib/testDataService';
import type {
  PreparedSpeedRecognitionQuestion,
  SpeedRecognitionAnalytics,
  SpeedRecognitionAnswerRecord,
  SpeedRecognitionAnswerKey,
  SpeedRecognitionDifficulty,
  SpeedRecognitionQuestion,
} from '@/types/schema';

const optionKeys: SpeedRecognitionAnswerKey[] = ['A', 'B', 'C', 'D'];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function fetchSpeedRecognitionQuestions(setId: string) {
  const questions = await getSpeedRecognitionQuestions(setId);
  return prepareSpeedRecognitionQuestions(shuffle(questions).slice(0, 30));
}

export function prepareSpeedRecognitionQuestions(questions: SpeedRecognitionQuestion[]): PreparedSpeedRecognitionQuestion[] {
  return questions.map((question) => {
    const options = optionKeys.map((key) => ({
      key,
      image: question[`option${key}` as const],
    }));

    return {
      ...question,
      options: shuffle(options),
    };
  });
}

export function buildSpeedRecognitionAnalytics(answers: SpeedRecognitionAnswerRecord[]): SpeedRecognitionAnalytics {
  const totalQuestions = answers.length;
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const responseTimes = answers.map((answer) => answer.responseTimeMs);
  const avgReactionTimeMs = responseTimes.length
    ? Math.round(responseTimes.reduce((total, time) => total + time, 0) / responseTimes.length)
    : 0;

  const breakdown = answers.reduce<Record<SpeedRecognitionDifficulty, { total: number; correct: number; accuracy: number }>>((acc, answer) => {
    acc[answer.difficulty].total += 1;
    acc[answer.difficulty].correct += answer.isCorrect ? 1 : 0;
    return acc;
  }, {
    easy: { total: 0, correct: 0, accuracy: 0 },
    medium: { total: 0, correct: 0, accuracy: 0 },
    hard: { total: 0, correct: 0, accuracy: 0 },
  });

  Object.values(breakdown).forEach((item) => {
    item.accuracy = item.total ? Math.round((item.correct / item.total) * 100) : 0;
  });

  return {
    score: correctCount,
    totalQuestions,
    accuracy: totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0,
    correctCount,
    incorrectCount,
    avgReactionTimeMs,
    fastestResponseMs: responseTimes.length ? Math.min(...responseTimes) : 0,
    slowestResponseMs: responseTimes.length ? Math.max(...responseTimes) : 0,
    difficultyBreakdown: breakdown,
  };
}

export async function submitSpeedRecognitionAttempt(payload: {
  userId: string;
  setId: string;
  answers: SpeedRecognitionAnswerRecord[];
  startedAt: string;
  completedAt: string;
}) {
  const analytics = buildSpeedRecognitionAnalytics(payload.answers);
  await saveSpeedRecognitionAttempt({ ...payload, analytics });
  return analytics;
}
