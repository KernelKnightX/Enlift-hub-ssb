import type { PurchasableTestType } from '@/lib/setAccess';

export type PsychTestModuleId = 'wat' | 'ppdt' | 'srt' | 'tat';

export type PsychTestModuleConfig = {
  id: PsychTestModuleId;
  code: string;
  title: string;
  testType: PurchasableTestType;
  primary: string;
  primaryDark: string;
  accentSoft: string;
  routes: { instructions: string; sets: string; test: string };
  sets: {
    total: number;
    free: number;
    unitLabel: string;
    gridCols: string;
  };
  specRows: [string, string][];
  noticeLead: string;
  rules: string[];
  keyPoints: string[];
  whatToWrite: string[];
  tip: string;
  setNotice: string;
  setSummaryBullets: string[];
  setStatChips: { label: string; value: string }[];
  ctaHint: string;
  refreshCompletedOnFocus?: boolean;
};

export const PSYCH_TEST_MODULES: Record<PsychTestModuleId, PsychTestModuleConfig> = {
  wat: {
    id: 'wat',
    code: 'WAT',
    title: 'Word Association Test',
    testType: 'wat',
    primary: '#c2410c',
    primaryDark: '#9a3412',
    accentSoft: '#fff7ed',
    routes: { instructions: '/wat/instructions', sets: '/wat/sets', test: '/wat/test' },
    sets: { total: 10, free: 5, unitLabel: '60 words', gridCols: 'sm:grid-cols-5' },
    specRows: [
      ['Mode', 'Offline writing (pen & paper)'],
      ['Items per set', '60 words'],
      ['Time per item', '15 seconds'],
      ['Total duration', '15 minutes'],
      ['Advance', 'Automatic after each word'],
    ],
    noticeLead:
      'This is an offline writing test. Keep pen and paper ready. Each word is shown for 15 seconds — write one complete sentence using that word.',
    rules: [
      'Do not type answers in the system; write on your answer sheet.',
      'Write a grammatically correct, meaningful sentence for every word.',
      'Stay positive and reflect officer-like qualities (OLQs).',
      'The timer advances automatically; manage pace calmly.',
    ],
    keyPoints: [
      'Write a meaningful sentence',
      'Use positive and impactful language',
      'Show leadership and OLQs',
      'Be quick but thoughtful',
    ],
    whatToWrite: [
      'A complete, grammatically correct sentence',
      'Use the given word meaningfully',
      'Show positive thinking',
      'Demonstrate OLQs (Officer Like Qualities)',
      'Be original and creative',
    ],
    tip: 'Focus on positive themes, leadership, discipline, and national service. Avoid negative or pessimistic statements.',
    setNotice: 'Each WAT set contains 60 words. Total time: 15 minutes (15 seconds per word).',
    setStatChips: [
      { label: 'Per word', value: '15 sec' },
      { label: 'Total', value: '15 min' },
      { label: 'Items', value: '60' },
      { label: 'Sets free', value: '1–5' },
    ],
    setSummaryBullets: [
      '60 words in this set',
      '15 seconds per word',
      'Total time: 15 minutes',
      'Fully automatic progression',
    ],
    ctaHint: 'Word appears for 15 seconds',
  },
  ppdt: {
    id: 'ppdt',
    code: 'PPDT',
    title: 'Picture Perception & Description Test',
    testType: 'ppdt',
    primary: '#7c3aed',
    primaryDark: '#5b21b6',
    accentSoft: '#f5f3ff',
    routes: { instructions: '/ppdt/instructions', sets: '/ppdt/sets', test: '/ppdt/test' },
    sets: { total: 10, free: 5, unitLabel: '10 pictures', gridCols: 'sm:grid-cols-5' },
    specRows: [
      ['Mode', 'Offline writing (pen & paper)'],
      ['Items per set', '10 pictures'],
      ['Picture viewing', '30 seconds each'],
      ['Story writing', '4 minutes each'],
      ['Approx. total', '~45 minutes per set'],
    ],
    noticeLead:
      'Offline writing test. View each picture for 30 seconds, then write a story for 4 minutes based on your perception.',
    rules: [
      'Observe the picture carefully during viewing time.',
      'Build a complete story with a logical, positive outcome.',
      'Include who, what, why, action taken, and result.',
      'Phases advance automatically when time ends.',
    ],
    keyPoints: [
      'Observe carefully during picture viewing',
      'Create a complete and realistic story',
      'Include thoughts, actions, and outcome',
      'Give a logical and positive conclusion',
    ],
    whatToWrite: [
      'Characters in the picture (number, age, gender)',
      'What is happening in the situation',
      'What led to this situation',
      'What action is taken',
      'What will be the final outcome',
    ],
    tip: 'Focus on positive themes, leadership, responsibility, and practical problem-solving. Avoid fantasy or unrealistic endings.',
    setNotice:
      'Each PPDT set contains 10 pictures. Total time: ~45 minutes (30 seconds viewing + 4 minutes writing per picture).',
    setStatChips: [
      { label: 'View', value: '30 sec' },
      { label: 'Write', value: '4 min' },
      { label: 'Pictures', value: '10' },
      { label: 'Sets free', value: '1–5' },
    ],
    setSummaryBullets: [
      '10 pictures in this set',
      '30 seconds picture viewing per image',
      '4 minutes story writing per image',
      'Total time: ~45 minutes',
    ],
    ctaHint: 'Picture 30 sec, then 4 min to write',
  },
  srt: {
    id: 'srt',
    code: 'SRT',
    title: 'Situation Reaction Test',
    testType: 'srt',
    primary: '#dc2626',
    primaryDark: '#991b1b',
    accentSoft: '#fef2f2',
    routes: { instructions: '/srt/instructions', sets: '/srt/sets', test: '/srt/test' },
    sets: { total: 10, free: 5, unitLabel: '60 situations', gridCols: 'sm:grid-cols-5' },
    specRows: [
      ['Mode', 'Offline writing (pen & paper)'],
      ['Items per set', '60 situations'],
      ['Time per item', '30 seconds'],
      ['Total duration', '30 minutes'],
      ['Advance', 'Automatic to next situation'],
    ],
    noticeLead:
      'Read each situation and write what you would do. There are 60 situations per set. Keep pen and paper ready.',
    rules: [
      'Write practical, specific actions — not vague ideals.',
      'Show maturity, common sense, and leadership.',
      'Keep responses concise within the time limit.',
      'Timer moves to the next situation automatically.',
    ],
    keyPoints: [
      'Read the situation carefully',
      'Write practical and realistic actions',
      'Show quick decision making',
      'Be specific about your response',
    ],
    whatToWrite: [
      'What action you would take',
      'Steps you would follow',
      'How you would handle the situation',
      'Practical and realistic approach',
      'Leadership qualities in action',
    ],
    tip: 'Focus on practical solutions and quick thinking. Avoid overly ideal or unrealistic responses.',
    setNotice: 'Each SRT set contains 60 situations. Total time: 30 minutes (30 seconds per situation).',
    setStatChips: [
      { label: 'Per item', value: '30 sec' },
      { label: 'Total', value: '30 min' },
      { label: 'Items', value: '60' },
      { label: 'Sets free', value: '1–5' },
    ],
    setSummaryBullets: [
      '60 situations in this set',
      '30 seconds per situation',
      'Total time: 30 minutes',
      'Timer auto-advances to next situation',
    ],
    ctaHint: '60 situations per set',
    refreshCompletedOnFocus: true,
  },
  tat: {
    id: 'tat',
    code: 'TAT',
    title: 'Thematic Apperception Test',
    testType: 'tat',
    primary: '#059669',
    primaryDark: '#047857',
    accentSoft: '#ecfdf5',
    routes: { instructions: '/tat/instructions', sets: '/tat/sets', test: '/tat/test' },
    sets: { total: 6, free: 3, unitLabel: '12 pictures', gridCols: 'sm:grid-cols-3' },
    specRows: [
      ['Mode', 'Offline writing (pen & paper)'],
      ['Items per set', '12 pictures'],
      ['Picture viewing', '30 seconds each'],
      ['Story writing', '4 minutes each'],
      ['Break between items', '5 seconds'],
    ],
    noticeLead:
      'Offline writing test. View each picture for 30 seconds, then write a story for 4 minutes. The set runs in one continuous session.',
    rules: [
      'Treat each picture as a separate story with a clear outcome.',
      'Use the full writing time to develop the plot.',
      'Stay realistic and positive; reflect OLQs.',
      'Session progresses automatically through all pictures.',
    ],
    keyPoints: [
      'Observe carefully during picture viewing',
      'Create a complete and realistic story',
      'Include thoughts, actions, and outcome',
      'Give a logical and positive conclusion',
    ],
    whatToWrite: [
      'Characters in the picture (number, age, gender)',
      'What is happening in the situation',
      'What led to this situation',
      'What action is taken',
      'What will be the final outcome',
    ],
    tip: 'Focus on positive themes, leadership, responsibility, and practical problem-solving. Avoid fantasy or extreme emotions.',
    setNotice: 'Each TAT set contains 12 pictures and runs automatically in one continuous session.',
    setStatChips: [
      { label: 'View', value: '30 sec' },
      { label: 'Write', value: '4 min' },
      { label: 'Pictures', value: '12' },
      { label: 'Sets free', value: '1–3' },
    ],
    setSummaryBullets: [
      '12 pictures in this set',
      '30 seconds picture viewing per image',
      '4 minutes story writing per image',
      '5 seconds break between pictures',
      'Fully automatic progression',
    ],
    ctaHint: 'Picture 30 sec, then 4 min to write',
  },
};

export function getPsychModule(id: PsychTestModuleId): PsychTestModuleConfig {
  return PSYCH_TEST_MODULES[id];
}
