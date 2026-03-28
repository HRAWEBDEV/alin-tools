'use client';
import { useState } from 'react';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
import { useForm, FormProvider } from 'react-hook-form';
import {
 type DailyTasksSchema,
 createDailyTasksSchema,
 defaultValues,
} from './schemas/dailyTasksSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
 dailyTasksBaseKey,
 getInitialData,
 getDailyTasks,
} from './services/dailyTasksApiActions';
import { useDateFns } from '@/hooks/useDateFns';
import { TimeNo } from './utils/timeNo';

export default function DailyTasksChecklistWrapper({
 dic,
}: {
 dic: DailyTasksChecklistDictionary;
}) {
 const [selectedCheckListID, setSelectedCheckListID] = useState<number | null>(
  null,
 );
 const dateFns = useDateFns();
 const filtersUseForm = useForm<DailyTasksSchema>({
  defaultValues: {
   ...defaultValues,
   date: dateFns.startOfToday(),
  },
  resolver: zodResolver(createDailyTasksSchema()),
 });
 const [dateValue, maidValue, roomTypeValue, timeNoValue] =
  filtersUseForm.watch(['date', 'maid', 'roomType', 'timeNo']);
 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isError: initDataIsError,
 } = useQuery({
  queryKey: [dailyTasksBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // check list
 const { data, isFetching, refetch, isSuccess, isError } = useQuery({
  enabled: !!maidValue && !!dateValue,
  queryKey: [
   dailyTasksBaseKey,
   'list',
   timeNoValue,
   maidValue?.key || 'all',
   dateValue?.toISOString(),
   roomTypeValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getDailyTasks({
    signal,
    maidID: maidValue!.key,
    roomTypeID: roomTypeValue?.key,
    date: dateValue!.toISOString(),
    timeNo: TimeNo[timeNoValue].toString(),
   });
   return res.data;
  },
 });

 return (
  <>
   <FormProvider {...filtersUseForm}>
    <></>
   </FormProvider>
  </>
 );
}
