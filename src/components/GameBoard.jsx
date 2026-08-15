import React, { useMemo } from 'react';
import { ArrowTile } from './ArrowTile.jsx';

export function GameBoard({
  boardSize,
  arrows,
  blockedArrowId,
  highlightedBlockerIds = [],
  hintInfo,
  animatingArrowIds,
  animatingArrow,
  onArrowClick
}) {
  const cellSize = 100 / boardSize;

  // Memoize background grid cells so they NEVER re-render on user pointer clicks
  const backgroundGrid = useMemo(() => {
    const totalCells = boardSize * boardSize;
    return (
      <div className="game-board-grid">
        {Array.from({ length: totalCells }).map((_, idx) => (
          <div key={idx} className="grid-cell" />
        ))}
      </div>
    );
  }, [boardSize]);

  // Fast blocker lookup set for O(1) checks
  const blockerSet = useMemo(() => {
    return new Set(highlightedBlockerIds);
  }, [highlightedBlockerIds]);

  return (
    <div
      className="game-board-wrapper"
      style={{
        '--grid-size': boardSize
      }}
    >
      {/* Background static board grid cells (memoized) */}
      {backgroundGrid}

      {/* SVG Vector Layer for Winding Snake Arrows & Ray Indicators */}
      <svg
        className="game-board-svg-layer"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="hintGlowGrad">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hint Escape Ray Trajectory */}
        {hintInfo && hintInfo.rayCells && (
          <g className="hint-ray-layer">
            {hintInfo.rayCells.map((rc, i) => (
              <rect
                key={i}
                x={rc.c * cellSize + cellSize * 0.15}
                y={rc.r * cellSize + cellSize * 0.15}
                width={cellSize * 0.7}
                height={cellSize * 0.7}
                rx={cellSize * 0.2}
                fill="rgba(245, 158, 11, 0.25)"
                stroke="#F59E0B"
                strokeWidth={cellSize * 0.04}
                strokeDasharray={`${cellSize * 0.1}, ${cellSize * 0.08}`}
                className="hint-ray-cell"
              />
            ))}
          </g>
        )}

        {/* Winding Snake Arrow Paths */}
        {arrows.map((arrow) => {
          const isEscaping = animatingArrowIds ? animatingArrowIds.has(arrow.id) : (animatingArrow?.id === arrow.id);
          return (
            <ArrowTile
              key={arrow.id}
              arrow={arrow}
              boardSize={boardSize}
              isBlocked={blockedArrowId === arrow.id}
              isHighlightedBlocker={blockerSet.has(arrow.id)}
              isHinted={hintInfo?.arrow?.id === arrow.id}
              isAnimatingEscape={Boolean(isEscaping)}
              onClick={onArrowClick}
            />
          );
        })}
      </svg>
    </div>
  );
}
