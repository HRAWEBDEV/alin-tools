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
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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
 const { data, hasNextPage, fetchNextPage, isFetching, refetch, isSuccess } =
  useInfiniteQuery({
   enabled: !!dateValue,
   queryKey: [
    entranceAndExitBaseKey,
    'rooms',
    dateValue?.toISOString(),
    typeValue?.key || 'all',
    floorValue?.key || 'all',
    roomTypeValue?.key || 'all',
   ],
   initialPageParam: {
    limit: 300,
    offset: 1,
   },
   async queryFn({ signal, pageParam }) {
    const res = await getRooms({
     signal,
     date: dateValue!.toISOString(),
     isCheckin: typeValue?.value === 'entrance',
     isCheckout: typeValue?.value === 'exit',
     limit: pageParam.limit.toString(),
     offset: pageParam.offset.toString(),
     floorNo: floorValue?.key,
     roomTypeID: roomTypeValue?.key,
    });
    return res.data;
   },
   getNextPageParam(lastPage) {
    const nextOffset = lastPage.offset + 1;
    if (lastPage.offset * lastPage.limit >= lastPage.rowsCount) {
     return undefined;
    }
    return {
     offset: nextOffset,
     limit: lastPage.limit,
    };
   },
   getPreviousPageParam(firstPage) {
    if (firstPage.offset <= 1) {
     return undefined;
    }
    return {
     limit: firstPage.limit,
     offset: firstPage.offset - 1,
    };
   },
  });

 console.log(data);
 return (
  <FormProvider {...filtersUseForm}>
   <EntranceAndExitFilters
    dic={dic}
    initDataIsLoading={initDataIsLoading}
    initData={initData}
   />
   <EntranceAndExitList dic={dic} />
  </FormProvider>
 );
}
