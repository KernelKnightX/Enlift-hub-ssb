import { Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumPlansModal } from '@/components/mock-test/PremiumPlansModal';
import { hasPremiumPlan } from '@/lib/premiumAccess';
import { useState } from 'react';
type Props = {
  open: boolean;
  onClose: () => void;
  testLabel: string;
  setNumber?: number;
  setPrice?: number;
  loading?: boolean;
  onPaySingleSet: () => void;
};

export function PracticeSetUnlockModal({
  open,
  onClose,
  testLabel,
  setNumber,
  setPrice,
  loading,
  onPaySingleSet,
}: Props) {
  const [showPlans, setShowPlans] = useState(false);
  const ssbActive = hasPremiumPlan('ssb-complete');
  const allActive = hasPremiumPlan('all-access');

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
        <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-t-xl bg-white p-6 shadow-2xl sm:rounded-xl sm:p-8">
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eff6ff]">
              <Crown className="h-7 w-7 text-[#0b3d91]" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {setNumber ? `Unlock ${testLabel} Set ${setNumber}` : `Unlock ${testLabel} sets`}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Pay for one set, or get every SSB practice set with a single premium plan.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {setNumber != null && setPrice != null && (
              <Button
                className="w-full bg-[#0b3d91] hover:bg-[#062a66]"
                onClick={onPaySingleSet}
                disabled={loading || ssbActive || allActive}
              >
                {ssbActive || allActive ? 'Included in SSB Complete' : loading ? 'Loading…' : `Pay ₹${setPrice} — this set only`}
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full border-[#0b3d91] text-[#0b3d91]"
              disabled={ssbActive || allActive}
              onClick={() => setShowPlans(true)}
            >
              {ssbActive || allActive ? 'SSB Complete active' : 'Buy SSB Complete — all practice sets'}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowPlans(true)}>
              Compare Mock Complete &amp; All Access
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Maybe later
            </Button>
          </div>
        </div>
      </div>
      <PremiumPlansModal
        open={showPlans}
        onClose={() => setShowPlans(false)}
        highlight="ssb-complete"
        title="Unlock practice sets"
        subtitle="SSB Complete opens every PPDT, WAT, SRT, TAT, OIR and related set. All Access includes mock tests too."
      />
    </>
  );
}
