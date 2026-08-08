const STORAGE_KEY = 'factorio-steampunk.dev-start-profiles.v1';
export const TEMP_PROFILE_COUNT = 3;

function emptySlots() {
  return Array.from({ length: TEMP_PROFILE_COUNT }, () => null);
}

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadTemporaryStartProfiles() {
  const storage = getStorage();
  if (!storage) return emptySlots();

  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    if (!Array.isArray(parsed)) return emptySlots();
    return emptySlots().map((_, index) => {
      const entry = parsed[index];
      if (!entry || typeof entry !== 'object' || !entry.snapshot) return null;
      return {
        savedAt: typeof entry.savedAt === 'string' ? entry.savedAt : null,
        snapshot: entry.snapshot,
      };
    });
  } catch {
    return emptySlots();
  }
}

export function saveTemporaryStartProfile(slotIndex, snapshot) {
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= TEMP_PROFILE_COUNT) return false;
  const storage = getStorage();
  if (!storage) return false;

  try {
    const slots = loadTemporaryStartProfiles();
    slots[slotIndex] = {
      savedAt: new Date().toISOString(),
      snapshot,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(slots));
    return true;
  } catch {
    return false;
  }
}

export function summarizeTemporaryStartProfile(entry) {
  if (!entry?.snapshot) return 'Vacío';
  const snapshot = entry.snapshot;
  const columns = Number(snapshot.config?.gridColumns) || 0;
  const rows = Number(snapshot.config?.gridRows) || 0;
  const inventory = snapshot.inventory || {};
  const stock = Math.max(0, Math.floor(Number(snapshot.extractorStock) || 0));
  const installed = Array.isArray(snapshot.extractors) ? snapshot.extractors.length : 0;
  const resourceSummary = ['coal', 'copper', 'iron', 'stone']
    .map((type) => Math.max(0, Math.floor(Number(inventory[type]) || 0)))
    .join(' / ');
  return `${columns}×${rows} · inv. Cb/Cu/Fe/Pi ${resourceSummary} · ext. ${stock}+${installed}`;
}
