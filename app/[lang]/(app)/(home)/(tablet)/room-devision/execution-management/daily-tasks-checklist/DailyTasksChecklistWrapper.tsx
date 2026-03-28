'use client';
import { useState, useEffect } from 'react';
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
import DailyTasksFilters from './components/DailyTasksFilters';
import DailyTasksList from './components/DailyTasksList';

export default function DailyTasksChecklistWrapper({
 dic,
}: {
 dic: DailyTasksChecklistDictionary;
}) {
 const [selectedCheckListID, setSelectedCheckListID] = useState<number | null>(
  null,
 );
 const [showNew, setShowNew] = useState(false);
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
  isSuccess: initDataIsSuccess,
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

 // edit or new
 function handleOpenEdit(id: number | null) {
  setSelectedCheckListID(id);
  setShowNew(true);
 }
 function handleCloseEdit() {
  setSelectedCheckListID(null);
  setShowNew(false);
 }

 const targetEditChecklist = !!data?.length
  ? data?.find((item) => item.id === selectedCheckListID) || null
  : null;

 useEffect(() => {
  if (!initDataIsSuccess || !initData.maids.length) return;
  const activeMaid = initData.maid
   ? initData.maids.find((item) => item.key === initData.maid.id.toString()) ||
     initData.maids[0]
   : initData.maids[0];
  filtersUseForm.setValue('maid', activeMaid);
 }, [initDataIsSuccess, initData, filtersUseForm]);

 return (
  <>
   <FormProvider {...filtersUseForm}>
    <DailyTasksFilters
     dic={dic}
     initDataIsLoading={initDataIsLoading}
     initData={initData}
     checklist={{
      isError,
      isFetching,
      isSuccess,
      refetch,
      data,
     }}
    />
    <DailyTasksList
     dic={dic}
     checklist={{
      isError,
      isFetching,
      isSuccess,
      refetch,
      data,
     }}
     editChecklist={{
      onCloseEdit: handleCloseEdit,
      onShowEdit: handleOpenEdit,
      selectedCheckListID,
      showNew,
      targetEditChecklist,
     }}
    />
   </FormProvider>
  </>
 );
}
