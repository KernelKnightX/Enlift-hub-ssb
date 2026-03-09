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
