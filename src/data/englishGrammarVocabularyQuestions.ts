export type EnglishQuestionCategory =
  | 'Error Detection'
  | 'Fill in the Blanks'
  | 'Synonyms'
  | 'Antonyms'
  | 'Missing Alphabets'
  | 'Correct Spelling'
  | 'Sentence Improvement';

export interface EnglishQuestion {
  id: string;
  category: EnglishQuestionCategory;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PreparedEnglishQuestion extends EnglishQuestion {
  testQuestionId: string;
  shuffledOptions: string[];
}

export const ENGLISH_TEST_TOTAL_QUESTIONS = 60;
export const ENGLISH_TEST_SECONDS_PER_QUESTION = 17;

export const englishGrammarVocabularyQuestions: EnglishQuestion[] = [
  {
    id: 'eng-001',
    category: 'Error Detection',
    prompt: 'Identify the part with an error: "Neither the cadet nor his friends was late for parade."',
    options: ['Neither the cadet', 'nor his friends', 'was late', 'for parade'],
    correctAnswer: 'was late',
    explanation: 'With "nor his friends", the verb agrees with the plural noun nearest to it: "were late".',
  },
  {
    id: 'eng-002',
    category: 'Fill in the Blanks',
    prompt: 'The officer asked the team to act _____ and avoid panic.',
    options: ['decisively', 'decision', 'deciding', 'decided'],
    correctAnswer: 'decisively',
    explanation: 'An adverb is needed to modify the verb "act".',
  },
  {
    id: 'eng-003',
    category: 'Synonyms',
    prompt: 'Choose the closest synonym of "resilient".',
    options: ['adaptable', 'fragile', 'ordinary', 'careless'],
    correctAnswer: 'adaptable',
    explanation: 'Resilient means able to recover or adapt after difficulty.',
  },
  {
    id: 'eng-004',
    category: 'Antonyms',
    prompt: 'Choose the antonym of "hostile".',
    options: ['friendly', 'aggressive', 'doubtful', 'rigid'],
    correctAnswer: 'friendly',
    explanation: 'Hostile means unfriendly or opposed; its opposite is friendly.',
  },
  {
    id: 'eng-005',
    category: 'Missing Alphabets',
    prompt: 'Complete the word: D _ S C I P L I N E',
    options: ['I', 'E', 'A', 'O'],
    correctAnswer: 'I',
    explanation: 'The correct spelling is DISCIPLINE.',
  },
  {
    id: 'eng-006',
    category: 'Correct Spelling',
    prompt: 'Choose the correctly spelled word.',
    options: ['Perseverance', 'Perserverance', 'Persevarance', 'Persivarence'],
    correctAnswer: 'Perseverance',
    explanation: 'Perseverance means continued effort despite difficulty.',
  },
  {
    id: 'eng-007',
    category: 'Sentence Improvement',
    prompt: 'Improve the sentence: "He is senior than me in the academy."',
    options: ['senior to me', 'senior from me', 'senior than I', 'more senior than me'],
    correctAnswer: 'senior to me',
    explanation: 'The adjective "senior" takes the preposition "to".',
  },
  {
    id: 'eng-008',
    category: 'Error Detection',
    prompt: 'Identify the error: "The information provided by the scouts were accurate."',
    options: ['The information', 'provided by the scouts', 'were accurate', 'No error'],
    correctAnswer: 'were accurate',
    explanation: '"Information" is uncountable and singular, so the verb should be "was".',
  },
  {
    id: 'eng-009',
    category: 'Fill in the Blanks',
    prompt: 'A good leader remains calm _____ pressure.',
    options: ['under', 'below', 'inside', 'through'],
    correctAnswer: 'under',
    explanation: 'The standard phrase is "under pressure".',
  },
  {
    id: 'eng-010',
    category: 'Synonyms',
    prompt: 'Choose the closest synonym of "vigilant".',
    options: ['watchful', 'carefree', 'silent', 'tired'],
    correctAnswer: 'watchful',
    explanation: 'Vigilant means alert and watchful.',
  },
  {
    id: 'eng-011',
    category: 'Antonyms',
    prompt: 'Choose the antonym of "scarce".',
    options: ['abundant', 'rare', 'limited', 'empty'],
    correctAnswer: 'abundant',
    explanation: 'Scarce means insufficient or rare; abundant means plentiful.',
  },
  {
    id: 'eng-012',
    category: 'Missing Alphabets',
    prompt: 'Complete the word: C O _ R A G E',
    options: ['U', 'A', 'E', 'I'],
    correctAnswer: 'U',
    explanation: 'The correct spelling is COURAGE.',
  },
  {
    id: 'eng-013',
    category: 'Correct Spelling',
    prompt: 'Choose the correctly spelled word.',
    options: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'],
    correctAnswer: 'Accommodate',
    explanation: 'Accommodate has double c and double m.',
  },
  {
    id: 'eng-014',
    category: 'Sentence Improvement',
    prompt: 'Improve the sentence: "The team discussed about the mission plan."',
    options: ['discussed the mission plan', 'discussed on the mission plan', 'discussed for the mission plan', 'discussed regarding mission plan'],
    correctAnswer: 'discussed the mission plan',
    explanation: '"Discuss" is transitive and does not need "about".',
  },
  {
    id: 'eng-015',
    category: 'Fill in the Blanks',
    prompt: 'The cadet was commended for his _____ during the emergency.',
    options: ['presence of mind', 'present of mind', 'mind presence', 'present mind'],
    correctAnswer: 'presence of mind',
    explanation: 'The idiomatic expression is "presence of mind".',
  },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function buildEnglishTestQuestions(
  sourceQuestions: EnglishQuestion[] = englishGrammarVocabularyQuestions,
): PreparedEnglishQuestion[] {
  const sourceBank = sourceQuestions.length > 0 ? sourceQuestions : englishGrammarVocabularyQuestions;
  const randomizedBank = shuffle(sourceBank);

  return Array.from({ length: ENGLISH_TEST_TOTAL_QUESTIONS }, (_, index) => {
    const source = randomizedBank[index % randomizedBank.length];

    return {
      ...source,
      testQuestionId: `${source.id}-${index + 1}`,
      shuffledOptions: shuffle(source.options),
    };
  });
}
