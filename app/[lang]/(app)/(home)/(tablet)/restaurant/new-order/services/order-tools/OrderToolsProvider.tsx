'use client';
import { useState } from 'react';
import { ReactNode } from 'react';
import { type ConfirmOrderType, orderToolsContext } from './orderToolsContext';

export default function OrderToolsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [confirmOrderIsOpen, setConfirmOrderIsOpen] = useState(false);
 const [confirmOrderActiveType, setConfirmOrderActiveType] =
  useState<ConfirmOrderType>('order-info');

 function showConfirmOrder(confirmType?: ConfirmOrderType) {
  setConfirmOrderIsOpen(true);
  setConfirmOrderActiveType(confirmType || 'order-info');
 }

 function closeConfirmOrder() {
  setConfirmOrderIsOpen(true);
  setConfirmOrderActiveType('order-info');
 }

 const ctx = {
  confirmOrderIsOpen,
  confirmOrderActiveType,
  showConfirmOrder,
  closeConfirmOrder,
 };

 return (
  <orderToolsContext.Provider value={ctx}>
   {children}
  </orderToolsContext.Provider>
 );
}
