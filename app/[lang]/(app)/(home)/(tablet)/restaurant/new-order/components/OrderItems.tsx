'use client';
import { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderItem from './OrderItem';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { useVirtualizer } from '@tanstack/react-virtual';

// Item width bounds (from grid-cols classes: minmax(9rem,10.2rem) / minmax(12rem,13rem))
const ITEM_MIN_WIDTH_MOBILE = 144; // 9rem
const ITEM_MIN_WIDTH_SM = 192; // 12rem
const SM_BREAKPOINT = 640;
const GAP = 16; // gap-4
const ROW_HEIGHT = 310; // min-h-60 (240px) + pt-17 (68px) + gap

export default function OrderItems({ dic }: { dic: NewOrderDictionary }) {
 const {
  initialDataInfo: { isLoading: initLoading },
  itemsInfo: { filteredData, isLoading, isSuccess, searchedItemName },
  userOrder: {
   order: { isError: userOrderIsError },
   orderItems: { isError: userOrderItemsError },
  },
 } = useOrderBaseConfigContext();

 const scrollRef = useRef<HTMLDivElement>(null);
 const [columnCount, setColumnCount] = useState(1); // Default to 1 instead of null

 // Calculate column count based on container width
 useLayoutEffect(() => {
  const container = scrollRef.current;
  if (!container) return;

  const calculateColumns = () => {
   const width = container.clientWidth - 32; // subtract padding (p-4 = 16px each side)
   const isSmall = window.innerWidth >= SM_BREAKPOINT;
   const minItemWidth = isSmall ? ITEM_MIN_WIDTH_SM : ITEM_MIN_WIDTH_MOBILE;
   const cols = Math.max(1, Math.floor((width + GAP) / (minItemWidth + GAP)));
   setColumnCount(cols);
  };

  calculateColumns();

  const resizeObserver = new ResizeObserver(calculateColumns);
  resizeObserver.observe(container);

  // Also listen for window resize for breakpoint changes
  window.addEventListener('resize', calculateColumns);

  return () => {
   resizeObserver.disconnect();
   window.removeEventListener('resize', calculateColumns);
  };
 }, []);

 // Calculate row count
 const rowCount = useMemo(
  () => Math.ceil(filteredData.length / columnCount),
  [filteredData.length, columnCount],
 );

 const rowVirtualizer = useVirtualizer({
  count: rowCount,
  getScrollElement: () => scrollRef.current,
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

 // Always render the container with ref, show loading inside
 return (
  <div
   ref={scrollRef}
   className='p-4 pb-10 pt-0 overflow-auto h-[calc(100vh-200px)] scrollbar-hide'
  >
   {isLoading || initLoading ? (
    <div className='grid place-content-center pt-10'>
     <Spinner className='size-16 text-primary' />
    </div>
   ) : (
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
          gridTemplateColumns: `repeat(${columnCount}, minmax(${
           window.innerWidth >= SM_BREAKPOINT ? '12rem' : '9rem'
          }, ${window.innerWidth >= SM_BREAKPOINT ? '13rem' : '10.2rem'}))`,
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
   )}
  </div>
 );
}
