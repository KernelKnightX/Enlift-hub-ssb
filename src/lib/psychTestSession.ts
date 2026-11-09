import type { PsychTestModuleId } from '@/data/psychTestModules';
import { getPsychModule } from '@/data/psychTestModules';
import type { TestType } from '@/types/enums';
import { savePracticeSession } from '@/utils/practiceHistory';

export function savePsychTestCompleted(
  userId: string,
  moduleId: PsychTestModuleId,
  set: string,
  totalItems: number,
  startTime: Date,
) {
  const endTime = new Date();
  const module = getPsychModule(moduleId);
  savePracticeSession({
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    userId,
    testType: module.testType as TestType,
    set,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: 'completed',
    score: 100,
    totalItems,
    answeredItems: totalItems,
    totalTimeMinutes: (endTime.getTime() - startTime.getTime()) / 60000,
    responses: [],
  });
}

export function savePsychTestQuit(
  userId: string,
  moduleId: PsychTestModuleId,
  set: string,
  totalItems: number,
  itemsReached: number,
  startTime: Date,
) {
  const endTime = new Date();
  const module = getPsychModule(moduleId);
  savePracticeSession({
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    userId,
    testType: module.testType as TestType,
    set,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: 'quit',
    score: 0,
    totalItems,
    answeredItems: Math.max(0, Math.min(itemsReached, totalItems)),
    totalTimeMinutes: (endTime.getTime() - startTime.getTime()) / 60000,
    responses: [],
  });
}
