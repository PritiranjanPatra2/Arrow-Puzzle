/**
 * Ray tracing, collision detection, and blocker analysis for Arrow Puzzle
 */

export const DIRECTIONS = {
  UP: { name: 'UP', dr: -1, dc: 0, symbol: '↑', angle: 0 },
  RIGHT: { name: 'RIGHT', dr: 0, dc: 1, symbol: '→', angle: 90 },
  DOWN: { name: 'DOWN', dr: 1, dc: 0, symbol: '↓', angle: 180 },
  LEFT: { name: 'LEFT', dr: 0, dc: -1, symbol: '←', angle: 270 }
};

/**
 * Returns a grid map of occupied cell coordinates to arrow objects
 */
export function createCellMap(arrows) {
  const map = new Map();
  for (let i = 0; i < arrows.length; i++) {
    const a = arrows[i];
    map.set(`${a.row},${a.col}`, a);
  }
  return map;
}

/**
 * Check if a specific arrow can escape given the active arrows and board size
 * Returns { canEscape: boolean, blockers: Array<Arrow>, rayCells: Array<{r, c}> }
 */
export function checkArrowEscape(arrow, arrows, boardSize, cellMap = null) {
  if (!cellMap) {
    cellMap = createCellMap(arrows);
  }

  const dir = DIRECTIONS[arrow.direction];
  if (!dir) return { canEscape: false, blockers: [], rayCells: [] };

  const blockers = [];
  const rayCells = [];

  let r = arrow.row + dir.dr;
  let c = arrow.col + dir.dc;

  while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
    rayCells.push({ r, c });
    const key = `${r},${c}`;
    if (cellMap.has(key)) {
      blockers.push(cellMap.get(key));
    }
    r += dir.dr;
    c += dir.dc;
  }

  return {
    canEscape: blockers.length === 0,
    blockers,
    firstBlocker: blockers.length > 0 ? blockers[0] : null,
    rayCells
  };
}

/**
 * Find all currently unblocked arrows that can escape right now
 */
export function getAvailableMoves(arrows, boardSize) {
  const cellMap = createCellMap(arrows);
  const available = [];

  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    const { canEscape } = checkArrowEscape(arrow, arrows, boardSize, cellMap);
    if (canEscape) {
      available.push(arrow);
    }
  }

  return available;
}

/**
 * Finds the best hint arrow (one that is free to move and unblocks maximal downstream dependencies)
 */
export function getBestHint(arrows, boardSize) {
  const available = getAvailableMoves(arrows, boardSize);
  if (available.length === 0) return null;

  // Score available moves by how many arrows they unblock
  let best = available[0];
  let maxUnblocked = -1;

  for (const candidate of available) {
    const remaining = arrows.filter(a => a.id !== candidate.id);
    const newAvailable = getAvailableMoves(remaining, boardSize);
    const score = newAvailable.length;
    if (score > maxUnblocked) {
      maxUnblocked = score;
      best = candidate;
    }
  }

  const escapeInfo = checkArrowEscape(best, arrows, boardSize);
  return {
    arrow: best,
    rayCells: escapeInfo.rayCells
  };
}
