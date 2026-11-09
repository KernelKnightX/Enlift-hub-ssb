export type PremiumPlan = 'ssb-complete' | 'mock-complete' | 'all-access';

const STORAGE_KEY = 'enlift-premium-plans';

export const PREMIUM_PLANS = {
  'ssb-complete': {
    name: 'SSB Complete',
    price: 499,
    description: 'Unlock all PPDT, WAT, SRT, TAT, OIR and other SSB practice sets.',
  },
  'mock-complete': {
    name: 'Mock Tests Complete',
    price: 399,
    description: 'Unlock all NDA, CDS and AFCAT mock tests and analysis.',
  },
  'all-access': {
    name: 'All Access',
    price: 699,
    description: 'Unlock every SSB practice set and every mock test.',
  },
} as const;

export function hasPremiumPlan(plan: PremiumPlan): boolean {
  const plans = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
  return plans.includes(plan) || (plan !== 'all-access' && plans.includes('all-access'));
}

export function unlockPremiumPlan(plan: PremiumPlan): void {
  const plans = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
  if (!plans.includes(plan)) {
    plans.push(plan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }
}
