// Subscription service for managing magazine subscribers in Firestore
import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// Types
export interface Subscriber {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  subscriptionDate: any;
  subscriptionEndDate?: any;
  isActive: boolean;
  paymentId?: string;
  paymentAmount?: number;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface MagazineIssue {
  id?: string;
  title: string;
  date: string;
  pdfUrl: string;
  uploadedAt?: any;
  uploadedBy: string;
  sentToSubscribers: boolean;
  sentAt?: any;
  subscriberCount?: number;
}

// Collection names
const SUBSCRIBERS_COLLECTION = 'subscribers';
const MAGAZINE_ISSUES_COLLECTION = 'magazine_issues';

// Subscription price (in paise) - ₹299/month
export const SUBSCRIPTION_PRICE = 299 * 100;

// -------------------- SUBSCRIBER FUNCTIONS --------------------

// Add a new subscriber after successful payment
export async function addSubscriber(subscriber: Omit<Subscriber, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, SUBSCRIBERS_COLLECTION), {
      ...subscriber,
      subscriptionDate: serverTimestamp(),
      isActive: true,
    });
    console.log('Subscriber added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}

// Get subscriber by email
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  try {
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION),
      where('email', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Subscriber;
  } catch (error) {
    console.error('Error getting subscriber:', error);
    throw error;
  }
}

// Get subscriber by ID
export async function getSubscriberById(id: string): Promise<Subscriber | null> {
  try {
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return { id: docSnap.id, ...docSnap.data() } as Subscriber;
  } catch (error) {
    console.error('Error getting subscriber:', error);
    throw error;
  }
}

// Get all active subscribers
export async function getActiveSubscribers(): Promise<Subscriber[]> {
  try {
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION),
      where('isActive', '==', true),
      orderBy('subscriptionDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subscriber[];
  } catch (error) {
    console.error('Error getting active subscribers:', error);
    throw error;
  }
}

// Get all subscribers (including inactive)
export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION),
      orderBy('subscriptionDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subscriber[];
  } catch (error) {
    console.error('Error getting all subscribers:', error);
    throw error;
  }
}

// Update subscriber
export async function updateSubscriber(id: string, data: Partial<Subscriber>): Promise<void> {
  try {
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('Subscriber updated:', id);
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw error;
  }
}

// Deactivate subscriber (cancel subscription)
export async function deactivateSubscriber(id: string): Promise<void> {
  try {
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, id);
    await updateDoc(docRef, {
      isActive: false,
      deactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Subscriber deactivated:', id);
  } catch (error) {
    console.error('Error deactivating subscriber:', error);
    throw error;
  }
}

// Check if email is already subscribed
export async function isEmailSubscribed(email: string): Promise<boolean> {
  const subscriber = await getSubscriberByEmail(email);
  return subscriber !== null && subscriber.isActive;
}

// -------------------- MAGAZINE ISSUE FUNCTIONS --------------------

// Upload magazine issue metadata
export async function addMagazineIssue(issue: Omit<MagazineIssue, 'id' | 'uploadedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, MAGAZINE_ISSUES_COLLECTION), {
      ...issue,
      uploadedAt: serverTimestamp(),
      sentToSubscribers: false,
    });
    console.log('Magazine issue added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding magazine issue:', error);
    throw error;
  }
}

// Get all magazine issues
export async function getAllMagazineIssues(): Promise<MagazineIssue[]> {
  try {
    const q = query(
      collection(db, MAGAZINE_ISSUES_COLLECTION),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MagazineIssue[];
  } catch (error) {
    console.error('Error getting magazine issues:', error);
    throw error;
  }
}

// Get latest magazine issue
export async function getLatestMagazineIssue(): Promise<MagazineIssue | null> {
  try {
    const q = query(
      collection(db, MAGAZINE_ISSUES_COLLECTION),
      orderBy('date', 'desc'),
      where('sentToSubscribers', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MagazineIssue;
  } catch (error) {
    console.error('Error getting latest magazine issue:', error);
    throw error;
  }
}

// Mark magazine issue as sent
export async function markMagazineAsSent(id: string, subscriberCount: number): Promise<void> {
  try {
    const docRef = doc(db, MAGAZINE_ISSUES_COLLECTION, id);
    await updateDoc(docRef, {
      sentToSubscribers: true,
      sentAt: serverTimestamp(),
      subscriberCount,
    });
    console.log('Magazine marked as sent:', id);
  } catch (error) {
    console.error('Error marking magazine as sent:', error);
    throw error;
  }
}

// Get subscriber count
export async function getSubscriberCount(): Promise<number> {
  try {
    const subscribers = await getActiveSubscribers();
    return subscribers.length;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return 0;
  }
}
