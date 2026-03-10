import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import RoomsManagementTabs from './RoomsManagementTabs';
import RoomsManagementSlot from './RoomsManagementSlot';
import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';

export default function RoomsManagementWrapper({
 dic,
 roomsStatisticsDic,
}: {
 dic: RoomsManagementDictionary;
 roomsStatisticsDic: RoomStatisticsDictionary;
}) {
 return (
  <div className='h-full flex flex-col'>
   <RoomsManagementTabs dic={dic} />
   <RoomsManagementSlot dic={dic} roomsStatisticsDic={roomsStatisticsDic} />
  </div>
 );
}
