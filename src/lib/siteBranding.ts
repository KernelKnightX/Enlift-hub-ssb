/** Public brand identity — single source for name, logo, and tagline in UI. */
export const BRAND_NAME = 'Fauji Grid';
export const BRAND_BYLINE = 'by Enlift Hub';
export const BRAND_DISPLAY_NAME = `${BRAND_NAME} ${BRAND_BYLINE}`;
/** Compact form for URLs / meta where space is awkward */
export const BRAND_SLUG = 'faujigrid';

export const BRAND_TAGLINE = 'Prepare like an officer';

/** SSB written & psychological practice product (separate platform). */
export const ENLIFT_PRODUCT_NAME = 'Enlift';
export const ENLIFT_TAGLINE = 'Your practice ground for SSB preparation';
export const ENLIFT_URL =
  (import.meta.env.VITE_ENLIFT_URL as string | undefined) ||
  (import.meta.env.VITE_ABHYAS_SSB_URL as string | undefined) ||
  'https://abhyassb.com';

/** Master artwork supplied for the Fauji Grid brand. */
export const BRAND_LOGO_MASTER = '/branding/faujigrid-master.jpg';
/** Full-width logo (hero, auth, Open Graph). PNG only. */
export const BRAND_LOGO_SRC = '/branding/faujigrid-logo.png';
/** Emblem-only crop for compact navigation and admin headers. */
export const BRAND_LOGO_NAV_SRC = '/branding/faujigrid-logo-nav.png';
export const BRAND_FAVICON_SRC = '/branding/faujigrid-icon.png';

export const BRAND_LOGO_ALT = 'Fauji Grid tri-service emblem';

/** Aspect ratio of the full master artwork. Use with width for layout-stable images. */
export const BRAND_LOGO_ASPECT = 1024 / 682;
/** Aspect ratio of the compact emblem crop (960×490). */
export const BRAND_LOGO_NAV_ASPECT = 960 / 490;

export function brandLogoHeight(width: number): number {
  return Math.round(width / BRAND_LOGO_ASPECT);
}

export function brandLogoNavHeight(width: number): number {
  return Math.round(width / BRAND_LOGO_NAV_ASPECT);
}
