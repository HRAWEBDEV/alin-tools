'use client';
import GuestCard from './GuestCard';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ResidentGuest } from '../services/guestsListApiActions';
import { ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';

type Props = {
 dic: ResidentGuestsDictionary;
 guests: ResidentGuest[];
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
 hasMore: boolean;
 onLoadMore: () => void;
 onSelectGuest: (guest: ResidentGuest) => void;
};

export default function GuestsList({
 dic,
 guests,
 isLoading,
 isFetching,
 isError,
 hasMore,
 onLoadMore,
 onSelectGuest,
}: Props) {
 if (!isLoading && !guests.length) return <NoItemFound />;
 if (!isFetching && isError) return <UnExpectedError />;

 return (
  <div>
   {isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {guests.map((guest) => (
     <GuestCard
      key={guest.id}
      guest={guest}
      dic={dic}
      onClick={() => onSelectGuest(guest)}
     />
    ))}
   </div>
   {hasMore && (
    <div className='flex items-center justify-center mt-4'>
     <Button
      variant='outline'
      size='lg'
      disabled={isFetching}
      onClick={onLoadMore}
      className='text-primary border-primary font-medium'
     >
      {isFetching && <Spinner className='text-primary' />}
      {dic.info.loadMore}
     </Button>
    </div>
   )}
  </div>
 );
}
