'use client';
import { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderItem from './OrderItem';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { useVirtualizer } from '@tanstack/react-virtual';

const ITEM_MIN_WIDTH_MOBILE = 144;
const ITEM_MIN_WIDTH_SM = 192;
const SM_BREAKPOINT = 640;
const GAP = 16;
const ROW_HEIGHT = 340;
export default function OrderItems({ dic }: { dic: NewOrderDictionary }) {
 const {
  initialDataInfo: { isLoading: initLoading },
  itemsInfo: { filteredData, isLoading, isSuccess, searchedItemName },
  userOrder: {
   order: { isError: userOrderIsError },
   orderItems: { isError: userOrderItemsError },
  },
 } = useOrderBaseConfigContext();

 const containerRef = useRef<HTMLDivElement>(null);
 const [columnCount, setColumnCount] = useState(5);

 useLayoutEffect(() => {
  const calculateColumns = () => {
   const container = containerRef.current;
   if (!container) return;

   const width = container.clientWidth - 32;
   const isSmall = window.innerWidth >= SM_BREAKPOINT;
   const minItemWidth = isSmall ? ITEM_MIN_WIDTH_SM : ITEM_MIN_WIDTH_MOBILE;
   const cols = Math.max(1, Math.floor((width + GAP) / (minItemWidth + GAP)));
   setColumnCount(cols);
  };

  calculateColumns();

  const timeoutId = setTimeout(calculateColumns, 100);

  const resizeObserver = new ResizeObserver(calculateColumns);
  if (containerRef.current) {
   resizeObserver.observe(containerRef.current);
  }
  window.addEventListener('resize', calculateColumns);

  return () => {
   clearTimeout(timeoutId);
   resizeObserver.disconnect();
   window.removeEventListener('resize', calculateColumns);
  };
 }, []);

 const rowCount = useMemo(
  () => Math.ceil(filteredData.length / columnCount),
  [filteredData.length, columnCount],
 );

 const rowVirtualizer = useVirtualizer({
  count: rowCount,
  getScrollElement: () => document.querySelector('[data-main-container]'),
  estimateSize: () => ROW_HEIGHT,
  overscan: 2,
 });

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

 if (isLoading || initLoading) {
  return (
   <div className='p-4 pb-10 pt-0'>
    <div className='grid place-content-center pt-10'>
     <Spinner className='size-16 text-primary' />
    </div>
   </div>
  );
 }

 return (
  <div ref={containerRef} className='p-4 pb-10 pt-0'>
   <div
    style={{
     height: `${rowVirtualizer.getTotalSize()}px`,
     width: '100%',
     position: 'relative',
    }}
   >
    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
     const startIndex = virtualRow.index * columnCount;
     const endIndex = Math.min(startIndex + columnCount, filteredData.length);
     const rowItems = filteredData.slice(startIndex, endIndex);

     return (
      <div
       key={virtualRow.key}
       style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
       }}
      >
       <div
        className='grid justify-center gap-4'
        style={{
         gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
       >
        {rowItems.map((itemProgram) => (
         <OrderItem key={itemProgram.id} itemProgram={itemProgram} />
        ))}
       </div>
      </div>
     );
    })}
   </div>
  </div>
 );
}
