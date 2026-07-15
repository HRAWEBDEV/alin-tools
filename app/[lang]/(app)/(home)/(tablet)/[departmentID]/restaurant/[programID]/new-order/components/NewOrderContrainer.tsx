'use client';
import { ReactNode } from 'react';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import SplitPanel from './split-panel/SplitPanel';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

export default function NewOrderContrainer({
 children,
 dic,
}: {
 children: ReactNode;
 dic: NewOrderDictionary;
}) {
 const { showSplitPanel } = useOrderBaseConfigContext();
 return (
  <div
   data-active-split={showSplitPanel}
   className='sm:data-[active-split="true"]:pe-(--app-restaurant-nav-width)'
  >
   {children}
   {showSplitPanel && <SplitPanel dic={dic} />}
  </div>
 );
}
