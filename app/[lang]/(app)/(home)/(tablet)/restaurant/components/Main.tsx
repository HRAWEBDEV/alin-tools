import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
 return (
  <main className='grow pt-[calc(var(--app-restaurant-header-height)+1rem)] pb-[calc(var(--app-restaurant-tabs-height)+1rem)] lg:py-0 overflow-auto'>
   {children}
  </main>
 );
}
