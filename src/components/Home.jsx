import React from 'react';
import { Play, Grid, HelpCircle, Settings, Star, Trophy } from 'lucide-react';
import { sounds } from '../audio/soundEffects.js';

export function Home({
  highestUnlockedLevel,
  completedCount,
  totalStars,
  onPlay,
  onLevelSelect,
  onHowToPlay,
  onSettings
}) {
  const isAllComplete = completedCount >= 1000;

  return (
    <div className="home-screen">
      {/* Floating ambient arrows in background */}
      <div className="ambient-arrows-container" aria-hidden="true">
        <div className="ambient-arrow a1">↑</div>
        <div className="ambient-arrow a2">→</div>
        <div className="ambient-arrow a3">↓</div>
        <div className="ambient-arrow a4">←</div>
        <div className="ambient-arrow a5">↗</div>
        <div className="ambient-arrow a6">↘</div>
      </div>

      <div className="home-content">
        {/* Title and Subtitle */}
        <div className="home-brand">
          <div className="brand-logo-badge">
            <div className="logo-icon-grid">
              <span className="logo-arr logo-arr-1">→</span>
              <span className="logo-arr logo-arr-2">↑</span>
              <span className="logo-arr logo-arr-3">↓</span>
              <span className="logo-arr logo-arr-4">←</span>
            </div>
          </div>
          <h1 className="brand-title">ARROW PUZZLE</h1>
          <p className="brand-subtitle">Think. Tap. Escape.</p>
        </div>

        {/* Action Buttons */}
        <div className="home-menu">
          <button
            className="home-menu-btn primary-menu-btn pulse-glow"
            onClick={() => {
              sounds.playClick();
              onPlay(highestUnlockedLevel);
            }}
          >
            <Play size={24} fill="currentColor" />
            <div className="btn-text-block">
              <span className="btn-main-label">
                {highestUnlockedLevel === 1 ? 'START GAME' : `CONTINUE LEVEL ${highestUnlockedLevel}`}
              </span>
              <span className="btn-sub-label">
                {isAllComplete ? 'All 1,000 Levels Conquered!' : `Level ${highestUnlockedLevel} of 1,000`}
              </span>
            </div>
          </button>

          <button
            className="home-menu-btn"
            onClick={() => {
              sounds.playClick();
              onLevelSelect();
            }}
          >
            <Grid size={20} />
            <span>LEVEL SELECT</span>
          </button>

          <div className="home-sub-menu-row">
            <button
              className="home-menu-btn flex-1"
              onClick={() => {
                sounds.playClick();
                onHowToPlay();
              }}
            >
              <HelpCircle size={18} />
              <span>HOW TO PLAY</span>
            </button>

            <button
              className="home-menu-btn flex-1"
              onClick={() => {
                sounds.playClick();
                onSettings();
              }}
            >
              <Settings size={18} />
              <span>SETTINGS</span>
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <div className="home-progress-card">
          <div className="progress-top-row">
            <div className="progress-stat">
              <span className="progress-stat-label">COMPLETED</span>
              <span className="progress-stat-val">
                {completedCount} <small>/ 1,000</small>
              </span>
            </div>
            <div className="progress-stat">
              <span className="progress-stat-label">TOTAL STARS</span>
              <span className="progress-stat-val text-amber">
                <Star size={16} fill="#F59E0B" className="inline-icon" /> {totalStars}
              </span>
            </div>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(completedCount / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
