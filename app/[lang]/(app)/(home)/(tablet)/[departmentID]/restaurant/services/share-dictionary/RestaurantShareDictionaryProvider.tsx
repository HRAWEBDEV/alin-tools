'use client';
import { ReactNode } from 'react';
import {
 type Store,
 shareDictionaryContext,
} from './restaurantShareDictionaryContext';

export default function ResturantShareDictionaryProvider({
 children,
 ...store
}: { children: ReactNode } & Store) {
 return (
  <shareDictionaryContext.Provider value={store}>
   {children}
  </shareDictionaryContext.Provider>
 );
}
