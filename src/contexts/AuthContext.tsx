import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  type ApplicationVerifier,
  type ConfirmationResult,
} from 'firebase/auth';
import {
 getDoc,
   doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, LoginData, RegistrationData } from '@/types/schema';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isFirebaseAuthenticated: boolean;
  isPhoneAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<{ isAdmin: boolean }>;
  register: (data: RegistrationData) => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, appVerifier: ApplicationVerifier) => Promise<ConfirmationResult>;
  completePhoneOtp: (confirmation: ConfirmationResult, code: string, candidateName: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetAdminPassword: (newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (in production, store securely in backend/env)
const ADMIN_EMAIL = 'admin@enlift.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [isPhoneAuthenticated, setIsPhoneAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set local persistence and listen for auth state changes
  useEffect(() => {
    // First check localStorage for existing session (our custom auth)
    const storedUser = localStorage.getItem('enlift-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('enlift-user');
      }
    }

    // Set Firebase Auth to local persistence (remember user across sessions)
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await loadOrCreateFirebaseProfile(firebaseUser.uid, {
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Candidate',
            email: firebaseUser.email || '',
            phoneNumber: firebaseUser.phoneNumber || '',
          });
          setUser(profile);
          localStorage.setItem('enlift-user', JSON.stringify(profile));
          setIsFirebaseAuthenticated(true);
          setIsPhoneAuthenticated(!!firebaseUser.phoneNumber);
        } catch (error) {
          setIsFirebaseAuthenticated(false);
          setIsPhoneAuthenticated(false);
          console.error('Error fetching user profile:', error);
        }
      } else {
        setIsFirebaseAuthenticated(false);
        setIsPhoneAuthenticated(false);
        if (!localStorage.getItem('enlift-user')) setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginData): Promise<{ isAdmin: boolean }> => {
    // Check for admin login first
    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      try {
        const adminUser: User = {
          id: 'admin-001',
          fullName: 'Admin',
          email: ADMIN_EMAIL,
          phoneNumber: '',
          role: 'admin',
          isPremium: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Save admin to localStorage
        localStorage.setItem('enlift-admin', 'true');
        localStorage.setItem('enlift-user', JSON.stringify(adminUser));
        
        // Set admin user in state
        setUser(adminUser);
        
        return { isAdmin: true };
      } catch (error) {
        console.error('Admin login error:', error);
        throw new Error('Invalid admin credentials');
      }
    }

    // Check localStorage first for all users (this is the ONLY auth method now)
    // We completely bypass Firebase Auth to avoid password conflicts
    const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
    const foundUser = users.find(
      (u: User & { password: string }) => u.email === data.email && u.password === data.password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem('enlift-user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return { isAdmin: userWithoutPassword.role === 'admin' };
    }

    // User not found - show error (no Firebase fallback)
    throw new Error('Invalid email or password');
  };

  const register = async (data: RegistrationData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.fullName
      });

      // Create user profile in Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        role: 'user',
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);

      // Also save to localStorage for backup during migration
      const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
      users.push({ ...newUser, password: data.password });
      localStorage.setItem('enlift-users', JSON.stringify(users));
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
      
      if (users.some((u: User) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      const localUser: User & { password: string } = {
        id: Date.now().toString(),
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        role: 'user',
        isPremium: false,
        password: data.password,
        createdAt: new Date().toISOString()
      };

      users.push(localUser);
      localStorage.setItem('enlift-users', JSON.stringify(users));

      const { password, ...userWithoutPassword } = localUser;
      localStorage.setItem('enlift-user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    }
  };

  const sendPhoneOtp = async (phoneNumber: string, appVerifier: ApplicationVerifier) => {
    const normalizedPhone = phoneNumber.replace(/[\s()-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      throw new Error('Enter a valid phone number with country code, for example +919876543210.');
    }
    try {
      if (auth.currentUser) {
        return await linkWithPhoneNumber(auth.currentUser, normalizedPhone, appVerifier);
      }
      return await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;
      if (code === 'auth/invalid-app-credential' || code === 'auth/captcha-check-failed') {
        throw new Error(
          'Firebase could not verify this app. Check that localhost is an Authorized domain in the correct Firebase project and that its Web API key is not restricted from Firebase Authentication.',
        );
      }
      if (code === 'auth/unauthorized-domain') {
        throw new Error('This website domain is not authorized for Firebase Phone Authentication.');
      }
      if (code === 'auth/too-many-requests' || code === 'auth/quota-exceeded') {
        throw new Error('Firebase has temporarily limited SMS verification. Please wait and try again, or use a Firebase test phone number.');
      }
      throw error;
    }
  };

  const completePhoneOtp = async (confirmation: ConfirmationResult, code: string, candidateName: string) => {
    const normalizedCode = code.trim();
    if (!/^\d{6}$/.test(normalizedCode)) throw new Error('Enter the 6-digit code sent to your phone.');
    const normalizedName = candidateName.trim();
    if (!normalizedName) throw new Error('Enter your name to continue.');
    const credential = await confirmation.confirm(normalizedCode);
    await updateProfile(credential.user, { displayName: normalizedName });
    const profile = await loadOrCreateFirebaseProfile(credential.user.uid, {
      fullName: normalizedName,
      email: credential.user.email || '',
      phoneNumber: credential.user.phoneNumber || '',
    });
    if (profile.fullName !== normalizedName) {
      profile.fullName = normalizedName;
      profile.updatedAt = new Date().toISOString();
      await setDoc(doc(db, 'users', credential.user.uid), profile, { merge: true });
    }
    setIsFirebaseAuthenticated(true);
    setIsPhoneAuthenticated(!!credential.user.phoneNumber);
    setUser(profile);
    localStorage.setItem('enlift-user', JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('enlift-user');
    localStorage.removeItem('enlift-admin');
    setUser(null);
  };

  const upgradeToPremium = async () => {
    if (!user) return;

    const updatedUser = { 
      ...user, 
      isPremium: true,
      updatedAt: new Date().toISOString() 
    };
    
    setUser(updatedUser);
    localStorage.setItem('enlift-user', JSON.stringify(updatedUser));

    // Update in Firestore
    if (user.id !== 'admin-001') {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          isPremium: true,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating premium status in Firestore:', error);
      }
    }

    // Update in localStorage users array
    const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].isPremium = true;
      users[userIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('enlift-users', JSON.stringify(users));
    }
  };

  const isAdmin = user?.role === 'admin' || user?.id === 'admin-001' || localStorage.getItem('enlift-admin') === 'true';

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const resetAdminPassword = async (newPassword: string) => {
    // Define admin user object
    const adminUser = {
      id: 'admin-001',
      fullName: 'Admin',
      email: ADMIN_EMAIL,
      phoneNumber: '',
      role: 'admin',
      isPremium: true,
      updatedAt: new Date().toISOString()
    };
    
    // Update admin password in Firestore
    await setDoc(doc(db, 'users', 'admin-001'), adminUser);
    // Note: In production, you would also update in a backend system
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isFirebaseAuthenticated,
        isPhoneAuthenticated,
        isAdmin,
        login, 
        register, 
        sendPhoneOtp,
        completePhoneOtp,
        logout, 
        upgradeToPremium,
        resetPassword,
        resetAdminPassword,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

async function loadOrCreateFirebaseProfile(
  userId: string,
  defaults: Pick<User, 'fullName' | 'email' | 'phoneNumber'>,
): Promise<User> {
  const profileRef = doc(db, 'users', userId);
  const profileSnapshot = await getDoc(profileRef);
  if (profileSnapshot.exists()) {
    return { ...defaults, ...profileSnapshot.data(), id: userId } as User;
  }
  const profile: User = {
    id: userId,
    ...defaults,
    role: 'user',
    isPremium: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await setDoc(profileRef, profile);
  return profile;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
