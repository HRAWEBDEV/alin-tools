'use client';

import ArrivalReserveCard from './ArrivalReserveCard';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { TReserveRoom } from '../services/arrivalReservesApiActions';
import type { ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';

type Props = {
 dic: ArrivalReservesDictionary;
 reserves: TReserveRoom[];
 isLoading: boolean;
 isFetching: boolean;
 isFetchingNextPage: boolean;
 isError: boolean;
 hasMore: boolean;
 onLoadMore: () => void;
 onSelectReserve: (reserve: TReserveRoom) => void;
};

export default function ArrivalReservesList({
 dic,
 reserves,
 isLoading,
 isFetching,
 isFetchingNextPage,
 isError,
 hasMore,
 onLoadMore,
 onSelectReserve,
}: Props) {
 if (!isLoading && !reserves.length) return <NoItemFound />;
 if (!isFetching && isError) return <UnExpectedError />;

 return (
  <div>
   {isFetching && !isFetchingNextPage && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {reserves.map((reserve) => (
     <ArrivalReserveCard
      key={reserve.id}
      reserve={reserve}
      dic={dic}
      onClick={() => onSelectReserve(reserve)}
     />
    ))}
   </div>
   {hasMore && (
    <div className='flex items-center justify-center mt-4'>
     <Button
      variant='outline'
      size='lg'
      disabled={isFetchingNextPage}
      onClick={onLoadMore}
      className='text-primary border-primary font-medium'
     >
      {isFetchingNextPage && <Spinner className='text-primary' />}
      {dic.info.loadMore}
     </Button>
    </div>
   )}
  </div>
 );
}
