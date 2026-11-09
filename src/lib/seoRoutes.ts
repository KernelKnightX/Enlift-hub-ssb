import { LANDING_FAQS } from '@/content/landingFaqs';
import { MOCK_EXAM_THEMES } from '@/components/mock-test/examThemes';
import {
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from '@/lib/siteSeo';

export type RobotsDirective = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';

export type PageSeoConfig = {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  robots?: RobotsDirective;
  ogType?: 'website' | 'article';
  ogImagePath?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function titleWithBrand(pageTitle: string): string {
  if (pageTitle.includes(SITE_NAME)) return pageTitle;
  return `${pageTitle} | ${SITE_NAME}`;
}

function faqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LANDING_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

function webPageJsonLd(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

const HOME: PageSeoConfig = {
  title: `${SITE_NAME} — CDS & AFCAT Mock Tests | NDA Coming Soon`,
  description:
    'Practice CDS and AFCAT with timed computer-based mock tests on Fauji Grid. NDA mock tests are coming soon. Browse papers, review answers, and track scores.',
  canonicalPath: '/',
  keywords: DEFAULT_KEYWORDS,
  jsonLd: [
    webPageJsonLd(
      `${SITE_NAME} — Defence mock tests`,
      'Timed CBT mock tests for CDS and AFCAT aspirants. NDA mock tests are coming soon.',
      '/',
    ),
    faqPageJsonLd(),
  ],
};

const ROUTE_MAP: Record<string, PageSeoConfig> = {
  '/': HOME,
  '/mock-tests': {
    title: titleWithBrand('CDS & AFCAT Mock Tests — NDA Coming Soon'),
    description:
      'Explore CDS and AFCAT practice papers without logging in. NDA mock tests are coming soon. See duration, marking, and syllabus before registering to attempt timed CBT mocks.',
    canonicalPath: '/mock-tests',
    keywords:
      'browse NDA mock test, CDS practice papers, AFCAT free mock, defence exam hub, CBT mock tests India',
    jsonLd: [
      webPageJsonLd('Mock test hub', 'Browse CDS and AFCAT practice papers. NDA mock tests are coming soon.', '/mock-tests'),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Mock tests', path: '/mock-tests' },
      ]),
    ],
  },
  '/mock-test/nda': {
    title: titleWithBrand('NDA Mock Tests — Coming Soon'),
    description:
      'NDA & NA examination practice papers are being prepared. NDA mock tests are coming soon; browse CDS and AFCAT papers in the meantime.',
    canonicalPath: '/mock-test/nda',
    keywords:
      'NDA mock test, NDA online test, NDA NA exam practice, UPSC NDA CBT, national defence academy mock, NDA question paper',
    jsonLd: [
      webPageJsonLd('NDA mock tests coming soon', MOCK_EXAM_THEMES.NDA.subtitle, '/mock-test/nda'),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Mock tests', path: '/mock-tests' },
        { name: 'NDA', path: '/mock-test/nda' },
      ]),
    ],
  },
  '/mock-test/cds': {
    title: titleWithBrand('CDS Mock Test Online — Combined Defence Services CBT'),
    description:
      'CDS examination mock tests in a formal computer-based format. Timed papers, marking scheme, and attempt history. Prepare for UPSC Combined Defence Services with realistic practice.',
    canonicalPath: '/mock-test/cds',
    keywords:
      'CDS mock test, CDS online test, combined defence services practice, UPSC CDS CBT, CDS question paper, OTA IMA INA mock',
    jsonLd: [
      webPageJsonLd('CDS mock tests', MOCK_EXAM_THEMES.CDS.subtitle, '/mock-test/cds'),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Mock tests', path: '/mock-tests' },
        { name: 'CDS', path: '/mock-test/cds' },
      ]),
    ],
  },
  '/mock-test/afcat': {
    title: titleWithBrand('AFCAT Mock Test Online — IAF Pattern CBT Practice'),
    description:
      'AFCAT mock tests for Indian Air Force aspirants. Timed CBT with Verbal, Numerical, Reasoning & GA-style papers, instructions, and post-test analysis on your account.',
    canonicalPath: '/mock-test/afcat',
    keywords:
      'AFCAT mock test, AFCAT online test, Indian Air Force exam practice, AFCAT CBT, AFCAT question paper, flying branch mock',
    jsonLd: [
      webPageJsonLd('AFCAT mock tests', MOCK_EXAM_THEMES.AFCAT.subtitle, '/mock-test/afcat'),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Mock tests', path: '/mock-tests' },
        { name: 'AFCAT', path: '/mock-test/afcat' },
      ]),
    ],
  },
  '/about': {
    title: titleWithBrand('About Us — Defence Preparation Ecosystem'),
    description:
      'Fauji Grid by Enlift Hub is a defence-preparation platform. Learn about our mission and Enlift — written and psychological-test practice for SSB aspirants.',
    canonicalPath: '/about',
    keywords:
      'Fauji Grid, Enlift Hub, Enlift, SSB preparation, OIR practice, PPDT, TAT WAT SRT, officer selection, defence aspirants India',
    jsonLd: [
      webPageJsonLd(
        'About Fauji Grid by Enlift Hub',
        'Defence preparation platform by Enlift Hub; Enlift supports SSB written and psychological-test practice.',
        '/about',
      ),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'About us', path: '/about' },
      ]),
    ],
  },
  '/terms': {
    title: titleWithBrand('Terms & Conditions'),
    description: 'Terms and conditions for using Fauji Grid mock tests, accounts, payments, and content.',
    canonicalPath: '/terms',
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: webPageJsonLd('Terms & Conditions', 'Fauji Grid terms of use.', '/terms'),
  },
  '/privacy': {
    title: titleWithBrand('Privacy Policy'),
    description:
      'How Fauji Grid collects, uses, and protects your data when you register, take mock tests, or make purchases.',
    canonicalPath: '/privacy',
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: webPageJsonLd('Privacy Policy', 'Fauji Grid privacy practices.', '/privacy'),
  },
  '/login': {
    title: titleWithBrand('Log in'),
    description: 'Log in to your Fauji Grid account to attempt available CDS and AFCAT mock tests and view attempt history.',
    canonicalPath: '/login',
    robots: 'noindex, follow',
  },
  '/register': {
    title: titleWithBrand('Create free account'),
    description:
      'Register free for Fauji Grid — timed CDS and AFCAT mock tests with saved progress and score history. NDA mock tests are coming soon.',
    canonicalPath: '/register',
    robots: 'noindex, follow',
  },
  '/reset-password': {
    title: titleWithBrand('Reset password'),
    description: 'Reset your Fauji Grid account password.',
    canonicalPath: '/reset-password',
    robots: 'noindex, nofollow',
  },
  '/direct-reset-password': {
    title: titleWithBrand('Reset password'),
    description: 'Reset your Fauji Grid account password.',
    canonicalPath: '/direct-reset-password',
    robots: 'noindex, nofollow',
  },
  '/admin-login': {
    title: titleWithBrand('Admin'),
    description: 'Fauji Grid administration.',
    canonicalPath: '/admin-login',
    robots: 'noindex, nofollow',
  },
  '/dashboard': {
    title: titleWithBrand('Dashboard'),
    description: 'Your Fauji Grid mock test dashboard.',
    canonicalPath: '/dashboard',
    robots: 'noindex, follow',
  },
};

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/** Resolve SEO for SPA routes (including private test URLs as noindex). */
export function resolvePageSeo(pathname: string): PageSeoConfig {
  const path = normalizePathname(pathname);

  if (path.startsWith('/mock-test/') && (path.endsWith('/test') || path.endsWith('/analysis'))) {
    return {
      title: titleWithBrand('Mock test session'),
      description: 'Private mock test session on Fauji Grid.',
      canonicalPath: path,
      robots: 'noindex, nofollow',
    };
  }

  if (path.startsWith('/admin')) {
    return {
      title: titleWithBrand('Admin'),
      description: 'Fauji Grid administration.',
      canonicalPath: path,
      robots: 'noindex, nofollow',
    };
  }

  return ROUTE_MAP[path] ?? {
    ...HOME,
    canonicalPath: path,
    robots: 'noindex, follow',
    title: titleWithBrand('Page not found'),
    description: HOME.description,
  };
}
