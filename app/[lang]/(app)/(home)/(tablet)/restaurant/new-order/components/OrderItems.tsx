'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderItem from './OrderItem';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { AnimatePresence } from 'motion/react';
import { Spinner } from '@/components/ui/spinner';

export default function OrderItems({}: { dic: NewOrderDictionary }) {
 const {
  initialDataInfo: { isLoading: initLoading },
  itemsInfo: { data, isLoading },
 } = useOrderBaseConfigContext();
 return (
  <div className='p-4 pt-0 overflow-hidden'>
   <AnimatePresence>
    <div className='grid justify-center gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,10.2rem))] sm:grid-cols-[repeat(auto-fill,minmax(12rem,13rem))]'>
     {isLoading || initLoading ? (
      <div className='grid place-content-center col-span-full pt-10'>
       <Spinner className='size-16 text-primary' />
      </div>
     ) : (
      data?.map((itemProgram) => (
       <OrderItem key={itemProgram.id} itemProgram={itemProgram} />
      ))
     )}
    </div>
   </AnimatePresence>
  </div>
 );
}
