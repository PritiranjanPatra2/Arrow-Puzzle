import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RefreshCw, Grid } from 'lucide-react';
import { formatTime } from '../utils/scoring.js';

export function LevelCompleteModal({
  level,
  stars,
  moves,
  timeSeconds,
  onNextLevel,
  onReplay,
  onLevelSelect,
  hasNextLevel
}) {
  useEffect(() => {
    // Satisfying celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#818CF8', '#F59E0B', '#10B981', '#EC4899']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card victory-card">
        <div className="victory-badge">🎉 LEVEL CLEAR!</div>
        
        <h2 className="victory-level-heading">LEVEL {level}</h2>

        {/* Animated Stars */}
        <div className="victory-stars-row">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`victory-star-wrapper star-anim-delay-${s} ${
                s <= stars ? 'star-earned' : 'star-missed'
              }`}
            >
              <Star size={36} />
            </div>
          ))}
        </div>

        {/* Stats summary */}
        <div className="victory-stats-grid">
          <div className="victory-stat-item">
            <span className="victory-stat-label">MOVES</span>
            <span className="victory-stat-num">{moves}</span>
          </div>
          <div className="victory-stat-item">
            <span className="victory-stat-label">TIME</span>
            <span className="victory-stat-num">{formatTime(timeSeconds)}</span>
          </div>
        </div>

        {hasNextLevel && (
          <div className="unlock-banner">
            <span className="unlock-icon">🔓</span>
            <span>LEVEL {level + 1} UNLOCKED</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="victory-actions">
          {hasNextLevel ? (
            <button className="primary-btn pulse-glow" onClick={onNextLevel}>
              <span>Next Level</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button className="primary-btn pulse-glow" onClick={onNextLevel}>
              <span>View All Complete</span>
            </button>
          )}

          <div className="modal-btn-row">
            <button className="secondary-btn flex-1" onClick={onReplay}>
              <RefreshCw size={18} />
              <span>Replay</span>
            </button>
            <button className="outline-btn flex-1" onClick={onLevelSelect}>
              <Grid size={18} />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
