'use client';
import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import RoomsStatisticsWrapper from '../rooms-statistics/RoomsStatisticsWrapper';
import EntranceAndExitRoomsWrapper from '../entrance-and-exit-rooms/EntranceAndExitRoomsWrapper';
import { useSearchParams } from 'next/navigation';
import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';

export default function RoomsManagementSlot({
 roomsStatisticsDic,
 entranceAndExitDic,
}: {
 dic: RoomsManagementDictionary;
 roomsStatisticsDic: RoomStatisticsDictionary;
 entranceAndExitDic: EntranceAndExitRoomsDictionary;
}) {
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'rooms-statistics';
 let slot = (
  <div className='p-4 lg:pt-0 w-[min(100%,55rem)] mx-auto'>
   <RoomsStatisticsWrapper dic={roomsStatisticsDic} />
  </div>
 );
 switch (activeTab) {
  case 'entrance-and-exit-rooms':
   slot = (
    <div className='p-4 lg:pt-0'>
     <EntranceAndExitRoomsWrapper dic={entranceAndExitDic} />
    </div>
   );
   break;
 }
 return <main className='order-1 lg:order-2 grow'>{slot}</main>;
}
