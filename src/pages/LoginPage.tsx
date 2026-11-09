import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WhatsAppFloatButton } from '@/components/WhatsAppFloatButton';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  Target,
  Clock,
  Repeat,
  CheckCircle,
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetPasswordFields, setShowResetPasswordFields] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { isAdmin: isAdminUser } = await login(formData);
      if (isAdminUser) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

    // If showing password fields, verify and reset password
    if (showResetPasswordFields) {
      if (resetNewPassword.length < 6) {
        setResetError('Password must be at least 6 characters');
        setResetLoading(false);
        return;
      }
      
      if (resetNewPassword !== resetConfirmPassword) {
        setResetError('Passwords do not match');
        setResetLoading(false);
        return;
      }

      try {
        // Check if user exists in Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', resetEmail), limit(1));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
          setResetError('No account found with this email');
          setResetLoading(false);
          return;
        }

        const userDoc = userSnapshot.docs[0];
        
        // Update password in localStorage (for fallback auth)
        const users = JSON.parse(localStorage.getItem('enlift-users') || '[]');
        
        // Remove any existing entry for this email (to avoid duplicates)
        const filteredUsers = users.filter((u: any) => u.email !== resetEmail);
        
        // Add user with new password
        const userData = userDoc.data();
        filteredUsers.push({
          id: userDoc.id,
          email: resetEmail,
          password: resetNewPassword,
          fullName: userData.fullName || 'User',
          role: userData.role || 'user',
          isPremium: userData.isPremium || false
        });
        
        localStorage.setItem('enlift-users', JSON.stringify(filteredUsers));

        // Update in Firestore user document
        await updateDoc(doc(db, 'users', userDoc.id), {
          password: resetNewPassword,
          passwordUpdatedAt: new Date().toISOString()
        });

        setResetSuccess(true);
        setTimeout(() => {
          setShowResetModal(false);
          setResetEmail('');
          setResetNewPassword('');
          setResetConfirmPassword('');
          setShowResetPasswordFields(false);
          setResetSuccess(false);
        }, 3000);
      } catch (err) {
        setResetError('Failed to reset password. Please try again.');
      } finally {
        setResetLoading(false);
      }
      return;
    }

    // First step: verify email exists, then show password fields
    try {
      // Check if user exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', resetEmail), limit(1));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        setResetError('No account found with this email');
        setResetLoading(false);
        return;
      }

      // User exists - show password fields
      setShowResetPasswordFields(true);
      setResetLoading(false);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to verify email');
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1710] grid lg:grid-cols-2 h-screen overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/LOOGO.png" alt="Enlift hub" className="h-10 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400">Login to continue your defence preparation</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A84B]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="pl-10 bg-[#1A2A1B] border-[#2E4030] text-white placeholder:text-gray-500 focus:border-[#C8A84B] focus:ring-[#C8A84B]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A84B]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="pl-10 pr-10 bg-[#1A2A1B] border-[#2E4030] text-white placeholder:text-gray-500 focus:border-[#C8A84B] focus:ring-[#C8A84B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-sm text-[#C8A84B] hover:text-[#E2C26A]"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C8A84B] hover:bg-[#E2C26A] text-[#0D1710] font-bold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#C8A84B] hover:text-[#E2C26A] font-medium">
                Create Account
              </Link>
            </p>
          </form>

          {/* Dashboard Link & Back to Home */}
          <div className="text-center space-y-2">
            <Link to="/dashboard" className="text-sm text-[#C8A84B] hover:text-[#E2C26A] block">
              ← Go to Dashboard
            </Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-400">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1A2A1B] via-[#243325] to-[#1A2A1B] text-white">
        <div className="max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A84B]/10 border border-[#C8A84B]/20">
              <ShieldCheck className="w-5 h-5 text-[#C8A84B]" />
              <span className="text-sm text-[#C8A84B]">Secure & Private</span>
            </div>
            <h2 className="text-3xl font-bold">Your SSB Journey Continues</h2>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Continue practicing SSB psychology tests and track your progress
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <Target className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-sm text-gray-400">Monitor performance across tests</p>
            </div>
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <Clock className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Practice Anytime</h3>
              <p className="text-sm text-gray-400">Timed SSB-style practice</p>
            </div>
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <Repeat className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Improve</h3>
              <p className="text-sm text-gray-400">Build confidence through practice</p>
            </div>
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <ShieldCheck className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">20+ Sets</h3>
              <p className="text-sm text-gray-400">Unlimited practice attempts</p>
            </div>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#C8A84B]/20 text-[#C8A84B] text-sm">Real Timings</span>
            <span className="px-3 py-1 rounded-full bg-[#C8A84B]/20 text-[#C8A84B] text-sm">Performance Tracking</span>
            <span className="px-3 py-1 rounded-full bg-[#C8A84B]/20 text-[#C8A84B] text-sm">SSB Format</span>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A1B] rounded-xl p-6 max-w-md w-full border border-[#C8A84B]/20">
            {resetSuccess ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-[#C8A84B] mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Password Reset Successful!</h2>
                <p className="text-gray-400">
                  Your password has been reset. You can now login with your new password.
                </p>
              </div>
            ) : showResetPasswordFields ? (
              // Step 2: Enter new password
              <div className="text-center mb-4">
                <Lock className="w-10 h-10 text-[#C8A84B] mx-auto mb-2" />
                <h2 className="text-xl font-bold text-white">Set New Password</h2>
                <p className="text-gray-400">Enter your new password for {resetEmail}</p>
              </div>
            ) : (
              // Step 1: Enter email
              <div className="text-center mb-4">
                <KeyRound className="w-10 h-10 text-[#C8A84B] mx-auto mb-2" />
                <h2 className="text-xl font-bold text-white">Reset Password</h2>
                <p className="text-gray-400">Enter your email to reset password</p>
              </div>
            )}

            {resetSuccess ? (
              <div className="bg-[#C8A84B]/10 border border-[#C8A84B]/20 rounded-lg p-4 text-center">
                <p className="text-[#C8A84B]">Password reset successful!</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {resetError && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}

                {showResetPasswordFields ? (
                  // Password fields
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="resetNewPassword" className="text-gray-300">New Password</Label>
                      <Input
                        id="resetNewPassword"
                        type="password"
                        required
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        minLength={6}
                        className="bg-[#243325] border-[#2E4030] text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resetConfirmPassword" className="text-gray-300">Confirm Password</Label>
                      <Input
                        id="resetConfirmPassword"
                        type="password"
                        required
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        minLength={6}
                        className="bg-[#243325] border-[#2E4030] text-white placeholder:text-gray-500"
                      />
                    </div>
                  </>
                ) : (
                  // Email field
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A84B]" />
                    <Input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="pl-10 bg-[#243325] border-[#2E4030] text-white placeholder:text-gray-500"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-[#2E4030] text-white hover:bg-[#243325]" 
                    onClick={() => {
                      setShowResetModal(false);
                      setShowResetPasswordFields(false);
                      setResetEmail('');
                      setResetNewPassword('');
                      setResetConfirmPassword('');
                      setResetError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#C8A84B] hover:bg-[#E2C26A] text-[#0D1710] font-bold" 
                    disabled={resetLoading}
                  >
                    {resetLoading ? 'Processing...' : showResetPasswordFields ? 'Reset Password' : 'Continue'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

<WhatsAppFloatButton />
