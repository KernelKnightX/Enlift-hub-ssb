import { BRAND_DISPLAY_NAME, BRAND_LOGO_SRC } from '@/lib/siteBranding';

/** Public site URL for canonical, Open Graph, and sitemap (override in production via .env). */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://faujigrid.com'
).replace(/\/$/, '');

export const SITE_NAME = BRAND_DISPLAY_NAME;
export const SITE_LOCALE = 'en_IN';
export const SUPPORT_EMAIL =
  (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined) || 'support@faujigrid.com';

export const DEFAULT_OG_IMAGE_PATH = BRAND_LOGO_SRC;

export const DEFAULT_KEYWORDS =
  'Fauji Grid, NDA mock test, CDS mock test, AFCAT mock test, NDA online test, CDS practice paper, AFCAT CBT, defence entrance exam, UPSC NDA, combined defence services, Indian Air Force exam, computer based test, free mock test India';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function absoluteImageUrl(path: string = DEFAULT_OG_IMAGE_PATH): string {
  return absoluteUrl(path);
}
