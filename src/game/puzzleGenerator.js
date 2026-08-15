import { DIRECTIONS } from './puzzleValidator.js';
import { solvePuzzle } from './puzzleSolver.js';
import { getDifficulty } from './difficulty.js';

/**
 * Seeded PRNG (Mulberry32) for deterministic level generation
 */
function createPRNG(seed) {
  let s = Math.floor(seed) >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DIR_KEYS = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

/**
 * MATHEMATICALLY GUARANTEED CONSTRUCTIVE GENERATOR
 */
export function generateLevel(levelNumber) {
  const difficulty = getDifficulty(levelNumber);
  const { boardSize, arrowCount, maxInitialFreeMoves, minChainDepth } = difficulty;

  let bestPuzzle = null;
  let bestScore = -Infinity;

  for (let attempt = 0; attempt < 40; attempt++) {
    const seed = (levelNumber * 10007) + (attempt * 433) + 71;
    const rng = createPRNG(seed);

    const candidate = generateConstructivePuzzle(boardSize, arrowCount, rng, levelNumber);
    if (!candidate || candidate.length < 3) continue;

    const solution = solvePuzzle(candidate, boardSize);
    if (!solution.isSolvable || solution.solutionLength !== candidate.length) {
      continue;
    }

    let score = 100;
    score -= Math.abs(candidate.length - arrowCount) * 5;

    if (levelNumber > 10 && solution.initialFreeMoves > maxInitialFreeMoves) {
      score -= (solution.initialFreeMoves - maxInitialFreeMoves) * 15;
    }

    score += solution.maxChainDepth * 8;

    if (score > bestScore) {
      bestScore = score;
      bestPuzzle = {
        level: levelNumber,
        boardSize,
        arrows: candidate,
        difficulty,
        metrics: solution
      };

      if (solution.maxChainDepth >= minChainDepth && solution.initialFreeMoves <= maxInitialFreeMoves + 1) {
        break;
      }
    }
  }

  if (!bestPuzzle) {
    const fallbackRng = createPRNG(levelNumber * 7919 + 53);
    const arrows = generateConstructivePuzzle(boardSize, arrowCount, fallbackRng, levelNumber);
    const solution = solvePuzzle(arrows, boardSize);
    bestPuzzle = {
      level: levelNumber,
      boardSize,
      arrows,
      difficulty,
      metrics: solution
    };
  }

  return bestPuzzle;
}

function generateConstructivePuzzle(boardSize, targetCount, rng, level) {
  const placedArrows = []; // [S_1, S_2, ..., S_k]
  const occupied = new Set();
  const reservedEscapePaths = new Set();
  let idCounter = 1;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  for (let k = 0; k < targetCount; k++) {
    const validCandidates = [];

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        const key = `${r},${c}`;
        if (occupied.has(key)) continue;
        if (reservedEscapePaths.has(key)) continue;

        for (const dirKey of DIR_KEYS) {
          const dir = DIRECTIONS[dirKey];

          let stepR = r + dir.dr;
          let stepC = c + dir.dc;
          let blockerCount = 0;

          while (stepR >= 0 && stepR < boardSize && stepC >= 0 && stepC < boardSize) {
            const stepKey = `${stepR},${stepC}`;
            if (occupied.has(stepKey)) {
              blockerCount++;
            }
            stepR += dir.dr;
            stepC += dir.dc;
          }

          let weight = 1;
          if (k === 0) {
            weight = 10;
          } else if (level <= 5) {
            weight = blockerCount <= 1 ? 10 : 2;
          } else {
            weight = blockerCount >= 1 ? (10 + blockerCount * 5) : 2;
          }

          validCandidates.push({ r, c, dir: dirKey, blockerCount, weight });
        }
      }
    }

    if (validCandidates.length === 0) break;

    shuffle(validCandidates);
    validCandidates.sort((a, b) => b.weight - a.weight);

    const chosen = validCandidates[0];
    occupied.add(`${chosen.r},${chosen.c}`);

    // Reserve chosen arrow's escape ray (from chosen cell to edge)
    const dir = DIRECTIONS[chosen.dir];
    let rayR = chosen.r + dir.dr;
    let rayC = chosen.c + dir.dc;
    while (rayR >= 0 && rayR < boardSize && rayC >= 0 && rayC < boardSize) {
      reservedEscapePaths.add(`${rayR},${rayC}`);
      rayR += dir.dr;
      rayC += dir.dc;
    }

    placedArrows.push({
      id: `arrow-${level}-${idCounter++}`,
      row: chosen.r,
      col: chosen.c,
      direction: chosen.dir
    });
  }

  return placedArrows;
}
