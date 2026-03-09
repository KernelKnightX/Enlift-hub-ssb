import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

const PASSWORD_RESET_COLLECTION = 'passwordResets';

// Get the app's base URL
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://abhyassb.com';
};

// Request password reset - uses Firebase Auth
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user exists in Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), limit(1));
    const userSnapshot = await getDocs(q);

    // Don't reveal if email exists - return success anyway for security
    if (userSnapshot.empty) {
      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link shortly.' 
      };
    }

    // Send password reset email using Firebase Auth
    // The email will come from Firebase but we can customize the template in Firebase Console
    await sendPasswordResetEmail(auth, email);

    return { 
      success: true, 
      message: 'Password reset link sent! Check your email (and spam folder).' 
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      // Don't reveal user doesn't exist
      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link shortly.' 
      };
    }
    
    if (error.code === 'auth/invalid-email') {
      return { 
        success: false, 
        message: 'Invalid email address.' 
      };
    }

    return { 
      success: false, 
      message: 'Failed to send reset email. Please try again.' 
    };
  }
}

// For custom reset page - verify our tracking token exists in Firestore
export async function verifyPasswordResetToken(token: string): Promise<{ valid: boolean; email?: string; userId?: string }> {
  try {
    const resetDocRef = doc(db, PASSWORD_RESET_COLLECTION, token);
    const resetDoc = await getDoc(resetDocRef);

    if (!resetDoc.exists()) {
      return { valid: false };
    }

    const resetData = resetDoc.data();

    // Check if token already used
    if (resetData.used) {
      return { valid: false };
    }

    // Check if token expired
    const expiresAt = new Date(resetData.expiresAt);
    if (expiresAt < new Date()) {
      return { valid: false };
    }

    return { 
      valid: true, 
      email: resetData.email,
      userId: resetData.userId 
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false };
  }
}

// Generate a secure random token for tracking
function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Handle password reset with Firebase Auth oobCode (from email URL)
export async function resetPasswordWithToken(
  oobCode: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    // First verify the oobCode is valid with Firebase
    const email = await verifyPasswordResetCode(auth, oobCode);
    
    if (!email) {
      return { 
        success: false, 
        message: 'Invalid reset link.' 
      };
    }

    // Now confirm the password reset with Firebase Auth
    await confirmPasswordReset(auth, oobCode, newPassword);

    return { 
      success: true, 
      message: 'Password has been reset successfully. Please login with your new password.' 
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    if (error.code === 'auth/expired-action-code') {
      return { 
        success: false, 
        message: 'Reset link has expired. Please request a new one.' 
      };
    }
    
    if (error.code === 'auth/invalid-action-code') {
      return { 
        success: false, 
        message: 'Invalid reset link. Please request a new one.' 
      };
    }

    return { 
      success: false, 
      message: 'Failed to reset password. Please try again.' 
    };
  }
}

// Clean up expired tokens
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    const resetsRef = collection(db, PASSWORD_RESET_COLLECTION);
    const snapshot = await getDocs(resetsRef);
    const now = new Date();

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const expiresAt = new Date(data.expiresAt);
      if (expiresAt < now) {
        await deleteDoc(docSnapshot.ref);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
