import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  ShieldCheck,
  Target,
  Award,
  Brain,
  AlertCircle,
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
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

    try {
      await register(formData);
      navigate('/dashboard');
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
    <div className="min-h-screen bg-[#0D1710] grid lg:grid-cols-2 h-screen overflow-hidden">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1A2A1B] via-[#243325] to-[#1A2A1B] text-white">
        <div className="max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A84B]/10 border border-[#C8A84B]/20">
              <ShieldCheck className="w-5 h-5 text-[#C8A84B]" />
              <span className="text-sm text-[#C8A84B]">Join 10,000+ SSB Aspirants</span>
            </div>
            <h2 className="text-3xl font-bold">Start Your SSB Journey Today</h2>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Join thousands preparing for SSB through authentic psychology practice
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <Brain className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Complete Test Suite</h3>
              <p className="text-sm text-gray-400">PPDT, TAT, WAT & SRT in authentic SSB format</p>
            </div>
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <Target className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Develop OLQs</h3>
              <p className="text-sm text-gray-400">Focus on Officer Like Qualities</p>
            </div>
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <Award className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Build Confidence</h3>
              <p className="text-sm text-gray-400">Timed practice sessions</p>
            </div>
            <div className="bg-[#243325] rounded-xl p-4 border border-[#C8A84B]/10">
              <ShieldCheck className="w-8 h-8 text-[#C8A84B] mb-2" />
              <h3 className="font-semibold mb-1">Real SSB Format</h3>
              <p className="text-sm text-gray-400">Practice like the actual SSB</p>
            </div>
          </div>

          {/* Perfect For */}
          <div className="space-y-4">
            <p className="text-center font-medium text-gray-300">Perfect For:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C8A84B]/20 text-[#C8A84B] text-sm">NDA/CDS/AFCAT Aspirants</span>
              <span className="px-3 py-1 rounded-full bg-[#C8A84B]/20 text-[#C8A84B] text-sm">First Timers</span>
              <span className="px-3 py-1 rounded-full bg-[#C8A84B]/20 text-[#C8A84B] text-sm">Conference Out Repeaters</span>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center">
            <p className="text-xl font-medium text-[#C8A84B]">"Train the Mind. Clear the Board."</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <img src="/AbhyasSSB.png" alt="Enlift hub" className="h-16 w-auto mx-auto" />
            <p className="text-sm font-medium text-[#C8A84B]">Train the Mind. Clear the Board.</p>
            <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
            <p className="text-gray-400">Join and start your defence preparation journey</p>
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
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A84B]" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="pl-10 bg-[#1A2A1B] border-[#2E4030] text-white placeholder:text-gray-500 focus:border-[#C8A84B] focus:ring-[#C8A84B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A84B]" />
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="pl-10 bg-[#1A2A1B] border-[#2E4030] text-white focus:border-[#C8A84B] focus:ring-[#C8A84B]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A84B]" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91"
                    className="pl-10 bg-[#1A2A1B] border-[#2E4030] text-white placeholder:text-gray-500 focus:border-[#C8A84B] focus:ring-[#C8A84B]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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

            <Button
              type="submit"
              className="w-full bg-[#C8A84B] hover:bg-[#E2C26A] text-[#0D1710] font-bold"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-gray-400">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-[#C8A84B] hover:text-[#E2C26A]">Terms & Conditions</a>
            </p>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#C8A84B] hover:text-[#E2C26A] font-medium">
                Login
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
    </div>
  );
}
