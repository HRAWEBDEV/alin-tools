import { useRef, Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import { FaSearch } from 'react-icons/fa';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { newOrderKey, getRooms } from '../../services/newOrderApiActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { IoReloadOutline } from 'react-icons/io5';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import Highlighter from 'react-highlight-words';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useFormContext } from 'react-hook-form';
import { OrderInfo } from '../../schemas/orderInfoSchema';
import { SaleTypes } from '../../utils/SaleTypes';
import { Label } from '@/components/ui/label';

export default function FindRooms({ dic }: { dic: NewOrderDictionary }) {
 const { setValue, watch, clearErrors } = useFormContext<OrderInfo>();
 const containerRef = useRef<HTMLDivElement>(null);
 const [searchedText, setSearchedText] = useState('');
 const [showAllGuests, setShowAllGuests] = useState(false);
 const [debouncedSearch] = useDebouncedValue(searchedText, {
  wait: 200,
 });
 const [dbShowAllGuests] = useDebouncedValue(showAllGuests, {
  wait: 200,
 });

 const saleTypeValue = watch('saleType');

 const { data, hasNextPage, fetchNextPage, isFetching, refetch, isSuccess } =
  useInfiniteQuery({
   enabled: saleTypeValue?.key === SaleTypes.room,
   queryKey: [
    newOrderKey,
    'rooms',
    debouncedSearch || 'all',
    String(dbShowAllGuests),
   ],
   initialPageParam: {
    limit: 300,
    offset: 1,
   },
   async queryFn({ signal, pageParam }) {
    const res = await getRooms({
     signal,
     limit: pageParam.limit,
     offset: pageParam.offset,
     showAllGuests: dbShowAllGuests,
     searchText: debouncedSearch,
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
  <DrawerContent className='h-[min(80svh,35rem)]'>
   <DrawerHeader className='hidden'>
    <DrawerTitle>{dic.orderInfo.room}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pt-2 pb-4 border-b border-input flex flex-wrap justify-between gap-4'>
    <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
     {dic.orderInfo.room}{' '}
     <span className='text-lg'>
      ({dic.findRooms.result}: {data?.pages[0].rowsCount})
     </span>
    </h1>
    <div className='w-100 grid grid-cols-[1fr_max-content_max-content] gap-4'>
     <InputGroup>
      <InputGroupInput
       type='search'
       placeholder={dic.findRooms.search}
       value={searchedText}
       onChange={(e) => setSearchedText(e.target.value)}
      />
      <InputGroupAddon align='inline-end'>
       <FaSearch className='text-primary size-4' />
      </InputGroupAddon>
     </InputGroup>
     <div className='flex gap-2 items-center'>
      <Switch
       checked={showAllGuests}
       onCheckedChange={(value) => setShowAllGuests(value)}
       style={{
        direction: 'ltr',
       }}
       id='all-guests'
       className='scale-125'
      />
      <Label htmlFor='all-guests'>{dic.findRooms.allGuests}</Label>
     </div>
     <Button
      disabled={isFetching}
      variant='outline'
      size='icon'
      onClick={() => refetch()}
      className='text-primary'
     >
      <IoReloadOutline className='size-5' />
     </Button>
    </div>
   </div>
   <div
    ref={(ref) => {
     containerRef.current = ref;
    }}
    className='grow overflow-hidden overflow-y-auto pt-0 p-4 bg-neutral-100 dark:bg-neutral-900'
   >
    <div className='mb-4 opacity-50'>
     {isFetching ? <LinearLoading /> : <div className='h-[6px]'></div>}
    </div>
    <div className='w-[min(100%,80rem)] mx-auto'>
     {isSuccess && !data.pages.length ? (
      <NoItemFound />
     ) : (
      <ul className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(14rem,15rem))]'>
       {data?.pages.map((group, i) => (
        <Fragment key={i}>
         {group.rows.map(({ id, registerID, guestFullName, roomLabel }) => (
          <li key={id}>
           <DrawerClose asChild>
            <Button
             variant={'outline'}
             className='py-4 items-start justify-start text-start w-full whitespace-normal bg-background shadow-md rounded-lg h-full'
             onClick={() => {
              setValue('room', {
               key: registerID.toString(),
               value: roomLabel,
               customerName: guestFullName,
              });
              clearErrors(['room']);
             }}
            >
             <div className='grid gap-1'>
              <div>
               <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                {dic.findRooms.roomNo}:{' '}
               </span>
               <Highlighter
                searchWords={[debouncedSearch]}
                textToHighlight={roomLabel}
               />
              </div>
              <div>
               <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                {dic.findRooms.guestName}:{' '}
               </span>
               <Highlighter
                searchWords={[debouncedSearch]}
                textToHighlight={guestFullName}
               />
              </div>
             </div>
            </Button>
           </DrawerClose>
          </li>
         ))}
        </Fragment>
       ))}
      </ul>
     )}
    </div>
    {hasNextPage && (
     <div className='p-4 grid place-content-center'>
      <Button
       disabled={isFetching}
       size='lg'
       className='w-36'
       onClick={() => fetchNextPage()}
      >
       {dic.findRooms.loadMore}
      </Button>
     </div>
    )}
   </div>
  </DrawerContent>
 );
}
