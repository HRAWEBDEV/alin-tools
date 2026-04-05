'use client';

import { useState, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../hooks/useDebounce';
import {
 getReserveRooms,
 getReserveRoomsQueryKey,
} from '../services/arrivalReservesApiActions';
import ArrivalReservesFilters from './ArrivalReservesFilters';
import ArrivalReservesList from './ArrivalReservesList';
import ArrivalReserveDrawer from './ArrivalReserveDrawer';
import type { TReserveRoom } from '../services/arrivalReservesApiActions';
import type { ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';
import { GetSearchQueryValuesResult } from '../../utils/searchQueryValues';

type Props = {
 dic: ArrivalReservesDictionary;
};

const PAGE_SIZE = 10;

export default function ArrivalReservesWrapper({ dic }: Props) {
 const [selectedReserve, setSelectedReserve] = useState<TReserveRoom | null>(
  null,
 );

 const methods = useForm({
  defaultValues: {
   date: null as string | Date | null,
   roomTypeID: null as string | null,
   customerID: null as string | null,
   withRoomNo: false,
   withoutRoomNo: false,
   charged: false,
   notCharged: false,
   noShow: false,
   canceled: false,
  },
 });

 const formValues = useWatch({ control: methods.control });
 const debouncedFilters = useDebounce(formValues, 500);

 const {
  data,
  isLoading,
  isFetching,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
 } = useInfiniteQuery({
  queryKey: [getReserveRoomsQueryKey, debouncedFilters],
  queryFn: async ({ pageParam = 1, signal }) => {
   const formattedQueryValues: GetSearchQueryValuesResult = {
    limit: [String(PAGE_SIZE)],
    offset: [String(pageParam)],
    withRoomNo: [debouncedFilters.withRoomNo ? 'true' : 'false'],
    withoutRoomNo: [debouncedFilters.withoutRoomNo ? 'true' : 'false'],
    charged: [debouncedFilters.charged ? 'true' : 'false'],
    notCharged: [debouncedFilters.notCharged ? 'true' : 'false'],
    noShow: [debouncedFilters.noShow ? 'true' : 'false'],
    canceled: [debouncedFilters.canceled ? 'true' : 'false'],
   };

   if (debouncedFilters.date) {
    formattedQueryValues.date = [new Date(debouncedFilters.date).toISOString()];
   }
   if (debouncedFilters.roomTypeID) {
    formattedQueryValues.roomTypeID = [String(debouncedFilters.roomTypeID)];
   }
   if (debouncedFilters.customerID) {
    formattedQueryValues.customerID = [String(debouncedFilters.customerID)];
   }

   const response = await getReserveRooms(signal, formattedQueryValues);
   return response.data;
  },
  getNextPageParam: (lastPage, allPages) => {
   const loadedCount = allPages.reduce(
    (acc, page) => acc + (page.rows?.length || 0),
    0,
   );
   if (loadedCount < (lastPage.rowsCount || 0)) {
    return allPages.length + 1;
   }
   return undefined;
  },
  initialPageParam: 1,
 });

 const reserves = useMemo(() => {
  return data?.pages.flatMap((page) => page.rows || []) || [];
 }, [data]);

 return (
  <div className='flex flex-col h-full'>
   <FormProvider {...methods}>
    <ArrivalReservesFilters dic={dic} />
   </FormProvider>

   <div className='flex-1 overflow-y-auto p-4'>
    <ArrivalReservesList
     dic={dic}
     reserves={reserves}
     isLoading={isLoading}
     isFetching={isFetching}
     isError={isError}
     hasMore={!!hasNextPage}
     isFetchingNextPage={isFetchingNextPage}
     onLoadMore={() => fetchNextPage()}
     onSelectReserve={setSelectedReserve}
    />
   </div>

   <ArrivalReserveDrawer
    reserve={selectedReserve}
    dic={dic}
    onClose={() => setSelectedReserve(null)}
   />
  </div>
 );
}
