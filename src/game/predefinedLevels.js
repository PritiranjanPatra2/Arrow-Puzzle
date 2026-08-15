import { generateLevel } from './puzzleGenerator.js';
import { solvePuzzle } from './puzzleSolver.js';
import { getDifficulty } from './difficulty.js';
import { normalizeArrow } from './puzzleValidator.js';

/**
 * Level 1 handcrafted introduction
 */
const TUTORIAL_LEVELS = {
  1: {
    level: 1,
    boardSize: 5,
    arrows: [
      {
        id: 'arrow-1-1',
        direction: 'UP',
        cells: [{ r: 1, c: 2 }, { r: 2, c: 2 }, { r: 2, c: 1 }],
        color: '#38BDF8'
      },
      {
        id: 'arrow-1-2',
        direction: 'LEFT',
        cells: [{ r: 3, c: 1 }, { r: 3, c: 2 }],
        color: '#818CF8'
      },
      {
        id: 'arrow-1-3',
        direction: 'RIGHT',
        cells: [{ r: 2, c: 4 }, { r: 3, c: 4 }],
        color: '#F472B6'
      },
      {
        id: 'arrow-1-4',
        direction: 'DOWN',
        cells: [{ r: 4, c: 0 }, { r: 3, c: 0 }],
        color: '#34D399'
      }
    ]
  }
};

const levelCache = new Map();

export function getLevelData(levelNumber) {
  const lvl = Math.max(1, Math.min(1000, Math.floor(levelNumber)));

  if (levelCache.has(lvl)) {
    return levelCache.get(lvl);
  }

  let levelData;

  if (TUTORIAL_LEVELS[lvl]) {
    const tutorial = TUTORIAL_LEVELS[lvl];
    const difficulty = getDifficulty(lvl);
    const normalizedArrows = tutorial.arrows.map(normalizeArrow);
    const metrics = solvePuzzle(normalizedArrows, tutorial.boardSize);
    levelData = {
      level: lvl,
      boardSize: tutorial.boardSize,
      arrows: normalizedArrows,
      difficulty,
      metrics
    };
  } else {
    levelData = generateLevel(lvl);
  }

  levelCache.set(lvl, levelData);
  return levelData;
}
