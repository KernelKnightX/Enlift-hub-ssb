import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  getAuth,
  type User as FirebaseUser
} from 'firebase/auth';
import {
 getDoc,
   doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, LoginData, RegistrationData } from '@/types/schema';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<{ isAdmin: boolean }>;
  register: (data: RegistrationData) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  // Set session-only persistence and listen for auth state changes
  useEffect(() => {
    // Set Firebase Auth to session-only persistence (user must login each session)
    setPersistence(auth, browserSessionPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            // Create user profile if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              role: 'user',
              isPremium: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to Firebase Auth data
          setUser({
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            phoneNumber: firebaseUser.phoneNumber || '',
            role: 'user',
            isPremium: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        // User signed out - clear the user state
        setUser(null);
        localStorage.removeItem('enlift-user');
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
        isAdmin,
        login, 
        register, 
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
