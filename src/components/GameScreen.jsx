import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame.js';
import { useTimer } from '../hooks/useTimer.js';
import { calculateStars } from '../utils/scoring.js';
import { GameHeader } from './GameHeader.jsx';
import { GameBoard } from './GameBoard.jsx';
import { GameControls } from './GameControls.jsx';
import { PauseModal } from './PauseModal.jsx';
import { LevelCompleteModal } from './LevelCompleteModal.jsx';
import { AllCompleteModal } from './AllCompleteModal.jsx';

export function GameScreen({
  level,
  bestStarsForLevel = 0,
  onCompleteLevelSave,
  onBackToMenu,
  onOpenSettings
}) {
  const timer = useTimer(true);
  const [isPaused, setIsPaused] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);

  const {
    currentLevel,
    levelData,
    boardSize,
    arrows,
    initialArrowCount,
    remainingCount,
    moves,
    historyLength,
    animatingArrow,
    blockedArrowId,
    highlightedBlockerIds,
    hintInfo,
    isLevelComplete,
    isAllComplete,
    handleArrowClick,
    undo,
    requestHint,
    restart,
    loadLevel
  } = useGame(level);

  // Load level on prop change
  useEffect(() => {
    loadLevel(level);
    timer.reset();
  }, [level, loadLevel]);

  // When level completes, pause timer and compute stars
  useEffect(() => {
    if (isLevelComplete) {
      timer.stop();
      const stars = calculateStars(
        moves,
        initialArrowCount,
        timer.seconds,
        levelData.difficulty.parTimeSeconds
      );
      setEarnedStars(stars);
      onCompleteLevelSave(currentLevel, stars, moves, timer.seconds);
    }
  }, [isLevelComplete, moves, initialArrowCount, timer.seconds, levelData.difficulty.parTimeSeconds, currentLevel, onCompleteLevelSave]);

  const handlePause = () => {
    timer.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    timer.resume();
  };

  const handleRestart = () => {
    setIsPaused(false);
    restart();
    timer.reset();
  };

  const handleNextLevel = () => {
    if (currentLevel < 1000) {
      loadLevel(currentLevel + 1);
      timer.reset();
    }
  };

  return (
    <div className="game-screen-container">
      <GameHeader
        level={currentLevel}
        boardSize={boardSize}
        remainingCount={remainingCount}
        moves={moves}
        timeSeconds={timer.seconds}
        bestStars={bestStarsForLevel}
        onBack={onBackToMenu}
        onPause={handlePause}
      />

      <main className="game-screen-main">
        <GameBoard
          boardSize={boardSize}
          arrows={arrows}
          blockedArrowId={blockedArrowId}
          highlightedBlockerIds={highlightedBlockerIds}
          hintInfo={hintInfo}
          animatingArrow={animatingArrow}
          onArrowClick={handleArrowClick}
        />
      </main>

      <GameControls
        historyLength={historyLength}
        onUndo={undo}
        onHint={requestHint}
        onRestart={handleRestart}
        disabled={isLevelComplete || isPaused}
      />

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={onBackToMenu}
        />
      )}

      {/* Standard Level Complete Modal */}
      {isLevelComplete && !isAllComplete && (
        <LevelCompleteModal
          level={currentLevel}
          stars={earnedStars}
          moves={moves}
          timeSeconds={timer.seconds}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onLevelSelect={onBackToMenu}
          hasNextLevel={currentLevel < 1000}
        />
      )}

      {/* Level 1000 Grand Master Modal */}
      {isLevelComplete && isAllComplete && (
        <AllCompleteModal
          onLevelSelect={onBackToMenu}
          onReplayLevel1000={handleRestart}
        />
      )}
    </div>
  );
}
