export interface MockTestMarkingScheme {
  positiveMarking: number;
  negativeMarking: number;
}

export function getMockTestMarkingScheme(
  examName: string,
  fallback: MockTestMarkingScheme = { positiveMarking: 1, negativeMarking: 0.25 },
): MockTestMarkingScheme {
  switch (examName.trim().toUpperCase()) {
    case 'CDS':
      return { positiveMarking: 1, negativeMarking: 0.33 };
    case 'AFCAT':
      return { positiveMarking: 3, negativeMarking: 1 };
    default:
      return fallback;
  }
}

export function hasFixedMockTestMarkingScheme(examName: string): boolean {
  const exam = examName.trim().toUpperCase();
  return exam === 'CDS' || exam === 'AFCAT';
}
