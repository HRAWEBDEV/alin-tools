import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import RoomsManagementTabs from './RoomsManagementTabs';
import RoomsManagementSlot from './RoomsManagementSlot';
import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';

export default function RoomsManagementWrapper({
 dic,
 roomsStatisticsDic,
 entranceAndExitDic,
}: {
 dic: RoomsManagementDictionary;
 roomsStatisticsDic: RoomStatisticsDictionary;
 entranceAndExitDic: EntranceAndExitRoomsDictionary;
}) {
 return (
  <div className='h-full flex flex-col'>
   <RoomsManagementTabs dic={dic} />
   <RoomsManagementSlot
    dic={dic}
    roomsStatisticsDic={roomsStatisticsDic}
    entranceAndExitDic={entranceAndExitDic}
   />
  </div>
 );
}
