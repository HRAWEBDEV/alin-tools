import { useQuery } from '@tanstack/react-query';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { roomsRackBaseKey } from '../../../services/roomsRackApiActions';
import { getInitialData } from '../../../services/guest-expenses/guestExpensesApiActions';
import {
 type GuestExpensesSchema,
 createGuestExpensesSchema,
 defaultValues,
} from '../../../schemas/guest-expenses/guestExpensesSchema';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDateFns } from '@/hooks/useDateFns';
import StayExpensesFilters from './StayExpensesFilters';

export default function StayExpenses({
 dic,
 registerID,
}: {
 dic: RoomsRackDictionary;
 registerID: number;
}) {
 const dateFns = useDateFns();
 const filtersUseForm = useForm<GuestExpensesSchema>({
  resolver: zodResolver(createGuestExpensesSchema()),
  defaultValues: {
   ...defaultValues,
   date: dateFns.startOfToday(),
  },
 });

 const { data: initialData, isLoading: initialDataIsLoading } = useQuery({
  queryKey: [roomsRackBaseKey, 'guest-expenses', 'initial-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({
    registerID,
    signal,
   });
   return res.data;
  },
 });

 return (
  <div>
   <FormProvider {...filtersUseForm}>
    <StayExpensesFilters
     dic={dic}
     initialData={initialData}
     initialDataIsLoading={initialDataIsLoading}
    />
   </FormProvider>
  </div>
 );
}
