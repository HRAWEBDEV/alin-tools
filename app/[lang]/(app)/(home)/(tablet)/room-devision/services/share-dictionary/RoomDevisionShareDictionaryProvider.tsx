'use client';
import { ReactNode } from 'react';
import {
 type Store,
 shareDictionaryContext,
} from './roomDevisionShareDictionaryContext';

export default function RoomDevisionShareDictionaryProvider({
 children,
 ...store
}: { children: ReactNode } & Store) {
 return (
  <shareDictionaryContext.Provider value={store}>
   {children}
  </shareDictionaryContext.Provider>
 );
}
