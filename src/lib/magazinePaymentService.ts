// Magazine Subscription Payment Service
// Uses Razorpay for payment processing
import { db } from './firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { loadRazorpayScript } from './razorpay';
import { 
  addSubscriber, 
  getSubscriberByEmail 
} from './subscriptionService';

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

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly',
    price: 0,
    priceInPaise: 0,
    duration: 'month',
    features: [
      'Daily Current Affairs Magazine',
      'PDF delivered to your email',
      'Stay updated with latest news',
      'Perfect for UPSC & Defense exams'
    ]
  },
  YEARLY: {
    id: 'yearly',
    name: 'Yearly',
    price: 0,
    priceInPaise: 0,
    duration: 'year',
    features: [
      'All Monthly features',
      'Priority support',
      'Exclusive study materials'
    ],
    popular: true
  }
};

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;

// Initialize Razorpay checkout for magazine subscription
export async function initializeMagazineSubscription(
  name: string,
  email: string,
  phone: string,
  planId: PlanId = 'MONTHLY'
): Promise<void> {
  try {
    const plan = SUBSCRIPTION_PLANS[planId];
    
    // If price is 0, skip payment and directly create subscriber (trial mode)
    if (plan.priceInPaise === 0) {
      await handleFreeSubscription(name, email, phone, planId);
      return;
    }
    
    // Load Razorpay script
    await loadRazorpayScript();
    
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SCXH8jcCrljVzy',
      amount: plan.priceInPaise,
      currency: 'INR',
      name: 'Enlift Hub',
      description: `${plan.name} Current Affairs Subscription - ₹${plan.price}`,
      image: 'https://your-logo-url.com/logo.png',
      handler: async (response) => {
        // Payment successful - create subscriber
        await handleMagazinePaymentSuccess(
          name,
          email,
          phone,
          response,
          planId
        );
      },
      prefill: {
        name,
        email,
        contact: phone,
      },
      theme: {
        color: '#10b981', // Green color
      }
    };

    if (!window.Razorpay) {
      throw new Error('Razorpay not loaded');
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Error initializing subscription:', error);
    throw error;
  }
}

// Handle free/trial subscription (no payment)
async function handleFreeSubscription(
  name: string,
  email: string,
  phone: string,
  planId: PlanId
): Promise<void> {
  try {
    // Check if subscriber already exists
    const existingSubscriber = await getSubscriberByEmail(email);
    
    if (existingSubscriber) {
      // Update existing subscriber
      const docRef = doc(db, 'subscribers', existingSubscriber.id!);
      
      const months = planId === 'YEARLY' ? 12 : 1;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      await updateDoc(docRef, {
        isActive: true,
        subscriptionEndDate: endDate.toISOString(),
        plan: planId,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Subscription extended for:', email);
    } else {
      // Create new subscriber
      const months = planId === 'YEARLY' ? 12 : 1;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      await addSubscriber({
        email: email.toLowerCase(),
        name,
        phone,
        subscriptionDate: serverTimestamp(),
        subscriptionEndDate: endDate.toISOString(),
        isActive: true,
        paymentAmount: 0,
      });
      
      console.log('New free subscriber added:', email);
    }
    
    // Store subscription info in localStorage for UI feedback
    localStorage.setItem('magazine_subscription_success', 'true');
    localStorage.setItem('magazine_subscriber_email', email);
    
    // Redirect to success page
    window.location.href = '/subscription/success';
  } catch (error) {
    console.error('Error handling free subscription:', error);
    throw error;
  }
}

// Handle successful payment
async function handleMagazinePaymentSuccess(
  name: string,
  email: string,
  phone: string,
  paymentResponse: RazorpayResponse,
  planId: PlanId
): Promise<void> {
  try {
    console.log('Payment successful:', paymentResponse);
    
    // Check if subscriber already exists
    const existingSubscriber = await getSubscriberByEmail(email);
    
    if (existingSubscriber) {
      // Update existing subscriber - extend subscription
      if (!existingSubscriber.id) {
        throw new Error('Subscriber ID is missing');
      }
      const docRef = doc(db, 'subscribers', existingSubscriber.id);
      
      // Calculate new subscription end date
      const plan = SUBSCRIPTION_PLANS[planId];
      const months = planId === 'YEARLY' ? 12 : 1;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      await updateDoc(docRef, {
        isActive: true,
        subscriptionEndDate: endDate.toISOString(),
        paymentId: paymentResponse.razorpay_payment_id,
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpaySignature: paymentResponse.razorpay_signature,
        plan: planId,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Subscription extended for:', email);
    } else {
      // Create new subscriber
      const plan = SUBSCRIPTION_PLANS[planId];
      const months = planId === 'YEARLY' ? 12 : 1;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      await addSubscriber({
        email: email.toLowerCase(),
        name,
        phone,
        subscriptionDate: serverTimestamp(),
        subscriptionEndDate: endDate.toISOString(),
        isActive: true,
        paymentId: paymentResponse.razorpay_payment_id,
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpaySignature: paymentResponse.razorpay_signature,
        paymentAmount: plan.price,
      });
      
      console.log('New subscriber added:', email);
    }
    
    // Store subscription info in localStorage for UI feedback
    localStorage.setItem('magazine_subscription_success', 'true');
    localStorage.setItem('magazine_subscriber_email', email);
    
    // Redirect to success page
    window.location.href = '/subscription/success';
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

// Verify subscription status
export async function checkSubscriptionStatus(email: string): Promise<{
  isSubscribed: boolean;
  plan?: string;
  endDate?: string;
}> {
  try {
    const subscriber = await getSubscriberByEmail(email);
    
    if (!subscriber || !subscriber.isActive) {
      return { isSubscribed: false };
    }
    
    return {
      isSubscribed: true,
      endDate: subscriber.subscriptionEndDate
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { isSubscribed: false };
  }
}
