import React from 'react';
import { X, Trophy, CheckCircle, Lock, Award } from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/achievements.js';

export function AchievementsModal({ progress, onClose }) {
  const unlockedSet = new Set(progress.unlockedAchievements || []);
  const totalUnlocked = unlockedSet.size;

  return (
    <div className="modal-backdrop">
      <div className="modal-card achievements-card">
        <div className="modal-header-row">
          <div className="achievements-header-title">
            <Trophy size={22} className="text-amber" />
            <h2 className="modal-title">ACHIEVEMENTS</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Header summary progress */}
        <div className="achievements-summary-box">
          <div className="summary-left">
            <span className="summary-label">UNLOCKED</span>
            <span className="summary-val">{totalUnlocked} / {ACHIEVEMENTS.length}</span>
          </div>
          <div className="summary-right">
            <Award size={18} className="text-amber" />
            <span className="summary-points">{progress.score || 0} Total Points</span>
          </div>
        </div>

        {/* List of achievements */}
        <div className="achievements-scroll-list">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedSet.has(ach.id);

            return (
              <div
                key={ach.id}
                className={`achievement-row ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="ach-icon-box">
                  <span>{ach.icon}</span>
                </div>

                <div className="ach-details">
                  <div className="ach-title-row">
                    <span className="ach-name">{ach.title}</span>
                    {isUnlocked ? (
                      <span className="ach-badge-unlocked">
                        <CheckCircle size={12} /> Unlocked
                      </span>
                    ) : (
                      <span className="ach-badge-locked">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                  <p className="ach-description">{ach.description}</p>
                </div>

                <div className="ach-reward">
                  +{ach.rewardPoints} pts
                </div>
              </div>
            );
          })}
        </div>

        <button className="primary-btn mt-4" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
