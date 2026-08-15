import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(autoStart = false) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setSeconds(0);
    setIsActive(true);
    setIsPaused(false);
  }, []);

  return {
    seconds,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    setSeconds
  };
}
