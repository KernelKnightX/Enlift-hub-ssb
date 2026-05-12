import { useEffect, useState } from 'react';
import { fetchSpeedRecognitionQuestions } from '@/services/speedRecognitionService';
import type { PreparedSpeedRecognitionQuestion } from '@/types/schema';

export function useSpeedRecognitionQuestions(setId: string) {
  const [questions, setQuestions] = useState<PreparedSpeedRecognitionQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSpeedRecognitionQuestions(setId);
        if (!active) return;
        setQuestions(data);
        if (!data.length) {
          setError('No Speed Recognition questions found for this set. Upload questions from admin first.');
        }
      } catch {
        if (active) setError('Unable to load Speed Recognition questions. Please retry.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadQuestions();

    return () => {
      active = false;
    };
  }, [retryKey, setId]);

  return {
    questions,
    loading,
    error,
    retry: () => setRetryKey((current) => current + 1),
  };
}
