// Razorpay Payment Integration
import { unlockPremiumPlan, type PremiumPlan } from './premiumAccess';
import { unlockMockTest } from './mockTestAccess';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: unknown) => void): void;
}

// Load Razorpay script
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
}

export async function createPremiumPlanOrder(
  userName: string,
  userEmail: string,
  userPhone: string,
  plan: PremiumPlan,
  price: number,
) {
  if (!window.Razorpay) {
    throw new Error('Razorpay not loaded');
  }

  const razorpay = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SCXH8jcCrljVzy',
    amount: price * 100,
    currency: 'INR',
    name: 'Fauji Grid by Enlift Hub',
    description: `${plan} premium access`,
    handler: (response) => {
      localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
      unlockPremiumPlan(plan);
      window.location.reload();
    },
    prefill: { name: userName, email: userEmail, contact: userPhone },
    theme: { color: '#0f172a' },
  });

  razorpay.open();
}

export async function createMockTestOrder(
  userName: string,
  userEmail: string,
  userPhone: string,
  userId: string,
  testId: string,
  testTitle: string,
  price: number,
) {
  if (!window.Razorpay) {
    throw new Error('Razorpay not loaded');
  }

  const razorpay = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SCXH8jcCrljVzy',
    amount: price * 100,
    currency: 'INR',
    name: 'Fauji Grid by Enlift Hub',
    description: `${testTitle} access`,
    handler: (response) => {
      localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
      unlockMockTest(testId, userId);
      window.location.reload();
    },
    prefill: { name: userName, email: userEmail, contact: userPhone },
    theme: { color: '#0f172a' },
  });

  razorpay.open();
}

// Verify payment (should be done on server in production)
export async function verifyPayment(paymentId: string, orderId: string, signature: string) {
  console.log('Verifying payment:', { paymentId, orderId, signature });
  return true;
}
