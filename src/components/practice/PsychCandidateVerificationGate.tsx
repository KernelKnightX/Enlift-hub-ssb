import { useEffect, useRef, useState, type ReactNode } from 'react';
import { RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';

interface Props {
  children?: ReactNode;
  label: string;
  color: string;
  onVerified?: () => void;
}

export function PsychCandidateVerificationGate({ children, label, color, onVerified }: Props) {
  const { isAuthenticated, loading: authLoading, sendPhoneOtp, completePhoneOtp } = useAuth();
  const [candidateName, setCandidateName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const recaptchaContainer = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => () => recaptchaVerifier.current?.clear(), []);

  if (authLoading) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-slate-100 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" aria-label="Checking candidate session" />
      </main>
    );
  }

  if (isAuthenticated || verified) return children;

  const requestOtp = async () => {
    setError('');
    if (!candidateName.trim()) {
      setError('Enter your name to continue.');
      return;
    }
    if (!recaptchaContainer.current) {
      setError('Phone verification could not start. Refresh this page and try again.');
      return;
    }

    setBusy(true);
    try {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainer.current, { size: 'invisible' });
      setConfirmation(await sendPhoneOtp(phoneNumber, recaptchaVerifier.current));
      setOtpSent(true);
    } catch (otpError) {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
      setError(otpError instanceof Error ? otpError.message : 'Unable to send a verification code.');
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmation) return;
    setError('');
    setBusy(true);
    try {
      await completePhoneOtp(confirmation, otp, candidateName);
      setVerified(true);
      onVerified?.();
    } catch (otpError) {
      setError(otpError instanceof Error ? otpError.message : 'Unable to verify the code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-100 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="psych-candidate-title"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-8"
        style={{ borderTopWidth: 4, borderTopColor: color }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label} · Candidate verification</p>
        <h1 id="psych-candidate-title" className="mt-2 text-xl font-bold text-slate-900">Before you start</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Enter your name and mobile number. We’ll verify your number with an SMS code before starting the test.
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-left text-xs text-red-800">
            {error}
          </p>
        )}
        {!otpSent ? (
          <div className="mt-5 space-y-2 text-left">
            <label htmlFor="psych-candidate-name" className="block text-xs font-bold text-slate-700">Your name</label>
            <input
              id="psych-candidate-name"
              autoComplete="name"
              value={candidateName}
              onChange={(event) => setCandidateName(event.target.value)}
              placeholder="Enter your full name"
              className="min-h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
            <label htmlFor="psych-candidate-phone" className="block pt-1 text-xs font-bold text-slate-700">Mobile number</label>
            <input
              id="psych-candidate-phone"
              type="tel"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+91 9876543210"
              className="min-h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
            <p className="text-[11px] text-slate-500">Include the country code. No test time passes before verification.</p>
            <button
              type="button"
              onClick={requestOtp}
              disabled={busy}
              className="mt-2 min-h-11 w-full rounded-md px-4 text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: color }}
            >
              {busy ? 'Sending code…' : 'Continue and send OTP'}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-2 text-left">
            <p className="text-xs text-slate-600">We sent a verification code to {phoneNumber}.</p>
            <label htmlFor="psych-candidate-otp" className="block text-xs font-bold text-slate-700">6-digit SMS code</label>
            <input
              id="psych-candidate-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter code"
              className="min-h-11 w-full rounded-md border border-slate-300 px-3 text-sm tracking-[.25em] text-slate-900 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={busy || otp.length !== 6}
              className="mt-2 min-h-11 w-full rounded-md px-4 text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: color }}
            >
              {busy ? 'Verifying…' : 'Verify and start test'}
            </button>
            <button
              type="button"
              onClick={() => { setOtpSent(false); setConfirmation(null); setOtp(''); setError(''); }}
              className="w-full py-2 text-xs font-semibold text-slate-600"
            >
              Change mobile number
            </button>
          </div>
        )}
        <div ref={recaptchaContainer} />
      </section>
    </main>
  );
}
