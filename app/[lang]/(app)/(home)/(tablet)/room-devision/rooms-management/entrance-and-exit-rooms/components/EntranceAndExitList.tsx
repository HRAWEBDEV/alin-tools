import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import EntranceAndExitItem from './EntranceAndExitItem';
import { EntranceAndExitRoomsProps } from '../utils/entranceAndExitRoomsProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';

export default function EntranceAndExitList({
 dic,
 rooms,
}: {
 dic: EntranceAndExitRoomsDictionary;
 rooms: EntranceAndExitRoomsProps;
}) {
 if (rooms.isSuccess && !rooms.data?.length) {
  return <NoItemFound />;
 }
 if (!rooms.isFetching && rooms.isError) {
  return <UnExpectedError />;
 }
 return (
  <div>
   {rooms.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {rooms.data?.map((room, i) => (
     <EntranceAndExitItem key={i} dic={dic} room={room} />
    ))}
   </div>
  </div>
 );
}
