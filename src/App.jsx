import React, { useState, useEffect } from 'react';
import { loadProgress, saveProgress, resetProgress } from './utils/storage.js';
import { sounds } from './audio/soundEffects.js';
import { checkNewAchievements } from './utils/achievements.js';
import { Home } from './components/Home.jsx';
import { LevelSelect } from './components/LevelSelect.jsx';
import { GameScreen } from './components/GameScreen.jsx';
import { InstructionsModal } from './components/InstructionsModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { AchievementsModal } from './components/AchievementsModal.jsx';
import { AchievementToast } from './components/AchievementToast.jsx';
import './App.css';

export function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [currentScreen, setCurrentScreen] = useState('HOME'); // 'HOME' | 'LEVEL_SELECT' | 'PLAYING'
  const [activeLevel, setActiveLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Sync sound settings to SoundManager
  useEffect(() => {
    sounds.setEnabled(progress.settings.sound);
  }, [progress.settings.sound]);

  // Persist progress to localStorage on any state update
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Save level completion stats and check achievements
  const handleLevelCompleted = (level, stars, moves, timeSeconds, lifelinesRemaining, pointsEarned) => {
    setProgress(prev => {
      const nextUnlocked = Math.min(1000, Math.max(prev.highestUnlockedLevel, level + 1));
      const completedSet = new Set(prev.completedLevels);
      completedSet.add(level);

      const prevStars = prev.stars[level] || 0;
      const prevMoves = prev.bestMoves[level] || Infinity;
      const prevTime = prev.bestTimes[level] || Infinity;
      const newScore = (prev.score || 0) + (pointsEarned || 0);

      const updatedProgress = {
        ...prev,
        highestUnlockedLevel: nextUnlocked,
        completedLevels: Array.from(completedSet),
        score: newScore,
        stars: {
          ...prev.stars,
          [level]: Math.max(prevStars, stars)
        },
        bestMoves: {
          ...prev.bestMoves,
          [level]: Math.min(prevMoves, moves)
        },
        bestTimes: {
          ...prev.bestTimes,
          [level]: Math.min(prevTime, timeSeconds)
        }
      };

      // Check for new achievements
      const newlyUnlocked = checkNewAchievements(updatedProgress, {
        level,
        stars,
        timeSeconds,
        lifelinesRemaining
      });

      if (newlyUnlocked.length > 0) {
        const unlockedIds = newlyUnlocked.map(a => a.id);
        updatedProgress.unlockedAchievements = [
          ...(prev.unlockedAchievements || []),
          ...unlockedIds
        ];
        // Add achievement reward points
        const bonusPoints = newlyUnlocked.reduce((sum, a) => sum + (a.rewardPoints || 0), 0);
        updatedProgress.score += bonusPoints;

        // Trigger fanfare & toast for the first newly unlocked
        sounds.playAchievement();
        setActiveToast(newlyUnlocked[0]);
      }

      return updatedProgress;
    });
  };

  const handleResetData = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    setActiveLevel(1);
    setCurrentScreen('HOME');
  };

  const handleUpdateSettings = (newSettings) => {
    setProgress(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  };

  const totalStars = Object.values(progress.stars).reduce((acc, val) => acc + (val || 0), 0);

  return (
    <div className={`app-root ${progress.settings.highContrast ? 'high-contrast-mode' : ''}`}>
      <div className="bg-glow-layer" />

      {/* Floating Achievement Toast */}
      {activeToast && (
        <AchievementToast
          achievement={activeToast}
          onDismiss={() => setActiveToast(null)}
        />
      )}

      {/* Screen Routing */}
      {currentScreen === 'HOME' && (
        <Home
          highestUnlockedLevel={progress.highestUnlockedLevel}
          completedCount={progress.completedLevels.length}
          totalStars={totalStars}
          score={progress.score || 0}
          unlockedAchievementsCount={(progress.unlockedAchievements || []).length}
          onPlay={(lvl) => {
            setActiveLevel(lvl);
            setCurrentScreen('PLAYING');
          }}
          onLevelSelect={() => setCurrentScreen('LEVEL_SELECT')}
          onAchievements={() => setShowAchievements(true)}
          onHowToPlay={() => setShowInstructions(true)}
          onSettings={() => setShowSettings(true)}
        />
      )}

      {currentScreen === 'LEVEL_SELECT' && (
        <LevelSelect
          highestUnlockedLevel={progress.highestUnlockedLevel}
          completedLevels={progress.completedLevels}
          stars={progress.stars}
          onSelectLevel={(lvl) => {
            setActiveLevel(lvl);
            setCurrentScreen('PLAYING');
          }}
          onBack={() => setCurrentScreen('HOME')}
        />
      )}

      {currentScreen === 'PLAYING' && (
        <GameScreen
          level={activeLevel}
          score={progress.score || 0}
          bestStarsForLevel={progress.stars[activeLevel] || 0}
          onCompleteLevelSave={handleLevelCompleted}
          onBackToMenu={() => setCurrentScreen('LEVEL_SELECT')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          progress={progress}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={progress.settings}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetData}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
