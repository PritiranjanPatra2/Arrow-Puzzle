import { useState, useEffect, useCallback, useRef } from 'react';
import { getLevelData } from '../game/predefinedLevels.js';
import { checkArrowEscape, getBestHint, getAvailableMoves } from '../game/puzzleValidator.js';
import { sounds } from '../audio/soundEffects.js';

export function useGame(initialLevel = 1, onLevelCompleted = null, onAllCompleted = null) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [levelData, setLevelData] = useState(() => getLevelData(initialLevel));
  const [arrows, setArrows] = useState(() => getLevelData(initialLevel).arrows.map(a => ({ ...a })));
  const [initialArrowCount, setInitialArrowCount] = useState(() => getLevelData(initialLevel).arrows.length);
  
  // Animation and interaction states
  const [animatingArrow, setAnimatingArrow] = useState(null); // { arrow, direction, exitDistance }
  const [blockedArrowId, setBlockedArrowId] = useState(null);
  const [highlightedBlockerIds, setHighlightedBlockerIds] = useState([]);
  const [hintInfo, setHintInfo] = useState(null); // { arrowId, rayCells }
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]); // Stack of previous arrow arrays
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);

  const blockedTimeoutRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  const escapeTimeoutRef = useRef(null);

  // Load a new level
  const loadLevel = useCallback((lvl) => {
    const validLevel = Math.max(1, Math.min(1000, Math.floor(lvl)));
    clearTimeout(blockedTimeoutRef.current);
    clearTimeout(hintTimeoutRef.current);
    clearTimeout(escapeTimeoutRef.current);

    const data = getLevelData(validLevel);
    setCurrentLevel(validLevel);
    setLevelData(data);
    setArrows(data.arrows.map(a => ({ ...a })));
    setInitialArrowCount(data.arrows.length);
    setMoves(0);
    setHistory([]);
    setAnimatingArrow(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
    setHintInfo(null);
    setIsLevelComplete(false);
    setIsAllComplete(false);
  }, []);

  // Handle arrow click
  const handleArrowClick = useCallback((arrowId) => {
    if (isLevelComplete || animatingArrow) return;

    const arrow = arrows.find(a => a.id === arrowId);
    if (!arrow) return;

    // Clear any active hint or blocker highlights
    setHintInfo(null);

    const escapeInfo = checkArrowEscape(arrow, arrows, levelData.boardSize);

    if (escapeInfo.canEscape) {
      // 1. Path is clear -> Arrow escapes!
      sounds.playEscape(1 + Math.min(1.2, (initialArrowCount - arrows.length) * 0.05));
      
      // Save current state for Undo
      setHistory(prev => [...prev, arrows.map(a => ({ ...a }))]);
      setMoves(m => m + 1);

      // Start flight escape animation
      setAnimatingArrow(arrow);

      escapeTimeoutRef.current = setTimeout(() => {
        setArrows(prev => {
          const next = prev.filter(a => a.id !== arrowId);
          if (next.length === 0) {
            // Level is complete!
            setIsLevelComplete(true);
            if (currentLevel === 1000) {
              setIsAllComplete(true);
              sounds.playAllComplete();
              if (onAllCompleted) onAllCompleted(currentLevel, moves + 1);
            } else {
              sounds.playLevelComplete();
              if (onLevelCompleted) onLevelCompleted(currentLevel, moves + 1);
            }
          }
          return next;
        });
        setAnimatingArrow(null);
      }, 260); // 260ms smooth escape animation

    } else {
      // 2. Blocked -> Shake & highlight blockers
      sounds.playBlocked();
      setBlockedArrowId(arrowId);
      setHighlightedBlockerIds(escapeInfo.blockers.map(b => b.id));

      clearTimeout(blockedTimeoutRef.current);
      blockedTimeoutRef.current = setTimeout(() => {
        setBlockedArrowId(null);
        setHighlightedBlockerIds([]);
      }, 500);
    }
  }, [arrows, isLevelComplete, animatingArrow, levelData.boardSize, initialArrowCount, currentLevel, moves, onLevelCompleted, onAllCompleted]);

  // Undo move
  const undo = useCallback(() => {
    if (history.length === 0 || isLevelComplete || animatingArrow) return;

    sounds.playUndo();
    const prevHistory = [...history];
    const previousState = prevHistory.pop();
    
    setHistory(prevHistory);
    setArrows(previousState);
    setMoves(m => Math.max(0, m - 1));
    setHintInfo(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
  }, [history, isLevelComplete, animatingArrow]);

  // Provide Hint
  const requestHint = useCallback(() => {
    if (isLevelComplete || animatingArrow || arrows.length === 0) return;

    const best = getBestHint(arrows, levelData.boardSize);
    if (!best) return;

    sounds.playHint();
    setHintInfo({
      arrowId: best.arrow.id,
      rayCells: best.rayCells
    });

    clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setHintInfo(null);
    }, 2500);
  }, [arrows, levelData.boardSize, isLevelComplete, animatingArrow]);

  // Restart current level
  const restart = useCallback(() => {
    clearTimeout(blockedTimeoutRef.current);
    clearTimeout(hintTimeoutRef.current);
    clearTimeout(escapeTimeoutRef.current);

    setArrows(levelData.arrows.map(a => ({ ...a })));
    setMoves(0);
    setHistory([]);
    setAnimatingArrow(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
    setHintInfo(null);
    setIsLevelComplete(false);
    setIsAllComplete(false);
    sounds.playClick();
  }, [levelData]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(blockedTimeoutRef.current);
      clearTimeout(hintTimeoutRef.current);
      clearTimeout(escapeTimeoutRef.current);
    };
  }, []);

  return {
    currentLevel,
    levelData,
    boardSize: levelData.boardSize,
    arrows,
    initialArrowCount,
    remainingCount: arrows.length,
    moves,
    historyLength: history.length,
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
  };
}
