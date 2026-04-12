'use client';
import { useState, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDateFns } from '@/hooks/useDateFns';
import { useDebounce } from '../../../hooks/useDebounce';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';

import {
 getRevenues,
 getRevenuesApi,
 getRooms,
 getItems,
 type Revenue,
} from '../services/guestsExpensesApiActions';

import {
 defaultValues,
 createGuestsExpensesFilterSchema,
 type GuestsExpensesSchema,
} from '../schemas/guestsExpensesSchema';

import GuestsExpensesFilters from './GuestsExpensesFilters';
import GuestsExpensesList from './GuestsExpensesList'; // Assumed component based on architecture
import GuestsExpenseDrawer from './GuestsExpensesDetailDrawer'; // Assumed component based on architecture

const PAGE_SIZE = 50;

type Props = {
 dic: GuestsExpensesDictionary;
};

export default function GuestsExpensesWrapper({ dic }: Props) {
 const dateFns = useDateFns();
 const [selectedExpense, setSelectedExpense] = useState<Revenue | null>(null);

 const methods = useForm<GuestsExpensesSchema>({
  resolver: zodResolver(createGuestsExpensesFilterSchema()),
  defaultValues: {
   ...defaultValues,
   date: dateFns.startOfToday(),
  },
 });

 const formValues = useWatch({ control: methods.control });
 const debouncedFilters = useDebounce(formValues, 500);

 const effectiveDate = useMemo(() => {
  return debouncedFilters.date
   ? new Date(debouncedFilters.date).toISOString()
   : new Date().toISOString();
 }, [debouncedFilters.date]);

 const { data: initData, isLoading: initDataIsLoading } = useQuery({
  queryKey: ['guests-expenses-init-data'],
  queryFn: async () => {
   const [roomsRes, itemsRes] = await Promise.all([
    getRooms({ limit: ['1000'], offset: ['1'] }),
    getItems({ limit: 1000, offset: 1 }),
   ]);

   return {
    rooms:
     roomsRes.data.rows?.map((r) => ({
      key: String(r.id),
      value: r.roomLabel || String(r.id),
     })) || [],
    items:
     itemsRes.data.rows?.map((i) => ({
      key: String(i.itemID),
      value: i.itemName || String(i.itemID),
     })) || [],
   };
  },
  staleTime: 5 * 60 * 1000,
 });

 const {
  data,
  isLoading,
  isFetching,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
 } = useInfiniteQuery({
  queryKey: [getRevenuesApi, debouncedFilters],
  queryFn: async ({ pageParam = 1, signal }) => {
   const response = await getRevenues({
    signal,
    limit: PAGE_SIZE,
    offset: pageParam,
    date: effectiveDate,
    roomID: debouncedFilters.room ? Number(debouncedFilters.room) : undefined,
    itemID: debouncedFilters.item ? Number(debouncedFilters.item) : undefined,
   });
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

 const expenses = useMemo(() => {
  return data?.pages.flatMap((page) => page.rows || []) || [];
 }, [data]);

 const totalResults = useMemo(() => {
  return data?.pages?.[0]?.rowsCount ?? undefined;
 }, [data]);

 return (
  <div className='flex flex-col h-full'>
   <FormProvider {...methods}>
    <GuestsExpensesFilters
     dic={dic}
     initData={initData}
     initDataIsLoading={initDataIsLoading}
     totalResults={totalResults}
    />
   </FormProvider>

   {/* <div className='flex-1 overflow-y-auto p-4'>
    <GuestsExpensesList
     dic={dic}
     expenses={expenses}
     isLoading={isLoading}
     isFetching={isFetching}
     isError={isError}
     hasMore={!!hasNextPage}
     isFetchingNextPage={isFetchingNextPage}
     onLoadMore={() => fetchNextPage()}
     onSelectExpense={setSelectedExpense}
    />
   </div>

   <GuestsExpenseDrawer
    expense={selectedExpense}
    dic={dic}
    onClose={() => setSelectedExpense(null)}
   /> */}
  </div>
 );
}
