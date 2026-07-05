'use client';
import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import EntranceAndExitFilters from './components/EntranceAndExitFilters';
import EntranceAndExitList from './components/EntranceAndExitList';
import { useForm, FormProvider } from 'react-hook-form';
import {
 EntranceAndExitSchema,
 createEntranceAndExitSchema,
 defaultValues,
} from './schemas/entranceAndExitSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDateFns } from '@/hooks/useDateFns';
import { useQuery } from '@tanstack/react-query';
import {
 entranceAndExitBaseKey,
 getInitialData,
 getRooms,
} from './services/entranceAndExitApiActions';

export default function EntranceAndExitRoomsWrapper({
 dic,
}: {
 dic: EntranceAndExitRoomsDictionary;
}) {
 const dateFns = useDateFns();
 const filtersUseForm = useForm<EntranceAndExitSchema>({
  defaultValues: {
   ...defaultValues,
   date: dateFns.startOfToday(),
  },
  resolver: zodResolver(createEntranceAndExitSchema()),
 });

 const [dateValue, floorValue, roomTypeValue, typeValue] = filtersUseForm.watch(
  ['date', 'floor', 'roomType', 'type'],
 );

 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isError: initDataIsError,
 } = useQuery({
  queryKey: [entranceAndExitBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // rooms
 const { data, isFetching, refetch, isSuccess, isError } = useQuery({
  enabled: !!dateValue,
  queryKey: [
   entranceAndExitBaseKey,
   'rooms',
   dateValue?.toISOString(),
   typeValue?.key || 'all',
   floorValue?.key || 'all',
   roomTypeValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getRooms({
    signal,
    date: dateValue!.toISOString(),
    isCheckin: typeValue?.value === 'entrance',
    isCheckout: typeValue?.value === 'exit',
    floorNo: floorValue?.value,
    roomTypeID: roomTypeValue?.key,
   });
   return res.data;
  },
 });

 return (
  <FormProvider {...filtersUseForm}>
   <EntranceAndExitFilters
    dic={dic}
    initDataIsLoading={initDataIsLoading}
    initData={initData}
    rooms={{
     data,
     isFetching,
     isSuccess,
     refetch,
     isError,
    }}
   />
   <EntranceAndExitList
    dic={dic}
    rooms={{
     data,
     isFetching,
     isSuccess,
     refetch,
     isError,
    }}
   />
  </FormProvider>
 );
}
