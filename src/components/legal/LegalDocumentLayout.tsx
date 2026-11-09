import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, FileText, Shield, ChevronRight } from 'lucide-react';

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type Props = {
  docType: 'terms' | 'privacy';
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalDocumentLayout({ docType, title, updated, intro, sections }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(section.id);
        },
        { rootMargin: '-20% 0px -55% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const other =
    docType === 'terms'
      ? { label: 'Privacy Policy', to: '/privacy', icon: Shield }
      : { label: 'Terms & Conditions', to: '/terms', icon: FileText };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-[#0f1f3d]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f1f3d]">
              <Shield className="h-4 w-4 text-white" />
            </span>
            Fauji Grid
          </Link>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Link to="/login" className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100">Log in</Link>
            <Link
              to="/register"
              className="rounded-md bg-[#0f1f3d] px-3 py-1.5 font-semibold text-white hover:bg-[#162a52]"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0f1f3d]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">On this page</p>
              <nav className="mt-3 space-y-0.5" aria-label="Section navigation">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      activeId === s.id
                        ? 'bg-[#0f1f3d]/8 font-semibold text-[#0f1f3d]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <Link
                  to={other.to}
                  className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <other.icon className="h-4 w-4 text-[#0f1f3d]" />
                    {other.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              </div>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Legal</p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{intro}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Updated {updated}
                </span>
              </div>

              <div className="mt-8 space-y-10">
                {sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="flex items-baseline gap-3 text-lg font-bold text-slate-900">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0f1f3d] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {section.title}
                    </h2>
                    <div className="mt-3 text-sm leading-relaxed text-slate-600 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:font-medium [&_a]:text-[#0f1f3d] [&_a]:underline-offset-2 hover:[&_a]:underline">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 rounded-xl bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Questions?{' '}
                  <a href="mailto:support@faujigrid.com" className="font-semibold text-[#0f1f3d]">
                    support@faujigrid.com
                  </a>
                </p>
                <Link
                  to={other.to}
                  className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-[#0f1f3d] hover:underline lg:hidden"
                >
                  Read {other.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Fauji Grid. Independent practice platform — not affiliated with UPSC, IAF, or
              the Indian Armed Forces.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
