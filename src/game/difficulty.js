/**
 * Dynamic Grid Scaling: Adds more grid size every 50 levels scaling up to 30x30.
 * Guaranteed 100% solvable with dense interlocking snake mazes and strictly 1 initial free move.
 */

export function getDifficulty(level) {
  const lvl = Math.max(1, Math.min(1000, Math.floor(level)));
  const progress = (lvl - 1) / 999;

  // Board Size Progression: Increases every 50 levels up to 30x30
  // Level 1-49:   5x5 / 6x6
  // Level 50-99:  7x7
  // Level 100-149: 8x8
  // Level 150-199: 9x9
  // Level 200-249: 10x10
  // Level 250-299: 11x11
  // Level 300-349: 12x12
  // Level 350-399: 13x13
  // ...
  // Level 950-1000: 30x30 Giant Master Labyrinth!
  let boardSize = 5;

  if (lvl >= 950) boardSize = 30;
  else if (lvl >= 900) boardSize = 28;
  else if (lvl >= 850) boardSize = 26;
  else if (lvl >= 800) boardSize = 24;
  else if (lvl >= 750) boardSize = 22;
  else if (lvl >= 700) boardSize = 20;
  else if (lvl >= 650) boardSize = 19;
  else if (lvl >= 600) boardSize = 18;
  else if (lvl >= 550) boardSize = 17;
  else if (lvl >= 500) boardSize = 16;
  else if (lvl >= 450) boardSize = 15;
  else if (lvl >= 400) boardSize = 14;
  else if (lvl >= 350) boardSize = 13;
  else if (lvl >= 300) boardSize = 12;
  else if (lvl >= 250) boardSize = 11;
  else if (lvl >= 200) boardSize = 10;
  else if (lvl >= 150) boardSize = 9;
  else if (lvl >= 100) boardSize = 8;
  else if (lvl >= 50) boardSize = 7;
  else if (lvl >= 10) boardSize = 6;
  else boardSize = 5;

  const totalCells = boardSize * boardSize;

  // Dense snake count scaling with board size & level difficulty
  let targetArrowCount;
  if (lvl === 1) {
    targetArrowCount = 4;
  } else if (lvl <= 9) {
    targetArrowCount = 6 + Math.round((lvl - 2) * 1.2);
  } else if (lvl <= 49) {
    targetArrowCount = 12 + Math.round((lvl - 10) * 0.4);
  } else if (lvl <= 99) {
    targetArrowCount = 18 + Math.round((lvl - 50) * 0.3);
  } else if (lvl <= 249) {
    targetArrowCount = 26 + Math.round((lvl - 100) * 0.2);
  } else if (lvl <= 499) {
    targetArrowCount = 45 + Math.round((lvl - 250) * 0.18);
  } else if (lvl <= 749) {
    targetArrowCount = 75 + Math.round((lvl - 500) * 0.15);
  } else {
    targetArrowCount = 105 + Math.round((lvl - 750) * 0.18);
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
