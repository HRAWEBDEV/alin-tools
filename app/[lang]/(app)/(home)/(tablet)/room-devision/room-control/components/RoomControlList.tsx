'use client';
import { RoomControlPageDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-control/dictionary';
import { type EditRoomControlProps } from '../utils/editRoomControlProps';
import { type RoomControlProps } from '../utils/roomControlProps';
import RoomControlItem from './RoomControlItem';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';

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
 return (
  <div className='grid grid-cols-[repeat(auto-fill,minmax(6.5rem,7rem))] justify-center gap-3'>
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
 );
}
