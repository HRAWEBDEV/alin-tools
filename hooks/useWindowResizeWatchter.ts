import { useEffect, useState } from 'react';
import { useDebouncedCallback } from '@tanstack/react-pacer';

type Breakpoint = keyof typeof breakpoints;
type WindowResizeWatcherUtils = ReturnType<typeof useWindowResizeWatchter>;

const breakpoints = {
 sm: 640,
 md: 768,
 lg: 1024,
 xl: 1280,
 '2xl': 1536,
} as const;

function useWindowResizeWatchter() {
 const [innerWidth, setInnerWidth] = useState(() => {
  // if (typeof window !== undefined) {
  //  return window.innerWidth;
  // }
  return 0;
 });
 const [innerHeight, setInnerHeight] = useState(() => {
  // if (typeof window !== undefined) {
  //  return window.innerHeight;
  // }
  return 0;
 });
 const [resizing, setResizing] = useState(false);

 const debounce = useDebouncedCallback(
  () => {
   setInnerHeight(window.innerHeight);
   setInnerWidth(window.innerWidth);
   setResizing(false);
  },
  {
   wait: 500,
  },
 );

 function isLargerThan(screenSize: Breakpoint): boolean {
  return innerWidth >= breakpoints[screenSize];
 }
 function isSmallerThan(screenSize: Breakpoint): boolean {
  return innerWidth < breakpoints[screenSize];
 }

 useEffect(() => {
  const abortController = new AbortController();
  window.addEventListener(
   'resize',
   () => {
    setResizing(true);
    debounce();
   },
   {
    signal: abortController.signal,
   },
  );
  return () => abortController.abort();
 }, [debounce]);
 return {
  innerHeight,
  innerWidth,
  resizing,
  isLargerThan,
  isSmallerThan,
 };
}

export type { Breakpoint, WindowResizeWatcherUtils };
export { breakpoints, useWindowResizeWatchter };
