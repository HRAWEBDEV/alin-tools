import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import RackRoom from './RackRoom';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';

export default function RackRooms({
 dic,
 roomControlDic,
}: {
 dic: RoomsRackDictionary;
 roomControlDic: RoomControlDictionary;
}) {
 const { rack } = useRackConfigContext();

 if (rack.isSuccess && !rack.data.length)
  return (
   <div className='grow'>
    <NoItemFound />
   </div>
  );

 if (rack.isError && !rack.isSuccess)
  return (
   <div className='grow'>
    <UnExpectedError />
   </div>
  );

 return (
  <div className='grow '>
   {rack.isLoading && <LinearLoading />}
   <div
    dir='ltr'
    data-layout-minimal={rack.rackView === 'minimal'}
    className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,9.5rem))] data-[layout-minimal=true]:grid-cols-[repeat(auto-fill,minmax(6.5rem,7rem))] justify-center pb-4 data-[layout-minimal=true]:gap-3'
   >
    {rack.data.map((room) => (
     <RackRoom
      dic={dic}
      key={room.roomLabel}
      room={room}
      roomControlDic={roomControlDic}
     />
    ))}
   </div>
  </div>
 );
}
