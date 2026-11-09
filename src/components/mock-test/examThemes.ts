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
  },
  CDS: {
    title: 'CDS Examination',
    subtitle: 'Combined Defence Services',
    conductingBody: 'UPSC pattern · Practice CBT',
    route: '/mock-test/cds',
    primary: '#6b2c1a',
    primaryDark: '#4a1e12',
    accentSoft: '#fdf0eb',
  },
  AFCAT: {
    title: 'AFCAT Examination',
    subtitle: 'Air Force Common Admission Test',
    conductingBody: 'IAF pattern · Practice CBT',
    route: '/mock-test/afcat',
    primary: '#0c4a6e',
    primaryDark: '#083344',
    accentSoft: '#e0f2fe',
  },
};

export const MOCK_LISTING_EXAMS: MockExamId[] = ['NDA', 'CDS', 'AFCAT'];
