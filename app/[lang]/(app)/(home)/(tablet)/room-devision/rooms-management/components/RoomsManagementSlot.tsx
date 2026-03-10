'use client';
import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import RoomsStatisticsWrapper from '../rooms-statistics/RoomsStatisticsWrapper';
import { useSearchParams } from 'next/navigation';

export default function RoomsManagementSlot({
 roomsStatisticsDic,
}: {
 dic: RoomsManagementDictionary;
 roomsStatisticsDic: RoomStatisticsDictionary;
}) {
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'rooms-statistics';
 let slot = (
  <div className='p-4 pt-0 w-[min(100%,55rem)] mx-auto'>
   <RoomsStatisticsWrapper dic={roomsStatisticsDic} />
  </div>
 );
 switch (activeTab) {
  case 'entrance-and-exit-rooms':
   slot = <div></div>;
   break;
  case 'reserved-rooms':
   slot = <div></div>;
   break;
 }
 return <main className='order-1 lg:order-2 grow'>{slot}</main>;
}
