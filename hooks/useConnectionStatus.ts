import { useState, useEffect } from 'react';

export function useConnectionStatus() {
 const [isOnline, setIsOnline] = useState(true);

 useEffect(() => {
  const controller = new AbortController();
  function updateConnectionStatus() {
   setIsOnline(navigator.onLine);
  }
  window.addEventListener('online', updateConnectionStatus, {
   signal: controller.signal,
  });
  window.addEventListener('offline', updateConnectionStatus, {
   signal: controller.signal,
  });
  return () => {
   controller.abort();
  };
 }, []);
 return { isOnline };
}
