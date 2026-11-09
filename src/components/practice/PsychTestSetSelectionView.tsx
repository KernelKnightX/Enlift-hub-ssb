import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Crown, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PracticeSetUnlockModal } from '@/components/practice/PracticeSetUnlockModal';
import { PsychInstructionsDialog } from '@/components/practice/PsychInstructionsDialog';
import { PsychSetRunwayGrid } from '@/components/practice/PsychSetRunwayGrid';
import { SsbPracticeShell } from '@/components/practice/SsbPracticeShell';
import { getPsychModule, type PsychTestModuleId } from '@/data/psychTestModules';
import { useAuth } from '@/contexts/AuthContext';
import { loadRazorpayScript, createRazorpayOrder } from '@/lib/razorpay';
import { hasPsychBriefingAck } from '@/lib/psychBriefingStorage';
import { prefetchPsychModuleSet } from '@/lib/prefetchPsychModuleSet';
import { getSetPrice, isSetUnlocked } from '@/lib/setAccess';
import { hasPremiumPlan } from '@/lib/premiumAccess';
import { getCompletedSets, getSetAttemptSummary } from '@/utils/practiceHistory';

type Props = {
  moduleId: PsychTestModuleId;
};

export function PsychTestSetSelectionView({ moduleId }: Props) {
  const module = getPsychModule(moduleId);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [selectedSet, setSelectedSet] = useState<number | null>(1);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedSets, setCompletedSets] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const { total, free, unitLabel } = module.sets;
  const isSetAvailable = (set: number) => set <= free || isSetUnlocked(module.testType, set);
  const premiumActive = hasPremiumPlan('ssb-complete') || hasPremiumPlan('all-access');

  useEffect(() => {
    if (!hasPsychBriefingAck(moduleId)) {
      setShowInstructions(true);
    }
  }, [moduleId]);

  useEffect(() => {
    if (searchParams.get('instructions') !== '1') return;
    setShowInstructions(true);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const loadCompleted = () => {
    if (!user) return;
    setRefreshing(true);
    setCompletedSets(getCompletedSets(user.id, module.testType));
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
    loadCompleted();
  }, [user, module.testType]);

  useEffect(() => {
    if (!module.refreshCompletedOnFocus) return;
    const onVisible = () => {
      if (!document.hidden) loadCompleted();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user, module.testType, module.refreshCompletedOnFocus]);

  useEffect(() => {
    setSelectedSet((prev) => {
      if (prev !== null && isSetAvailable(prev)) return prev;
      const firstOpen = Array.from({ length: total }, (_, i) => i + 1).find((n) => isSetAvailable(n));
      return firstOpen ?? null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumActive, total]);

  useEffect(() => {
    if (selectedSet) prefetchPsychModuleSet(moduleId, `set${selectedSet}`);
  }, [moduleId, selectedSet]);

  const handleSetClick = (set: number) => {
    if (!isSetAvailable(set)) {
      setSelectedSet(set);
      setShowPremiumModal(true);
      return;
    }
    setSelectedSet(set);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      await createRazorpayOrder(
        user?.fullName || '',
        user?.email || '',
        user?.phoneNumber || '',
        module.testType,
        selectedSet || free + 1,
        getSetPrice(selectedSet || free + 1),
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to load payment gateway. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    if (!selectedSet || !isSetAvailable(selectedSet)) return;
    navigate(`${module.routes.test}?set=set${selectedSet}`);
  };

  const statusLabel = (setNum: number): string => {
    const setKey = `set${setNum}`;
    if (!isSetAvailable(setNum)) return 'Premium';
    if (user) {
      const attempt = getSetAttemptSummary(user.id, module.testType, setKey);
      if (attempt) return attempt.label;
    }
    if (completedSets.includes(setKey)) return 'Completed';
    if (setNum <= free) return 'Free access';
    return unitLabel;
  };

  const headerExtra = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setShowInstructions(true)}
        className="flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20"
      >
        <FileText className="h-3.5 w-3.5" />
        Instructions
      </button>
      {module.refreshCompletedOnFocus && (
        <button
          type="button"
          onClick={loadCompleted}
          disabled={refreshing}
          className="rounded-md border border-white/30 bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Refresh progress"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PracticeSetUnlockModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        testLabel={module.code}
        setNumber={selectedSet || free + 1}
        setPrice={getSetPrice(selectedSet || free + 1)}
        loading={loading}
        onPaySingleSet={handlePayment}
      />

      <PsychInstructionsDialog module={module} open={showInstructions} onClose={() => setShowInstructions(false)} />

      <SsbPracticeShell
        module={module}
        step="sets"
        pageTitle="Select practice set"
        headerExtra={headerExtra}
        backFallback="/dashboard"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden">
          <div
            className="shrink-0 rounded-lg border px-3 py-2.5 text-sm leading-snug text-slate-800"
            style={{ borderColor: `${module.primary}33`, background: module.accentSoft }}
          >
            <span className="font-semibold" style={{ color: module.primaryDark }}>
              Note:{' '}
            </span>
            {module.setNotice}
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex shrink-0 flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Practice sets</h2>
                <p className="text-xs text-slate-600">
                  Sets 1–{free} are free. Select a set, then start the timed practice.
                </p>
              </div>
              {selectedSet && (
                <p className="text-xs text-slate-600">
                  Selected:{' '}
                  <strong className="text-slate-900">
                    Set {selectedSet}
                  </strong>
                  <span className="text-slate-500"> · {statusLabel(selectedSet)}</span>
                </p>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <PsychSetRunwayGrid
                module={module}
                total={total}
                selectedSet={selectedSet}
                onSelect={handleSetClick}
                statusLabel={statusLabel}
                isLocked={(n) => !isSetAvailable(n)}
              />
            </div>
          </div>

          <div className="shrink-0 space-y-2">
            {!premiumActive && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSet(free + 1);
                  setShowPremiumModal(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-100/80"
              >
                <Crown className="h-4 w-4 text-amber-700" />
                Unlock premium sets — single set or SSB Complete plan
              </button>
            )}

            <Button
              disabled={!selectedSet || !isSetAvailable(selectedSet)}
              className="h-11 w-full text-base font-semibold text-white"
              style={{ background: module.primary }}
              onClick={startTest}
            >
              Start {module.code} · Set {selectedSet ?? '—'}
            </Button>
            <p className="text-center text-[11px] text-slate-500">{module.ctaHint}</p>
          </div>
        </div>
      </SsbPracticeShell>
    </>
  );
}
