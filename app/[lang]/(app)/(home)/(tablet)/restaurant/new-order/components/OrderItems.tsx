'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderItem from './OrderItem';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { AnimatePresence } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderItems({}: { dic: NewOrderDictionary }) {
 const {
  initialDataInfo: { isLoading: initLoading },
  itemsInfo: { data, isLoading },
 } = useOrderBaseConfigContext();
 return (
  <div className='p-4 pt-0 overflow-hidden'>
   <AnimatePresence>
    <div className='grid justify-center gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,10.2rem))] sm:grid-cols-[repeat(auto-fill,minmax(12rem,13rem))]'>
     {isLoading || initLoading
      ? Array.from({ length: 3 }, (_, i) => i).map((i) => (
         <Skeleton key={i} className='h-60 border border-input' />
        ))
      : data?.map((itemProgram) => (
         <OrderItem key={itemProgram.id} itemProgram={itemProgram} />
        ))}
    </div>
   </AnimatePresence>
  </div>
 );
}
