import React, { useState, useEffect } from 'react';
import { loadProgress, saveProgress, resetProgress } from './utils/storage.js';
import { sounds } from './audio/soundEffects.js';
import { Home } from './components/Home.jsx';
import { LevelSelect } from './components/LevelSelect.jsx';
import { GameScreen } from './components/GameScreen.jsx';
import { InstructionsModal } from './components/InstructionsModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import './App.css';

export function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [currentScreen, setCurrentScreen] = useState('HOME'); // 'HOME' | 'LEVEL_SELECT' | 'PLAYING'
  const [activeLevel, setActiveLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync sound settings to SoundManager on mount / update
  useEffect(() => {
    sounds.setEnabled(progress.settings.sound);
  }, [progress.settings.sound]);

  // Persist progress to localStorage on any progress state update
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Save level completion stats
  const handleLevelCompleted = (level, stars, moves, timeSeconds) => {
    setProgress(prev => {
      const nextUnlocked = Math.min(1000, Math.max(prev.highestUnlockedLevel, level + 1));
      const completedSet = new Set(prev.completedLevels);
      completedSet.add(level);

      const prevStars = prev.stars[level] || 0;
      const prevMoves = prev.bestMoves[level] || Infinity;
      const prevTime = prev.bestTimes[level] || Infinity;

      return {
        ...prev,
        highestUnlockedLevel: nextUnlocked,
        completedLevels: Array.from(completedSet),
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
      {/* Background radial glow */}
      <div className="bg-glow-layer" />

      {/* Screen Routing */}
      {currentScreen === 'HOME' && (
        <Home
          highestUnlockedLevel={progress.highestUnlockedLevel}
          completedCount={progress.completedLevels.length}
          totalStars={totalStars}
          onPlay={(lvl) => {
            setActiveLevel(lvl);
            setCurrentScreen('PLAYING');
          }}
          onLevelSelect={() => setCurrentScreen('LEVEL_SELECT')}
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
          bestStarsForLevel={progress.stars[activeLevel] || 0}
          onCompleteLevelSave={handleLevelCompleted}
          onBackToMenu={() => setCurrentScreen('LEVEL_SELECT')}
          onOpenSettings={() => setShowSettings(true)}
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
