import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { BrandLogo } from '@/components/BrandLogo';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Tighter header + spacing for longer forms (register). */
  compact?: boolean;
};

export function AuthFormLayout({ title, subtitle, children, footer, compact = false }: Props) {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[#f4f6f9]">
      <div className="flex flex-1 flex-col justify-center overflow-y-auto overscroll-contain px-4 py-3 sm:py-4">
        <div className="mx-auto w-full max-w-[440px]">
          <div className={`flex flex-col items-center text-center ${compact ? 'mb-4' : 'mb-6'}`}>
            <BrandLogo
              variant="auth"
              loading="eager"
              className={compact ? 'mb-2' : 'mb-3'}
            />
            <h1 className={`font-bold text-slate-900 ${compact ? 'mt-3 text-xl' : 'mt-4 text-2xl'}`}>{title}</h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          </div>

          {children}

          {footer}

          <p className="mt-4 text-center text-xs text-slate-400">
            <Link to="/" className="font-medium hover:text-[#0f1f3d]">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const authFieldClass =
  'h-11 rounded-lg border-slate-200 bg-white text-sm shadow-sm focus-visible:border-[#0f1f3d] focus-visible:ring-[#0f1f3d]/20';
export const authLabelClass = 'text-xs font-semibold text-slate-700';
