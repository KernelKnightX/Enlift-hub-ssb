import type { TestType, TestStatus } from './enums';

// User types
export interface User {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  email: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  createdAt: string;
  updatedAt?: string;
  premiumPaymentId?: string;
  premiumSince?: string;
}

// Registration form data
export interface RegistrationData {
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  password: string;
}

// Login form data
export interface LoginData {
  email: string;
  password: string;
}

// Test configuration
export interface TestConfig {
  type: TestType;
  name: string;
  description: string;
  icon: string;
  totalTime: number; // in minutes
  instructions: TestInstructions;
  // Test behavior configuration
  layout: 'image-options' | 'word-input' | 'situation-textarea' | 'image-input' | 'text-options';
  timerPerQuestion?: number; // in seconds, optional for tests with total time
  hasCorrectAnswer: boolean;
  showPalette: boolean;
  allowMarkForReview: boolean;
  autoAdvance?: boolean;
}

export interface TestInstructions {
  title: string;
  description: string;
  timeDetails: string;
  format: string;
  navigation: string;
  howToAnswer: string[];
  keyPoints: string[];
}

// Test selection options
export interface TestSelectionOption {
  value: number;
  label: string;
  duration: number; // in minutes
  perItemTime?: number; // in seconds
}

// WAT data
export interface WATWord {
  id: string;
  word: string;
}

// SRT data
export interface SRTSituation {
  id: string;
  situation: string;
}

// PPDT/TAT image data
export interface TestImage {
  id: string;
  url: string;
  alt: string;
}

// OIR question data
export interface OIRQuestion {
  id: string;
  imageUrl: string;
  options: string[];
  correctAnswer: number;
}

// VIIT question data
export interface VIITQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface EnglishGrammarQuestion {
  id: string;
  category: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ListeningQuestionData {
  id: string;
  category: string;
  audioWords: string[];
  options: string[];
  correctAnswers: string[];
}

export type SpeedRecognitionDifficulty = 'easy' | 'medium' | 'hard';
export type SpeedRecognitionAnswerKey = 'A' | 'B' | 'C' | 'D';

export interface SpeedRecognitionQuestion {
  id: string;
  targetImage: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: SpeedRecognitionAnswerKey;
  difficulty: SpeedRecognitionDifficulty;
}

export interface PreparedSpeedRecognitionOption {
  key: SpeedRecognitionAnswerKey;
  image: string;
}

export interface PreparedSpeedRecognitionQuestion extends SpeedRecognitionQuestion {
  options: PreparedSpeedRecognitionOption[];
}

export interface SpeedRecognitionAnswerRecord {
  questionId: string;
  difficulty: SpeedRecognitionDifficulty;
  selectedAnswer: SpeedRecognitionAnswerKey | null;
  correctAnswer: SpeedRecognitionAnswerKey;
  isCorrect: boolean;
  responseTimeMs: number;
  timedOut: boolean;
}

export interface SpeedRecognitionAnalytics {
  score: number;
  totalQuestions: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  avgReactionTimeMs: number;
  fastestResponseMs: number;
  slowestResponseMs: number;
  difficultyBreakdown: Record<SpeedRecognitionDifficulty, {
    total: number;
    correct: number;
    accuracy: number;
  }>;
}

// Practice history
export interface PracticeSession {
  id: string;
  userId: string;
  testType: TestType;
  set: string;
  startTime: string;
  endTime: string;
  status: TestStatus;
  score?: number;
  totalItems: number;
  answeredItems: number;
  totalTimeMinutes: number;
  responses: string[]; // Array of responses, can be empty strings for unanswered
}

// Blog types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Mock Test types
export type ExamType = "prelims" | "mains" | "mains-descriptive" | "current-affairs";
export type Difficulty = "easy" | "medium" | "hard";

export interface MockTestQuestion {
  id: number;
  question: string;
  options: string[]; // for MCQ
  correctAnswer: number; // 0-3 for MCQ
  explanation: string;
  subject: string;
  difficulty: Difficulty;
  source: string;
  // For descriptive questions
  answer?: string;
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  examType: ExamType;
  examName: string; // CDS, AFCAT, NDA, etc.
  subject: string;
  difficulty: Difficulty;
  duration: number; // minutes
  totalQuestions: number;
  totalMarks: number;
  negativeMarking: number; // e.g., 0.33
  positiveMarking: number; // e.g., 1
  passingScore: number; // e.g., 40
  questions: MockTestQuestion[];
  createdAt: string;
  createdBy: string;
  isPublished: boolean;
}

export interface MockTestAnswer {
  questionId: number;
  question: string;
  userAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
  topic: string;
}

export interface MockTestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  examType: string;
  examName: string;
  score: number; // percentage
  correct: number;
  incorrect: number;
  total: number;
  totalAnswered: number;
  totalUnanswered: number;
  rawScore: number;
  negativeMarks: number;
  timeTaken: number; // seconds
  timeLimit: number;
  answers: MockTestAnswer[];
  completedAt: string;
  passingScore: number;
  isPassed: boolean;
}
