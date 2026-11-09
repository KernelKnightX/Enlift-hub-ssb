export interface OPAMQuestion {
  id: number;
  section: string;
  prompt: string;
}

export interface OPAMSection {
  number: number;
  label: string;
  start: number;
  end: number;
}

const sectionLabels = [
  'Effective Intelligence',
  'Reasoning Ability',
  'Organizing Ability',
  'Power of Expression',
  'Social Adaptability',
  'Cooperation',
  'Sense of Responsibility',
  'Initiative',
  'Self Confidence',
  'Speed of Decision',
  'Ability to Influence Group',
  'Liveliness',
  'Determination',
  'Courage',
  'Stamina',
];

const sectionPrompts = [
  [
    'I can find practical solutions during difficult situations.',
    'I remain calm while solving unexpected problems.',
    'I can handle multiple responsibilities effectively.',
    'I quickly understand the root cause of a problem.',
    'I apply common sense before taking action.',
    'I can adapt my plans according to changing situations.',
    'People often seek my advice during confusion.',
    'I learn from mistakes and improve my approach.',
  ],
  [
    'I analyze facts before forming opinions.',
    'I enjoy solving logical puzzles and analytical tasks.',
    'I can identify flaws in arguments quickly.',
    'I compare alternatives before making decisions.',
    'I can think objectively under pressure.',
    'I ask relevant questions before concluding.',
    'I can understand complex instructions easily.',
    'I evaluate situations from different perspectives.',
  ],
  [
    'I prepare plans before starting major tasks.',
    'I prioritize tasks according to importance.',
    'I manage my time effectively.',
    'I can coordinate people efficiently during group work.',
    'I keep my surroundings and work organized.',
    'I can manage resources effectively.',
    'I complete tasks systematically.',
    'I remain organized even during stressful situations.',
  ],
  [
    'I can express my thoughts clearly.',
    'I speak confidently in front of groups.',
    'I explain ideas in a simple and understandable manner.',
    'I communicate effectively during disagreements.',
    'I can convince others with logical arguments.',
    'I actively participate in discussions.',
    'I listen carefully before responding.',
    'I maintain clarity while speaking under pressure.',
  ],
  [
    'I adjust easily in new environments.',
    'I can interact comfortably with strangers.',
    'I respect people from different backgrounds.',
    'I adapt my behavior according to situations.',
    'I make friends easily in new groups.',
    'I remain polite even during conflicts.',
    'I can work efficiently with different personalities.',
    'I accept constructive criticism positively.',
  ],
  [
    'I willingly help team members when needed.',
    'I believe teamwork leads to better results.',
    'I support others during difficult tasks.',
    'I share responsibilities equally in group work.',
    'I encourage weaker members in a team.',
    'I avoid unnecessary conflicts in groups.',
    'I value team success more than personal recognition.',
    'I maintain harmony while working with others.',
  ],
  [
    'I complete assigned duties sincerely.',
    'I accept responsibility for my mistakes.',
    'People trust me with important work.',
    'I fulfill commitments on time.',
    'I consider the consequences before acting.',
    'I take care of shared resources responsibly.',
    'I can be relied upon during emergencies.',
    'I remain accountable for my actions.',
  ],
  [
    'I volunteer for challenging tasks.',
    'I take action without waiting for instructions.',
    'I actively search for opportunities to improve.',
    'I encourage others to start new activities.',
    'I do not hesitate to take the first step.',
    'I try innovative methods while solving problems.',
    'I remain proactive during emergencies.',
    'I confidently take charge when needed.',
  ],
  [
    'I believe in my abilities.',
    'I remain confident even after failures.',
    'I can face criticism without losing confidence.',
    'I trust my judgment during important decisions.',
    'I can perform well under observation.',
    'I remain composed in competitive situations.',
    'I am comfortable taking leadership roles.',
    'I can recover quickly from setbacks.',
  ],
  [
    'I make decisions quickly in urgent situations.',
    'I avoid unnecessary delays while acting.',
    'I remain decisive during confusion.',
    'I can choose the best option under pressure.',
    'I do not overthink simple problems.',
    'I respond quickly during emergencies.',
    'I balance speed with accuracy in decisions.',
    'I confidently take responsibility for quick decisions.',
  ],
  [
    'People often listen to my suggestions.',
    'I motivate others to achieve goals.',
    'I can guide groups during difficult situations.',
    'I remain calm while leading teams.',
    'I can resolve disagreements within groups.',
    'I encourage participation from everyone.',
    'I can inspire confidence among team members.',
    'I influence others positively through my behavior.',
  ],
  [
    'I remain cheerful during stressful situations.',
    'I spread positivity in groups.',
    'I maintain enthusiasm during long tasks.',
    'I enjoy participating in group activities.',
    'I recover quickly from disappointments.',
    'I keep others motivated with my energy.',
    'I remain optimistic during failures.',
    'I actively engage in social interactions.',
  ],
  [
    'I continue efforts despite repeated failures.',
    'I stay focused on long-term goals.',
    'I do not give up easily.',
    'I work hard until tasks are completed.',
    'I remain committed under pressure.',
    'I can tolerate difficulties while pursuing goals.',
    'I continue trying until I succeed.',
    'I maintain discipline during challenging periods.',
  ],
  [
    'I speak the truth even in difficult situations.',
    'I stand against unfair practices.',
    'I remain calm during dangerous situations.',
    'I take responsibility during emergencies.',
    'I defend weaker individuals when needed.',
    'I can face criticism bravely.',
    'I take calculated risks confidently.',
    'I do not avoid challenges due to fear.',
  ],
  [
    'I can work continuously for long hours.',
    'I maintain focus despite fatigue.',
    'I participate actively in physical activities.',
    'I remain mentally strong during stressful periods.',
    'I recover quickly after hard work.',
    'I can handle pressure without breaking down.',
    'I maintain consistency in performance.',
    'I continue working effectively despite discomfort.',
  ],
];

export const opamSections: OPAMSection[] = sectionLabels.map((label, index) => ({
  number: index + 1,
  label,
  start: index * 8 + 1,
  end: index * 8 + 8,
}));

export const opamQuestions: OPAMQuestion[] = opamSections.flatMap((section, sectionIndex) =>
  sectionPrompts[sectionIndex].map((prompt, questionIndex) => ({
    id: section.start + questionIndex,
    section: section.label,
    prompt,
  }))
);

export function getOPAMInterpretation(score: number) {
  if (score >= 32) return 'Excellent';
  if (score >= 24) return 'Good';
  if (score >= 16) return 'Average';
  return 'Needs Improvement';
}
