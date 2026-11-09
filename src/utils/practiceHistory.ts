import type { PracticeSession } from '@/types/schema';

const STORAGE_KEY = 'enlift-ssb-practice-history';

export function savePracticeSession(session: PracticeSession): void {
  const history = loadPracticeHistory();
  history.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function loadPracticeHistory(userId?: string): PracticeSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const history: PracticeSession[] = JSON.parse(data);
    if (userId) {
      return history.filter(session => session.userId === userId);
    }
    return history;
  } catch (error) {
    console.error('Error loading practice history:', error);
    return [];
  }
}

export function getPracticeStats(userId: string) {
  const history = loadPracticeHistory(userId);

  const totalSessions = history.length;
  const totalTimeMinutes = history.reduce((sum, session) => sum + session.totalTimeMinutes, 0);
  const totalTests = history.length;
  const averageScore = history.filter(s => s.score !== undefined).length > 0
    ? history.reduce((sum, session) => sum + (session.score || 0), 0) / history.filter(s => s.score !== undefined).length
    : 0;

  return {
    totalSessions,
    totalTimeMinutes,
    totalTests,
    averageScore,
    history
  };
}

export function isSetCompleted(userId: string, testType: string, set: string): boolean {
  const history = loadPracticeHistory(userId);
  return history.some(session => 
    session.testType === testType && 
    session.set === set && 
    session.status === 'completed'
  );
}

export function getCompletedSets(userId: string, testType: string): string[] {
  const history = loadPracticeHistory(userId);
  const completedSets = new Set<string>();
  history.forEach(session => {
    if (session.testType === testType && session.status === 'completed') {
      completedSets.add(session.set);
    }
  });
  return Array.from(completedSets);
}