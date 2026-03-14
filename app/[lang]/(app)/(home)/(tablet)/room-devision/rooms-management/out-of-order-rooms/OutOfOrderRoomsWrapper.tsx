'use client';
import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import OutOfOrderRoomsFilters from './components/OutOfOrderRoomsFilters';
import OutOfOrderRooms from './components/OutOfOrderRooms';
import { useForm, FormProvider } from 'react-hook-form';
import {
 OutOfOrderRoomsSchema,
 createOutOfOrderRoomsSchema,
 defaultValues,
} from './schemas/outOfOrderRoomsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
 outOfOrderRoomsBaseKey,
 getInitialData,
} from './services/outOfOrderApiActions';

export default function OutOfOrderRoomsWrapper({
 dic,
}: {
 dic: OutOfOrderRoomsDictionary;
}) {
 const filtersUseForm = useForm<OutOfOrderRoomsSchema>({
  defaultValues: {
   ...defaultValues,
  },
  resolver: zodResolver(createOutOfOrderRoomsSchema()),
 });

 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isError: initDataIsError,
 } = useQuery({
  queryKey: [outOfOrderRoomsBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 return (
  <FormProvider {...filtersUseForm}>
   <OutOfOrderRoomsFilters
    dic={dic}
    initDataIsLoading={initDataIsLoading}
    initData={initData}
   />
   <OutOfOrderRooms dic={dic} />
  </FormProvider>
 );
}
