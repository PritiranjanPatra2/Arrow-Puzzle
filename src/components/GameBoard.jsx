import React, { useMemo } from 'react';
import { ArrowTile } from './ArrowTile.jsx';

export function GameBoard({
  boardSize,
  arrows,
  blockedArrowId,
  highlightedBlockerIds,
  hintInfo,
  animatingArrow,
  onArrowClick
}) {
  // Generate background empty cell grid for clean board appearance
  const gridCells = useMemo(() => {
    const cells = [];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        cells.push({ r, c, key: `bg-${r}-${c}` });
      }
    }
    return cells;
  }, [boardSize]);

  // Fast lookup set for blocker IDs
  const blockerSet = useMemo(() => new Set(highlightedBlockerIds), [highlightedBlockerIds]);

  // Hint ray cells lookup
  const hintRaySet = useMemo(() => {
    if (!hintInfo || !hintInfo.rayCells) return new Set();
    return new Set(hintInfo.rayCells.map(cell => `${cell.r},${cell.c}`));
  }, [hintInfo]);

  return (
    <div className="game-board-wrapper">
      <div
        className="game-board"
        style={{
          '--grid-size': boardSize,
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`
        }}
      >
        {/* Background cell slots */}
        {gridCells.map(cell => {
          const isHintRay = hintRaySet.has(`${cell.r},${cell.c}`);
          return (
            <div
              key={cell.key}
              className={`board-cell ${isHintRay ? 'hint-ray-cell' : ''}`}
              style={{
                gridRow: cell.r + 1,
                gridColumn: cell.c + 1
              }}
            >
              <div className="cell-inner-dot" />
            </div>
          );
        })}

        {/* Active Arrows */}
        {arrows.map(arrow => (
          <ArrowTile
            key={arrow.id}
            arrow={arrow}
            boardSize={boardSize}
            isBlocked={arrow.id === blockedArrowId}
            isHighlightedBlocker={blockerSet.has(arrow.id)}
            isHinted={hintInfo && hintInfo.arrowId === arrow.id}
            isAnimatingEscape={animatingArrow && animatingArrow.id === arrow.id}
            onClick={onArrowClick}
          />
        ))}
      </div>
    </div>
  );
}
