# Dosier Test Migration Guide

## Overview
The dosier test data has been refactored to match the pattern of other tests (OIR, WAT, SRT, PPDT, TAT) by:
1. Separating each test type into its own data file
2. Adding backend service functions for data fetching/saving
3. Following the same structure as existing tests

## Changes Made

### New Data Files Created
All following the same `Record<string, Type[]>` pattern as other tests:

1. **src/data/dosierTATImages.ts** - TAT images for dosier sets
   - Similar to `tatImages.ts`
   - Export: `dosierTATImageSets`

2. **src/data/dosierWATWords.ts** - WAT words for dosier sets
   - Similar to `watWords.ts`
   - Export: `dosierWATWordSets`

3. **src/data/dosierSRTSituations.ts** - SRT situations for dosier sets
   - Similar to `srtSituations.ts`
   - Export: `dosierSRTSituationSets`

4. **src/data/dosierSDTPrompts.ts** - SDT prompts for dosier sets (unique to dosier)
   - New type: `SDTPrompt`
   - Export: `dosierSDTPromptSets`

### Backend Service Functions Added

Added to `src/lib/testDataService.ts`:

#### Fetch Functions
```typescript
getDosierTATImages(setId: string): Promise<TestImage[]>
getDosierWATWords(setId: string): Promise<WATWord[]>
getDosierSRTSituations(setId: string): Promise<SRTSituation[]>
getDosierSDTPrompts(setId: string): Promise<SDTPrompt[]>
```

#### Save Functions
```typescript
saveDosierTATSet(setId: string, images: TestImage[]): Promise<void>
saveDosierWATSet(setId: string, words: WATWord[]): Promise<void>
saveDosierSRTSet(setId: string, situations: SRTSituation[]): Promise<void>
saveDosierSDTSet(setId: string, prompts: SDTPrompt[]): Promise<void>
```

#### Delete Functions
```typescript
deleteDosierTATSet(setId: string): Promise<void>
deleteDosierWATSet(setId: string): Promise<void>
deleteDosierSRTSet(setId: string): Promise<void>
deleteDosierSDTSet(setId: string): Promise<void>
```

### New Firebase Collections
- `dosierTATImages`
- `dosierWATWords`
- `dosierSRTSituations`
- `dosierSDTPrompts`

## Migration Steps

### For Pages Using Dosier Data

**Before (Hardcoded):**
```typescript
import { dosierSets } from '@/data/dosierSets';

const set = dosierSets.find(s => s.id === setId);
// Use set.tatImages, set.watWords, etc.
```

**After (Backend):**
```typescript
import { 
  getDosierTATImages, 
  getDosierWATWords, 
  getDosierSRTSituations, 
  getDosierSDTPrompts 
} from '@/lib/testDataService';

const [tatImages, setTatImages] = useState<TestImage[]>([]);
const [watWords, setWatWords] = useState<WATWord[]>([]);
const [srtSituations, setSrtSituations] = useState<SRTSituation[]>([]);
const [sdtPrompts, setSdtPrompts] = useState<SDTPrompt[]>([]);

useEffect(() => {
  const loadDosierData = async () => {
    if (!setId) return;
    
    const [tat, wat, srt, sdt] = await Promise.all([
      getDosierTATImages(setId),
      getDosierWATWords(setId),
      getDosierSRTSituations(setId),
      getDosierSDTPrompts(setId)
    ]);
    
    setTatImages(tat);
    setWatWords(wat);
    setSrtSituations(srt);
    setSdtPrompts(sdt);
  };
  
  loadDosierData();
}, [setId]);
```

### For Admin Upload/Management

Use the save functions to upload data to backend:

```typescript
import { 
  saveDosierTATSet,
  saveDosierWATSet,
  saveDosierSRTSet,
  saveDosierSDTSet
} from '@/lib/testDataService';

// Import fallback data from new files
import { dosierTATImageSets } from '@/data/dosierTATImages';
import { dosierWATWordSets } from '@/data/dosierWATWords';
import { dosierSRTSituationSets } from '@/data/dosierSRTSituations';
import { dosierSDTPromptSets } from '@/data/dosierSDTPrompts';

// Upload to backend
await saveDosierTATSet('set1', dosierTATImageSets.set1);
await saveDosierWATSet('set1', dosierWATWordSets.set1);
await saveDosierSRTSet('set1', dosierSRTSituationSets.set1);
await saveDosierSDTSet('set1', dosierSDTPromptSets.set1);
```

## Files That Need Updates

The following files currently import from `dosierSets.ts` and need migration:

1. **src/pages/Dosier/SetSelectionPage.tsx**
   - Update to fetch available sets from backend
   - Use dosier service functions

2. **src/pages/Dosier/FeedbackPage.tsx**
   - Update to fetch set data from backend
   - Use dosier service functions

3. **src/pages/Dosier/TestPage.tsx**
   - Update to fetch test data from backend
   - Use separate state for each test type (TAT, WAT, SRT, SDT)

## Benefits of This Structure

1. **Consistency** - Matches pattern of all other tests (OIR, WAT, SRT, etc.)
2. **Scalability** - Easy to add new sets without code changes
3. **Admin Control** - Admins can upload/manage sets via backend
4. **No Hardcoding** - All test data comes from Firebase
5. **Type Safety** - Proper TypeScript types for all data

## Deprecated Files

- **src/data/dosierSets.ts** - Still exists for backward compatibility but marked as deprecated
- Should be removed once all pages are migrated to use backend functions

## Testing Checklist

- [ ] Verify all dosier pages load data from backend
- [ ] Test dosier set selection page
- [ ] Test dosier test page with all 4 test types
- [ ] Test dosier feedback page
- [ ] Verify admin can upload new dosier sets
- [ ] Remove deprecated `dosierSets.ts` import statements
