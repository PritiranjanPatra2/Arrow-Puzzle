import React from 'react';
import { ArrowLeft, Pause, Star, Heart, Award } from 'lucide-react';
import { formatTime } from '../utils/scoring.js';
import { MAX_LIFELINES } from '../hooks/useGame.js';

export function GameHeader({
  level,
  boardSize,
  remainingCount,
  moves,
  timeSeconds,
  lifelines = 7,
  lostHeartIndex = null,
  score = 0,
  bestStars = 0,
  onBack,
  onPause
}) {
  let tierLabel = 'Novice';
  if (level >= 900) tierLabel = 'Supreme';
  else if (level >= 750) tierLabel = 'Extreme';
  else if (level >= 500) tierLabel = 'Master';
  else if (level >= 250) tierLabel = 'Expert';
  else if (level >= 100) tierLabel = 'Advanced';
  else if (level >= 25) tierLabel = 'Challenger';

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

      {/* Lifelines and Score Banner Row */}
      <div className="lifelines-score-banner">
        {/* 7 Lifelines (Hearts) */}
        <div className="lifelines-group" title={`${lifelines}/${MAX_LIFELINES} Lifelines remaining`}>
          <span className="lifeline-label">LIFELINES</span>
          <div className="hearts-row">
            {Array.from({ length: MAX_LIFELINES }).map((_, idx) => {
              const isAlive = idx < lifelines;
              const isBreaking = idx === lostHeartIndex;

              return (
                <div
                  key={idx}
                  className={`heart-wrapper ${isAlive ? 'heart-alive' : 'heart-empty'} ${
                    isBreaking ? 'heart-breaking' : ''
                  }`}
                >
                  <Heart size={16} fill={isAlive ? '#F43F5E' : 'transparent'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="header-score-pill">
          <Award size={16} className="text-amber" />
          <span className="score-num">{score}</span>
          <span className="score-unit">PTS</span>
        </div>
      </div>

      {/* Stats HUD Bar */}
      <div className="stats-hud">
        {/* Rating Stars */}
        <div className="stat-card">
          <span className="stat-label">RATING</span>
          <div className="stars-row">
            {[1, 2, 3].map(s => (
              <Star
                key={s}
                size={14}
                className={s <= bestStars ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
        </div>

        {/* Arrows Remaining */}
        <div className="stat-card">
          <span className="stat-label">REMAINING</span>
          <span className="stat-value stat-mono highlight-cyan">{remainingCount}</span>
        </div>

        {/* Moves Taken */}
        <div className="stat-card">
          <span className="stat-label">MOVES</span>
          <span className="stat-value stat-mono">{moves}</span>
        </div>

        {/* Level Timer */}
        <div className="stat-card">
          <span className="stat-label">TIME</span>
          <span className="stat-value stat-mono">{formatTime(timeSeconds)}</span>
        </div>
      </div>
    </header>
  );
}
