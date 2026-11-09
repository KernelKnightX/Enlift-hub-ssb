import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AuthFormLayout, authFieldClass, authLabelClass } from '@/components/auth/AuthFormLayout';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetPasswordFields, setShowResetPasswordFields] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const getContinuePath = () => {
    const continueTo = new URLSearchParams(location.search).get('continue');
    return continueTo?.startsWith('/') && !continueTo.startsWith('//') ? continueTo : '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { isAdmin: isAdminUser } = await login(formData);
      if (isAdminUser) {
        navigate('/admin', { replace: true });
      } else {
        navigate(getContinuePath(), { replace: true });
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

  const closeResetModal = () => {
    setShowResetModal(false);
    setShowResetPasswordFields(false);
    setResetEmail('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

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
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', resetEmail), limit(1));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
          setResetError('No account found with this email');
          setResetLoading(false);
          return;
        }

        const userDoc = userSnapshot.docs[0];
        const users = JSON.parse(localStorage.getItem('enlift-users') || '[]') as Array<{
          email: string;
          [key: string]: unknown;
        }>;
        const filteredUsers = users.filter((u) => u.email !== resetEmail);
        const userData = userDoc.data();
        filteredUsers.push({
          id: userDoc.id,
          email: resetEmail,
          password: resetNewPassword,
          fullName: userData.fullName || 'User',
          role: userData.role || 'user',
          isPremium: userData.isPremium || false,
        });
        localStorage.setItem('enlift-users', JSON.stringify(filteredUsers));
        await updateDoc(doc(db, 'users', userDoc.id), {
          password: resetNewPassword,
          passwordUpdatedAt: new Date().toISOString(),
        });
        setResetSuccess(true);
        setTimeout(closeResetModal, 2500);
      } catch {
        setResetError('Failed to reset password. Please try again.');
      } finally {
        setResetLoading(false);
      }
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', resetEmail), limit(1));
      const userSnapshot = await getDocs(q);
      if (userSnapshot.empty) {
        setResetError('No account found with this email');
        setResetLoading(false);
        return;
      }
      setShowResetPasswordFields(true);
      setResetLoading(false);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to verify email');
      setResetLoading(false);
    }
  };

  return (
    <>
      <AuthFormLayout
        title="Welcome Back"
        subtitle="Log in to continue your mock tests and saved attempts."
        footer={
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              to={location.search ? `/register${location.search}` : '/register'}
              className="font-semibold text-[#0f1f3d] hover:underline"
            >
              Create account
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className={authLabelClass}>Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                className={authFieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className={authLabelClass}>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`${authFieldClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-xs font-medium text-[#0f1f3d] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="h-10 w-full rounded-lg bg-[#0f1f3d] text-sm font-bold text-white hover:bg-[#162a52]"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
      </AuthFormLayout>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            {resetSuccess ? (
              <div className="text-center">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Password updated</h2>
                <p className="mt-2 text-sm text-slate-600">You can log in with your new password.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <KeyRound className="mx-auto mb-2 h-8 w-8 text-[#0f1f3d]" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {showResetPasswordFields ? 'Set new password' : 'Reset password'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {showResetPasswordFields ? resetEmail : 'Enter the email on your account'}
                  </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {resetError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{resetError}</AlertDescription>
                    </Alert>
                  )}
                  {showResetPasswordFields ? (
                    <>
                      <Input
                        type="password"
                        required
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="New password"
                        minLength={6}
                        className="h-11"
                      />
                      <Input
                        type="password"
                        required
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        minLength={6}
                        className="h-11"
                      />
                    </>
                  ) : (
                    <Input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="candidate@example.com"
                      className="h-11"
                    />
                  )}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={closeResetModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#0f1f3d] text-white hover:bg-[#162a52]"
                      disabled={resetLoading}
                    >
                      {resetLoading ? 'Please wait…' : showResetPasswordFields ? 'Update' : 'Continue'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
