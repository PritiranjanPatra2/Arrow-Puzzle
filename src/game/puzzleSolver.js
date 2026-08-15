import { checkArrowEscape, getAvailableMoves, normalizeArrow } from './puzzleValidator.js';

/**
 * Deterministic puzzle solver that solves by greedily removing unblocked multi-cell arrows.
 * Runs in O(N^2) with zero recursion bottlenecks.
 */
export function solvePuzzle(initialArrows, boardSize) {
  let remaining = initialArrows.map(normalizeArrow);
  const solutionOrder = [];
  const initialAvailable = getAvailableMoves(remaining, boardSize);
  const initialFreeMoves = initialAvailable.length;

  while (remaining.length > 0) {
    const available = getAvailableMoves(remaining, boardSize);
    if (available.length === 0) {
      // Deadlock reached
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

    const nextMove = available[0];
    solutionOrder.push(nextMove.id);
    remaining = remaining.filter(a => a.id !== nextMove.id);
  }

  const { maxDepth, avgDepth } = calculateDependencyMetricsFast(initialArrows, boardSize);

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
 * Ultra-fast O(V + E) DAG longest path calculation with zero exponential backtracking
 */
function calculateDependencyMetricsFast(arrows, boardSize) {
  const normalized = arrows.map(normalizeArrow);
  const inDegree = new Map();
  const adjacency = new Map();

  for (const a of normalized) {
    inDegree.set(a.id, 0);
    adjacency.set(a.id, []);
  }

  for (const a of normalized) {
    const info = checkArrowEscape(a, normalized, boardSize);
    for (const blocker of info.blockers) {
      if (adjacency.has(blocker.id)) {
        adjacency.get(blocker.id).push(a.id);
        inDegree.set(a.id, (inDegree.get(a.id) || 0) + 1);
      }
    }
  }

  // Topological longest path
  const queue = [];
  const depth = new Map();

  for (const a of normalized) {
    if (inDegree.get(a.id) === 0) {
      queue.push(a.id);
      depth.set(a.id, 1);
    } else {
      depth.set(a.id, 1);
    }
  }

  let maxDepth = 1;
  let totalDepth = 0;

  while (queue.length > 0) {
    const u = queue.shift();
    const currentD = depth.get(u) || 1;
    maxDepth = Math.max(maxDepth, currentD);
    totalDepth += currentD;

    const neighbors = adjacency.get(u) || [];
    for (const v of neighbors) {
      depth.set(v, Math.max(depth.get(v) || 1, currentD + 1));
      inDegree.set(v, inDegree.get(v) - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  const avgDepth = normalized.length > 0 ? Number((totalDepth / normalized.length).toFixed(2)) : 0;
  return { maxDepth, avgDepth };
}
