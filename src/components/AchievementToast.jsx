import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.15 },
        colors: ['#F59E0B', '#38BDF8', '#818CF8']
      });
    } catch (e) {}

    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!achievement) return null;

  return (
    <div className="achievement-toast" onClick={onDismiss}>
      <div className="toast-icon-wrapper">
        <span className="toast-emoji">{achievement.icon}</span>
      </div>
      <div className="toast-content">
        <div className="toast-tag">
          <Trophy size={12} className="text-amber" />
          <span>ACHIEVEMENT UNLOCKED!</span>
        </div>
        <div className="toast-title">{achievement.title}</div>
        <div className="toast-desc">{achievement.description}</div>
      </div>
      <div className="toast-points-badge">
        +{achievement.rewardPoints} pts
      </div>
    </div>
  );
}
