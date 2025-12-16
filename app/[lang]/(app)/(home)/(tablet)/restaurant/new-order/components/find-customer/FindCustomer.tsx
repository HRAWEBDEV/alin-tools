import { useRef, Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { newOrderKey, getCustomers } from '../../services/newOrderApiActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { IoReloadOutline } from 'react-icons/io5';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import Highlighter from 'react-highlight-words';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useFormContext } from 'react-hook-form';
import { OrderInfo } from '../../schemas/orderInfoSchema';
import { SaleTypes } from '../../utils/SaleTypes';

export default function FindCustomer({ dic }: { dic: NewOrderDictionary }) {
 const { setValue, getValues } = useFormContext<OrderInfo>();
 const containerRef = useRef<HTMLDivElement>(null);
 const [searchedText, setSearchedText] = useState('');
 const [debouncedSearch] = useDebouncedValue(searchedText, {
  wait: 200,
 });

 const { data, hasNextPage, fetchNextPage, isFetching, refetch, isSuccess } =
  useInfiniteQuery({
   enabled: getValues('saleType')?.key !== SaleTypes.room,
   queryKey: [newOrderKey, 'customers', debouncedSearch],
   initialPageParam: {
    limit: 300,
    offset: 1,
   },
   async queryFn({ signal, pageParam }) {
    const res = await getCustomers({
     signal,
     limit: pageParam.limit,
     offset: pageParam.offset,
     searchPhrase: debouncedSearch,
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
    <DrawerTitle>{dic.orderInfo.customer}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pt-2 pb-4 border-b border-input flex flex-wrap justify-between gap-4'>
    <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
     {dic.orderInfo.customer}
    </h1>
    <div className='w-[20rem] grid grid-cols-[1fr_max-content] gap-2'>
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
     <Button
      disabled={isFetching}
      variant='outline'
      size='icon'
      onClick={() => refetch()}
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
         {group.rows.map(({ id, name, code }) => (
          <li key={id}>
           <DrawerClose asChild>
            <Button
             variant={'outline'}
             className='items-start justify-start text-start h-auto w-full bg-background shadow-md'
             onClick={() => {
              setValue('customer', {
               key: id.toString(),
               value: name,
               code: code.toString(),
              });
             }}
            >
             <div className='grid gap-1'>
              <div>
               <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                {dic.findCustomer.code}:{' '}
               </span>
               <Highlighter
                className='text-sm'
                searchWords={[debouncedSearch]}
                textToHighlight={code.toString()}
               />
              </div>
              <div>
               <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                {dic.findCustomer.name}:{' '}
               </span>
               <Highlighter
                className='text-sm'
                searchWords={[debouncedSearch]}
                textToHighlight={name.toString()}
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
