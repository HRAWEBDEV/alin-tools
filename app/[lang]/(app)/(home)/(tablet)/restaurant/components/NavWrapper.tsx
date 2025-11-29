'use client';
import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { useTheme } from 'next-themes';

export default function NavWrapper({ children }: { children: ReactNode }) {
 const navClassname =
  'relative hidden lg:flex overflow-hidden shrink-0 basis-(--app-restaurant-nav-width) bg-neutral-100 dark:bg-neutral-900 flex-col border-e border-input';
 const [isMounted, setIsMounted] = useState(false);
 const { resolvedTheme } = useTheme();

 useEffect(() => {
  setIsMounted(true);
 }, []);

 if (!isMounted) return <nav className={navClassname}></nav>;

 return (
  <nav
   style={{
    backgroundImage:
     resolvedTheme === 'light'
      ? `url("data:image/svg+xml,${encodeURIComponent(`
    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='a' patternUnits='userSpaceOnUse' width='69.141' height='40' patternTransform='scale(7) rotate(0)'>
          <rect x='0' y='0' width='100%' height='100%' fill='transparent'/>
          <path d='M69.212 40H46.118L34.57 20 46.118 0h23.094l11.547 20zM57.665 60H34.57L23.023 40 34.57 20h23.095l11.547 20zm0-40H34.57L23.023 0 34.57-20h23.095L69.212 0zM34.57 60H11.476L-.07 40l11.547-20h23.095l11.547 20zm0-40H11.476L-.07 0l11.547-20h23.095L46.118 0zM23.023 40H-.07l-11.547-20L-.07 0h23.094L34.57 20z'
            stroke-width='1' stroke='#ffffff87' fill='none' />
        </pattern>
      </defs>
      <rect width='800%' height='800%' transform='translate(-350,0)' fill='url(#a)'/>
    </svg>
  `)}")`
      : `url("data:image/svg+xml,${encodeURIComponent(`
    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='a' patternUnits='userSpaceOnUse' width='69.141' height='40' patternTransform='scale(7) rotate(0)'>
          <rect x='0' y='0' width='100%' height='100%' fill='transparent'/>
          <path d='M69.212 40H46.118L34.57 20 46.118 0h23.094l11.547 20zM57.665 60H34.57L23.023 40 34.57 20h23.095l11.547 20zm0-40H34.57L23.023 0 34.57-20h23.095L69.212 0zM34.57 60H11.476L-.07 40l11.547-20h23.095l11.547 20zm0-40H11.476L-.07 0l11.547-20h23.095L46.118 0zM23.023 40H-.07l-11.547-20L-.07 0h23.094L34.57 20z'
            stroke-width='1' stroke='#0000001f' fill='none' />
        </pattern>
      </defs>
      <rect width='800%' height='800%' transform='translate(-350,0)' fill='url(#a)'/>
    </svg>
  `)}")`,
   }}
   className={navClassname}
  >
   {children}
  </nav>
 );
}
