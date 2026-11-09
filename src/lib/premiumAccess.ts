export type PremiumPlan = 'ssb-complete' | 'mock-complete' | 'all-access';

const STORAGE_KEY = 'enlift-premium-plans';

export const PREMIUM_PLANS = {
  'ssb-complete': {
    name: 'Legacy SSB plan',
    price: 499,
    description: 'No longer sold on this site. Existing purchases are honoured on the SSB platform.',
  },
  'mock-complete': {
    name: 'Mock Tests Complete',
    price: 399,
    description: 'Unlock available CDS and AFCAT mock tests and analysis.',
  },
  'all-access': {
    name: 'All mock tests',
    price: 399,
    description: 'Same as Mock Tests Complete — full access to available CDS and AFCAT papers.',
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
