/**
 * LocalStorage persistence manager for Arrow Puzzle with Asynchronous Non-Blocking Saves
 */

const STORAGE_KEY = 'arrowPuzzleProgress_v3';

const DEFAULT_STATE = {
  highestUnlockedLevel: 1, // Only Level 1 is unlocked initially
  completedLevels: [],     // No levels completed initially
  score: 0,
  unlockedAchievements: [],
  claimedRewards: [],
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
    try {
      localStorage.removeItem('arrowPuzzleProgress_v1');
      localStorage.removeItem('arrowPuzzleProgress_v2');
    } catch (_) {}

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProgressSync(DEFAULT_STATE);
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(raw);
    const completed = Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [];
    
    const maxCompleted = completed.length > 0 ? Math.max(...completed) : 0;
    const strictHighestUnlocked = Math.min(1000, Math.max(1, maxCompleted + 1));

    const sanitizedState = {
      highestUnlockedLevel: strictHighestUnlocked,
      completedLevels: completed,
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      claimedRewards: Array.isArray(parsed.claimedRewards) ? parsed.claimedRewards : [],
      stars: parsed.stars || {},
      bestMoves: parsed.bestMoves || {},
      bestTimes: parsed.bestTimes || {},
      settings: {
        ...DEFAULT_STATE.settings,
        ...(parsed.settings || {})
      }
    };

    return sanitizedState;
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return DEFAULT_STATE;
  }
}

function saveProgressSync(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

let saveTimeout = null;

/**
 * Non-blocking asynchronous save offloaded from the main pointer interaction frame (INP < 16ms)
 */
export function saveProgress(state) {
  if (typeof window === 'undefined') return;
  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save progress to localStorage:', e);
    }
  }, 32);
}

export function unlockAllLevelsProgress() {
  const current = loadProgress();
  const allLevels = Array.from({ length: 1000 }, (_, i) => i + 1);
  const updated = {
    ...current,
    highestUnlockedLevel: 1000,
    completedLevels: allLevels
  };
  saveProgressSync(updated);
  return updated;
}

export function resetProgress() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('arrowPuzzleProgress_v1');
    localStorage.removeItem('arrowPuzzleProgress_v2');
    saveProgressSync(DEFAULT_STATE);
    return DEFAULT_STATE;
  } catch (e) {
    console.error('Failed to reset progress:', e);
    return DEFAULT_STATE;
  }
}
