import { useEffect, useState } from 'react';

export function useScrollWatcher() {
 const [scrollTop, setScrollTop] = useState(0);
 useEffect(() => {
  const watcherAbort = new AbortController();
  const mainContainer = document.querySelector(
   '[data-main-container]',
  ) as HTMLHtmlElement;
  if (!mainContainer) return;
  mainContainer.addEventListener(
   'scroll',
   () => {
    setScrollTop(mainContainer.scrollTop);
   },
   {
    signal: watcherAbort.signal,
   },
  );
  return () => watcherAbort.abort();
 }, []);
 return {
  scrollTop,
 };
}
