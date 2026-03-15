import { Fragment } from 'react';
import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import OutOfOrderRoom from './OutOfOrderRoom';
import { type OutOfOrderRoomsProps } from '../utils/outOfOrderRoomsProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function OutOfOrderRooms({
 dic,
 rooms,
}: {
 dic: OutOfOrderRoomsDictionary;
 rooms: OutOfOrderRoomsProps;
}) {
 if (rooms.isSuccess && !rooms.data?.pages.length) {
  return <NoItemFound />;
 }
 return (
  <div>
   {rooms.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {rooms.data?.pages.map((group, i) => (
     <Fragment key={i}>
      {group.rows.length ? (
       group.rows.map((room) => (
        <OutOfOrderRoom room={room} key={room.id} dic={dic} />
       ))
      ) : (
       <div className='col-span-full'>
        <NoItemFound />
       </div>
      )}
     </Fragment>
    ))}
   </div>
   {rooms.hasNextPage && (
    <div className='flex items-center justify-center mt-4'>
     <Button
      variant='outline'
      size='lg'
      disabled={rooms.isFetching}
      onClick={() => rooms.fetchNextPage()}
      className='text-primary border-primary font-medium'
     >
      {rooms.isFetching && <Spinner className='text-primary' />}
      {dic.info.loadMore}
     </Button>
    </div>
   )}
  </div>
 );
}
