import React from 'react';
import { HeartCrack, RefreshCw, Home } from 'lucide-react';

export function GameOverModal({ level, onRestart, onExit }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card game-over-card">
        <div className="game-over-icon-box">
          <HeartCrack size={52} className="heart-broken-icon" />
        </div>

        <h2 className="game-over-title">OUT OF LIFELINES!</h2>
        <p className="game-over-subtitle">
          You lost all 5 lifelines on Level {level}. Take a deep breath and plan the escape order carefully!
        </p>

        <div className="modal-actions-col mt-4">
          <button className="primary-btn pulse-glow" onClick={onRestart}>
            <RefreshCw size={20} />
            <span>Try Again (Full Hearts)</span>
          </button>

          <button className="outline-btn" onClick={onExit}>
            <Home size={20} />
            <span>Back to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
