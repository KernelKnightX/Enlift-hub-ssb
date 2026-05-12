import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const setId = process.env.SPEED_SET_ID || 'set1';

const questions = [
  {
    id: '1',
    targetImage: '/images/speed-recognition/vehicle-target.svg',
    optionA: '/images/speed-recognition/vehicle-target.svg',
    optionB: '/images/speed-recognition/vehicle-rotated.svg',
    optionC: '/images/speed-recognition/shape-target.svg',
    optionD: '/images/speed-recognition/object-target.svg',
    correctAnswer: 'A',
    difficulty: 'easy',
  },
  {
    id: '2',
    targetImage: '/images/speed-recognition/shape-target.svg',
    optionA: '/images/speed-recognition/object-target.svg',
    optionB: '/images/speed-recognition/shape-rotated.svg',
    optionC: '/images/speed-recognition/shape-target.svg',
    optionD: '/images/speed-recognition/vehicle-target.svg',
    correctAnswer: 'C',
    difficulty: 'medium',
  },
  {
    id: '3',
    targetImage: '/images/speed-recognition/object-target.svg',
    optionA: '/images/speed-recognition/shape-target.svg',
    optionB: '/images/speed-recognition/vehicle-rotated.svg',
    optionC: '/images/speed-recognition/object-target.svg',
    optionD: '/images/speed-recognition/vehicle-target.svg',
    correctAnswer: 'C',
    difficulty: 'hard',
  },
];

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error('Missing Firebase env vars. Export VITE_FIREBASE_* values before running this seed script.');
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

await Promise.all(questions.map((question, index) => setDoc(
  doc(db, 'speedRecognitionQuestions', `${setId}_${question.id}`),
  {
    ...question,
    setId,
    order: index + 1,
    updatedAt: Timestamp.now(),
  },
)));

console.log(`Seeded ${questions.length} Speed Recognition questions into ${setId}.`);
