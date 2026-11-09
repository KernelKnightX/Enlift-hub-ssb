import { hasPremiumPlan } from '@/lib/premiumAccess';
import type { MockTest } from '@/types/schema';

const STORAGE_KEY = 'enlift-unlocked-mock-tests';

function isPurchased(testId: string, userId?: string): boolean {
  if (!userId) return false;
  const purchases = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string[]>;
  return purchases[userId]?.includes(testId) ?? false;
}

export function unlockMockTest(testId: string, userId: string): void {
  const purchases = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string[]>;
  const userPurchases = purchases[userId] ?? [];
  if (!userPurchases.includes(testId)) {
    purchases[userId] = [...userPurchases, testId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  }
}

export function isMockPaperUnlocked(test: MockTest, paperIndex: number, userId?: string): boolean {
  if (hasPremiumPlan('mock-complete') || hasPremiumPlan('all-access')) return true;
  if (test.isFree ?? paperIndex === 0) return true;
  if (test.isFree === undefined) return false;
  return isPurchased(test.id, userId);
}

export function isMockTestUnlocked(testId: string, tests: MockTest[], userId?: string): boolean {
  const index = tests.findIndex((t) => t.id === testId);
  if (index === -1) return true;
  return isMockPaperUnlocked(tests[index], index, userId);
}

export function mockAccessLabel(test: MockTest, paperIndex: number, userId?: string): string {
  if (test.isFree ?? paperIndex === 0) return 'Free';
  if (isMockPaperUnlocked(test, paperIndex, userId)) return 'Unlocked';
  if (test.isFree === undefined) return 'Premium';
  return `₹${test.price ?? 0}`;
}
