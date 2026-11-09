// Razorpay Payment Integration
import { unlockSet, type PurchasableTestType } from './setAccess';
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

// Create Razorpay order (in production, this should be done on server)
export async function createRazorpayOrder(
  userName: string,
  userEmail: string,
  userPhone: string,
  testType: PurchasableTestType,
  setNumber: number,
  price: number
) {
  // In production, call your backend to create order
  // For demo, we'll use client-side only (not recommended for production)
  
  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SCXH8jcCrljVzy',
    amount: price * 100,
    currency: 'INR',
    name: 'Enlift hub',
    description: `${testType.toUpperCase()} Set ${setNumber} access`,
    image: 'https://your-logo-url.com/logo.png',
    handler: (response) => {
      // Payment successful - unlock only the selected set
      handlePaymentSuccess(response, testType, setNumber);
    },
    prefill: {
      name: userName,
      email: userEmail,
      contact: userPhone,
    },
    theme: {
      color: '#f59e0b', // Amber color
    },
  };

  if (!window.Razorpay) {
    throw new Error('Razorpay not loaded');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
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
    name: 'Enlift hub',
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
    name: 'Enlift hub',
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

// Callback when payment is successful
async function handlePaymentSuccess(
  response: RazorpayResponse,
  testType: PurchasableTestType,
  setNumber: number
) {
  console.log('Payment successful:', response);

  // Store payment info
  localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);

  unlockSet(testType, setNumber);
  // Reload so the set-selection screen reflects the new access grant.
  window.location.reload();
}

// Verify payment (should be done on server in production)
export async function verifyPayment(paymentId: string, orderId: string, signature: string) {
  // In production, send to backend for verification
  console.log('Verifying payment:', { paymentId, orderId, signature });
  return true;
}
