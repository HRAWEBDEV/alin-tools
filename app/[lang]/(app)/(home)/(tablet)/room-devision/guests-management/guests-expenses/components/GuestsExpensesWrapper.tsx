'use client';
import { useState, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import {
 useInfiniteQuery,
 useQuery,
 useQueryClient,
} from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDateFns } from '@/hooks/useDateFns';
import { useDebounce } from '../../../hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';

import {
 getRevenues,
 getRevenuesApi,
 getRooms,
 getItems,
 getRegisterRoomNight,
 getRegisterRoomNightApi,
 getRegisterInfo,
 getRegisterInfoApi,
 type Revenue,
} from '../services/guestsExpensesApiActions';

import {
 defaultValues,
 createGuestsExpensesFilterSchema,
 type GuestsExpensesSchema,
} from '../schemas/guestsExpensesSchema';

import GuestsExpensesFilters from './GuestsExpensesFilters';
import GuestsExpensesList from './GuestsExpensesList';
import GuestsExpenseActionDrawer, {
 type InitData,
} from './GuestsExpensesActionDrawer';

const PAGE_SIZE = 50;

type Props = {
 dic: GuestsExpensesDictionary;
};

export default function GuestsExpensesWrapper({ dic }: Props) {
 const dateFns = useDateFns();
 const queryClient = useQueryClient();

 const [selectedExpense, setSelectedExpense] = useState<Revenue | null>(null);
 const [drawerMode, setDrawerMode] = useState<
  'create' | 'edit' | 'view' | null
 >(null);

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

 const isToday = useMemo(() => {
  if (!debouncedFilters.date) return false;
  return (
   new Date(debouncedFilters.date).setHours(0, 0, 0, 0) ===
   new Date().setHours(0, 0, 0, 0)
  );
 }, [debouncedFilters.date]);

 const { data: initData, isLoading: initDataIsLoading } = useQuery<InitData>({
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
      price: i.price,
      serviceRate: i.serviceRate,
      taxRate: i.taxRate,
     })) || [],
   };
  },
  staleTime: 5 * 60 * 1000,
 });

 const { data: registerRoomNight } = useQuery({
  enabled: !!debouncedFilters.room && isToday,
  queryKey: [getRegisterRoomNightApi, debouncedFilters.room, isToday],
  queryFn: async ({ signal }) => {
   const { data } = await getRegisterRoomNight({
    signal,
    roomID: Number(debouncedFilters.room),
   });
   return data;
  },
 });

 const { data: registerInfo } = useQuery({
  enabled: !!registerRoomNight?.registerID,
  queryKey: [getRegisterInfoApi, registerRoomNight?.registerID],
  queryFn: async ({ signal }) => {
   const { data } = await getRegisterInfo({
    signal,
    registerID: registerRoomNight!.registerID,
   });
   return data;
  },
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

 const handleRefresh = () => {
  queryClient.invalidateQueries({ queryKey: [getRevenuesApi] });
 };

 return (
  <div className='flex flex-col h-full bg-background'>
   <FormProvider {...methods}>
    <GuestsExpensesFilters
     dic={dic}
     initData={initData}
     initDataIsLoading={initDataIsLoading}
     totalResults={totalResults}
     onSetMode={setDrawerMode}
    />
   </FormProvider>

   {registerInfo && (
    <div className='px-4 pt-2 pb-0 flex justify-end shrink-0'>
     <Button
      onClick={() => {
       setSelectedExpense(null);
       setDrawerMode('create');
      }}
      className='w-full sm:w-auto shadow-sm'
     >
      <PlusIcon className='mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0' />
      {dic.actions?.addExpense}
     </Button>
    </div>
   )}

   <div className='flex-1 overflow-y-auto p-4'>
    <GuestsExpensesList
     dic={dic}
     expenses={expenses}
     isLoading={isLoading}
     isFetching={isFetching}
     isError={isError}
     hasMore={!!hasNextPage}
     isFetchingNextPage={isFetchingNextPage}
     onLoadMore={() => fetchNextPage()}
     onSelectExpense={(expense: Revenue) => {
      setSelectedExpense(expense);
      setDrawerMode('view');
     }}
    />
   </div>

   <GuestsExpenseActionDrawer
    isOpen={drawerMode !== null}
    mode={drawerMode}
    expense={selectedExpense}
    registerInfo={registerInfo ?? null}
    initData={initData}
    dic={dic}
    onClose={() => {
     setDrawerMode(null);
     setSelectedExpense(null);
    }}
    onSuccess={handleRefresh}
    onSetMode={setDrawerMode}
   />
  </div>
 );
}
