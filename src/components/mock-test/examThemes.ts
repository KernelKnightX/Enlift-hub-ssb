export type MockExamId = 'NDA' | 'CDS' | 'AFCAT';

export const MOCK_EXAM_THEMES: Record<
  MockExamId,
  {
    title: string;
    subtitle: string;
    conductingBody: string;
    route: string;
    primary: string;
    primaryDark: string;
    accentSoft: string;
    logoSrc: string;
    logoAlt: string;
    shortLabel: string;
    stripe: string;
  }
> = {
  NDA: {
    title: 'NDA & NA Examination',
    subtitle: 'National Defence Academy & Naval Academy',
    conductingBody: 'UPSC pattern · Practice CBT',
    route: '/mock-test/nda',
    primary: '#0b3d91',
    primaryDark: '#062a66',
    accentSoft: '#e8f0fc',
    logoSrc: '/landing/thumbs/logo-nda.png',
    logoAlt: 'NDA emblem',
    shortLabel: 'NDA',
    stripe: 'linear-gradient(90deg, #062a66, #0b3d91)',
  },
  CDS: {
    title: 'CDS Examination',
    subtitle: 'Combined Defence Services',
    conductingBody: 'UPSC pattern · Practice CBT',
    route: '/mock-test/cds',
    primary: '#6b2c1a',
    primaryDark: '#4a1e12',
    accentSoft: '#fdf0eb',
    logoSrc: '/landing/thumbs/logo-cds.png',
    logoAlt: 'CDS emblem',
    shortLabel: 'CDS',
    stripe: 'linear-gradient(90deg, #4a1e12, #8b3d2a)',
  },
  AFCAT: {
    title: 'AFCAT Examination',
    subtitle: 'Air Force Common Admission Test',
    conductingBody: 'IAF pattern · Practice CBT',
    route: '/mock-test/afcat',
    primary: '#0c4a6e',
    primaryDark: '#083344',
    accentSoft: '#e0f2fe',
    logoSrc: '/landing/thumbs/logo-iaf.png',
    logoAlt: 'Indian Air Force emblem',
    shortLabel: 'AFCAT · IAF',
    stripe: 'linear-gradient(90deg, #083344, #0ea5e9)',
  },
};

/** Dashboard card order (CDS → AFCAT → NDA). */
export const DASHBOARD_MOCK_EXAMS: MockExamId[] = ['CDS', 'AFCAT', 'NDA'];

/** Exams with papers available to browse and attempt. */
export const AVAILABLE_MOCK_EXAMS: MockExamId[] = ['CDS', 'AFCAT'];

export const MOCK_LISTING_EXAMS: MockExamId[] = ['NDA', 'CDS', 'AFCAT'];
