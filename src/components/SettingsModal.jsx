import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, AlertTriangle, RefreshCw, Unlock, Check } from 'lucide-react';
import { sounds } from '../audio/soundEffects.js';

export function SettingsModal({
  settings,
  highestUnlockedLevel = 1,
  onUpdateSettings,
  onUnlockAllLevels,
  onResetProgress,
  onClose
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [unlockedNotice, setUnlockedNotice] = useState(false);

  const toggleSound = () => {
    const next = !settings.sound;
    onUpdateSettings({ sound: next });
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  const toggleAnimations = () => {
    onUpdateSettings({ animations: !settings.animations });
  };

  const toggleHighContrast = () => {
    onUpdateSettings({ highContrast: !settings.highContrast });
  };

  const handleUnlockAll = () => {
    onUnlockAllLevels();
    setUnlockedNotice(true);
    sounds.playClick();
    setTimeout(() => setUnlockedNotice(false), 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card settings-card">
        <div className="modal-header-row">
          <h2 className="modal-title">SETTINGS</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="settings-list">
          {/* Sound Toggle */}
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon-box">
                {settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </div>
              <div>
                <div className="setting-name">Sound Effects</div>
                <div className="setting-desc">Escape whooshes and tactile clicks</div>
              </div>
            </div>
            <button
              className={`toggle-switch ${settings.sound ? 'active' : ''}`}
              onClick={toggleSound}
              role="switch"
              aria-checked={settings.sound}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* Animations Toggle */}
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon-box">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="setting-name">Visual Animations</div>
                <div className="setting-desc">Smooth exit transitions & effects</div>
              </div>
            </div>
            <button
              className={`toggle-switch ${settings.animations ? 'active' : ''}`}
              onClick={toggleAnimations}
              role="switch"
              aria-checked={settings.animations}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* High Contrast */}
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon-box">
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>👁️</span>
              </div>
              <div>
                <div className="setting-name">High Contrast</div>
                <div className="setting-desc">Enhanced outlines for accessibility</div>
              </div>
            </div>
            <button
              className={`toggle-switch ${settings.highContrast ? 'active' : ''}`}
              onClick={toggleHighContrast}
              role="switch"
              aria-checked={settings.highContrast}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* Testing / Developer Actions */}
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon-box" style={{ background: 'rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)' }}>
                <Unlock size={20} />
              </div>
              <div>
                <div className="setting-name">Testing Mode</div>
                <div className="setting-desc">
                  {highestUnlockedLevel >= 1000 ? 'All 1,000 Levels Unlocked' : `Unlocked up to Level ${highestUnlockedLevel}`}
                </div>
              </div>
            </div>
            <button
              className={`secondary-btn ${unlockedNotice ? 'btn-success-active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={handleUnlockAll}
            >
              {unlockedNotice ? (
                <>
                  <Check size={14} />
                  <span>All Unlocked!</span>
                </>
              ) : (
                <span>Unlock All 1000</span>
              )}
            </button>
          </div>

          {/* Reset Data Section */}
          <div className="reset-section">
            {!showConfirmReset ? (
              <button
                className="danger-outline-btn"
                onClick={() => setShowConfirmReset(true)}
              >
                <RefreshCw size={16} />
                <span>Restore / Reset to Level 1</span>
              </button>
            ) : (
              <div className="reset-confirm-box">
                <div className="reset-confirm-warning">
                  <AlertTriangle size={18} className="text-amber" />
                  <span>Reset progress and lock levels back to Level 1?</span>
                </div>
                <div className="reset-btn-group">
                  <button
                    className="danger-btn"
                    onClick={() => {
                      onResetProgress();
                      setShowConfirmReset(false);
                    }}
                  >
                    Yes, Restore to Level 1
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => setShowConfirmReset(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="primary-btn mt-4" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
