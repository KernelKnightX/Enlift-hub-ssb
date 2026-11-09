import { useState, useEffect } from 'react';
import { watWordSets } from '@/data/watWords';
import { srtSituationSets } from '@/data/srtSituations';
import { viitQuestionSets } from '@/data/viitQuestions';
import { ppdtImageSets } from '@/data/ppdtImages';
import { tatImageSets } from '@/data/tatImages';
import { oirQuestionSets } from '@/data/oirQuestions';
import { opamQuestions } from '@/data/opamQuestions';
import { testConfigs } from '@/data/testConfigs';
import {
  getWATWords,
  getSRTSituations,
  getPPDTImages,
  getTATImages,
  getAvailableSets as getFirebaseSets,
  getOPAMQuestions,
} from '@/lib/testDataService';
import { prefetchTestImages } from '@/lib/prefetchTestImages';
import type { WATWord, SRTSituation, VIITQuestion, TestImage, TestConfig, OIRQuestion, OPAMQuestion } from '@/types/schema';
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
          case 'opam':
            localSets = ['opam-default'];
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
      const localData = (watWordSets[set] || []).slice(0, count);
      if (localData.length > 0) {
        setData(localData);
        setLoading(false);
      }
      try {
        const firebaseData = await getWATWords(set);
        if (firebaseData.length > 0) {
          setData(firebaseData.slice(0, count));
        } else if (localData.length === 0) {
          setData([]);
        }
      } catch (error) {
        console.error('Error loading WAT words:', error);
        if (localData.length === 0) setData(localData);
      } finally {
        if (localData.length === 0) setLoading(false);
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
      const localData = (srtSituationSets[set] || []).slice(0, count);
      if (localData.length > 0) {
        setData(localData);
        setLoading(false);
      }
      try {
        const firebaseData = await getSRTSituations(set);
        if (firebaseData.length > 0) {
          setData(firebaseData.slice(0, count));
        } else if (localData.length === 0) {
          setData([]);
        }
      } catch (error) {
        console.error('Error loading SRT situations:', error);
        if (localData.length === 0) setData(localData);
      } finally {
        if (localData.length === 0) setLoading(false);
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

export function useOIRQuestions(set: string, count: number): { data: OIRQuestion[]; loading: boolean } {
  const [data, setData] = useState<OIRQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // OIR uses local data
    const localData = oirQuestionSets[set] || [];
    setData(localData.slice(0, count));
    setLoading(false);
  }, [set, count]);

  return { data, loading };
}

export function useOPAMQuestions(set: string, count: number): { data: OPAMQuestion[]; loading: boolean } {
  const [data, setData] = useState<OPAMQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const firebaseData = await getOPAMQuestions(set);

        if (firebaseData.length > 0) {
          setData(firebaseData.slice(0, count));
        } else {
          const localData = opamQuestions.filter((item) => item.id <= count);
          setData(localData);
        }
      } catch (error) {
        console.error('Error loading OPAM questions:', error);
        const localData = opamQuestions.filter((item) => item.id <= count);
        setData(localData);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [set, count]);

  return { data, loading };
}

export function usePPDTImages(set: string, count: number): { data: TestImage[]; loading: boolean } {
  const [data, setData] = useState<TestImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const localData = (ppdtImageSets[set] || []).slice(0, count);

    if (localData.length > 0) {
      setData(localData);
      setLoading(false);
      prefetchTestImages(localData);
    }

    const loadImages = async () => {
      try {
        const firebaseData = await getPPDTImages(set);
        if (cancelled) return;

        if (firebaseData.length > 0) {
          const slice = firebaseData.slice(0, count);
          setData(slice);
          prefetchTestImages(slice);
        } else if (localData.length === 0) {
          setData([]);
        }
      } catch (error) {
        console.error('Error loading PPDT images:', error);
        if (!cancelled && localData.length === 0) setData([]);
      } finally {
        if (!cancelled && localData.length === 0) setLoading(false);
      }
    };

    loadImages();
    return () => {
      cancelled = true;
    };
  }, [set, count]);

  return { data, loading };
}

export function useTATImages(set: string, count: number): { data: TestImage[]; loading: boolean } {
  const [data, setData] = useState<TestImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const localData = (tatImageSets[set] || []).slice(0, count);

    if (localData.length > 0) {
      setData(localData);
      setLoading(false);
      prefetchTestImages(localData);
    }

    const loadImages = async () => {
      try {
        const firebaseData = await getTATImages(set);
        if (cancelled) return;

        if (firebaseData.length > 0) {
          const slice = firebaseData.slice(0, count);
          setData(slice);
          prefetchTestImages(slice);
        } else if (localData.length === 0) {
          setData([]);
        }
      } catch (error) {
        console.error('[TAT] Error loading TAT images:', error);
        if (!cancelled && localData.length === 0) setData([]);
      } finally {
        if (!cancelled && localData.length === 0) setLoading(false);
      }
    };

    loadImages();
    return () => {
      cancelled = true;
    };
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
    case 'oir':
      return useOIRQuestions(set, count);
    case 'opam':
      return useOPAMQuestions(set, count);
    default:
      return { data: [], loading: false };
  }
}
