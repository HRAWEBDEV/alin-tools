'use client';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export function useTimer(initialSeconds: number) {
 const [remainedTime, setRemainedTime] = useState(initialSeconds);
 const [isRunning, setIsRunning] = useState(false);
 const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

 const clearTimer = useCallback(() => {
  setIsRunning(false);
  if (intervalRef.current !== null) {
   clearInterval(intervalRef.current);
   intervalRef.current = null;
  }
 }, []);

 const start = useCallback(() => {
  clearTimer();
  setIsRunning(true);
  intervalRef.current = setInterval(() => {
   setRemainedTime((prev) => {
    if (prev <= 1) {
     clearTimer();
     return 0;
    }
    return prev - 1;
   });
  }, 1000);
 }, [clearTimer]);

 const stop = useCallback(() => {
  clearTimer();
  setIsRunning(false);
 }, [clearTimer]);

 const reset = useCallback(() => {
  clearTimer();
  setRemainedTime(initialSeconds);
 }, [clearTimer, initialSeconds]);

 useEffect(() => {
  return () => clearTimer();
 }, [clearTimer]);

 const hours = useMemo(() => Math.floor(remainedTime / 3600), [remainedTime]);
 const minutes = useMemo(
  () => Math.floor((remainedTime % 3600) / 60),
  [remainedTime],
 );
 const seconds = useMemo(() => remainedTime % 60, [remainedTime]);

 return {
  remainedTime,
  hours,
  minutes,
  seconds,
  start,
  stop,
  reset,
  isRunning,
 };
}
