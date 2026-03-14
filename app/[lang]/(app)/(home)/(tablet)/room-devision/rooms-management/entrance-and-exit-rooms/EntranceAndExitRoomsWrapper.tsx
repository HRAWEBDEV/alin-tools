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
 return (
  <FormProvider {...filtersUseForm}>
   <EntranceAndExitFilters dic={dic} />
   <EntranceAndExitList dic={dic} />
  </FormProvider>
 );
}
