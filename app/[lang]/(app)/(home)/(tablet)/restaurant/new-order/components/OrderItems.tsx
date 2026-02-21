'use client';
import { useRef } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderItem from './OrderItem';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { AnimatePresence } from 'motion/react';
import { Spinner } from '@/components/ui/spinner';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function OrderItems({ dic }: { dic: NewOrderDictionary }) {
 const {
  initialDataInfo: { isLoading: initLoading },
  itemsInfo: { filteredData, isLoading, isSuccess, searchedItemName },
  userOrder: {
   order: { isError: userOrderIsError },
   orderItems: { isError: userOrderItemsError },
  },
 } = useOrderBaseConfigContext();

 if (userOrderItemsError || userOrderIsError) {
  return <UnExpectedError />;
 }

 if (isSuccess && !filteredData.length) {
  return (
   <div className='flex flex-col items-center'>
    <NoItemFound />
    {searchedItemName && (
     <div className='text-neutral-600 dark:text-neutral-400'>
      <span>{dic.tools.search}: </span>
      <span>{searchedItemName}</span>
     </div>
    )}
   </div>
  );
 }

 return (
  <div className='p-4 pb-10 pt-0 overflow-hidden'>
   <AnimatePresence>
    <div className='grid justify-center gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,10.2rem))] sm:grid-cols-[repeat(auto-fill,minmax(12rem,13rem))]'>
     {isLoading || initLoading ? (
      <div className='grid place-content-center col-span-full pt-10'>
       <Spinner className='size-16 text-primary' />
      </div>
     ) : (
      filteredData?.map((itemProgram) => (
       <OrderItem key={itemProgram.id} itemProgram={itemProgram} />
      ))
     )}
    </div>
   </AnimatePresence>
  </div>
 );
}
