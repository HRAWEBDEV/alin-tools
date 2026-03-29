'use client';
import { useState } from 'react';
import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import OutOfOrderRoomsFilters from './components/OutOfOrderRoomsFilters';
import OutOfOrderRooms from './components/OutOfOrderRooms';
import { useForm, FormProvider } from 'react-hook-form';
import {
 OutOfOrderRoomsSchema,
 createOutOfOrderRoomsSchema,
 defaultValues,
} from './schemas/outOfOrderRoomsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
 outOfOrderRoomsBaseKey,
 getInitialData,
 getOutOfOrderRooms,
} from './services/outOfOrderApiActions';
import { useDateFns } from '@/hooks/useDateFns';
import NewOutOfOrderRoom from './components/NewOutOfOrderRoom';

export default function OutOfOrderRoomsWrapper({
 dic,
}: {
 dic: OutOfOrderRoomsDictionary;
}) {
 const [selectedOutOfOrderRoomID, setSelectedOutOfOrderRoomID] = useState<
  number | null
 >(null);
 const [showNew, setShowNew] = useState(false);
 const dateFns = useDateFns();
 const filtersUseForm = useForm<OutOfOrderRoomsSchema>({
  defaultValues: {
   ...defaultValues,
   fromDate: dateFns.startOfToday(),
   toDate: dateFns.addYears(dateFns.startOfYear(new Date()), 1),
  },
  resolver: zodResolver(createOutOfOrderRoomsSchema()),
 });
 const [fromDateValue, toDateValue, floorValue, roomValue, roomTypeValue] =
  filtersUseForm.watch(['fromDate', 'toDate', 'floor', 'room', 'roomType']);
 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isError: initDataIsError,
 } = useQuery({
  queryKey: [outOfOrderRoomsBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // rooms
 const {
  data,
  hasNextPage,
  fetchNextPage,
  isFetching,
  refetch,
  isSuccess,
  isError,
 } = useInfiniteQuery({
  enabled: !!fromDateValue && !!toDateValue,
  queryKey: [
   outOfOrderRoomsBaseKey,
   'rooms',
   fromDateValue?.toISOString(),
   toDateValue?.toISOString(),
   floorValue?.key || 'all',
   roomTypeValue?.key || 'all',
   roomValue?.key || 'all',
  ],
  initialPageParam: {
   limit: 50,
   offset: 1,
  },
  async queryFn({ signal, pageParam }) {
   const res = await getOutOfOrderRooms({
    signal,
    limit: pageParam.limit.toString(),
    offset: pageParam.offset.toString(),
    fromDate: fromDateValue!.toISOString(),
    toDate: toDateValue!.toISOString(),
    floorNo: floorValue?.value,
    roomID: roomValue?.key,
    roomTypeID: roomTypeValue?.key,
   });
   return res.data;
  },
  getNextPageParam(lastPage) {
   const nextOffset = lastPage.outOfOrders.offset + 1;
   if (
    lastPage.outOfOrders.offset * lastPage.outOfOrders.limit >=
    lastPage.outOfOrders.rowsCount
   ) {
    return undefined;
   }
   return {
    offset: nextOffset,
    limit: lastPage.outOfOrders.limit,
   };
  },
  getPreviousPageParam(firstPage) {
   if (firstPage.outOfOrders.offset <= 1) {
    return undefined;
   }
   return {
    limit: firstPage.outOfOrders.limit,
    offset: firstPage.outOfOrders.offset - 1,
   };
  },
 });

 // edit or new
 function handleOpenEdit(id: number | null) {
  setSelectedOutOfOrderRoomID(id);
  setShowNew(true);
 }
 function handleCloseEdit() {
  setSelectedOutOfOrderRoomID(null);
  setShowNew(false);
 }

 const targetEditRoom = !!data?.pages[0].outOfOrders.rowsCount
  ? data?.pages[0].outOfOrders.rows.find(
     (item) => item.id === selectedOutOfOrderRoomID,
    ) || null
  : null;

 return (
  <>
   <FormProvider {...filtersUseForm}>
    <OutOfOrderRoomsFilters
     dic={dic}
     initDataIsLoading={initDataIsLoading}
     initData={initData}
     rooms={{
      data,
      hasNextPage,
      fetchNextPage,
      isFetching,
      refetch,
      isSuccess,
      isError,
     }}
     editRoom={{
      selectedOutOfOrderRoomID,
      showNew,
      onCloseEdit: handleCloseEdit,
      onShowEdit: handleOpenEdit,
      targetEditRoom,
     }}
    />
    <OutOfOrderRooms
     dic={dic}
     editRoom={{
      selectedOutOfOrderRoomID,
      showNew,
      onCloseEdit: handleCloseEdit,
      onShowEdit: handleOpenEdit,
      targetEditRoom,
     }}
     rooms={{
      data,
      hasNextPage,
      fetchNextPage,
      isFetching,
      refetch,
      isSuccess,
      isError,
     }}
    />
   </FormProvider>
   <NewOutOfOrderRoom
    dic={dic}
    initialData={initData}
    initDataIsLoading={initDataIsLoading}
    editRoom={{
     selectedOutOfOrderRoomID,
     showNew,
     onCloseEdit: handleCloseEdit,
     onShowEdit: handleOpenEdit,
     targetEditRoom,
    }}
   />
  </>
 );
}
