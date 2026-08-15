import { useState, useEffect, useCallback, useRef } from 'react';
import { getLevelData } from '../game/predefinedLevels.js';
import { checkArrowEscape, getBestHint } from '../game/puzzleValidator.js';
import { sounds } from '../audio/soundEffects.js';

export const MAX_LIFELINES = 5;

export function useGame(initialLevel = 1, onLevelCompleted = null, onAllCompleted = null) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [levelData, setLevelData] = useState(() => getLevelData(initialLevel));
  const [arrows, setArrows] = useState(() => getLevelData(initialLevel).arrows.map(a => ({ ...a })));
  const [initialArrowCount, setInitialArrowCount] = useState(() => getLevelData(initialLevel).arrows.length);
  
  // Lifelines state (5 hearts)
  const [lifelines, setLifelines] = useState(MAX_LIFELINES);
  const [lostHeartIndex, setLostHeartIndex] = useState(null); // for crack/break animation
  
  // Animation and interaction states
  const [animatingArrow, setAnimatingArrow] = useState(null);
  const [blockedArrowId, setBlockedArrowId] = useState(null);
  const [highlightedBlockerIds, setHighlightedBlockerIds] = useState([]);
  const [hintInfo, setHintInfo] = useState(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]); // Stack of previous board snapshots
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

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
    setLifelines(MAX_LIFELINES);
    setLostHeartIndex(null);
    setMoves(0);
    setHistory([]);
    setAnimatingArrow(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
    setHintInfo(null);
    setIsLevelComplete(false);
    setIsAllComplete(false);
    setIsGameOver(false);
  }, []);

  // Handle arrow click
  const handleArrowClick = useCallback((arrowId) => {
    if (isLevelComplete || isGameOver || animatingArrow) return;

    const arrow = arrows.find(a => a.id === arrowId);
    if (!arrow) return;

    setHintInfo(null);

    const escapeInfo = checkArrowEscape(arrow, arrows, levelData.boardSize);

    if (escapeInfo.canEscape) {
      // 1. Path is clear -> Arrow escapes!
      sounds.playEscape(1 + Math.min(1.2, (initialArrowCount - arrows.length) * 0.05));
      
      // Save current state for Undo
      setHistory(prev => [...prev, { arrows: arrows.map(a => ({ ...a })), lifelines }]);
      setMoves(m => m + 1);

      // Flight escape animation
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
              if (onAllCompleted) onAllCompleted(currentLevel, moves + 1, lifelines);
            } else {
              sounds.playLevelComplete();
              if (onLevelCompleted) onLevelCompleted(currentLevel, moves + 1, lifelines);
            }
          }
          return next;
        });
        setAnimatingArrow(null);
      }, 260);

    } else {
      // 2. Blocked Arrow -> Lose a Lifeline / Heart!
      sounds.playHeartLost();
      setBlockedArrowId(arrowId);
      setHighlightedBlockerIds(escapeInfo.blockers.map(b => b.id));

      setLifelines(prev => {
        const next = Math.max(0, prev - 1);
        setLostHeartIndex(prev - 1);
        setTimeout(() => setLostHeartIndex(null), 600);

        if (next === 0) {
          // Out of lifelines -> Game Over!
          setIsGameOver(true);
          sounds.playGameOver();
        }
        return next;
      });

      clearTimeout(blockedTimeoutRef.current);
      blockedTimeoutRef.current = setTimeout(() => {
        setBlockedArrowId(null);
        setHighlightedBlockerIds([]);
      }, 500);
    }
  }, [arrows, isLevelComplete, isGameOver, animatingArrow, levelData.boardSize, initialArrowCount, lifelines, currentLevel, moves, onLevelCompleted, onAllCompleted]);

  // Undo move
  const undo = useCallback(() => {
    if (history.length === 0 || isLevelComplete || isGameOver || animatingArrow) return;

    sounds.playUndo();
    const prevHistory = [...history];
    const previousSnapshot = prevHistory.pop();
    
    setHistory(prevHistory);
    setArrows(previousSnapshot.arrows);
    setMoves(m => Math.max(0, m - 1));
    setHintInfo(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
  }, [history, isLevelComplete, isGameOver, animatingArrow]);

  // Provide Hint
  const requestHint = useCallback(() => {
    if (isLevelComplete || isGameOver || animatingArrow || arrows.length === 0) return;

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
  }, [arrows, levelData.boardSize, isLevelComplete, isGameOver, animatingArrow]);

  // Restart current level
  const restart = useCallback(() => {
    clearTimeout(blockedTimeoutRef.current);
    clearTimeout(hintTimeoutRef.current);
    clearTimeout(escapeTimeoutRef.current);

    setArrows(levelData.arrows.map(a => ({ ...a })));
    setLifelines(MAX_LIFELINES);
    setLostHeartIndex(null);
    setMoves(0);
    setHistory([]);
    setAnimatingArrow(null);
    setBlockedArrowId(null);
    setHighlightedBlockerIds([]);
    setHintInfo(null);
    setIsLevelComplete(false);
    setIsAllComplete(false);
    setIsGameOver(false);
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
    lifelines,
    lostHeartIndex,
    moves,
    historyLength: history.length,
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
  };
}
