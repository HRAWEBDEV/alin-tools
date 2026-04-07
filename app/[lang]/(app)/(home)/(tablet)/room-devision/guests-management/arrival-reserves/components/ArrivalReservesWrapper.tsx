'use client';

import { useState, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../hooks/useDebounce';
import {
 getReserveRooms,
 getReserveRoomsQueryKey,
 getInitDatas,
 getInitDatasQueryKey,
 getCustomers,
} from '../services/arrivalReservesApiActions';
import ArrivalReservesFilters from './ArrivalReservesFilters';
import ArrivalReservesList from './ArrivalReservesList';
import ArrivalReserveDrawer from './ArrivalReserveDrawer';
import {
 createArrivalReservesSchema,
 defaultValues,
 type ArrivalReservesSchema,
} from '../schemas/arrivalReservesSchema';
import type { ReserveRoom } from '../services/arrivalReservesApiActions';
import type { ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';
import { GetSearchQueryValuesResult } from '../../utils/searchQueryValues';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
 dic: ArrivalReservesDictionary;
};

const PAGE_SIZE = 10;

export default function ArrivalReservesWrapper({ dic }: Props) {
 const [selectedReserve, setSelectedReserve] = useState<ReserveRoom | null>(
  null,
 );

 const { data: initData, isLoading: initDataIsLoading } = useQuery({
  queryKey: [getInitDatasQueryKey, 'customers-list'],
  queryFn: async ({ signal }) => {
   const [initDatasRes, customersRes] = await Promise.all([
    getInitDatas(signal),
    getCustomers(signal),
   ]);
   return {
    roomTypes: initDatasRes.data || [],
    customers:
     customersRes.data.rows?.map((c) => ({
      key: String(c.id),
      value: c.name,
     })) || [],
   };
  },
  staleTime: 5 * 60 * 1000,
 });

 const methods = useForm<ArrivalReservesSchema>({
  resolver: zodResolver(createArrivalReservesSchema()),
  defaultValues,
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
    <ArrivalReservesFilters
     dic={dic}
     initData={initData}
     initDataIsLoading={initDataIsLoading}
    />
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
