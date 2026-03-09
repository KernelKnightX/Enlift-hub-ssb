export type AdminPPDTImage = {
    id: string;
    url: string;
    alt: string;
    isActive: boolean;
  };
  
  export type AdminPPDTSet = {
    id: string;
    items: AdminPPDTImage[];
    createdAt: string;
  };
  
  const PPDT_KEY = 'admin-ppdt-sets';
  
  // Get all PPDT sets
  export function getPPDTSets(): Record<string, AdminPPDTSet> {
    return JSON.parse(localStorage.getItem(PPDT_KEY) || '{}');
  }
  
  // Save / overwrite a PPDT set
  export function savePPDTSet(setId: string, items: AdminPPDTImage[]) {
    const existing = getPPDTSets();
  
    existing[setId] = {
      id: setId,
      items,
      createdAt: new Date().toISOString()
    };
  
    localStorage.setItem(PPDT_KEY, JSON.stringify(existing));
  }
  
  // Update all sets (used for toggle/delete)
  export function updatePPDTSets(
    sets: Record<string, AdminPPDTSet>
  ) {
    localStorage.setItem(PPDT_KEY, JSON.stringify(sets));
  }
  