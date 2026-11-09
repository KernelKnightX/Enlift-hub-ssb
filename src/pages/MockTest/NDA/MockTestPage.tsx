import { Link } from 'react-router';
import { ArrowRight, Clock3 } from 'lucide-react';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { NavbarSection } from '@/pages/navbar/NavbarSection';

export default function NDAMockTestPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <NavbarSection />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <Clock3 className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            NDA · Coming Soon
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            NDA mock tests are on the way
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            NDA practice papers are being prepared. For now, browse and attempt mock tests for CDS and AFCAT.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/mock-test/cds"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#6b2c1a] px-5 py-3 text-sm font-bold text-white hover:bg-[#4a1e12]"
            >
              Explore CDS <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/mock-test/afcat"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0c4a6e] px-5 py-3 text-sm font-bold text-white hover:bg-[#083344]"
            >
              Explore AFCAT <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
