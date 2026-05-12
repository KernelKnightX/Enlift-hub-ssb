import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import type {
  EnglishGrammarQuestion,
  ListeningQuestionData,
  SpeedRecognitionAnalytics,
  SpeedRecognitionAnswerRecord,
  SpeedRecognitionQuestion,
  WATWord,
  SRTSituation,
  TestImage,
  OIRQuestion
} from '@/types/schema';

// Collection names
const COLLECTIONS = {
  WAT_WORDS: 'watWords',
  SRT_SITUATIONS: 'srtSituations',
  PPDT_IMAGES: 'ppdtImages',
  TAT_IMAGES: 'tatImages',
  OIR_QUESTIONS: 'oirQuestions',
  ENGLISH_GRAMMAR_QUESTIONS: 'englishGrammarQuestions',
  LISTENING_QUESTIONS: 'listeningQuestions',
  SPEED_RECOGNITION_QUESTIONS: 'speedRecognitionQuestions',
  SPEED_RECOGNITION_ATTEMPTS: 'speedRecognitionAttempts',
} as const;

// ==================== WAT ====================

export async function getWATWords(setId: string): Promise<WATWord[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.WAT_WORDS),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.size === 0) {
      return [];
    }
    
    // Map documents and sort by order
    const words = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        word: data.word,
        order: data.order || 0
      } as WATWord & { order: number };
    });
    
    // Sort by order
    return words.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching WAT words:', error);
    return [];
  }
}

export async function saveWATSet(setId: string, words: WATWord[]): Promise<void> {
  const batch: Promise<void>[] = words.map((word, index) => {
    const wordData = {
      ...word,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.WAT_WORDS, `${setId}_${word.id}`), wordData);
  });
  await Promise.all(batch);
}

export async function deleteWATSet(setId: string): Promise<void> {
  const q = query(collection(db, COLLECTIONS.WAT_WORDS), where('setId', '==', setId));
  const snapshot = await getDocs(q);
  const batch: Promise<void>[] = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(batch);
}

// ==================== SRT ====================

export async function getSRTSituations(setId: string): Promise<SRTSituation[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.SRT_SITUATIONS),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.size === 0) {
      return [];
    }
    
    // Map documents and sort by order
    const situations = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        situation: data.situation,
        order: data.order || 0
      } as SRTSituation & { order: number };
    });
    
    // Sort by order
    return situations.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching SRT situations:', error);
    return [];
  }
}

export async function saveSRTSet(setId: string, situations: SRTSituation[]): Promise<void> {
  const batch: Promise<void>[] = situations.map((situation, index) => {
    const data = {
      ...situation,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.SRT_SITUATIONS, `${setId}_${situation.id}`), data);
  });
  await Promise.all(batch);
}

export async function deleteSRTSet(setId: string): Promise<void> {
  const q = query(collection(db, COLLECTIONS.SRT_SITUATIONS), where('setId', '==', setId));
  const snapshot = await getDocs(q);
  const batch: Promise<void>[] = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(batch);
}

// ==================== OIR ====================

export async function saveOIRSet(setId: string, questions: OIRQuestion[]): Promise<void> {
  const batch: Promise<void>[] = questions.map((question, index) => {
    const data = {
      ...question,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.OIR_QUESTIONS, `${setId}_${question.id}`), data);
  });
  await Promise.all(batch);
}

// ==================== English Grammar & Vocabulary ====================

export async function getEnglishGrammarQuestions(setId: string): Promise<EnglishGrammarQuestion[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.ENGLISH_GRAMMAR_QUESTIONS),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size === 0) return [];

    const questions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        category: data.category,
        prompt: data.prompt,
        options: data.options || [],
        correctAnswer: data.correctAnswer,
        explanation: data.explanation || '',
        order: data.order || 0
      } as EnglishGrammarQuestion & { order: number };
    });

    return questions.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching English grammar questions:', error);
    return [];
  }
}

export async function saveEnglishGrammarSet(setId: string, questions: EnglishGrammarQuestion[]): Promise<void> {
  const batch: Promise<void>[] = questions.map((question, index) => {
    const data = {
      ...question,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.ENGLISH_GRAMMAR_QUESTIONS, `${setId}_${question.id}`), data);
  });
  await Promise.all(batch);
}

export async function deleteEnglishGrammarSet(setId: string): Promise<void> {
  const q = query(collection(db, COLLECTIONS.ENGLISH_GRAMMAR_QUESTIONS), where('setId', '==', setId));
  const snapshot = await getDocs(q);
  const batch: Promise<void>[] = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(batch);
}

// ==================== Listening Test ====================

export async function getListeningQuestions(setId: string): Promise<ListeningQuestionData[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.LISTENING_QUESTIONS),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size === 0) return [];

    const questions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        category: data.category,
        audioWords: data.audioWords || [],
        options: data.options || [],
        correctAnswers: data.correctAnswers || [],
        order: data.order || 0
      } as ListeningQuestionData & { order: number };
    });

    return questions.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching Listening questions:', error);
    return [];
  }
}

export async function saveListeningSet(setId: string, questions: ListeningQuestionData[]): Promise<void> {
  const batch: Promise<void>[] = questions.map((question, index) => {
    const data = {
      ...question,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.LISTENING_QUESTIONS, `${setId}_${question.id}`), data);
  });
  await Promise.all(batch);
}

export async function deleteListeningSet(setId: string): Promise<void> {
  const q = query(collection(db, COLLECTIONS.LISTENING_QUESTIONS), where('setId', '==', setId));
  const snapshot = await getDocs(q);
  const batch: Promise<void>[] = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(batch);
}

// ==================== Speed Recognition Test ====================

export async function getSpeedRecognitionQuestions(setId: string): Promise<SpeedRecognitionQuestion[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.SPEED_RECOGNITION_QUESTIONS),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size === 0) return [];

    const questions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        targetImage: data.targetImage,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        difficulty: data.difficulty || 'medium',
        order: data.order || 0,
      } as SpeedRecognitionQuestion & { order: number };
    });

    return questions.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching Speed Recognition questions:', error);
    return [];
  }
}

export async function saveSpeedRecognitionSet(setId: string, questions: SpeedRecognitionQuestion[]): Promise<void> {
  const batch: Promise<void>[] = questions.map((question, index) => {
    const data = {
      ...question,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now(),
    };
    return setDoc(doc(db, COLLECTIONS.SPEED_RECOGNITION_QUESTIONS, `${setId}_${question.id}`), data);
  });
  await Promise.all(batch);
}

export async function deleteSpeedRecognitionSet(setId: string): Promise<void> {
  const q = query(collection(db, COLLECTIONS.SPEED_RECOGNITION_QUESTIONS), where('setId', '==', setId));
  const snapshot = await getDocs(q);
  const batch: Promise<void>[] = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(batch);
}

export async function saveSpeedRecognitionAttempt(payload: {
  userId: string;
  setId: string;
  answers: SpeedRecognitionAnswerRecord[];
  analytics: SpeedRecognitionAnalytics;
  startedAt: string;
  completedAt: string;
}): Promise<void> {
  const attemptId = `${payload.userId}_${payload.setId}_${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.SPEED_RECOGNITION_ATTEMPTS, attemptId), {
    ...payload,
    createdAt: Timestamp.now(),
  });
}

// ==================== Images (PPDT/TAT) ====================

export async function getPPDTImages(setId: string): Promise<TestImage[]> {
  try {
    // Get all documents for this setId and sort manually (avoids composite index requirement)
    const q = query(
      collection(db, COLLECTIONS.PPDT_IMAGES),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.size === 0) {
      return [];
    }
    
    // Map documents and sort by order
    const images = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        url: data.url,
        alt: data.alt,
        order: data.order || 0
      } as TestImage & { order: number };
    });
    
    // Sort by order
    return images.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching PPDT images:', error);
    return [];
  }
}

export async function savePPDTSet(setId: string, images: TestImage[]): Promise<void> {
  const batch: Promise<void>[] = images.map((image, index) => {
    const data = {
      ...image,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.PPDT_IMAGES, `${setId}_${image.id}`), data);
  });
  await Promise.all(batch);
}

export async function getTATImages(setId: string): Promise<TestImage[]> {
  try {
    // Get all documents for this setId and sort manually (avoids composite index requirement)
    const q = query(
      collection(db, COLLECTIONS.TAT_IMAGES),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.size === 0) {
      return [];
    }
    
    // Map documents and sort by order
    const images = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        url: data.url,
        alt: data.alt,
        order: data.order || 0
      } as TestImage & { order: number };
    });
    
    // Sort by order
    return images.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching TAT images:', error);
    return [];
  }
}

export async function saveTATSet(setId: string, images: TestImage[]): Promise<void> {
  const batch: Promise<void>[] = images.map((image, index) => {
    const data = {
      ...image,
      setId,
      order: index + 1,
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(db, COLLECTIONS.TAT_IMAGES, `${setId}_${image.id}`), data);
  });
  await Promise.all(batch);
}

export async function uploadTestImage(
  testType: 'ppdt' | 'tat',
  setId: string,
  imageFile: File,
  imageId: string
): Promise<string> {
  const storageRef = ref(storage, `${testType}Images/${setId}/${imageId}`);
  await uploadBytes(storageRef, imageFile);
  return getDownloadURL(storageRef);
}

export async function saveImageMetadata(
  testType: 'ppdt' | 'tat',
  setId: string,
  image: TestImage
): Promise<void> {
  const collectionName = testType === 'ppdt' ? COLLECTIONS.PPDT_IMAGES : COLLECTIONS.TAT_IMAGES;
  await setDoc(doc(db, collectionName, `${setId}_${image.id}`), {
    ...image,
    setId,
    updatedAt: Timestamp.now()
  });
}

export async function deleteTestImage(
  testType: 'ppdt' | 'tat',
  setId: string,
  imageId: string,
  _imageUrl?: string
): Promise<void> {
  // Delete from Storage
  try {
    const storageRef = ref(storage, `${testType}Images/${setId}/${imageId}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image from storage:', error);
  }
  
  // Delete metadata from Firestore
  const collectionName = testType === 'ppdt' ? COLLECTIONS.PPDT_IMAGES : COLLECTIONS.TAT_IMAGES;
  await deleteDoc(doc(db, collectionName, `${setId}_${imageId}`));
}

// ==================== Utility ====================

export async function checkCollectionExists(collectionName: string): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, '_metadata');
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch {
    return false;
  }
}

// ==================== Get Available Sets from Firebase ====================

export async function getAvailableSets(testType: string): Promise<string[]> {
  try {
    let collectionName: string;
    
    switch (testType) {
      case 'wat':
        collectionName = COLLECTIONS.WAT_WORDS;
        break;
      case 'srt':
        collectionName = COLLECTIONS.SRT_SITUATIONS;
        break;
      case 'ppdt':
        collectionName = COLLECTIONS.PPDT_IMAGES;
        break;
      case 'tat':
        collectionName = COLLECTIONS.TAT_IMAGES;
        break;
      case 'english':
        collectionName = COLLECTIONS.ENGLISH_GRAMMAR_QUESTIONS;
        break;
      case 'listening':
        collectionName = COLLECTIONS.LISTENING_QUESTIONS;
        break;
      default:
        return [];
    }

    // Get all documents from the collection
    const snapshot = await getDocs(collection(db, collectionName));
    
    // Extract unique setIds
    const setIds = new Set<string>();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.setId) {
        setIds.add(data.setId);
      }
    });

    return Array.from(setIds);
  } catch (error) {
    console.error(`Error fetching available sets for ${testType}:`, error);
    return [];
  }
}

export { COLLECTIONS };
