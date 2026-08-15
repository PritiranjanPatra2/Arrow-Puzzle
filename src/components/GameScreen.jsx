import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame.js';
import { useTimer } from '../hooks/useTimer.js';
import { calculateStars, calculateLevelPoints } from '../utils/scoring.js';
import { GameHeader } from './GameHeader.jsx';
import { GameBoard } from './GameBoard.jsx';
import { GameControls } from './GameControls.jsx';
import { PauseModal } from './PauseModal.jsx';
import { GameOverModal } from './GameOverModal.jsx';
import { LevelCompleteModal } from './LevelCompleteModal.jsx';
import { AllCompleteModal } from './AllCompleteModal.jsx';

export function GameScreen({
  level,
  score = 0,
  bestStarsForLevel = 0,
  onCompleteLevelSave,
  onBackToMenu,
  onOpenSettings
}) {
  const timer = useTimer(true);
  const [isPaused, setIsPaused] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [pointsBreakdown, setPointsBreakdown] = useState(null);

  const {
    currentLevel,
    levelData,
    boardSize,
    arrows,
    initialArrowCount,
    remainingCount,
    lifelines,
    lostHeartIndex,
    moves,
    historyLength,
    animatingArrow,
    blockedArrowId,
    highlightedBlockerIds,
    hintInfo,
    isLevelComplete,
    isAllComplete,
    isGameOver,
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

  // When level completes, pause timer, calculate stars & points breakdown
  useEffect(() => {
    if (isLevelComplete) {
      timer.stop();
      const stars = calculateStars(
        moves,
        initialArrowCount,
        timer.seconds,
        levelData.difficulty.parTimeSeconds
      );
      const points = calculateLevelPoints(
        currentLevel,
        stars,
        lifelines,
        timer.seconds,
        levelData.difficulty.parTimeSeconds
      );
      setEarnedStars(stars);
      setPointsBreakdown(points);
      onCompleteLevelSave(currentLevel, stars, moves, timer.seconds, lifelines, points.totalPoints);
    }
  }, [isLevelComplete, moves, initialArrowCount, lifelines, timer.seconds, levelData.difficulty.parTimeSeconds, currentLevel, onCompleteLevelSave]);

  // Stop timer on game over
  useEffect(() => {
    if (isGameOver) {
      timer.stop();
    }
  }, [isGameOver, timer]);

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
        lifelines={lifelines}
        lostHeartIndex={lostHeartIndex}
        score={score}
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
        disabled={isLevelComplete || isGameOver || isPaused}
      />

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={onBackToMenu}
        />
      )}

      {/* Game Over (0 lifelines) Modal */}
      {isGameOver && (
        <GameOverModal
          level={currentLevel}
          onRestart={handleRestart}
          onExit={onBackToMenu}
        />
      )}

      {/* Standard Level Complete Modal */}
      {isLevelComplete && !isAllComplete && (
        <LevelCompleteModal
          level={currentLevel}
          stars={earnedStars}
          moves={moves}
          timeSeconds={timer.seconds}
          pointsBreakdown={pointsBreakdown}
          lifelinesRemaining={lifelines}
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
