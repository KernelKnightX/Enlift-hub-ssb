import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthFormLayout, authFieldClass, authLabelClass } from '@/components/auth/AuthFormLayout';
import { Mail, Lock, Eye, EyeOff, User, Calendar, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const getContinuePath = () => {
    const continueTo = new URLSearchParams(location.search).get('continue');
    return continueTo?.startsWith('/') && !continueTo.startsWith('//') ? continueTo : '/dashboard';
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const digits = formData.phoneNumber.replace(/\D/g, '');
    const phoneNumber =
      formData.phoneNumber.trim().startsWith('+')
        ? formData.phoneNumber.trim()
        : `+91${digits.length > 10 ? digits.slice(-10) : digits}`;

    try {
      await register({ ...formData, phoneNumber });
      navigate(getContinuePath(), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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

  return (
    <AuthFormLayout
      compact
      title="Create Your Account"
      subtitle="Join and start your defence preparation journey today."
      footer={
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to={location.search ? `/login${location.search}` : '/login'}
            className="font-semibold text-[#0f1f3d] hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="fullName" className={authLabelClass}>Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className={authFieldClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth" className={authLabelClass}>Date of Birth</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={authFieldClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber" className={authLabelClass}>Phone Number</Label>
          <div className="flex gap-2">
            <div className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
              <span aria-hidden="true">🇮🇳</span>
              <span className="font-medium">+91</span>
            </div>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="9876543210"
              className="h-10 flex-1 rounded-lg border-slate-200 bg-white text-sm"
            />
          </div>
        </div>

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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
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

        <Button
          type="submit"
          className="mt-1 h-10 w-full rounded-lg bg-[#0f1f3d] text-sm font-bold text-white hover:bg-[#162a52]"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>

        <p className="text-center text-xs leading-relaxed text-slate-500">
          By registering, you agree to our{' '}
          <Link to="/terms" className="font-medium text-[#0f1f3d] underline underline-offset-2">
            Terms &amp; Conditions
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-medium text-[#0f1f3d] underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthFormLayout>
  );
}
