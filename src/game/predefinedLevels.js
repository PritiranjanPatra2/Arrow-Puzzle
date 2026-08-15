import { generateLevel } from './puzzleGenerator.js';
import { solvePuzzle } from './puzzleSolver.js';
import { getDifficulty } from './difficulty.js';

/**
 * Handcrafted initial tutorial levels (Levels 1 to 5)
 */
const TUTORIAL_LEVELS = {
  1: {
    level: 1,
    boardSize: 5,
    arrows: [
      { id: 'arrow-1-1', row: 1, col: 2, direction: 'UP' },
      { id: 'arrow-1-2', row: 3, col: 1, direction: 'LEFT' },
      { id: 'arrow-1-3', row: 2, col: 3, direction: 'RIGHT' }
    ]
  },
  2: {
    level: 2,
    boardSize: 5,
    arrows: [
      { id: 'arrow-2-1', row: 2, col: 1, direction: 'RIGHT' },
      { id: 'arrow-2-2', row: 2, col: 3, direction: 'DOWN' },
      { id: 'arrow-2-3', row: 0, col: 1, direction: 'UP' },
      { id: 'arrow-2-4', row: 4, col: 3, direction: 'RIGHT' }
    ]
  },
  3: {
    level: 3,
    boardSize: 5,
    arrows: [
      { id: 'arrow-3-1', row: 2, col: 1, direction: 'RIGHT' },
      { id: 'arrow-3-2', row: 2, col: 2, direction: 'RIGHT' },
      { id: 'arrow-3-3', row: 2, col: 3, direction: 'RIGHT' },
      { id: 'arrow-3-4', row: 1, col: 3, direction: 'UP' },
      { id: 'arrow-3-5', row: 3, col: 1, direction: 'DOWN' }
    ]
  },
  4: {
    level: 4,
    boardSize: 5,
    arrows: [
      { id: 'arrow-4-1', row: 1, col: 1, direction: 'RIGHT' },
      { id: 'arrow-4-2', row: 1, col: 3, direction: 'DOWN' },
      { id: 'arrow-4-3', row: 3, col: 3, direction: 'LEFT' },
      { id: 'arrow-4-4', row: 3, col: 1, direction: 'DOWN' },
      { id: 'arrow-4-5', row: 0, col: 2, direction: 'UP' },
      { id: 'arrow-4-6', row: 4, col: 4, direction: 'RIGHT' }
    ]
  },
  5: {
    level: 5,
    boardSize: 5,
    arrows: [
      { id: 'arrow-5-1', row: 2, col: 0, direction: 'RIGHT' },
      { id: 'arrow-5-2', row: 2, col: 2, direction: 'UP' },
      { id: 'arrow-5-3', row: 0, col: 2, direction: 'RIGHT' },
      { id: 'arrow-5-4', row: 2, col: 4, direction: 'DOWN' },
      { id: 'arrow-5-5', row: 4, col: 2, direction: 'LEFT' },
      { id: 'arrow-5-6', row: 3, col: 2, direction: 'DOWN' },
      { id: 'arrow-5-7', row: 1, col: 4, direction: 'UP' }
    ]
  }
};

const levelCache = new Map();

/**
 * Gets level configuration for any level from 1 to 1000.
 */
export function getLevelData(levelNumber) {
  const lvl = Math.max(1, Math.min(1000, Math.floor(levelNumber)));

  if (levelCache.has(lvl)) {
    return levelCache.get(lvl);
  }

  let levelData;

  if (TUTORIAL_LEVELS[lvl]) {
    const tutorial = TUTORIAL_LEVELS[lvl];
    const difficulty = getDifficulty(lvl);
    const metrics = solvePuzzle(tutorial.arrows, tutorial.boardSize);
    levelData = {
      level: lvl,
      boardSize: tutorial.boardSize,
      arrows: tutorial.arrows.map(a => ({ ...a })),
      difficulty,
      metrics
    };
  } else {
    levelData = generateLevel(lvl);
  }

  levelCache.set(lvl, levelData);
  return levelData;
}
