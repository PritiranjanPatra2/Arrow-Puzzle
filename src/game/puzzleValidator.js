/**
 * Winding Snake Arrow Ray Tracing, Collision Detection, and Validation
 */

export const DIRECTIONS = {
  UP: { name: 'UP', dr: -1, dc: 0, symbol: '↑', angle: 0 },
  RIGHT: { name: 'RIGHT', dr: 0, dc: 1, symbol: '→', angle: 90 },
  DOWN: { name: 'DOWN', dr: 1, dc: 0, symbol: '↓', angle: 180 },
  LEFT: { name: 'LEFT', dr: 0, dc: -1, symbol: '←', angle: 270 }
};

/**
 * Normalizes an arrow to a winding snake arrow structure:
 * {
 *   id: string,
 *   direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT', // Head pointing direction
 *   cells: Array<{ r: number, c: number }>,       // [Head, body_1, body_2, ..., Tail]
 *   head: { r: number, c: number },
 *   tail: { r: number, c: number },
 *   length: number,
 *   colorIndex: number
 * }
 */
export function normalizeArrow(arrow) {
  let cells = [];

  if (arrow.cells && arrow.cells.length > 0) {
    cells = arrow.cells.map(pt => ({
      r: typeof pt.r === 'number' ? pt.r : pt.row,
      c: typeof pt.c === 'number' ? pt.c : pt.col
    }));
  } else {
    const r = typeof arrow.r === 'number' ? arrow.r : (typeof arrow.row === 'number' ? arrow.row : 0);
    const c = typeof arrow.c === 'number' ? arrow.c : (typeof arrow.col === 'number' ? arrow.col : 0);
    cells = [{ r, c }];
  }

  const head = cells[0];
  const tail = cells[cells.length - 1];

  return {
    ...arrow,
    cells,
    head,
    tail,
    length: cells.length,
    r: head.r,
    c: head.c,
    row: head.r,
    col: head.c
  };
}

/**
 * Returns a grid map of occupied cell coordinates "r,c" -> arrow object
 */
export function createCellMap(arrows) {
  const map = new Map();
  for (let i = 0; i < arrows.length; i++) {
    const a = normalizeArrow(arrows[i]);
    for (const pt of a.cells) {
      map.set(`${pt.r},${pt.c}`, a);
    }
  }
  return map;
}

/**
 * Check if a winding snake arrow can escape.
 * Ray starts from head moving in the head's direction to the edge of the board.
 * If ANY other arrow occupies a cell along this ray, the escape is blocked!
 */
export function checkArrowEscape(rawArrow, arrows, boardSize, cellMap = null) {
  if (!cellMap) {
    cellMap = createCellMap(arrows);
  }

  const arrow = normalizeArrow(rawArrow);
  const dir = DIRECTIONS[arrow.direction];
  if (!dir) return { canEscape: false, blockers: [], rayCells: [] };

  const blockers = [];
  const blockerSet = new Set();
  const rayCells = [];

  let r = arrow.head.r + dir.dr;
  let c = arrow.head.c + dir.dc;

  while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
    rayCells.push({ r, c });
    const key = `${r},${c}`;
    if (cellMap.has(key)) {
      const blocker = cellMap.get(key);
      if (blocker.id !== arrow.id && !blockerSet.has(blocker.id)) {
        blockerSet.add(blocker.id);
        blockers.push(blocker);
      }
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
