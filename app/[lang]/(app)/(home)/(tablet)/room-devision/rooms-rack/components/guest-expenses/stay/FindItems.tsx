import { useRef, Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
// import { FaSearch } from 'react-icons/fa';
// import {
//  InputGroup,
//  InputGroupInput,
//  InputGroupAddon,
// } from '@/components/ui/input-group';
import {
 type StayExpenseItem,
 getStayExpenseItemsApi,
 getStayExpenseItems,
} from '../../../services/guest-expenses/guestExpensesApiActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { IoReloadOutline } from 'react-icons/io5';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import Highlighter from 'react-highlight-words';
import { useDebouncedValue } from '@tanstack/react-pacer';

export default function FindItems({
 dic,
 onChangeItem,
}: {
 dic: RoomsRackDictionary;
 onChangeItem: (item: StayExpenseItem) => unknown;
}) {
 const containerRef = useRef<HTMLDivElement>(null);
 const [searchedText, setSearchedText] = useState('');
 const [debouncedSearch] = useDebouncedValue(searchedText, {
  wait: 200,
 });

 const { data, hasNextPage, fetchNextPage, isFetching, refetch, isSuccess } =
  useInfiniteQuery({
   queryKey: [getStayExpenseItemsApi, debouncedSearch],
   initialPageParam: {
    limit: 100,
    offset: 1,
   },
   async queryFn({ signal, pageParam }) {
    const res = await getStayExpenseItems({
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
  <DrawerContent className='h-[min(80svh,35rem)]'>
   <DrawerHeader className='hidden'>
    <DrawerTitle>{dic.guestExpensesStay.item}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pt-2 pb-4 border-b border-input flex flex-wrap justify-between gap-4'>
    <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
     {dic.guestExpensesStay.item}
    </h1>
    <div>
     {/*<InputGroup>
      <InputGroupInput
       type='search'
       placeholder={dic.findRooms.search}
       value={searchedText}
       onChange={(e) => setSearchedText(e.target.value)}
      />
      <InputGroupAddon align='inline-end'>
       <FaSearch className='text-primary size-4' />
      </InputGroupAddon>
     </InputGroup>*/}
     <Button
      disabled={isFetching}
      variant='outline'
      size='icon'
      className='text-primary'
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
      <ul className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(16rem,18rem))]'>
       {data?.pages.map((group, i) => (
        <Fragment key={i}>
         {group.rows.map((item) => (
          <li key={item.itemID} className='bg-background shadow-md rounded-lg'>
           <DrawerClose asChild>
            <Button
             variant={'outline'}
             className='py-4 items-start justify-start text-start w-full whitespace-normal bg-background shadow-md rounded-lg h-full'
             onClick={() => {
              onChangeItem(item);
             }}
            >
             <div>
              <Highlighter
               searchWords={[debouncedSearch]}
               textToHighlight={(item.itemName || '').toString()}
              />
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
       {dic.guestExpensesStay.loadMore}
      </Button>
     </div>
    )}
   </div>
  </DrawerContent>
 );
}
