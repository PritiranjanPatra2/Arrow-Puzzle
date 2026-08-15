import React from 'react';
import { Play, RefreshCw, Home } from 'lucide-react';

export function PauseModal({ onResume, onRestart, onHome }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card pause-card">
        <h2 className="modal-title">GAME PAUSED</h2>
        <p className="modal-subtitle">Take a breather, plan your next escape.</p>

        <div className="modal-actions-col">
          <button className="primary-btn pulse-glow" onClick={onResume}>
            <Play size={20} />
            <span>Resume</span>
          </button>

          <button className="secondary-btn" onClick={onRestart}>
            <RefreshCw size={20} />
            <span>Restart Level</span>
          </button>

          <button className="outline-btn" onClick={onHome}>
            <Home size={20} />
            <span>Level Select / Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
