'use client';

import { useEffect, useRef } from 'react';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';

const STORAGE_KEY = 'initialOrderConfig';

export default function InitialOrderTrigger() {
 const { openQuickOrderInfo } = useOrderBaseConfigContext();
 const hasTriggeredRef = useRef(false);
 useEffect(() => {
  if (hasTriggeredRef.current) return;
  if (typeof window !== 'undefined') {
   const stored = localStorage.getItem(STORAGE_KEY);

   if (stored === 'active') {
    openQuickOrderInfo();
    hasTriggeredRef.current = true;
   }
  }
 }, [openQuickOrderInfo]);

 return null;
}
