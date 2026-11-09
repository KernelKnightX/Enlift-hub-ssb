import type { NavigateFunction } from 'react-router';

/** Leave a live test without leaving a stale history entry (fixes browser Back returning to quit tests). */
export function exitLiveActivity(navigate: NavigateFunction, to: string) {
  navigate(to, { replace: true });
}

export function goBackInApp(navigate: NavigateFunction, fallback: string) {
  const idx = window.history.state?.idx;
  if (typeof idx === 'number' && idx > 0) {
    navigate(-1);
    return;
  }
  navigate(fallback);
}

export function goForwardInApp(navigate: NavigateFunction) {
  navigate(1);
}
