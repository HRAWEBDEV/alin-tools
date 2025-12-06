'use client';
import { ReactNode, useRef } from 'react';
import MainWrapperSetupProvider from '../services/main-wrapper-setup/MainWrapperSetupProvider';

export default function Main({ children }: { children: ReactNode }) {
 const mainWrapperRef = useRef<HTMLDivElement>(null);
 return (
  <MainWrapperSetupProvider mainWrapperRef={mainWrapperRef}>
   <main
    ref={mainWrapperRef}
    data-main-container
    className='scroll-smooth grow pt-(--app-restaurant-header-height) pb-(--app-restaurant-tabs-height) lg:py-0 overflow-auto'
   >
    {children}
   </main>
  </MainWrapperSetupProvider>
 );
}
