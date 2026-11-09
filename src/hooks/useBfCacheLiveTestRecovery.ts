import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { exitLiveActivity } from '@/lib/appNavigation';

/** If the browser restores a live test from back-forward cache after exit, send user to a safe page. */
export function useBfCacheLiveTestRecovery(setsOrListPath: string) {
  const navigate = useNavigate();

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        exitLiveActivity(navigate, setsOrListPath);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [navigate, setsOrListPath]);
}
