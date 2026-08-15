/**
 * Achievements System for Arrow Puzzle
 */

export const ACHIEVEMENTS = [
  {
    id: 'first_win',
    title: 'First Escape',
    description: 'Complete Level 1 and start your journey.',
    icon: '🎯',
    target: 1,
    rewardPoints: 50,
    check: (progress) => (progress.completedLevels?.length || 0) >= 1
  },
  {
    id: 'points_100',
    title: 'Century Scorer',
    description: 'Reach 100 total puzzle points.',
    icon: '💯',
    target: 100,
    rewardPoints: 100,
    check: (progress) => (progress.score || 0) >= 100
  },
  {
    id: 'flawless_victory',
    title: 'Flawless Mind',
    description: 'Clear a level without losing a single lifeline (5/5 hearts).',
    icon: '🛡️',
    target: 1,
    rewardPoints: 75,
    check: (progress, context) => context?.lifelinesRemaining === 5
  },
  {
    id: 'stars_10',
    title: 'Star Collector',
    description: 'Collect 10 total stars across levels.',
    icon: '⭐',
    target: 10,
    rewardPoints: 100,
    check: (progress) => {
      const total = Object.values(progress.stars || {}).reduce((a, b) => a + (b || 0), 0);
      return total >= 10;
    }
  },
  {
    id: 'points_500',
    title: 'High Roller',
    description: 'Accumulate 500 total points.',
    icon: '💎',
    target: 500,
    rewardPoints: 200,
    check: (progress) => (progress.score || 0) >= 500
  },
  {
    id: 'level_10',
    title: 'Novice Graduate',
    description: 'Complete 10 levels.',
    icon: '🏅',
    target: 10,
    rewardPoints: 150,
    check: (progress) => (progress.completedLevels?.length || 0) >= 10
  },
  {
    id: 'speed_demon',
    title: 'Lightning Speed',
    description: 'Clear any level in under 10 seconds.',
    icon: '⚡',
    target: 1,
    rewardPoints: 100,
    check: (progress, context) => context?.timeSeconds && context.timeSeconds <= 10
  },
  {
    id: 'points_1000',
    title: 'Grand Master Scorer',
    description: 'Accumulate 1,000 total points.',
    icon: '👑',
    target: 1000,
    rewardPoints: 500,
    check: (progress) => (progress.score || 0) >= 1000
  },
  {
    id: 'level_25',
    title: 'Chapter 1 Champion',
    description: 'Complete 25 levels.',
    icon: '🏆',
    target: 25,
    rewardPoints: 250,
    check: (progress) => (progress.completedLevels?.length || 0) >= 25
  },
  {
    id: 'points_5000',
    title: 'Arrow Legend',
    description: 'Accumulate 5,000 total points.',
    icon: '🌌',
    target: 5000,
    rewardPoints: 1000,
    check: (progress) => (progress.score || 0) >= 5000
  }
];

export function checkNewAchievements(progress, context = {}) {
  const unlocked = new Set(progress.unlockedAchievements || []);
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (!unlocked.has(ach.id)) {
      if (ach.check(progress, context)) {
        newlyUnlocked.push(ach);
      }
    }
  }

  return newlyUnlocked;
}
