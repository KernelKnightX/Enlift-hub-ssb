export interface PaperFoldingQuestion {
  id: number;
  foldedPaper: string; // path to folded paper image
  options: string[]; // paths to 4 option images
  answer: number; // correct option index (0-3)
}

export const paperFoldingQuestions: PaperFoldingQuestion[] = [
  {
    id: 1,
    foldedPaper: "/questions/paper-folding/q1/folded.svg",
    options: [
      "/questions/paper-folding/q1/a.svg",
      "/questions/paper-folding/q1/b.svg",
      "/questions/paper-folding/q1/c.svg",
      "/questions/paper-folding/q1/d.svg"
    ],
    answer: 2
  },
  {
    id: 2,
    foldedPaper: "/questions/paper-folding/q2/folded.svg",
    options: [
      "/questions/paper-folding/q2/a.svg",
      "/questions/paper-folding/q2/b.svg",
      "/questions/paper-folding/q2/c.svg",
      "/questions/paper-folding/q2/d.svg"
    ],
    answer: 1
  },
  {
    id: 3,
    foldedPaper: "/questions/paper-folding/q3/folded.svg",
    options: [
      "/questions/paper-folding/q3/a.svg",
      "/questions/paper-folding/q3/b.svg",
      "/questions/paper-folding/q3/c.svg",
      "/questions/paper-folding/q3/d.svg"
    ],
    answer: 0
  },
  {
    id: 4,
    foldedPaper: "/questions/paper-folding/q4/folded.svg",
    options: [
      "/questions/paper-folding/q4/a.svg",
      "/questions/paper-folding/q4/b.svg",
      "/questions/paper-folding/q4/c.svg",
      "/questions/paper-folding/q4/d.svg"
    ],
    answer: 3
  },
  {
    id: 5,
    foldedPaper: "/questions/paper-folding/q5/folded.svg",
    options: [
      "/questions/paper-folding/q5/a.svg",
      "/questions/paper-folding/q5/b.svg",
      "/questions/paper-folding/q5/c.svg",
      "/questions/paper-folding/q5/d.svg"
    ],
    answer: 1
  },
  {
    id: 6,
    foldedPaper: "/questions/paper-folding/q6/folded.svg",
    options: [
      "/questions/paper-folding/q6/a.svg",
      "/questions/paper-folding/q6/b.svg",
      "/questions/paper-folding/q6/c.svg",
      "/questions/paper-folding/q6/d.svg"
    ],
    answer: 2
  },
  {
    id: 7,
    foldedPaper: "/questions/paper-folding/q7/folded.svg",
    options: [
      "/questions/paper-folding/q7/a.svg",
      "/questions/paper-folding/q7/b.svg",
      "/questions/paper-folding/q7/c.svg",
      "/questions/paper-folding/q7/d.svg"
    ],
    answer: 0
  },
  {
    id: 8,
    foldedPaper: "/questions/paper-folding/q8/folded.svg",
    options: [
      "/questions/paper-folding/q8/a.svg",
      "/questions/paper-folding/q8/b.svg",
      "/questions/paper-folding/q8/c.svg",
      "/questions/paper-folding/q8/d.svg"
    ],
    answer: 3
  },
  {
    id: 9,
    foldedPaper: "/questions/paper-folding/q9/folded.svg",
    options: [
      "/questions/paper-folding/q9/a.svg",
      "/questions/paper-folding/q9/b.svg",
      "/questions/paper-folding/q9/c.svg",
      "/questions/paper-folding/q9/d.svg"
    ],
    answer: 1
  },
  {
    id: 10,
    foldedPaper: "/questions/paper-folding/q10/folded.svg",
    options: [
      "/questions/paper-folding/q10/a.svg",
      "/questions/paper-folding/q10/b.svg",
      "/questions/paper-folding/q10/c.svg",
      "/questions/paper-folding/q10/d.svg"
    ],
    answer: 2
  }
];

// Note: In production, these SVG paths would be replaced with actual backend URLs
// For now, these are placeholder paths. You may need to create actual SVG files or use a service to generate them.