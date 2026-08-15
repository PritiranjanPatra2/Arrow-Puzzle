/**
 * LocalStorage persistence manager for Arrow Puzzle with Score and Achievements
 */

const STORAGE_KEY = 'arrowPuzzleProgress_v2';

const DEFAULT_STATE = {
  highestUnlockedLevel: 1,
  completedLevels: [],
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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Try migrating from v1
      const oldRaw = localStorage.getItem('arrowPuzzleProgress_v1');
      if (oldRaw) {
        const oldParsed = JSON.parse(oldRaw);
        return {
          ...DEFAULT_STATE,
          highestUnlockedLevel: oldParsed.highestUnlockedLevel || 1,
          completedLevels: oldParsed.completedLevels || [],
          stars: oldParsed.stars || {},
          bestMoves: oldParsed.bestMoves || {},
          bestTimes: oldParsed.bestTimes || {},
          settings: { ...DEFAULT_STATE.settings, ...(oldParsed.settings || {}) }
        };
      }
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw);
    return {
      highestUnlockedLevel: parsed.highestUnlockedLevel || 1,
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
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
    localStorage.removeItem('arrowPuzzleProgress_v1');
    return DEFAULT_STATE;
  } catch (e) {
    console.error('Failed to reset progress:', e);
    return DEFAULT_STATE;
  }
}
