import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Grid, RefreshCw } from 'lucide-react';

export function AllCompleteModal({ onLevelSelect, onReplayLevel1000 }) {
  useEffect(() => {
    // 3 spaced celebration bursts
    const timers = [
      setTimeout(() => {
        try {
          confetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.5, x: 0.3 },
            disableForReducedMotion: true,
            colors: ['#38BDF8', '#818CF8', '#F59E0B']
          });
        } catch (e) {}
      }, 100),
      setTimeout(() => {
        try {
          confetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.5, x: 0.7 },
            disableForReducedMotion: true,
            colors: ['#10B981', '#EC4899', '#E0E7FF']
          });
        } catch (e) {}
      }, 400)
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
      try {
        confetti.reset();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card master-victory-card">
        <div className="trophy-halo">
          <Trophy size={64} className="trophy-icon" />
        </div>

        <h2 className="master-title">🏆 ALL 1,000 LEVELS CONQUERED!</h2>
        <p className="master-subtitle">You conquered all 1,000 Arrow Puzzle levels!</p>

        <div className="master-stars-row">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={28} className="star-filled animate-bounce-soft" />
          ))}
        </div>

        <div className="master-score-badge">
          <span className="master-badge-title">SUPREME ARROW MASTER</span>
          <span className="master-badge-val">1,000 / 1,000 CONQUERED</span>
        </div>

        <div className="master-actions">
          <button className="primary-btn pulse-glow" onClick={onLevelSelect}>
            <Grid size={20} />
            <span>Select Any Level</span>
          </button>
          <button className="secondary-btn" onClick={onReplayLevel1000}>
            <RefreshCw size={20} />
            <span>Replay Final Level 1,000</span>
          </button>
        </div>
      </div>
    </div>
  );
}
