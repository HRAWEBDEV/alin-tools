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
  useState<ConfirmOrderType>('orderInfo');

 function showConfirmOrder(confirmType?: ConfirmOrderType) {
  setConfirmOrderIsOpen(true);
  setConfirmOrderActiveType(confirmType || 'orderInfo');
 }

 function closeConfirmOrder() {
  setConfirmOrderIsOpen(false);
  setConfirmOrderActiveType('orderInfo');
 }

 function changeConfirmType(type: ConfirmOrderType) {
  setConfirmOrderActiveType(type);
 }

 const ctx = {
  confirmOrderIsOpen,
  changeConfirmType,
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
