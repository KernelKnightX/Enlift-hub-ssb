export type PurchasableTestType =
  | 'oir'
  | 'wat'
  | 'srt'
  | 'tat'
  | 'ppdt'
  | 'english'
  | 'listening'
  | 'paper-folding'
  | 'speed-recognition';

const STORAGE_KEY = 'enlift-unlocked-sets';

export function getSetPrice(setNumber: number): number {
  return 10 + Math.max(0, setNumber - 4) * 5;
}

export function getSetAccessKey(testType: PurchasableTestType, setNumber: number): string {
  return `${testType}:set${setNumber}`;
}

export function isSetUnlocked(testType: PurchasableTestType, setNumber: number): boolean {
  const premiumPlans = JSON.parse(localStorage.getItem('enlift-premium-plans') || '[]') as string[];
  const isSsbTest = [
    'oir',
    'wat',
    'srt',
    'tat',
    'ppdt',
    'english',
    'listening',
    'paper-folding',
    'speed-recognition',
  ].includes(testType);
  if (isSsbTest && (premiumPlans.includes('ssb-complete') || premiumPlans.includes('all-access'))) {
    return true;
  }
  const unlockedSets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return unlockedSets.includes(getSetAccessKey(testType, setNumber));
}

export function unlockSet(testType: PurchasableTestType, setNumber: number): void {
  const unlockedSets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
  const accessKey = getSetAccessKey(testType, setNumber);

  if (!unlockedSets.includes(accessKey)) {
    unlockedSets.push(accessKey);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedSets));
  }
}
