import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AlertTriangle, CheckCircle2, Clock3, History, Lock, RefreshCw, Search, UserPlus, X } from 'lucide-react';
import { loginUrl, registerUrl } from '@/lib/authUrls';
import { useAuth } from '@/contexts/AuthContext';
import { getMockTestsByExam, getUserMockTestAttempts } from '@/lib/mockTestService';
import {
  MockTestPortalLayout,
  PortalUnlockAllButton,
} from '@/components/mock-test/MockTestPortalLayout';
import type { PortalNavId } from '@/components/mock-test/MockTestPortalLayout';
import { PremiumPlansModal } from '@/components/mock-test/PremiumPlansModal';
import { MOCK_EXAM_THEMES, type MockExamId } from '@/components/mock-test/examThemes';
import { isMockPaperUnlocked, mockAccessLabel } from '@/lib/mockTestAccess';
import { getMockTestMarkingScheme } from '@/lib/mockTestMarking';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadedExam, setLoadedExam] = useState<string | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<{ userId: string; attempts: MockTestAttempt[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('all');
  const [showPlans, setShowPlans] = useState(false);
  const [showAttemptHistory, setShowAttemptHistory] = useState(false);
  const [activeNav, setActiveNav] = useState<PortalNavId>('practice');

  const analysisRef = useRef<HTMLElement>(null);
  const syllabusRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    getMockTestsByExam(exam)
      .then((loadedTests) => {
        if (active) {
          setTests(loadedTests);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        console.error(`Failed to load ${exam} mock tests`, error);
        if (active) setLoadError(`We couldn’t load the ${exam} papers. Check your connection and try again.`);
      })
      .finally(() => {
        if (active) {
          setLoadedExam(exam);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [exam, loadAttempt]);
  const papersLoading = loading || loadedExam !== exam;

  useEffect(() => {
    if (!user?.id) return;
    getUserMockTestAttempts(user.id)
      .then((attempts) => setAttemptHistory({ userId: user.id, attempts }))
      .catch((error) => console.error('Failed to load mock test history', error));
  }, [user?.id]);

  const attempts =
    attemptHistory && attemptHistory.userId === user?.id
      ? attemptHistory.attempts.filter((a) => a.examName === exam || tests.some((t) => t.id === a.testId))
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

  const planUnlocked = hasPremiumPlan('mock-complete') || hasPremiumPlan('all-access');
  const totalQuestions = tests.reduce((total, test) => total + test.totalQuestions, 0);
  const isGuest = !user;
  const hubPath = isGuest ? '/mock-tests' : '/dashboard';
  const candidateLabel = user?.fullName || 'Guest — browse only';
  const testContinuePath = (testId: string) => `${theme.route}/test?testId=${testId}`;

  const handleNav = (id: PortalNavId) => {
    setActiveNav(id);
    if (id === 'dashboard') {
      navigate(hubPath);
      return;
    }
    if (id === 'practice') {
      scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (id === 'analysis') {
      setShowAttemptHistory(true);
      return;
    }
    if (id === 'syllabus') {
      syllabusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const promptGuestSignIn = (continueTo: string) => {
    navigate(registerUrl(continueTo));
  };

  const openInstructions = async (test: MockTest, indexInFullList: number) => {
    if (!isMockPaperUnlocked(test, indexInFullList, user?.id)) {
      if (test.isFree === false) {
        if (!user) {
          promptGuestSignIn(theme.route);
          return;
        }
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
        if (!user) {
          promptGuestSignIn(theme.route);
          return;
        }
        setShowPlans(true);
      }
      return;
    }
    setSelectedIndex(indexInFullList);
    setSelectedTest(test);
  };

  const proceedToTest = () => {
    if (!selectedTest) return;
    if (!user) {
      navigate(registerUrl(testContinuePath(selectedTest.id)));
      return;
    }
    if (!isMockPaperUnlocked(selectedTest, selectedIndex, user?.id)) {
      setShowPlans(true);
      return;
    }
    navigate(testContinuePath(selectedTest.id));
  };

  return (
    <>
      <MockTestPortalLayout
        pageTitle={theme.title}
        conductingLabel={`${theme.conductingBody} · Candidate: ${candidateLabel}`}
        breadcrumbs={[
          { label: 'Mock Tests', to: hubPath },
          { label: `${exam} Dashboard` },
        ]}
        backFallback={hubPath}
        dashboardHref={hubPath}
        primaryColor={theme.primary}
        primaryDark={theme.primaryDark}
        titleLogoSrc={theme.logoSrc}
        titleLogoAlt={theme.logoAlt}
        activeNav={activeNav}
        onNavSelect={handleNav}
        headerExtra={
          isGuest ? (
            <Link
              to={registerUrl(theme.route)}
              className="inline-flex items-center gap-1.5 rounded border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/25"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register to attempt
            </Link>
          ) : (
            <PortalUnlockAllButton
              unlocked={planUnlocked}
              primaryColor={theme.primary}
              onClick={() => setShowPlans(true)}
            />
          )
        }
      >
        {isGuest && (
          <div
            className="mb-5 flex flex-col gap-3 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            role="status"
          >
            <div>
              <p className="text-sm font-bold text-sky-950">You&apos;re browsing as a guest</p>
              <p className="mt-1 text-sm text-sky-900/85">
                Explore papers and instructions free. Create an account to start the timer, save progress, and track scores.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to={registerUrl(theme.route)}
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-bold text-white shadow-sm"
                style={{ background: theme.primary }}
              >
                Register free
              </Link>
              <Link
                to={loginUrl(theme.route)}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Log in
              </Link>
            </div>
          </div>
        )}

        <div className="mb-5 grid min-h-[88px] grid-cols-2 gap-3 sm:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[76px] animate-pulse rounded-lg border border-slate-200 bg-slate-100/90"
                />
              ))
            : [
                ['Available Papers', tests.length],
                ['Total Questions', totalQuestions],
                ['Access', planUnlocked ? 'Full series' : 'Free + paid papers'],
                ['Exam Code', exam],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-lg border border-slate-200/80 bg-white px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900">{value}</p>
                </div>
              ))}
        </div>

        <section
          ref={scheduleRef}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">Test schedule — practice papers</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Choose a subject, then select <strong className="font-semibold text-slate-800">Start test</strong> to
                review the instructions and begin the CBT.
              </p>
            </div>
            <label className="relative w-full sm:w-52">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search paper..."
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--exam-primary)] focus:ring-2 focus:ring-[color:var(--exam-primary)]/25"
                style={{ ['--exam-primary' as string]: theme.primary }}
              />
            </label>
          </div>

          <div
            className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 sm:px-5"
            aria-label="Filter papers by subject"
          >
            {subjects.map((item) => {
              const label = item === 'all' ? 'All subjects' : formatSubject(item);
              const active = subject === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSubject(item)}
                  className={`shrink-0 rounded-md border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-transparent text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                  style={active ? { background: theme.primary, borderColor: theme.primary } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-5">
            {papersLoading ? (
              <div
                className="grid min-h-[320px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                aria-busy="true"
                aria-label="Loading test papers"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[220px] animate-pulse rounded-lg border border-slate-200 bg-slate-100/80"
                  />
                ))}
              </div>
            ) : loadError ? (
              <div className="mx-auto flex min-h-[320px] max-w-lg flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50/60 px-6 py-10 text-center">
                <AlertTriangle className="h-8 w-8 text-amber-700" aria-hidden />
                <h3 className="mt-3 text-base font-bold text-slate-900">Papers didn’t load</h3>
                <p className="mt-1 text-sm text-slate-600">{loadError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setLoadError(null);
                    setLoadAttempt((attempt) => attempt + 1);
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white"
                  style={{ background: theme.primary }}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden />
                  Try again
                </button>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 px-4 py-14 text-center text-sm text-slate-500">
                {tests.length === 0 ? 'No papers are available yet.' : 'No papers match your filters.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTests.map((test) => {
                  const indexInFullList = tests.findIndex((t) => t.id === test.id);
                  const unlocked = isMockPaperUnlocked(test, indexInFullList, user?.id);
                  const status = mockAccessLabel(test, indexInFullList, user?.id);
                  const latestAttempt = latestAttempts.get(test.id);
                  const marking = getMockTestMarkingScheme(test.examName, test);
                  const maxMarks = test.questions.length * marking.positiveMarking;
                  const isPremiumLocked = !unlocked;
                  const showPremiumBadge = isPremiumLocked && status !== 'Free';

                  return (
                    <article
                      key={test.id}
                      className={`flex flex-col rounded-lg border p-4 transition-shadow hover:shadow-md ${
                        latestAttempt ? 'border-emerald-200/90 bg-white' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ background: theme.primary }}
                        >
                          {indexInFullList + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold leading-snug text-slate-900">{test.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {formatSubject(test.subject || 'Full paper')}
                          </p>
                        </div>
                        {latestAttempt ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Given
                          </span>
                        ) : showPremiumBadge ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                            <Lock className="h-3 w-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 rounded-md bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-800">
                            {status}
                          </span>
                        )}
                      </div>

                      <div
                        className="mt-3 grid grid-cols-3 divide-x divide-slate-200/80 rounded-md py-2.5 text-center"
                        style={{ background: theme.accentSoft }}
                      >
                        <div className="px-1">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Questions</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">{test.totalQuestions}</p>
                        </div>
                        <div className="px-1">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Duration</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">{test.duration} min</p>
                        </div>
                        <div className="px-1">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                            {latestAttempt ? 'Your score' : 'Marks'}
                          </p>
                          <p
                            className={`mt-0.5 text-sm font-bold ${
                              latestAttempt ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {latestAttempt
                              ? `${latestAttempt.rawScore.toFixed(2)} / ${maxMarks}`
                              : maxMarks}
                          </p>
                        </div>
                      </div>

                      {unlocked ? (
                        <button
                          type="button"
                          onClick={() => openInstructions(test, indexInFullList)}
                          className="mt-3 w-full rounded-md px-3 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95"
                          style={{ background: theme.primary }}
                        >
                          {latestAttempt ? 'Retake test' : 'Start test'} →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openInstructions(test, indexInFullList)}
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50"
                        >
                          <Lock className="h-4 w-4" />
                          {test.isFree === false ? `Unlock · ₹${test.price ?? 0}` : 'Unlock'}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section ref={analysisRef} className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Analysis &amp; attempt history</h3>
              <p className="mt-1 text-sm text-slate-600">Review completed papers and scores from this examination.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isGuest) {
                  navigate(loginUrl(theme.route));
                  return;
                }
                setShowAttemptHistory(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              <History className="h-4 w-4" />
              {isGuest ? 'Log in for history' : `View history (${attempts.length})`}
            </button>
          </div>
        </section>

        <section
          ref={syllabusRef}
          id="marking-scheme"
          className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <h3 className="text-sm font-bold text-slate-900">Exam guidelines &amp; marking scheme (summary)</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            {instructions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-slate-500">
            Positive and negative marks for each paper are shown on the instruction sheet before you start.
          </p>
        </section>
      </MockTestPortalLayout>

      {showAttemptHistory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4"
          onClick={() => setShowAttemptHistory(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-history-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Analysis</p>
                <h2 id="mock-history-title" className="mt-1 text-lg font-bold text-slate-900">
                  Given tests &amp; scores — {exam}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {attempts.length} completed attempt{attempts.length === 1 ? '' : 's'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAttemptHistory(false)}
                className="rounded p-2 text-slate-500 hover:bg-white"
                aria-label="Close history"
              >
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
                      <article
                        key={attempt.id}
                        className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{attempt.testTitle}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            {Number.isNaN(date.getTime())
                              ? 'Date unavailable'
                              : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            {attempt.correct} correct · {attempt.incorrect} wrong · {attempt.totalUnanswered} skipped
                          </p>
                        </div>
                        <div className="shrink-0 rounded-md bg-white px-3 py-2 text-left sm:text-right">
                          <p className="text-lg font-extrabold text-emerald-800">
                            {attempt.rawScore.toFixed(2)}{maximum ? ` / ${maximum}` : ' marks'}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            {attempt.score}% · {attempt.isPassed ? 'Passed' : 'Not passed'}
                          </p>
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
            <div
              className="flex items-start justify-between border-b border-slate-200 p-4"
              style={{ background: theme.accentSoft }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                  Instruction sheet
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{selectedTest.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="rounded p-2 text-slate-400 hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-4 sm:p-5">
              <table className="w-full border border-slate-200 text-sm">
                <tbody>
                  {[
                    ['Total questions', selectedTest.totalQuestions],
                    ['Duration', `${selectedTest.duration} minutes`],
                    [
                      'Maximum marks',
                      selectedTest.questions.length *
                        getMockTestMarkingScheme(selectedTest.examName, selectedTest).positiveMarking,
                    ],
                    ['Correct response', `+${getMockTestMarkingScheme(selectedTest.examName, selectedTest).positiveMarking}`],
                    ['Incorrect response', `−${getMockTestMarkingScheme(selectedTest.examName, selectedTest).negativeMarking}`],
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
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedToTest}
                className="rounded px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                style={{ background: theme.primary }}
              >
                {isGuest ? 'Register & start test' : 'Start test'}
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
        subtitle="One-time access to available CDS and AFCAT papers on this portal."
      />
    </>
  );
}
