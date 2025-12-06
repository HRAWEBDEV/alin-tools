'use client';
import { ReactNode, RefObject } from 'react';
import {
 type MainWrapperSetup,
 mainWrapperSetupContext,
} from './mainWrapperSetupContext';

export default function MainWrapperSetupProvider({
 children,
 mainWrapperRef,
}: {
 children: ReactNode;
 mainWrapperRef: RefObject<HTMLDivElement | null>;
}) {
 function scrollToTop() {
  if (!mainWrapperRef.current) return;
  mainWrapperRef.current.scrollTop = 0;
 }

 const ctx: MainWrapperSetup = {
  scrollToTop,
 };

 return (
  <mainWrapperSetupContext.Provider value={ctx}>
   {children}
  </mainWrapperSetupContext.Provider>
 );
}
