'use client';
import { RoomControlPageDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-control/dictionary';
import { type EditRoomControlProps } from '../utils/editRoomControlProps';
import { type RoomControlProps } from '../utils/roomControlProps';
import RoomControlItem from './RoomControlItem';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';

export default function RoomControlList({
 dic,
 roomControlDic,
 roomControl,
 editRoomControl,
}: {
 dic: RoomControlPageDictionary;
 editRoomControl: EditRoomControlProps;
 roomControl: RoomControlProps;
 roomControlDic: RoomControlDictionary;
}) {
 if (roomControl.isError && !roomControl.isFetching) {
  return (
   <>
    <UnExpectedError />
   </>
  );
 }
 if (roomControl.isSuccess && !roomControl.data?.length) {
  return <NoItemFound />;
 }
 return (
  <div>
   {roomControl.isFetching && <LinearLoading />}
   <div
    dir='ltr'
    className='grid grid-cols-[repeat(auto-fill,minmax(6.5rem,7rem))] justify-center gap-3'
   >
    {roomControl.data?.map((item) => (
     <RoomControlItem
      key={item.id}
      dic={dic}
      editRoomControlProps={editRoomControl}
      roomControl={item}
      roomControlDic={roomControlDic}
     />
    ))}
   </div>
  </div>
 );
}
