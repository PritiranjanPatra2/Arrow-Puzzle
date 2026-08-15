import React, { useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AchievementToast({ achievement, onDismiss }) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!hasFired.current) {
      hasFired.current = true;
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.2 },
          ticks: 120,
          disableForReducedMotion: true,
          colors: ['#F59E0B', '#38BDF8', '#818CF8']
        });
      } catch (e) {}
    }

    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);

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
