import React from 'react';
import { DIRECTIONS } from '../game/puzzleValidator.js';

export function ArrowTile({
  arrow,
  boardSize,
  isBlocked,
  isHighlightedBlocker,
  isHinted,
  isAnimatingEscape,
  onClick
}) {
  const dirInfo = DIRECTIONS[arrow.direction] || DIRECTIONS.UP;
  const rotation = dirInfo.angle;

  // Compute CSS translate distance for escape animation
  let escapeClass = '';
  if (isAnimatingEscape) {
    if (arrow.direction === 'UP') escapeClass = 'animate-escape-up';
    if (arrow.direction === 'DOWN') escapeClass = 'animate-escape-down';
    if (arrow.direction === 'LEFT') escapeClass = 'animate-escape-left';
    if (arrow.direction === 'RIGHT') escapeClass = 'animate-escape-right';
  }

  return (
    <div
      className={`arrow-tile-container ${escapeClass}`}
      style={{
        gridRow: arrow.row + 1,
        gridColumn: arrow.col + 1
      }}
      onClick={() => onClick(arrow.id)}
      role="button"
      tabIndex={0}
      aria-label={`Arrow pointing ${arrow.direction} at row ${arrow.row + 1}, column ${arrow.col + 1}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(arrow.id);
        }
      }}
    >
      <div
        className={`arrow-tile ${isBlocked ? 'shake-blocked' : ''} ${
          isHighlightedBlocker ? 'highlight-blocker' : ''
        } ${isHinted ? 'pulse-hint' : ''}`}
      >
        {/* Glow backdrop layer */}
        <div className="arrow-glow-bg" />

        {/* SVG Arrow with directional rotation */}
        <svg
          viewBox="0 0 48 48"
          className="arrow-svg"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <defs>
            <linearGradient id={`arrowGrad-${arrow.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <filter id={`glow-${arrow.id}`} x1="-20%" y1="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38BDF8" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Arrow stem and arrowhead */}
          <path
            d="M 24,6 L 36,20 L 28,20 L 28,40 L 20,40 L 20,20 L 12,20 Z"
            fill={`url(#arrowGrad-${arrow.id})`}
            filter={`url(#glow-${arrow.id})`}
            stroke="#C7D2FE"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Center directional accent chevron */}
          <path
            d="M 24,14 L 30,22 M 24,14 L 18,22"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Blocker indicator dot if highlighted */}
        {isHighlightedBlocker && (
          <div className="blocker-warning-badge" title="This arrow is blocking the path!">
            !
          </div>
        )}
      </div>
    </div>
  );
}
