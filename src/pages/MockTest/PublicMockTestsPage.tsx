import { Link } from 'react-router';
import { ArrowRight, ClipboardList, Clock, LayoutGrid } from 'lucide-react';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import {
  AVAILABLE_MOCK_EXAMS,
  DASHBOARD_MOCK_EXAMS,
  MOCK_EXAM_THEMES,
} from '@/components/mock-test/examThemes';
import { useAuth } from '@/contexts/AuthContext';
import { registerUrl } from '@/lib/authUrls';
import { ExamLogo } from '@/components/ExamLogo';

const perks = [
  { icon: Clock, text: 'Timed CBT with auto-submit' },
  { icon: LayoutGrid, text: 'Question palette & navigation' },
  { icon: ClipboardList, text: 'Instruction sheet before each paper' },
];

export default function PublicMockTestsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <NavbarSection />

        <main className="mx-auto max-w-5xl px-4 pb-16 pt-[88px] sm:px-6">
          <header className="rounded-xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Practice CBT</p>
            <h1 className="mt-2 font-['Rajdhani',sans-serif] text-3xl font-bold tracking-wide text-slate-900 sm:text-4xl">
              Defence mock tests
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {isAuthenticated
                ? 'Pick an examination hub to view papers, marking rules, and your attempt history.'
                : 'Browse CDS and AFCAT papers and syllabus — no login required. NDA mock tests are coming soon.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md bg-[#0f172a] px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Your dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to={registerUrl('/mock-tests')}
                    className="inline-flex items-center gap-2 rounded-md bg-[#C8A84B] px-5 py-2.5 text-sm font-bold text-[#0d1710] hover:bg-[#e2c26a]"
                  >
                    Create free account <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-5">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                  <Icon className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </header>

          <section className="mt-8" aria-labelledby="exam-hubs-heading">
            <h2 id="exam-hubs-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Examination hubs
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {DASHBOARD_MOCK_EXAMS.map((examId) => {
                const theme = MOCK_EXAM_THEMES[examId];
                const isAvailable = AVAILABLE_MOCK_EXAMS.includes(examId);
                const card = (
                  <>
                    <div className="h-1 w-full" style={{ background: theme.stripe }} />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-1.5">
                        <ExamLogo src={theme.logoSrc} alt="" size={48} loading="lazy" />
                      </div>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                        {examId}
                      </p>
                      <h3 className="mt-1 text-base font-bold leading-snug text-slate-900">{theme.title}</h3>
                      <p className="mt-1 flex-1 text-xs text-slate-600">{theme.subtitle}</p>
                      <span
                        className="mt-4 inline-flex items-center gap-1 text-sm font-bold"
                        style={{ color: theme.primary }}
                      >
                        {isAvailable ? (
                          <>View papers <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                            Coming soon
                          </span>
                        )}
                      </span>
                    </div>
                  </>
                );
                const cardClassName =
                  'flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition ' +
                  (isAvailable ? 'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md' : 'cursor-not-allowed opacity-75');
                return isAvailable ? (
                  <Link key={examId} to={theme.route} className={`group ${cardClassName}`}>
                    {card}
                  </Link>
                ) : (
                  <div key={examId} className={cardClassName} aria-label={`${examId} mock tests coming soon`}>
                    {card}
                  </div>
                );
              })}
            </div>
          </section>

          {!isAuthenticated && (
            <aside
              className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50/90 px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6"
              aria-label="Sign up prompt"
            >
              <div>
                <p className="font-bold text-amber-950">Ready to attempt a paper?</p>
                <p className="mt-1 text-sm text-amber-900/90">
                  Free registration unlocks timed attempts, auto-save, and score history on your profile.
                </p>
              </div>
              <Link
                to={registerUrl('/mock-tests')}
                className="mt-4 inline-flex shrink-0 items-center justify-center rounded-md bg-amber-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-950 sm:mt-0"
              >
                Register free
              </Link>
            </aside>
          )}
        </main>

        <FooterSection />
      </div>
    </>
  );
}
