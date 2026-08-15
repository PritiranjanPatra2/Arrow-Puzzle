/**
 * Calculates star rating and points for Arrow Puzzle
 */

export function calculateStars(movesTaken, initialArrowCount, timeSeconds, parTimeSeconds) {
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

export function calculateLevelPoints(level, stars, lifelinesRemaining, timeSeconds, parTimeSeconds) {
  // Base points scaling with level
  const basePoints = Math.round(50 + Math.min(250, level * 0.4));

  // Star bonus
  let starBonus = 10;
  if (stars === 3) starBonus = 50;
  else if (stars === 2) starBonus = 25;

  // Lifelines bonus (+10 pts per intact heart, up to +50)
  const lifelineBonus = Math.max(0, lifelinesRemaining) * 10;

  // Speed bonus if solved faster than benchmark
  const speedBonus = timeSeconds < parTimeSeconds ? Math.min(50, Math.round((parTimeSeconds - timeSeconds) * 1.5)) : 0;

  const totalPoints = basePoints + starBonus + lifelineBonus + speedBonus;

  return {
    basePoints,
    starBonus,
    lifelineBonus,
    speedBonus,
    totalPoints
  };
}

export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
