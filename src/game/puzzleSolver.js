import { checkArrowEscape, getAvailableMoves } from './puzzleValidator.js';

/**
 * Deterministic puzzle solver that solves by greedily removing unblocked arrows.
 * Also builds the full dependency graph and analyzes depth.
 * 
 * Returns:
 * {
 *   isSolvable: boolean,
 *   solutionOrder: Array<string> (arrow IDs),
 *   solutionLength: number,
 *   initialFreeMoves: number,
 *   maxChainDepth: number,
 *   averageChainDepth: number,
 *   deadlockCount: number
 * }
 */
export function solvePuzzle(initialArrows, boardSize) {
  let remaining = [...initialArrows];
  const solutionOrder = [];
  const initialAvailable = getAvailableMoves(remaining, boardSize);
  const initialFreeMoves = initialAvailable.length;

  while (remaining.length > 0) {
    const available = getAvailableMoves(remaining, boardSize);
    if (available.length === 0) {
      // Deadlock reached! The puzzle cannot be fully cleared from this state.
      return {
        isSolvable: false,
        solutionOrder,
        solutionLength: solutionOrder.length,
        remainingCount: remaining.length,
        initialFreeMoves,
        maxChainDepth: 0,
        averageChainDepth: 0
      };
    }

    // Pick the first available move (or the one that frees the most arrows)
    const nextMove = available[0];
    solutionOrder.push(nextMove.id);
    remaining = remaining.filter(a => a.id !== nextMove.id);
  }

  // Calculate dependency depths from solution sequence
  const { maxDepth, avgDepth } = calculateDependencyMetrics(initialArrows, boardSize);

  return {
    isSolvable: true,
    solutionOrder,
    solutionLength: solutionOrder.length,
    remainingCount: 0,
    initialFreeMoves,
    maxChainDepth: maxDepth,
    averageChainDepth: avgDepth
  };
}

/**
 * Computes direct blocking dependencies and longest chain path
 */
export function calculateDependencyMetrics(arrows, boardSize) {
  const arrowMap = new Map(arrows.map(a => [a.id, a]));
  const adjacency = new Map(); // id -> array of ids blocked by this arrow

  for (const a of arrows) {
    adjacency.set(a.id, []);
  }

  for (const a of arrows) {
    const info = checkArrowEscape(a, arrows, boardSize);
    for (const blocker of info.blockers) {
      // 'blocker' blocks 'a'. Therefore 'blocker' must move before 'a'.
      // Blocker -> a
      if (adjacency.has(blocker.id)) {
        adjacency.get(blocker.id).push(a.id);
      }
    }
  }

  // Find longest path in DAG using memoized DFS
  const memo = new Map();

  function getDepth(id, visited = new Set()) {
    if (memo.has(id)) return memo.get(id);
    if (visited.has(id)) return 0; // Cycle guard
    visited.add(id);

    const neighbors = adjacency.get(id) || [];
    let maxChildDepth = 0;
    for (const childId of neighbors) {
      maxChildDepth = Math.max(maxChildDepth, 1 + getDepth(childId, new Set(visited)));
    }

    memo.set(id, maxChildDepth);
    return maxChildDepth;
  }

  let maxDepth = 0;
  let totalDepth = 0;
  for (const a of arrows) {
    const d = getDepth(a.id);
    maxDepth = Math.max(maxDepth, d);
    totalDepth += d;
  }

  const avgDepth = arrows.length > 0 ? Number((totalDepth / arrows.length).toFixed(2)) : 0;

  return { maxDepth, avgDepth };
}
