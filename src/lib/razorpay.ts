// Razorpay Payment Integration
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

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

// Razorpay payment amount (in paise) - ₹1 for premium
const PREMIUM_PRICE = 1 * 100; // ₹1

// Create Razorpay order (in production, this should be done on server)
export async function createRazorpayOrder(userName: string, userEmail: string, userPhone: string) {
  // In production, call your backend to create order
  // For demo, we'll use client-side only (not recommended for production)
  
  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SCXH8jcCrljVzy',
    amount: PREMIUM_PRICE,
    currency: 'INR',
    name: 'Enlift hub',
    description: 'Premium Membership - Just ₹1',
    image: 'https://your-logo-url.com/logo.png',
    handler: (response) => {
      // Payment successful - update premium status
      handlePaymentSuccess(response);
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

// Callback when payment is successful
async function handlePaymentSuccess(response: RazorpayResponse) {
  console.log('Payment successful:', response);
  
  // Store payment info
  localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
  
  // Upgrade user to premium (saves to both localStorage and Firebase)
  await upgradeUserToPremium(response.razorpay_payment_id);
}

// Upgrade user to premium
export async function upgradeUserToPremium(paymentId?: string) {
  // Get current user from localStorage
  const userStr = localStorage.getItem('enlift-user');
  if (!userStr) {
    console.error('No user found in localStorage');
    return;
  }

  const user = JSON.parse(userStr);
  
  // Update localStorage
  user.isPremium = true;
  if (paymentId) {
    user.premiumPaymentId = paymentId;
    user.premiumSince = new Date().toISOString();
  }
  localStorage.setItem('enlift-user', JSON.stringify(user));
  
  // Also update in users array
  const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
  const userIndex = users.findIndex((u: { id: string }) => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex].isPremium = true;
    if (paymentId) {
      users[userIndex].premiumPaymentId = paymentId;
      users[userIndex].premiumSince = new Date().toISOString();
    }
    localStorage.setItem('enlift-users', JSON.stringify(users));
  }

  // Update to Firebase Firestore
  try {
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, {
      isPremium: true,
      premiumPaymentId: paymentId || null,
      premiumSince: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('Premium status saved to Firebase');
  } catch (error) {
    console.error('Failed to save premium status to Firebase:', error);
  }
  
  // Reload page to reflect changes
  window.location.reload();
}

// Verify payment (should be done on server in production)
export async function verifyPayment(paymentId: string, orderId: string, signature: string) {
  // In production, send to backend for verification
  console.log('Verifying payment:', { paymentId, orderId, signature });
  return true;
}
