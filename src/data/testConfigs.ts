import type { TestConfig } from '@/types/schema';

export const testConfigs: Record<string, TestConfig> = {
  ppdt: {
    type: 'ppdt',
    name: 'Picture Perception & Description Test',
    description: 'Write a story based on the picture shown',
    icon: 'Image',
    totalTime: 0, // Dynamic based on selection
    layout: 'image-input',
    hasCorrectAnswer: false,
    showPalette: false,
    allowMarkForReview: false,
    autoAdvance: true,
    instructions: {
      title: 'PPDT Test Instructions',
      description: 'You will be shown a picture for 30 seconds. After viewing, you have 4 minutes to write a story about it.',
      timeDetails: 'Each picture: 30s viewing + 4min writing = 4.5 minutes',
      format: 'Story writing based on pictures',
      navigation: 'One picture at a time',
      howToAnswer: [
        'Observe the picture carefully during viewing time',
        'Note key elements and characters',
        'Write a coherent story with beginning, middle, and end',
        'Include mood, action, and outcome'
      ],
      keyPoints: [
        'Be creative and positive',
        'Keep the story realistic',
        'Write clearly and legibly',
        'Complete within time limit'
      ]
    }
  },
  wat: {
    type: 'wat',
    name: 'Word Association Test',
    description: 'Write the first thought that comes to mind',
    icon: 'PenTool',
    totalTime: 0, // Dynamic based on selection
    layout: 'word-input',
    timerPerQuestion: 15,
    hasCorrectAnswer: false,
    showPalette: false,
    allowMarkForReview: false,
    autoAdvance: true,
    instructions: {
      title: 'WAT Test Instructions',
      description: 'A word will be displayed for 15 seconds. Write the first meaningful sentence that comes to your mind.',
      timeDetails: '15 seconds per word',
      format: 'Sentence formation',
      navigation: 'Words appear sequentially',
      howToAnswer: [
        'Read the word quickly',
        'Write the first positive thought',
        'Form a complete sentence',
        'Be spontaneous and honest'
      ],
      keyPoints: [
        'Think positive',
        'Be quick and natural',
        'Avoid negative associations',
        'Write legibly'
      ]
    }
  },
  srt: {
    type: 'srt',
    name: 'Situation Reaction Test',
    description: 'Respond to practical situations',
    icon: 'MessageSquare',
    totalTime: 30,
    layout: 'situation-textarea',
    timerPerQuestion: 30,
    hasCorrectAnswer: false,
    showPalette: false,
    allowMarkForReview: false,
    instructions: {
      title: 'SRT Test Instructions',
      description: 'You will be presented with various situations. Write what you would do in each situation.',
      timeDetails: 'Total Time: 30 minutes for 60 situations',
      format: 'Short response to situations',
      navigation: 'Move through situations sequentially',
      howToAnswer: [
        'Read the situation carefully',
        'Think of a practical solution',
        'Write a brief, clear response',
        'Be realistic and positive'
      ],
      keyPoints: [
        'Show initiative and responsibility',
        'Be practical and logical',
        'Avoid extreme reactions',
        'Manage time - 30 seconds per situation'
      ]
    }
  },
  tat: {
    type: 'tat',
    name: 'Thematic Apperception Test',
    description: 'Write stories based on ambiguous pictures',
    icon: 'BookOpen',
    totalTime: 0, // Dynamic based on selection
    layout: 'image-input',
    hasCorrectAnswer: false,
    showPalette: false,
    allowMarkForReview: false,
    autoAdvance: true,
    instructions: {
      title: 'TAT Test Instructions',
      description: 'You will be shown pictures one by one. Write a story for each picture describing what is happening.',
      timeDetails: 'Each picture: 30s viewing + 4min writing',
      format: 'Story writing',
      navigation: 'One picture at a time',
      howToAnswer: [
        'Observe all details in the picture',
        'Identify characters and their relationships',
        'Create a story with past, present, and future',
        'Include emotions and motivations'
      ],
      keyPoints: [
        'Be imaginative yet realistic',
        'Show positive character traits',
        'Include action and resolution',
        'Complete within time limit'
      ]
    }
  },
  viit: {
    type: 'viit',
    name: 'Verbal Intelligence Test',
    description: 'Verbal reasoning, vocabulary, and comprehension test',
    icon: 'MessageSquare',
    totalTime: 25,
    layout: 'text-options',
    timerPerQuestion: 25,
    hasCorrectAnswer: true,
    showPalette: true,
    allowMarkForReview: true,
    instructions: {
      title: 'VIIT Test Instructions',
      description: 'This test assesses your verbal intelligence through synonyms, antonyms, analogies, sentence completion, and verbal reasoning questions.',
      timeDetails: 'Total Time: 25 minutes',
      format: 'Multiple-choice questions',
      navigation: 'Move freely between questions',
      howToAnswer: [
        'Read each question carefully',
        'Consider all options before selecting',
        'Use logical reasoning for analogies and verbal problems',
        'Manage your time effectively'
      ],
      keyPoints: [
        'Read instructions for each question type',
        'Answer based on standard English usage',
        'Trust your first instinct but verify',
        'Review answers before submitting'
      ]
    }
  }
};