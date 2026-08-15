/**
 * Continuous Mathematical Difficulty Scaling for Levels 1 to 1000.
 * Every level introduces a gradual, monotonically increasing step in challenge.
 */

export function getDifficulty(level) {
  const lvl = Math.max(1, Math.min(1000, Math.floor(level)));
  const progress = (lvl - 1) / 999; // 0.0 at lvl 1, 1.0 at lvl 1000

  // 1. Board Size Progression (5x5 up to 10x10)
  let boardSize = 5;
  if (lvl >= 751) boardSize = 10;
  else if (lvl >= 501) boardSize = 9;
  else if (lvl >= 251) boardSize = 8;
  else if (lvl >= 101) boardSize = 7;
  else if (lvl >= 26) boardSize = 6;
  else boardSize = 5;

  const totalCells = boardSize * boardSize;

  // 2. Arrow Count (monotonically scaling from 3 arrows up to ~75 arrows)
  let targetArrowCount;
  if (lvl <= 5) {
    targetArrowCount = 3 + lvl; // 4, 5, 6, 7, 8
  } else if (lvl <= 25) {
    // 5x5 (25 cells) -> 8..15
    const t = (lvl - 5) / 20;
    targetArrowCount = Math.round(8 + t * 7);
  } else if (lvl <= 100) {
    // 6x6 (36 cells) -> 14..22
    const t = (lvl - 26) / 74;
    targetArrowCount = Math.round(14 + t * 8);
  } else if (lvl <= 250) {
    // 7x7 (49 cells) -> 20..32
    const t = (lvl - 101) / 149;
    targetArrowCount = Math.round(20 + t * 12);
  } else if (lvl <= 500) {
    // 8x8 (64 cells) -> 30..46
    const t = (lvl - 251) / 249;
    targetArrowCount = Math.round(30 + t * 16);
  } else if (lvl <= 750) {
    // 9x9 (81 cells) -> 42..62
    const t = (lvl - 501) / 249;
    targetArrowCount = Math.round(42 + t * 20);
  } else {
    // 10x10 (100 cells) -> 58..78
    const t = (lvl - 751) / 249;
    targetArrowCount = Math.round(58 + t * 20);
  }

  const maxAllowed = Math.floor(totalCells * 0.82);
  const arrowCount = Math.min(maxAllowed, Math.max(3, targetArrowCount));
  const density = Number((arrowCount / totalCells).toFixed(3));

  // 3. Max Initially Available / Obvious Free Moves
  let maxInitialFreeMoves = 3;
  if (lvl > 100) maxInitialFreeMoves = 1;
  else if (lvl > 30) maxInitialFreeMoves = 2;
  else if (lvl > 10) maxInitialFreeMoves = 2;

  // 4. Minimum required dependency chain depth (continuous scaling)
  const minChainDepth = Math.max(1, Math.min(32, Math.round(1 + Math.pow(progress, 0.85) * 28)));

  // 5. Complexity Target Score
  const targetComplexity = Math.round(10 + progress * 190);

  // 6. Benchmark metrics for 3-star scoring
  const targetMoves = arrowCount;
  const parTimeSeconds = Math.round(15 + progress * 240);

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
