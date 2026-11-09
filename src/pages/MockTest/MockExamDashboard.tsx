import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Clock3, History, Lock, Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getMockTestsByExam, getUserMockTestAttempts } from '@/lib/mockTestService';
import { MockTestPortalLayout } from '@/components/mock-test/MockTestPortalLayout';
import { PremiumPlansModal } from '@/components/mock-test/PremiumPlansModal';
import { MOCK_EXAM_THEMES, type MockExamId } from '@/components/mock-test/examThemes';
import { isMockPaperUnlocked, mockAccessLabel } from '@/lib/mockTestAccess';
import { hasPremiumPlan } from '@/lib/premiumAccess';
import { createMockTestOrder, loadRazorpayScript } from '@/lib/razorpay';
import type { MockTest, MockTestAttempt } from '@/types/schema';

const instructions = [
  'The countdown timer displays remaining time. The test auto-submits when time reaches zero.',
  'Use the question palette to jump between items. Mark questions for review if needed.',
  'You may change your response before final submission.',
  'Refer to the marking scheme on the instruction sheet before you begin.',
];

function formatSubject(subjectName: string): string {
  return /^math(?:s|ematics)?$/i.test(subjectName.trim()) ? 'Maths' : subjectName;
}

const EMPTY_ATTEMPTS: MockTestAttempt[] = [];

export default function MockExamDashboard({ exam }: { exam: MockExamId }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = MOCK_EXAM_THEMES[exam];
  const [tests, setTests] = useState<MockTest[]>([]);
  const [attemptHistory, setAttemptHistory] = useState<{ userId: string; attempts: MockTestAttempt[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('all');
  const [showPlans, setShowPlans] = useState(false);
  const [showAttemptHistory, setShowAttemptHistory] = useState(false);

  useEffect(() => {
    getMockTestsByExam(exam)
      .then(setTests)
      .catch((error) => console.error(`Failed to load ${exam} mock tests`, error))
      .finally(() => setLoading(false));
  }, [exam]);

  useEffect(() => {
    if (!user?.id) return;
    getUserMockTestAttempts(user.id)
      .then((attempts) => setAttemptHistory({ userId: user.id, attempts }))
      .catch((error) => console.error('Failed to load mock test history', error));
  }, [user?.id]);

  const attempts =
    attemptHistory && attemptHistory.userId === user?.id
      ? attemptHistory.attempts
      : EMPTY_ATTEMPTS;

  const subjects = useMemo(
    () => ['all', ...Array.from(new Set(tests.map((t) => t.subject.trim()).filter(Boolean)))],
    [tests],
  );

  const latestAttempts = useMemo(() => {
    const latest = new Map<string, MockTestAttempt>();
    attempts.forEach((attempt) => {
      if (!latest.has(attempt.testId)) latest.set(attempt.testId, attempt);
    });
    return latest;
  }, [attempts]);

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSubject = subject === 'all' || test.subject === subject;
      const matchesQuery =
        !query || `${test.title} ${test.subject}`.toLowerCase().includes(query.toLowerCase());
      return matchesSubject && matchesQuery;
    });
  }, [tests, subject, query]);

  const planUnlocked = hasPremiumPlan('mock-complete');
  const totalQuestions = tests.reduce((total, test) => total + test.totalQuestions, 0);

  const openInstructions = async (test: MockTest, indexInFullList: number) => {
    if (!isMockPaperUnlocked(test, indexInFullList, user?.id)) {
      if (test.isFree === false) {
        if (!user) return;
        if (!test.price || test.price <= 0) {
          alert('This test does not have a valid price. Please contact support.');
          return;
        }
        try {
          await loadRazorpayScript();
          await createMockTestOrder(
            user.fullName,
            user.email,
            user.phoneNumber || '',
            user.id,
            test.id,
            test.title,
            test.price ?? 0,
          );
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Unable to start payment. Please try again.');
        }
      } else {
        setShowPlans(true);
      }
      return;
    }
    setSelectedIndex(indexInFullList);
    setSelectedTest(test);
  };

  const proceedToTest = () => {
    if (!selectedTest) return;
    if (!isMockPaperUnlocked(selectedTest, selectedIndex, user?.id)) {
      setShowPlans(true);
      return;
    }
    navigate(`${theme.route}/test?testId=${selectedTest.id}`);
  };

  return (
    <>
      <MockTestPortalLayout
        pageTitle={theme.title}
        conductingLabel={`${theme.conductingBody} · Candidate: ${user?.fullName || 'Guest'}`}
        breadcrumbs={[
          { label: 'Mock Tests', to: '/mock-tests' },
          { label: `${exam} Dashboard` },
        ]}
        primaryColor={theme.primary}
        primaryDark={theme.primaryDark}
        headerExtra={
          <button
            type="button"
            onClick={() => setShowPlans(true)}
            className="rounded-md border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 sm:text-sm"
          >
            {planUnlocked ? 'Mock premium active' : 'Unlock all papers'}
          </button>
        }
      >
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:grid-cols-4 sm:gap-3">
          {[
            ['Available papers', tests.length],
            ['Total questions', totalQuestions],
            ['Access', planUnlocked ? 'Full series' : 'Free + paid papers'],
            ['Exam code', exam],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{value}</p>
            </div>
          ))}
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Test schedule — practice papers</h2>
              <p className="mt-1 text-sm text-slate-600">Choose a subject, then select Start test to review the instructions and begin the CBT.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search paper"
                  className="w-full rounded border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0b3d91] sm:w-48"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 px-4 py-3 sm:px-5" aria-label="Filter papers by subject">
            {subjects.map((item) => {
              const label = item === 'all'
                ? 'All subjects'
                : formatSubject(item);
              const active = subject === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSubject(item)}
                  className={`shrink-0 rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-[#0b3d91] bg-[#0b3d91] text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-[#0b3d91] hover:text-[#0b3d91]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                Loading test papers…
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                No papers match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredTests.map((test) => {
                  const indexInFullList = tests.findIndex((t) => t.id === test.id);
                  const unlocked = isMockPaperUnlocked(test, indexInFullList, user?.id);
                  const status = mockAccessLabel(test, indexInFullList, user?.id);
                  const latestAttempt = latestAttempts.get(test.id);
                  const maxMarks = test.questions.length * test.positiveMarking;
                  return (
                    <article
                      key={test.id}
                      className={`rounded-lg border p-3 transition-colors sm:p-4 ${
                        latestAttempt
                          ? 'border-emerald-200 bg-emerald-50/70'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {indexInFullList + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-bold text-slate-900">{test.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {formatSubject(test.subject || 'Full paper')} · {test.examType}
                          </p>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${
                          latestAttempt
                            ? 'bg-emerald-100 text-emerald-800'
                            : unlocked
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-800'
                        }`}>
                          {latestAttempt ? <CheckCircle2 className="h-3 w-3" /> : !unlocked && <Lock className="h-3 w-3" />}
                          {latestAttempt ? 'Given' : status}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-md bg-slate-50 py-2 text-center">
                        <div className="px-1">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Questions</p>
                          <p className="mt-0.5 text-xs font-bold text-slate-800">{test.totalQuestions}</p>
                        </div>
                        <div className="px-1">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Duration</p>
                          <p className="mt-0.5 text-xs font-bold text-slate-800">{test.duration} min</p>
                        </div>
                        <div className="px-1">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                            {latestAttempt ? 'Your score' : 'Marks'}
                          </p>
                          <p className={`mt-0.5 text-xs font-bold ${latestAttempt ? 'text-emerald-800' : 'text-slate-800'}`}>
                            {latestAttempt
                              ? `${latestAttempt.rawScore.toFixed(2)} / ${latestAttempt.totalMarks ?? maxMarks}`
                              : test.totalMarks}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openInstructions(test, indexInFullList)}
                        className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm"
                        style={{ background: theme.primary, outlineColor: theme.primary }}
                      >
                        {unlocked ? 'Start test' : test.isFree === false ? `Unlock ₹${test.price ?? 0}` : 'Unlock'}
                        <span aria-hidden="true">→</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h3 className="text-sm font-bold text-emerald-950">Your test history</h3>
            <p className="mt-1 text-sm text-emerald-900/80">Review every mock paper you have completed and the marks you scored.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAttemptHistory(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900"
          >
            <History className="h-4 w-4" />
            Given tests <span className="rounded bg-white/20 px-2 py-0.5">{attempts.length}</span>
          </button>
        </section>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-5 sm:p-5">
          <h3 className="text-sm font-bold text-[#0b3d91]">General instructions (summary)</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {instructions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      </MockTestPortalLayout>

      {showAttemptHistory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4" onClick={() => setShowAttemptHistory(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-history-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-200 bg-emerald-50 p-4 sm:p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Candidate record</p>
                <h2 id="mock-history-title" className="mt-1 text-lg font-bold text-slate-900">Given tests &amp; scores</h2>
                <p className="mt-1 text-sm text-slate-600">{attempts.length} completed attempt{attempts.length === 1 ? '' : 's'}</p>
              </div>
              <button type="button" onClick={() => setShowAttemptHistory(false)} className="rounded p-2 text-slate-500 hover:bg-white" aria-label="Close history">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">
              {attempts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center">
                  <Clock3 className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 font-semibold text-slate-800">No completed tests yet</p>
                  <p className="mt-1 text-sm text-slate-500">Your scores will appear here after you submit a paper.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attempts.map((attempt) => {
                    const matchingTest = tests.find((test) => test.id === attempt.testId);
                    const maximum =
                      attempt.totalMarks ??
                      (matchingTest ? matchingTest.questions.length * matchingTest.positiveMarking : undefined);
                    const date = new Date(attempt.completedAt);
                    return (
                      <article key={attempt.id} className="flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{attempt.testTitle}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            {attempt.examName} · {Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">{attempt.correct} correct · {attempt.incorrect} wrong · {attempt.totalUnanswered} skipped</p>
                        </div>
                        <div className="shrink-0 rounded-md bg-white px-3 py-2 text-left sm:text-right">
                          <p className="text-lg font-extrabold text-emerald-800">
                            {attempt.rawScore.toFixed(2)}{maximum ? ` / ${maximum}` : ' marks'}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">{attempt.score}% · {attempt.isPassed ? 'Passed' : 'Not passed'}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-lg border border-slate-300 bg-white shadow-2xl sm:rounded-lg">
            <div className="flex items-start justify-between border-b border-slate-200 bg-[#f0f7ff] p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b3d91]">Instruction sheet</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{selectedTest.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedTest(null)} className="rounded p-2 text-slate-400 hover:bg-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-4 sm:p-5">
              <table className="w-full border border-slate-200 text-sm">
                <tbody>
                  {[
                    ['Total questions', selectedTest.totalQuestions],
                    ['Duration', `${selectedTest.duration} minutes`],
                    ['Maximum marks', selectedTest.totalMarks],
                    ['Correct response', `+${selectedTest.positiveMarking}`],
                    ['Incorrect response', `−${selectedTest.negativeMarking}`],
                    ['Unattempted', '0'],
                  ].map(([k, v]) => (
                    <tr key={String(k)} className="border-b border-slate-100">
                      <td className="bg-slate-50 px-3 py-2 font-semibold text-slate-700">{k}</td>
                      <td className="px-3 py-2 text-slate-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Please read carefully</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {instructions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setSelectedTest(null)} className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedToTest}
                className="rounded px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                style={{ background: theme.primary }}
              >
                Start test
              </button>
            </div>
          </div>
        </div>
      )}

      <PremiumPlansModal
        open={showPlans}
        onClose={() => setShowPlans(false)}
        highlight="mock-complete"
        title="Unlock mock test papers"
        subtitle="Mock Tests Complete unlocks every NDA, CDS and AFCAT paper. All Access also includes all SSB practice sets."
      />
    </>
  );
}
