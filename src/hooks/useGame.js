import { useState, useEffect, useCallback, useRef } from 'react';
import { getLevelData } from '../game/predefinedLevels.js';
import { checkArrowEscape, getBestHint, createCellMap } from '../game/puzzleValidator.js';
import { sounds } from '../audio/soundEffects.js';

export const MAX_LIFELINES = 5;

export function useGame(initialLevel = 1, onLevelCompleted = null, onAllCompleted = null) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [levelData, setLevelData] = useState(() => getLevelData(initialLevel));
  const [arrows, setArrows] = useState(() => getLevelData(initialLevel).arrows.map(a => ({ ...a })));
  const [initialArrowCount, setInitialArrowCount] = useState(() => getLevelData(initialLevel).arrows.length);
  
  // Lifelines state (5 hearts)
  const [lifelines, setLifelines] = useState(MAX_LIFELINES);
  const [lostHeartIndex, setLostHeartIndex] = useState(null);
  
  // Animation and interaction states
  const [animatingArrowIds, setAnimatingArrowIds] = useState(new Set());
  const [blockedArrowId, setBlockedArrowId] = useState(null);
  const [highlightedBlockerIds, setHighlightedBlockerIds] = useState([]);
  const [hintInfo, setHintInfo] = useState(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const blockedTimeoutRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  
  // Ref for live arrows to prevent stale closures on rapid successive taps
  const arrowsRef = useRef(arrows);
  arrowsRef.current = arrows;

  // Track currently escaping arrows in a Ref for instant zero-lag collision updates
  const escapingIdsRef = useRef(new Set());

  // Load a new level
  const loadLevel = useCallback((lvl) => {
    const validLevel = Math.max(1, Math.min(1000, Math.floor(lvl)));
    clearTimeout(blockedTimeoutRef.current);
    clearTimeout(hintTimeoutRef.current);

    const data = getLevelData(validLevel);
    setCurrentLevel(validLevel);
    setLevelData(data);
    const freshArrows = data.arrows.map(a => ({ ...a }));
    setArrows(freshArrows);
    arrowsRef.current = freshArrows;
    escapingIdsRef.current.clear();
    setInitialArrowCount(data.arrows.length);
    setLifelines(MAX_LIFELINES);
    setLostHeartIndex(null);
    setMoves(0);
    setHistory([]);
    setAnimatingArrowIds(new Set());
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
    setHintInfo(null);
    setIsLevelComplete(false);
    setIsAllComplete(false);
    setIsGameOver(false);
  }, []);

  // Handle arrow click: Instant responsive click evaluation with zero collision race conditions
  const handleArrowClick = useCallback((arrowId) => {
    if (isLevelComplete || isGameOver) return;
    
    // Ignore if this specific arrow is already escaping
    if (escapingIdsRef.current.has(arrowId)) return;

    const currentActiveArrows = arrowsRef.current.filter(a => !escapingIdsRef.current.has(a.id));
    const targetArrow = currentActiveArrows.find(a => a.id === arrowId);
    if (!targetArrow) return;

    if (hintInfo) setHintInfo(null);

    // Evaluate escape against current active non-escaping arrows
    const escapeInfo = checkArrowEscape(targetArrow, currentActiveArrows, levelData.boardSize);

    if (escapeInfo.canEscape) {
      // 1. Path is clear -> Arrow escapes immediately on 1st tap!
      escapingIdsRef.current.add(arrowId);
      
      sounds.playEscape(1 + Math.min(1.2, (initialArrowCount - currentActiveArrows.length) * 0.05));
      
      // Save current state for Undo
      setHistory(prev => [...prev, { arrows: arrowsRef.current.map(a => ({ ...a })), lifelines }]);
      setMoves(m => m + 1);

      // Trigger visual GPU flight animation
      setAnimatingArrowIds(prev => new Set([...prev, arrowId]));

      // Remove from visual arrows after animation completes
      setTimeout(() => {
        setArrows(prev => {
          const next = prev.filter(a => a.id !== arrowId);
          arrowsRef.current = next;
          escapingIdsRef.current.delete(arrowId);

          if (next.length === 0) {
            setIsLevelComplete(true);
            if (currentLevel === 1000) {
              setIsAllComplete(true);
              sounds.playAllComplete();
              if (onAllCompleted) onAllCompleted(currentLevel, moves + 1, lifelines);
            } else {
              sounds.playLevelComplete();
              if (onLevelCompleted) onLevelCompleted(currentLevel, moves + 1, lifelines);
            }
          }
          return next;
        });

        setAnimatingArrowIds(prev => {
          const next = new Set(prev);
          next.delete(arrowId);
          return next;
        });
      }, 250);

    } else {
      // 2. Blocked Arrow -> Lose a Lifeline / Heart!
      sounds.playHeartLost();
      setBlockedArrowId(arrowId);
      setHighlightedBlockerIds(escapeInfo.blockers.map(b => b.id));

      setLifelines(prev => {
        const next = Math.max(0, prev - 1);
        setLostHeartIndex(prev - 1);
        setTimeout(() => setLostHeartIndex(null), 500);

        if (next === 0) {
          setIsGameOver(true);
          sounds.playGameOver();
        }
        return next;
      });

      clearTimeout(blockedTimeoutRef.current);
      blockedTimeoutRef.current = setTimeout(() => {
        setBlockedArrowId(null);
        setHighlightedBlockerIds([]);
      }, 450);
    }
  }, [isLevelComplete, isGameOver, levelData.boardSize, initialArrowCount, lifelines, currentLevel, moves, hintInfo, onLevelCompleted, onAllCompleted]);

  // Undo move
  const undo = useCallback(() => {
    if (history.length === 0 || isLevelComplete || isGameOver || escapingIdsRef.current.size > 0) return;

    sounds.playUndo();
    const prevHistory = [...history];
    const previousSnapshot = prevHistory.pop();
    
    setHistory(prevHistory);
    setArrows(previousSnapshot.arrows);
    arrowsRef.current = previousSnapshot.arrows;
    escapingIdsRef.current.clear();
    setAnimatingArrowIds(new Set());
    setMoves(m => Math.max(0, m - 1));
    setHintInfo(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
    setLifelines(previousSnapshot.lifelines);
  }, [history, isLevelComplete, isGameOver]);

  // Request Hint
  const requestHint = useCallback(() => {
    if (isLevelComplete || isGameOver) return;

    const currentActiveArrows = arrowsRef.current.filter(a => !escapingIdsRef.current.has(a.id));
    const best = getBestHint(currentActiveArrows, levelData.boardSize);
    if (!best || !best.arrow) return;

    sounds.playHint();
    setHintInfo(best);

    clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setHintInfo(null);
    }, 4000);
  }, [isLevelComplete, isGameOver, levelData.boardSize]);

  // Restart level
  const restart = useCallback(() => {
    loadLevel(currentLevel);
  }, [loadLevel, currentLevel]);

  // Next level
  const nextLevel = useCallback(() => {
    if (currentLevel < 1000) {
      loadLevel(currentLevel + 1);
    }
  }, [loadLevel, currentLevel]);

  return {
    currentLevel,
    levelData,
    boardSize: levelData?.boardSize || 5,
    arrows,
    initialArrowCount,
    remainingCount: arrows.length,
    lifelines,
    lostHeartIndex,
    moves,
    historyLength: history.length,
    animatingArrowIds,
    blockedArrowId,
    highlightedBlockerIds,
    hintInfo,
    isLevelComplete,
    isAllComplete,
    isGameOver,
    canUndo: history.length > 0 && !isLevelComplete && !isGameOver,
    handleArrowClick,
    undo,
    requestHint,
    restart,
    nextLevel,
    loadLevel
  };
}
