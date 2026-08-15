import React from 'react';
import { X, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export function InstructionsModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card instructions-card">
        <div className="modal-header-row">
          <h2 className="modal-title">HOW TO PLAY</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="instructions-body">
          {/* Step 1: Escape rule */}
          <div className="instruction-step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h4>Arrows Move Forward</h4>
              <p>Each arrow points in one direction (<strong>↑, →, ↓, ←</strong>). It wants to escape the board in that direction.</p>
              <div className="mini-diagram">
                <div className="mini-cell">
                  <div className="mini-arrow-tag">→</div>
                </div>
                <ArrowRight size={16} className="mini-flow-arrow" />
                <span className="mini-label success"><CheckCircle size={14} /> Clear Exit!</span>
              </div>
            </div>
          </div>

          {/* Step 2: Blocking rule */}
          <div className="instruction-step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h4>Blockers Prevent Escape</h4>
              <p>If another active arrow stands anywhere in the ray of escape, the arrow is blocked and cannot move.</p>
              <div className="mini-diagram">
                <div className="mini-cell">
                  <div className="mini-arrow-tag">→</div>
                </div>
                <div className="mini-cell blocked-target">
                  <div className="mini-arrow-tag">↑</div>
                </div>
                <span className="mini-label danger"><XCircle size={14} /> Blocked! Move ↑ first</span>
              </div>
            </div>
          </div>

          {/* Step 3: Dependency Chains */}
          <div className="instruction-step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h4>Find the Correct Order</h4>
              <p>Chain reactions are key: solving one arrow opens the path for the next. Think several moves ahead!</p>
            </div>
          </div>

          {/* Step 4: Clear to Win */}
          <div className="instruction-step">
            <div className="step-num">4</div>
            <div className="step-content">
              <h4>Conquer 100 Levels</h4>
              <p>Clear all arrows to earn up to <strong>3 stars ⭐⭐⭐</strong> per level and unlock increasingly complex challenges.</p>
            </div>
          </div>
        </div>

        <button className="primary-btn pulse-glow mt-4" onClick={onClose}>
          Got it, Let's Play!
        </button>
      </div>
    </div>
  );
}
