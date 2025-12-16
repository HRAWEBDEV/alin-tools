import { useRef, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { FaSearch } from 'react-icons/fa';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { newOrderKey, getRooms } from '../../services/newOrderApiActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FaUncharted } from 'react-icons/fa6';

export default function FindRooms({ dic }: { dic: NewOrderDictionary }) {
 const containerRef = useRef<HTMLDivElement>(null);

 const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
  queryKey: [newOrderKey, 'rooms'],
  initialPageParam: {
   limit: 20,
   offset: 1,
  },
  async queryFn({ signal, pageParam }) {
   const res = await getRooms({
    signal,
    limit: pageParam.limit,
    offset: pageParam.offset,
   });
   return res.data;
  },
  getNextPageParam(lastPage) {
   const nextOffset = lastPage.offset + 1;
   if (lastPage.offset * lastPage.limit >= lastPage.rowsCount) {
    return undefined;
   }
   return {
    offset: nextOffset,
    limit: lastPage.limit,
   };
  },
  getPreviousPageParam(firstPage) {
   if (firstPage.offset <= 1) {
    return undefined;
   }
   return {
    limit: firstPage.limit,
    offset: firstPage.offset - 1,
   };
  },
 });

 return (
  <DrawerContent className='h-[80svh]'>
   <DrawerHeader className='hidden'>
    <DrawerTitle>{dic.orderInfo.room}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pt-2 pb-4 border-b border-input flex flex-wrap justify-between gap-4'>
    <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
     {dic.orderInfo.room}
    </h1>
    <div className='w-[20rem]'>
     <InputGroup>
      <InputGroupInput type='search' placeholder={dic.findRooms.search} />
      <InputGroupAddon align='inline-end'>
       <FaSearch className='text-primary size-4' />
      </InputGroupAddon>
     </InputGroup>
    </div>
   </div>
   <div
    ref={containerRef}
    className='grow overflow-hidden overflow-y-auto p-4 bg-neutral-100 dark:bg-neutral-900'
   >
    {data?.pages.map((group, i) => (
     <Fragment key={i}>
      <ul className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(14rem,15rem))]'>
       {group.rows.map(({ id, guestFullName, roomLabel }) => (
        <li key={id}>
         <Button
          variant={'outline'}
          className='items-start justify-start text-start h-auto w-full bg-background shadow-md'
         >
          <div className='grid gap-1'>
           <div>
            <span className='text-sm text-neutral-600 dark:text-neutral-400'>
             {dic.findRooms.roomNo}:{' '}
            </span>
            <span className='text-sm'>{roomLabel}</span>
           </div>
           <div>
            <span className='text-sm text-neutral-600 dark:text-neutral-400'>
             {dic.findRooms.guestName}:{' '}
            </span>
            <span className='text-sm'>{guestFullName}</span>
           </div>
          </div>
         </Button>
        </li>
       ))}
      </ul>
     </Fragment>
    ))}
   </div>
  </DrawerContent>
 );
}
