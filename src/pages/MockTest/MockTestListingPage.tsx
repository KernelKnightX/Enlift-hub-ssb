import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Bolt, BookOpen, Shield } from 'lucide-react';
import { MockTestPortalLayout } from '@/components/mock-test/MockTestPortalLayout';
import { PremiumPlansModal } from '@/components/mock-test/PremiumPlansModal';
import { MOCK_EXAM_THEMES, MOCK_LISTING_EXAMS } from '@/components/mock-test/examThemes';
import { hasPremiumPlan } from '@/lib/premiumAccess';

export default function MockTestListingPage() {
  const navigate = useNavigate();
  const [showPlans, setShowPlans] = useState(false);
  const mockUnlocked = hasPremiumPlan('mock-complete');

  return (
    <>
      <MockTestPortalLayout
        pageTitle="Mock Test Centre"
        conductingLabel="Select an examination to view scheduled practice papers, instructions, and timed attempts."
        breadcrumbs={[{ label: 'Mock Tests' }]}
        headerExtra={
          <button
            type="button"
            onClick={() => setShowPlans(true)}
            className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            {mockUnlocked ? 'Premium active' : 'View premium plans'}
          </button>
        }
      >
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-5 sm:p-5">
          <h2 className="text-base font-bold text-[#0b3d91] sm:text-lg">Candidate dashboard</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Follow the same steps as a formal computer-based test: choose your exam, read the instruction sheet, attempt the paper under exam duration, then review your responses.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {[
              ['Step 1', 'Select examination', 'NDA, CDS or AFCAT'],
              ['Step 2', 'Read instructions', 'Duration, marking & rules'],
              ['Step 3', 'Start CBT', 'Timer · palette · submit'],
            ].map(([step, title, sub]) => (
              <div key={step} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step}</p>
                <p className="mt-0.5 font-semibold text-slate-900">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-5 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#0b3d91]" />
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">Registered examinations</h2>
              <p className="mt-1 text-sm text-slate-600">Open the exam-specific dashboard to view available mock papers.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MOCK_LISTING_EXAMS.map((examId, index) => {
              const theme = MOCK_EXAM_THEMES[examId];
              return (
                <article key={examId} className="rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
                      style={{ background: theme.primary }}
                    >
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900">{examId}</p>
                      <p className="mt-0.5 text-sm leading-snug text-slate-600">{theme.subtitle}</p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.primary }} />
                        {theme.conductingBody}
                      </p>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-400">#{index + 1}</span>
                  </div>
                  <div className="mt-3.5 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => navigate(theme.route)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ background: theme.primary, outlineColor: theme.primary }}
                    >
                      Open dashboard <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Bolt className="mt-0.5 h-5 w-5 shrink-0 fill-amber-600 text-amber-700" />
            <div>
              <h2 className="text-base font-bold text-amber-950">Premium access</h2>
            </div>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/90">
            Unlock high-yield all-India rank predictive mocks, detailed section analytics, and past year question simulations.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowPlans(true)}
              className="text-left text-sm font-semibold text-amber-950 underline decoration-amber-700 underline-offset-4 hover:text-[#0b3d91]"
            >
              Explore test bundles &amp; subscriptions <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

      </MockTestPortalLayout>

      <PremiumPlansModal open={showPlans} onClose={() => setShowPlans(false)} highlight="mock-complete" />
    </>
  );
}
