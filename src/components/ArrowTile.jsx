import React, { memo } from 'react';
import { DIRECTIONS, normalizeArrow } from '../game/puzzleValidator.js';

function ArrowTileComponent({
  arrow: rawArrow,
  boardSize,
  isBlocked,
  isHighlightedBlocker,
  isHinted,
  isAnimatingEscape,
  onClick
}) {
  const arrow = normalizeArrow(rawArrow);
  const dirInfo = DIRECTIONS[arrow.direction] || DIRECTIONS.UP;
  const color = arrow.color || '#38BDF8';
  const cellSize = 100 / boardSize;

  // Center points for all cells in snake path from Head (0) to Tail (last)
  const originalPoints = arrow.cells.map(pt => ({
    x: (pt.c + 0.5) * cellSize,
    y: (pt.r + 0.5) * cellSize
  }));

  // Path from Tail to Head
  const tailToHead = [...originalPoints].reverse();
  let pathData = `M ${tailToHead[0].x} ${tailToHead[0].y}`;
  for (let i = 1; i < tailToHead.length; i++) {
    pathData += ` L ${tailToHead[i].x} ${tailToHead[i].y}`;
  }

  // Head position and arrowhead rotation
  const headPt = originalPoints[0];
  const headAngle = dirInfo.angle;
  const arrowHeadSize = cellSize * 0.55;

  let animClass = '';
  if (isAnimatingEscape) {
    if (arrow.direction === 'UP') animClass = 'snake-escape-up';
    else if (arrow.direction === 'DOWN') animClass = 'snake-escape-down';
    else if (arrow.direction === 'LEFT') animClass = 'snake-escape-left';
    else if (arrow.direction === 'RIGHT') animClass = 'snake-escape-right';
  }

  return (
    <g
      className={`snake-arrow-group ${animClass} ${isBlocked ? 'snake-blocked' : ''} ${
        isHighlightedBlocker ? 'snake-blocker-warning' : ''
      } ${isHinted ? 'snake-hinted' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(arrow.id);
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Invisible thick clickable tap area for effortless mobile touches */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth={cellSize * 0.95}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer shadow / border tube */}
      <path
        d={pathData}
        fill="none"
        stroke="#0A0E1A"
        strokeWidth={cellSize * 0.58}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main colorful snake tube */}
      <path
        d={pathData}
        fill="none"
        stroke={isBlocked ? '#F43F5E' : (isHighlightedBlocker ? '#F59E0B' : color)}
        strokeWidth={cellSize * 0.42}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="snake-body-path"
      />

      {/* Glossy inner light reflection stripe */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.48)"
        strokeWidth={cellSize * 0.12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Body segment joints at each cell center */}
      {tailToHead.map((pt, idx) => (
        <circle
          key={idx}
          cx={pt.x}
          cy={pt.y}
          r={cellSize * 0.14}
          fill="rgba(255, 255, 255, 0.25)"
          stroke="#0A0E1A"
          strokeWidth={cellSize * 0.03}
          pointerEvents="none"
        />
      ))}

      {/* Directional Arrowhead at the Head of the snake */}
      <g transform={`translate(${headPt.x}, ${headPt.y}) rotate(${headAngle})`}>
        <circle r={cellSize * 0.5} fill="transparent" />

        {/* Head background shadow */}
        <polygon
          points={`0,${-arrowHeadSize * 0.65} ${arrowHeadSize * 0.55},${arrowHeadSize * 0.45} 0,${arrowHeadSize * 0.25} ${-arrowHeadSize * 0.55},${arrowHeadSize * 0.45}`}
          fill="#0A0E1A"
          stroke="#0A0E1A"
          strokeWidth={cellSize * 0.08}
          strokeLinejoin="round"
        />

        {/* Glossy sharp arrowhead polygon */}
        <polygon
          points={`0,${-arrowHeadSize * 0.65} ${arrowHeadSize * 0.5},${arrowHeadSize * 0.4} 0,${arrowHeadSize * 0.2} ${-arrowHeadSize * 0.5},${arrowHeadSize * 0.4}`}
          fill={isBlocked ? '#F43F5E' : (isHighlightedBlocker ? '#F59E0B' : color)}
          stroke={isBlocked ? '#FDA4AF' : (isHighlightedBlocker ? '#FDE68A' : '#FFFFFF')}
          strokeWidth={cellSize * 0.05}
          strokeLinejoin="round"
          className="snake-head-polygon"
        />
      </g>

      {/* Blocker alert exclamation badge */}
      {isHighlightedBlocker && (
        <g transform={`translate(${headPt.x}, ${headPt.y})`}>
          <circle r={cellSize * 0.22} fill="#F59E0B" stroke="#000" strokeWidth={1} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="#000"
            fontSize={cellSize * 0.28}
            fontWeight="bold"
          >
            !
          </text>
        </g>
      )}
    </g>
  );
}

// Ultra-fast memoization for zero re-render overhead on clicks
export const ArrowTile = memo(ArrowTileComponent, (prev, next) => {
  return (
    prev.arrow.id === next.arrow.id &&
    prev.boardSize === next.boardSize &&
    prev.isBlocked === next.isBlocked &&
    prev.isHighlightedBlocker === next.isHighlightedBlocker &&
    prev.isHinted === next.isHinted &&
    prev.isAnimatingEscape === next.isAnimatingEscape &&
    prev.arrow.color === next.arrow.color &&
    prev.arrow.direction === next.arrow.direction &&
    prev.arrow.length === next.arrow.length
  );
});
