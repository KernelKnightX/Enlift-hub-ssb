import {
  BRAND_LOGO_ALT,
  BRAND_LOGO_NAV_SRC,
  BRAND_LOGO_SRC,
  brandLogoNavHeight,
  brandLogoHeight,
} from '@/lib/siteBranding';

type Variant = 'nav' | 'hero' | 'auth';

const WIDTH: Record<Variant, number> = {
  nav: 160,
  hero: 300,
  auth: 260,
};

type Props = {
  variant?: Variant;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
};

/** Site logo or compact tri-service emblem — PNG dimensions avoid CLS. */
export function BrandLogo({
  variant = 'nav',
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
}: Props) {
  const width = WIDTH[variant];
  const height = variant === 'nav' ? brandLogoNavHeight(width) : brandLogoHeight(width);
  const src = variant === 'nav' ? BRAND_LOGO_NAV_SRC : BRAND_LOGO_SRC;

  const defaultClass =
    variant === 'nav'
      ? 'h-10 w-auto max-w-[min(200px,52vw)] object-contain object-left'
      : variant === 'hero'
        ? 'h-auto w-full max-w-[min(300px,88vw)] object-contain'
        : 'h-auto w-full max-w-[min(260px,90vw)] object-contain';

  return (
    <img
      src={src}
      alt={BRAND_LOGO_ALT}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className ?? defaultClass}
    />
  );
}
