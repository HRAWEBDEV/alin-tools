import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
 return (
  <main className='grow pt-(--app-restaurant-header-height) pb-(--app-restaurant-tabs-height) lg:py-0 overflow-auto'>
   {children}
  </main>
 );
}
