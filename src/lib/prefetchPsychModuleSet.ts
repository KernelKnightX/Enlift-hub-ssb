import { ppdtImageSets } from '@/data/ppdtImages';
import { tatImageSets } from '@/data/tatImages';
import type { PsychTestModuleId } from '@/data/psychTestModules';
import { prefetchTestImages } from '@/lib/prefetchTestImages';

/** Warm image cache while user is on set selection (PPDT/TAT). */
export function prefetchPsychModuleSet(moduleId: PsychTestModuleId, setKey: string, maxItems = 12) {
  if (moduleId === 'ppdt') {
    prefetchTestImages((ppdtImageSets[setKey] || []).slice(0, maxItems));
  } else if (moduleId === 'tat') {
    prefetchTestImages((tatImageSets[setKey] || []).slice(0, maxItems));
  }
}
