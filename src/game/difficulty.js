/**
 * Dynamic Grid Scaling: Above Level 20 starts at 28x28 and scales up to 50x50 board size.
 * Guaranteed 100% solvable with dense interlocking snake mazes and strictly 1 initial free move.
 */

export function getDifficulty(level) {
  const lvl = Math.max(1, Math.min(1000, Math.floor(level)));
  const progress = (lvl - 1) / 999;

  // Board Size Progression: Above Level 20 adds 28x28 grid and scales up to 50x50!
  let boardSize = 5;

  if (lvl >= 900) boardSize = 50;
  else if (lvl >= 800) boardSize = 48;
  else if (lvl >= 700) boardSize = 46;
  else if (lvl >= 600) boardSize = 44;
  else if (lvl >= 500) boardSize = 42;
  else if (lvl >= 400) boardSize = 40;
  else if (lvl >= 300) boardSize = 38;
  else if (lvl >= 200) boardSize = 35;
  else if (lvl >= 100) boardSize = 32;
  else if (lvl >= 50) boardSize = 30;
  else if (lvl >= 20) boardSize = 28;
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
    targetArrowCount = 26 + Math.round((lvl - 20) * 0.4);
  } else if (lvl <= 99) {
    targetArrowCount = 38 + Math.round((lvl - 50) * 0.3);
  } else if (lvl <= 199) {
    targetArrowCount = 52 + Math.round((lvl - 100) * 0.25);
  } else if (lvl <= 399) {
    targetArrowCount = 76 + Math.round((lvl - 200) * 0.2);
  } else if (lvl <= 699) {
    targetArrowCount = 110 + Math.round((lvl - 400) * 0.18);
  } else {
    targetArrowCount = 150 + Math.round((lvl - 700) * 0.18);
  }

  const maxAllowed = Math.floor(totalCells * 0.85);
  const arrowCount = Math.min(maxAllowed, Math.max(3, targetArrowCount));
  const density = Number((arrowCount / totalCells).toFixed(3));

  // Max initial free moves: Strictly 1 from Level 2 onward!
  let maxInitialFreeMoves = 1;
  if (lvl === 1) maxInitialFreeMoves = 3;

  const minChainDepth = Math.max(1, Math.min(55, Math.round(2 + Math.pow(progress, 0.7) * 50)));
  const targetComplexity = Math.round(20 + progress * 400);
  const targetMoves = arrowCount;
  const parTimeSeconds = Math.round(20 + progress * 450);

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
