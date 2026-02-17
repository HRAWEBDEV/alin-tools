import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
 window.addEventListener('storage', callback);
 window.addEventListener('local-storage', callback);
 return () => {
  window.removeEventListener('storage', callback);
  window.removeEventListener('local-storage', callback);
 };
}

const defaultSnapshot = () => null;

/**
 * Hook to subscribe to localStorage changes.
 * Handles hydration mismatch by returning null on server.
 * Returns null if key doesn't exist.
 */
export function useLocalStorageSync(key: string) {
 const getSnapshot = () => localStorage.getItem(key);

 const storedValue = useSyncExternalStore(
  subscribe,
  getSnapshot,
  defaultSnapshot, // Server snapshot
 );

 return storedValue;
}
