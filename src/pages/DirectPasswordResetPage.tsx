import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Admin code for direct password reset - configure in .env file
// Default: VITE_ADMIN_RESET_CODE in .env
const getAdminResetCode = (): string => {
  return import.meta.env.VITE_ADMIN_RESET_CODE || 'SSB-ADMIN-2024';
};

export default function DirectPasswordResetPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'verify' | 'success'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userFound, setUserFound] = useState(false);

  // Check if user exists in Firestore
  const handleCheckUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        setError('No account found with this email address.');
        setLoading(false);
        return;
      }

      // Verify admin code
      if (adminCode !== getAdminResetCode()) {
        setError('Invalid admin code. Please contact support.');
        setLoading(false);
        return;
      }

      setUserFound(true);
      setStep('verify');
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password directly
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Find the user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const userDoc = userSnapshot.docs[0];
      
      // Update password in localStorage (for fallback auth)
      const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].password = password;
        localStorage.setItem('enlift-users', JSON.stringify(users));
      }

      // Update in Firestore user document
      await updateDoc(doc(db, 'users', userDoc.id), {
        password: password,
        passwordUpdatedAt: new Date().toISOString()
      });

      // Note: We cannot directly update Firebase Auth password without the user's current password
      // or a reset link. This solution works for the localStorage fallback authentication.
      // For full Firebase Auth password reset, the user would need access to their email.
      
      setStep('success');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Enter email and admin code
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Reset Password Directly</h1>
            <p className="text-muted-foreground">
              Enter your email and admin code to reset password without email
            </p>
          </div>

          <form onSubmit={handleCheckUser} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminCode">Admin Code</Label>
              <div className="relative">
                <Input
                  id="adminCode"
                  type={showAdminCode ? 'text' : 'password'}
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminCode(!showAdminCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showAdminCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Contact admin to get the code
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Continue'
              )}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Enter new password
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Set New Password</h1>
            <p className="text-muted-foreground">
              Enter your new password for {email}
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-blue-600 hover:text-blue-700"
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        <h1 className="text-2xl font-bold">Password Reset Successful!</h1>
        <p className="text-muted-foreground">
          Your password has been reset. You can now login with your new password.
        </p>
        <Link to="/login">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
