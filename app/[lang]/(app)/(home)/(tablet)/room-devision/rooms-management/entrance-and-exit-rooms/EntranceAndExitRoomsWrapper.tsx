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
} from './services/entranceAndExitApiActions';
import { init } from 'next/dist/compiled/webpack/webpack';

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
