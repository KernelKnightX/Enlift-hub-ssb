import type { PsychTestModuleId } from '@/data/psychTestModules';

const prefix = 'psych-briefing-v2';

export function hasPsychBriefingAck(moduleId: PsychTestModuleId): boolean {
  try {
    return localStorage.getItem(`${prefix}:${moduleId}`) === '1';
  } catch {
    return false;
  }
}

export function setPsychBriefingAck(moduleId: PsychTestModuleId): void {
  try {
    localStorage.setItem(`${prefix}:${moduleId}`, '1');
  } catch {
    /* ignore */
  }
}
