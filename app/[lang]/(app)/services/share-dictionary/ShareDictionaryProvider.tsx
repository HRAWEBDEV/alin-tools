'use client';
import { ReactNode } from 'react';
import { type Store, shareDictionaryContext } from './shareDictionaryContext';

export default function ShareDictionaryProvider({
 children,
 ...store
}: { children: ReactNode } & Store) {
 return (
  <shareDictionaryContext.Provider value={store}>
   {children}
  </shareDictionaryContext.Provider>
 );
}
