'use client';
import { useState } from 'react';
import { RoomControlPageDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-control/dictionary';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';
import { useForm, FormProvider } from 'react-hook-form';
import {
 type RoomControlSchema,
 createRoomControlSchema,
 defaultValues,
} from '../schemas/roomControlSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
 roomControlBaseKey,
 getInitialData,
 getRoomControls,
} from '../services/roomControlApiActions';
import RoomControlFilters from './RoomControlFilters';
import RoomControl from '../../rooms-rack/components/room-control/RoomControl';

export default function RoomControlWrapper({
 dic,
 roomControlDic,
}: {
 dic: RoomControlPageDictionary;
 roomControlDic: RoomControlDictionary;
}) {
 const [selectedRoomControlId, setSelectedRoomControlId] = useState<
  number | null
 >(null);
 const [showEditRoomControl, setShowEditRoomControl] = useState(false);

 const filtersUseForm = useForm<RoomControlSchema>({
  defaultValues: {
   ...defaultValues,
  },
  resolver: zodResolver(createRoomControlSchema()),
 });

 const [floorValue, roomTypeValue] = filtersUseForm.watch([
  'floor',
  'roomType',
 ]);

 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isError: initDataIsError,
 } = useQuery({
  queryKey: [roomControlBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // room controls
 const { data, isFetching, refetch, isSuccess, isError } = useQuery({
  queryKey: [
   roomControlBaseKey,
   'room-control',
   floorValue?.key || 'all',
   roomTypeValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getRoomControls({
    signal,
    floorNo: floorValue?.value,
    roomTypeID: roomTypeValue?.key,
   });
   return res.data;
  },
 });

 function handleShowEditRoomControl(id: number) {
  setShowEditRoomControl(true);
  setSelectedRoomControlId(id);
 }

 function handleCloseEditRoomControl() {
  setSelectedRoomControlId(null);
  setShowEditRoomControl(false);
 }

 const targetRoomControl = selectedRoomControlId
  ? data?.find((item) => item.id === selectedRoomControlId) || null
  : null;

 return (
  <>
   <FormProvider {...filtersUseForm}>
    <RoomControlFilters
     dic={dic}
     initDataIsLoading={initDataIsLoading}
     initData={initData}
     roomControl={{ data, isFetching, refetch, isSuccess, isError }}
    />
   </FormProvider>
   {targetRoomControl && (
    <RoomControl
     dic={roomControlDic}
     open={showEditRoomControl}
     registerID={targetRoomControl.registerID}
     roomID={targetRoomControl.roomID}
     roomLabel={targetRoomControl.roomLabel}
     onChangeOpen={() => handleCloseEditRoomControl()}
     onSuccess={() => {}}
    />
   )}
  </>
 );
}
