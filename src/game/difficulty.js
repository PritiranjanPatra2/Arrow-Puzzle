/**
 * Dynamic Grid Scaling:
 * - Levels 1-9: 5x5
 * - Levels 10-19: 6x6
 * - Level 20+: Starts from 12x12
 * - Level 900+: Reaches max 35x35 (Hardest!)
 * Guaranteed 100% solvable with dense interlocking snake mazes and strictly 1 initial free move.
 */

export function getDifficulty(level) {
  const lvl = Math.max(1, Math.min(1000, Math.floor(level)));
  const progress = (lvl - 1) / 999;

  // Board Size Progression: Starts from 12x12 after level 20, scaling up to 35x35 (Hardest!)
  let boardSize = 5;

  if (lvl >= 900) boardSize = 35;
  else if (lvl >= 800) boardSize = 32;
  else if (lvl >= 700) boardSize = 30;
  else if (lvl >= 600) boardSize = 28;
  else if (lvl >= 500) boardSize = 25;
  else if (lvl >= 400) boardSize = 22;
  else if (lvl >= 300) boardSize = 20;
  else if (lvl >= 200) boardSize = 18;
  else if (lvl >= 100) boardSize = 16;
  else if (lvl >= 50) boardSize = 14;
  else if (lvl >= 20) boardSize = 12;
  else if (lvl >= 10) boardSize = 6;
  else boardSize = 5;

  const totalCells = boardSize * boardSize;

  // Dense snake count scaling with board size & level difficulty
  let targetArrowCount;
  if (lvl === 1) {
    targetArrowCount = 4;
  } else if (lvl <= 9) {
    targetArrowCount = 6 + Math.round((lvl - 2) * 1.2);
  } else if (lvl <= 19) {
    targetArrowCount = 12 + Math.round((lvl - 10) * 0.4);
  } else if (lvl <= 49) {
    targetArrowCount = 18 + Math.round((lvl - 20) * 0.4);
  } else if (lvl <= 99) {
    targetArrowCount = 28 + Math.round((lvl - 50) * 0.3);
  } else if (lvl <= 199) {
    targetArrowCount = 40 + Math.round((lvl - 100) * 0.25);
  } else if (lvl <= 399) {
    targetArrowCount = 60 + Math.round((lvl - 200) * 0.2);
  } else if (lvl <= 699) {
    targetArrowCount = 85 + Math.round((lvl - 400) * 0.18);
  } else {
    targetArrowCount = 115 + Math.round((lvl - 700) * 0.18);
  }

  const maxAllowed = Math.floor(totalCells * 0.85);
  const arrowCount = Math.min(maxAllowed, Math.max(3, targetArrowCount));
  const density = Number((arrowCount / totalCells).toFixed(3));

  // Max initial free moves: Strictly 1 from Level 2 onward!
  let maxInitialFreeMoves = 1;
  if (lvl === 1) maxInitialFreeMoves = 3;

  const minChainDepth = Math.max(1, Math.min(50, Math.round(2 + Math.pow(progress, 0.7) * 45)));
  const targetComplexity = Math.round(20 + progress * 380);
  const targetMoves = arrowCount;
  const parTimeSeconds = Math.round(20 + progress * 400);

  return {
    level: lvl,
    boardSize,
    totalCells,
    arrowCount,
    density,
    maxInitialFreeMoves,
    minChainDepth,
    targetComplexity,
    targetMoves,
    parTimeSeconds
  };
}
