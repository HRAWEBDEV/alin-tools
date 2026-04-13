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
import {
 newOrderKey,
 getCustomerContract,
} from '../../services/newOrderApiActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { IoReloadOutline } from 'react-icons/io5';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useFormContext } from 'react-hook-form';
import { OrderInfo } from '../../schemas/orderInfoSchema';
import { NumericFormat } from 'react-number-format';

export default function FindCustomerContract({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const { setValue } = useFormContext<OrderInfo>();
 const containerRef = useRef<HTMLDivElement>(null);
 const [searchedText, setSearchedText] = useState('');
 const [code, setCode] = useState('');
 const [debouncedSearch] = useDebouncedValue(searchedText, {
  wait: 200,
 });
 const [debouncedCode] = useDebouncedValue(code, {
  wait: 200,
 });

 const { data, hasNextPage, fetchNextPage, isFetching, refetch, isSuccess } =
  useInfiniteQuery({
   queryKey: [
    newOrderKey,
    'contracts',
    debouncedSearch || 'all',
    debouncedCode || 'all',
   ],
   initialPageParam: {
    limit: 300,
    offset: 1,
   },
   async queryFn({ signal, pageParam }) {
    const res = await getCustomerContract({
     signal,
     limit: pageParam.limit,
     offset: pageParam.offset,
     contractNo: debouncedCode,
     customerName: debouncedSearch,
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
    <DrawerTitle>{dic.orderInfo.customerContractNo}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pt-2 pb-4 border-b border-input flex flex-wrap justify-between gap-4'>
    <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
     {dic.orderInfo.customerContractNo}
    </h1>
    <div className='w-100 grid grid-cols-[1fr_1fr_max-content] gap-2'>
     <InputGroup>
      <NumericFormat
       placeholder={dic.findCustomerContract.code}
       customInput={InputGroupInput}
       decimalScale={0}
       allowLeadingZeros={false}
       value={code}
       onValueChange={({ value }) => setCode(value || '')}
      />
      <InputGroupAddon align='inline-end'>
       <FaSearch className='text-primary size-4' />
      </InputGroupAddon>
     </InputGroup>
     <InputGroup>
      <InputGroupInput
       type='search'
       placeholder={dic.findCustomerContract.customerName}
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
      <ul className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(14rem,15rem))]'>
       {data?.pages.map((group, i) => (
        <Fragment key={i}>
         {group.rows.map(({ id, customerName, contractNo }) => (
          <li key={id} className='bg-background shadow-md rounded-lg'>
           <DrawerClose asChild>
            <Button
             variant={'outline'}
             className='py-4 items-start justify-start text-start w-full whitespace-normal bg-background shadow-md rounded-lg h-full'
             onClick={() => {
              setValue('contract', {
               key: id.toString(),
               value: '',
              });
             }}
            >
             <div className='grid gap-1'>
              <div>
               <span className='text-neutral-700 dark:text-neutral-400 text-sm'>
                {dic.findCustomerContract.code}:{' '}
               </span>
               <span className='text-xl font-medium'>{contractNo}</span>
              </div>
              <p>{customerName}</p>
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
