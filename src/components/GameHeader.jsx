import React from 'react';
import { ArrowLeft, Pause, Star } from 'lucide-react';
import { formatTime } from '../utils/scoring.js';

export function GameHeader({
  level,
  boardSize,
  remainingCount,
  moves,
  timeSeconds,
  bestStars = 0,
  onBack,
  onPause
}) {
  // Difficulty label based on level tier
  let tierLabel = 'Novice';
  if (level >= 90) tierLabel = 'Master';
  else if (level >= 75) tierLabel = 'Extreme';
  else if (level >= 50) tierLabel = 'Expert';
  else if (level >= 25) tierLabel = 'Advanced';
  else if (level >= 10) tierLabel = 'Challenger';

  return (
    <header className="game-header">
      <div className="header-top-row">
        <button
          className="icon-btn"
          onClick={onBack}
          aria-label="Back to Menu"
          title="Back to Menu"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="header-level-info">
          <h1 className="header-level-title">LEVEL {level}</h1>
          <span className="header-level-badge">
            {tierLabel} • {boardSize}×{boardSize}
          </span>
        </div>

        <button
          className="icon-btn"
          onClick={onPause}
          aria-label="Pause Game"
          title="Pause Game"
        >
          <Pause size={22} />
        </button>
      </div>

      {/* Stats HUD Bar */}
      <div className="stats-hud">
        {/* Stars */}
        <div className="stat-card">
          <span className="stat-label">RATING</span>
          <div className="stars-row">
            {[1, 2, 3].map(s => (
              <Star
                key={s}
                size={16}
                className={s <= bestStars ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
        </div>

        {/* Remaining Arrows */}
        <div className="stat-card">
          <span className="stat-label">REMAINING</span>
          <span className="stat-value highlight-cyan">{remainingCount}</span>
        </div>

        {/* Moves */}
        <div className="stat-card">
          <span className="stat-label">MOVES</span>
          <span className="stat-value">{moves}</span>
        </div>

        {/* Timer */}
        <div className="stat-card">
          <span className="stat-label">TIME</span>
          <span className="stat-value stat-mono">{formatTime(timeSeconds)}</span>
        </div>
      </div>
    </header>
  );
}
