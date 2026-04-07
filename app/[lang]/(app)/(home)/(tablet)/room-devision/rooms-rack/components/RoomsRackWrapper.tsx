'use client';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import RackTools from './RackTools';
import RackRooms from './rooms/RackRooms';
import RackSidebar from './side-bar/RackSidebar';
import RackPagination from './rooms/RackPagination';
import { useRackConfigContext } from '../services/rooms-rack-config/roomsRackConfigContext';
import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';

export default function RoomsRackWrapper({
 dic,
 roomsStatisticsDic,
 roomControlDic,
}: {
 dic: RoomsRackDictionary;
 roomsStatisticsDic: RoomStatisticsDictionary;
 roomControlDic: RoomControlDictionary;
}) {
 const {
  sidebar: { isPin, isOpen },
 } = useRackConfigContext();
 return (
  <div
   data-sidebar-isOpen={isOpen}
   data-sidebar-isPin={isPin}
   className={`grid grid-cols-1 ${isOpen && isPin ? 'md:grid-cols-[18rem_1fr]' : ''}  h-full overflow-hidden relative`}
  >
   <RackSidebar dic={dic} roomsStatisticsDic={roomsStatisticsDic} />
   <div className='flex flex-col overflow-auto px-4 md:my-4'>
    <RackTools dic={dic} />
    <RackRooms dic={dic} roomControlDic={roomControlDic} />
    <RackPagination dic={dic} />
   </div>
  </div>
 );
}
