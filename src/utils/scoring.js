/**
 * Calculates 1, 2, or 3 star rating based on moves taken, initial arrow count, and time
 */
export function calculateStars(movesTaken, initialArrowCount, timeSeconds, parTimeSeconds) {
  // Perfect moves: exactly initialArrowCount (each move escapes one arrow)
  // 3 stars: Optimal moves (<= initialArrowCount + 2) and reasonable time
  // 2 stars: Minor extra moves or slightly slow
  // 1 star: Completed the level

  const extraMoves = Math.max(0, movesTaken - initialArrowCount);

  if (extraMoves === 0 && timeSeconds <= parTimeSeconds * 1.3) {
    return 3;
  }

  if (extraMoves <= Math.max(2, Math.floor(initialArrowCount * 0.15)) && timeSeconds <= parTimeSeconds * 2.0) {
    return 3;
  }

  if (extraMoves <= Math.max(5, Math.floor(initialArrowCount * 0.35))) {
    return 2;
  }

  return 1;
}

export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
