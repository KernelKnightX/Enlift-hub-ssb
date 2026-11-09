import { X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadRazorpayScript, createPremiumPlanOrder } from '@/lib/razorpay';
import { hasPremiumPlan, PREMIUM_PLANS, type PremiumPlan } from '@/lib/premiumAccess';

const PLAN_ORDER: PremiumPlan[] = ['mock-complete'];

type Props = {
  open: boolean;
  onClose: () => void;
  highlight?: PremiumPlan;
  title?: string;
  subtitle?: string;
};

export function PremiumPlansModal({
  open,
  onClose,
  highlight = 'mock-complete',
  title = 'Unlock all mock tests',
  subtitle = 'One-time access to available CDS and AFCAT papers plus full post-test analysis.',
}: Props) {
  const { user } = useAuth();

  if (!open) return null;

  const buyPlan = async (plan: PremiumPlan) => {
    try {
      await loadRazorpayScript();
      await createPremiumPlanOrder(
        user?.fullName || 'Fauji Grid learner',
        user?.email || '',
        user?.phoneNumber || '',
        plan,
        PREMIUM_PLANS[plan].price,
      );
    } catch (error) {
      console.error('Premium plan payment failed', error);
      alert('Unable to open the payment gateway. Please try again.');
    }
  };

  const mockActive =
    hasPremiumPlan('mock-complete') || hasPremiumPlan('all-access');

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0b3d91]">Fauji Grid Premium</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          {PLAN_ORDER.map((plan) => {
            const featured = plan === highlight;
            const planInfo = PREMIUM_PLANS[plan];
            return (
              <div
                key={plan}
                className={`flex flex-col rounded-lg border p-4 ${
                  featured ? 'border-[#0b3d91] bg-[#f0f7ff] ring-1 ring-[#0b3d91]' : 'border-slate-200 bg-white'
                }`}
              >
                {featured && (
                  <span className="mb-2 inline-block w-fit rounded bg-[#0b3d91] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Recommended
                  </span>
                )}
                <p className="font-bold text-slate-900">{planInfo.name}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">₹{planInfo.price}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{planInfo.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                  <li className="flex gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> All available CDS &amp; AFCAT mock papers
                  </li>
                  <li className="flex gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Full analysis &amp; review flow
                  </li>
                </ul>
                <button
                  type="button"
                  disabled={mockActive}
                  onClick={() => buyPlan(plan)}
                  className="mt-4 w-full rounded-md bg-[#0b3d91] px-3 py-2.5 text-sm font-bold text-white hover:bg-[#062a66] disabled:cursor-not-allowed disabled:bg-emerald-600"
                >
                  {mockActive ? 'Access active' : 'Buy now'}
                </button>
              </div>
            );
          })}
        </div>
        <p className="border-t border-slate-100 px-5 pb-5 text-center text-[11px] text-slate-500 sm:px-6">
          Secure payment via Razorpay. For production, verify payments on your server before granting access.
        </p>
      </div>
    </div>
  );
}
