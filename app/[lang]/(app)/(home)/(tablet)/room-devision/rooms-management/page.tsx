import { getRoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import { getRoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { getEntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import { getOutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import { type Locale } from '@/internalization/app/localization';
import RoomsManagementWrapper from './components/RoomsManagementWrapper';

export default async function RoomsManagement(
 props: PageProps<'/[lang]/room-devision/rooms-management'>,
) {
 const { lang } = await props.params;
 const roomsManagementDic = await getRoomsManagementDictionary({
  locale: lang as Locale,
 });
 const roomsStatisticsDic = await getRoomStatisticsDictionary({
  locale: lang as Locale,
 });
 const entranceAndExitDic = await getEntranceAndExitRoomsDictionary({
  locale: lang as Locale,
 });
 const outOfOrderDic = await getOutOfOrderRoomsDictionary({
  locale: lang as Locale,
 });
 return (
  <RoomsManagementWrapper
   dic={roomsManagementDic}
   outOfOrderDic={outOfOrderDic}
   roomsStatisticsDic={roomsStatisticsDic}
   entranceAndExitDic={entranceAndExitDic}
  />
 );
}
