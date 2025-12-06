'use client';
import { ReactNode, useEffect, useState, useRef } from 'react';
import {
 type MainWrapperSetup,
 type ScrollDirection,
 mainWrapperSetupContext,
} from './mainWrapperSetupContext';
import { useDebouncedCallback } from '@tanstack/react-pacer';

export default function MainWrapperSetupProvider({
 children,
}: {
 children: ReactNode;
}) {
 const mainWrapperRef = useRef<HTMLDivElement>(null);
 const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');
 const [scrollTop, setScrollTop] = useState<number>(0);

 const debouncer = useDebouncedCallback(
  () => {
   if (!mainWrapperRef.current) return;
   const newScrollTop = mainWrapperRef.current.scrollTop;
   const scrollOffset = newScrollTop - scrollTop;
   let newScrollDirection: ScrollDirection = 'up';
   if (newScrollTop && Math.abs(scrollOffset) < 80) {
    return;
   }
   if (newScrollTop === 0 || scrollOffset < 0) {
    newScrollDirection = 'up';
   } else {
    newScrollDirection = 'down';
   }
   document.documentElement.setAttribute(
    'data-scroll-dicretion',
    newScrollDirection,
   );
   setScrollDirection(newScrollDirection);
   setScrollTop(newScrollTop);
  },
  {
   wait: 500,
  },
 );

 function scrollToTop() {
  if (!mainWrapperRef.current) return;
  mainWrapperRef.current.scrollTop = 0;
 }

 const ctx: MainWrapperSetup = {
  scrollTop,
  scrollDirection,
  scrollToTop,
 };

 useEffect(() => {
  if (!mainWrapperRef.current) return;
  const abortController = new AbortController();
  document.documentElement.setAttribute('data-scroll-dicretion', 'up');
  mainWrapperRef.current!.addEventListener(
   'scroll',
   () => {
    debouncer();
   },
   {
    signal: abortController.signal,
   },
  );
  return () => {
   abortController.abort();
  };
 }, [mainWrapperRef, debouncer]);

 return (
  <mainWrapperSetupContext.Provider value={ctx}>
   <main
    ref={mainWrapperRef}
    data-main-container
    className={`scroll-smooth grow pt-(--app-restaurant-header-height) pb-(--app-restaurant-tabs-height) lg:py-0 overflow-auto`}
   >
    {children}
   </main>
  </mainWrapperSetupContext.Provider>
 );
}
