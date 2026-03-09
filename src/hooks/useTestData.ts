import { useState, useEffect } from 'react';
import { watWordSets } from '@/data/watWords';
import { srtSituationSets } from '@/data/srtSituations';
import { viitQuestionSets } from '@/data/viitQuestions';
import { ppdtImageSets } from '@/data/ppdtImages';
import { tatImageSets } from '@/data/tatImages';
import { testConfigs } from '@/data/testConfigs';
import {
  getWATWords,
  getSRTSituations,
  getPPDTImages,
  getTATImages,
  getAvailableSets as getFirebaseSets
} from '@/lib/testDataService';
import type { WATWord, SRTSituation, VIITQuestion, TestImage, TestConfig } from '@/types/schema';
import type { TestType } from '@/types/enums';

// ==================== SET LISTING ====================

export function useAvailableSets(testType: TestType) {
  const [sets, setSets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      try {
        let localSets: string[] = [];
        
        // Get local sets first
        switch (testType) {
          case 'wat':
            localSets = Object.keys(watWordSets);
            break;
          case 'srt':
            localSets = Object.keys(srtSituationSets);
            break;
          case 'viit':
            localSets = Object.keys(viitQuestionSets);
            break;
          case 'ppdt':
            localSets = Object.keys(ppdtImageSets);
            break;
          case 'tat':
            localSets = Object.keys(tatImageSets);
            break;
        }
        
        // Try to get additional sets from Firebase
        try {
          const firebaseSets = await getFirebaseSets(testType);
          
          // Merge local and Firebase sets, remove duplicates
          const allSets = [...new Set([...localSets, ...firebaseSets])];
          setSets(allSets);
        } catch (error) {
          console.error('Error loading Firebase sets:', error);
          // Fall back to local sets only
          setSets(localSets);
        }
      } catch (error) {
        console.error('Error loading sets:', error);
        setSets([]);
      } finally {
        setLoading(false);
      }
    };

    loadSets();
  }, [testType]);

  return { sets, loading };
}

// ==================== DATA FETCHING ====================

export function useWATWords(set: string, count: number): { data: WATWord[]; loading: boolean } {
  const [data, setData] = useState<WATWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWords = async () => {
      try {
        // Try Firebase first
        const firebaseData = await getWATWords(set);
        
        if (firebaseData.length > 0) {
          // Use Firebase data
          setData(firebaseData.slice(0, count));
        } else {
          // Fall back to local data
          const localData = watWordSets[set] || [];
          setData(localData.slice(0, count));
        }
      } catch (error) {
        console.error('Error loading WAT words:', error);
        // Fall back to local data on error
        const localData = watWordSets[set] || [];
        setData(localData.slice(0, count));
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [set, count]);

  return { data, loading };
}

export function useSRTSituations(set: string, count: number): { data: SRTSituation[]; loading: boolean } {
  const [data, setData] = useState<SRTSituation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSituations = async () => {
      try {
        const firebaseData = await getSRTSituations(set);
        
        if (firebaseData.length > 0) {
          setData(firebaseData.slice(0, count));
        } else {
          const localData = srtSituationSets[set] || [];
          setData(localData.slice(0, count));
        }
      } catch (error) {
        console.error('Error loading SRT situations:', error);
        const localData = srtSituationSets[set] || [];
        setData(localData.slice(0, count));
      } finally {
        setLoading(false);
      }
    };

    loadSituations();
  }, [set, count]);

  return { data, loading };
}

export function useVIITQuestions(set: string, count: number): { data: VIITQuestion[]; loading: boolean } {
  const [data, setData] = useState<VIITQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // VIIT doesn't have Firebase yet, use local data
    const localData = viitQuestionSets[set] || [];
    setData(localData.slice(0, count));
    setLoading(false);
  }, [set, count]);

  return { data, loading };
}

export function usePPDTImages(set: string, count: number): { data: TestImage[]; loading: boolean } {
  const [data, setData] = useState<TestImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const firebaseData = await getPPDTImages(set);
        
        if (firebaseData.length > 0) {
          setData(firebaseData.slice(0, count));
        } else {
          const localData = ppdtImageSets[set] || [];
          setData(localData.slice(0, count));
        }
      } catch (error) {
        console.error('Error loading PPDT images:', error);
        const localData = ppdtImageSets[set] || [];
        setData(localData.slice(0, count));
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [set, count]);

  return { data, loading };
}

export function useTATImages(set: string, count: number): { data: TestImage[]; loading: boolean } {
  const [data, setData] = useState<TestImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      console.log('[TAT] Fetching images for set:', set);
      try {
        const firebaseData = await getTATImages(set);
        console.log('[TAT] Firebase data returned:', firebaseData.length, 'images');
        
        if (firebaseData.length > 0) {
          setData(firebaseData.slice(0, count));
        } else {
          console.log('[TAT] No Firebase data, checking local data...');
          const localData = tatImageSets[set] || [];
          console.log('[TAT] Local data:', localData.length, 'images');
          setData(localData.slice(0, count));
        }
      } catch (error) {
        console.error('[TAT] Error loading TAT images:', error);
        const localData = tatImageSets[set] || [];
        setData(localData.slice(0, count));
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [set, count]);

  return { data, loading };
}

export function useTestConfig(type: TestType): TestConfig {
  return testConfigs[type];
}

export function useTestQuestions(testType: TestType, set: string, count: number) {
  switch (testType) {
    case 'wat':
      return useWATWords(set, count);
    case 'srt':
      return useSRTSituations(set, count);
    case 'ppdt':
      return usePPDTImages(set, count);
    case 'tat':
      return useTATImages(set, count);
    case 'viit':
      return useVIITQuestions(set, count);
    default:
      return { data: [], loading: false };
  }
}
