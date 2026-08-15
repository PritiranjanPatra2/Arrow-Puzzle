/**
 * LocalStorage persistence manager for Arrow Puzzle
 */

const STORAGE_KEY = 'arrowPuzzleProgress_v1';

const DEFAULT_STATE = {
  highestUnlockedLevel: 1,
  completedLevels: [],
  stars: {},       // { [level]: 1 | 2 | 3 }
  bestMoves: {},   // { [level]: number }
  bestTimes: {},   // { [level]: number in seconds }
  settings: {
    sound: true,
    vibration: true,
    animations: true,
    highContrast: false
  }
};

export function loadProgress() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      highestUnlockedLevel: parsed.highestUnlockedLevel || 1,
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      stars: parsed.stars || {},
      bestMoves: parsed.bestMoves || {},
      bestTimes: parsed.bestTimes || {},
      settings: {
        ...DEFAULT_STATE.settings,
        ...(parsed.settings || {})
      }
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return DEFAULT_STATE;
  }
}

export function saveProgress(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save progress to localStorage:', e);
  }
}

export function resetProgress() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_STATE;
  } catch (e) {
    console.error('Failed to reset progress:', e);
    return DEFAULT_STATE;
  }
}
