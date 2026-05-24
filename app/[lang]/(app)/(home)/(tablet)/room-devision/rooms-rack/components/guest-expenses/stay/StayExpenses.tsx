import { useQuery } from '@tanstack/react-query';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { roomsRackBaseKey } from '../../../services/roomsRackApiActions';
import {
 getInitialData,
 getRevenues,
} from '../../../services/guest-expenses/guestExpensesApiActions';
import {
 type GuestExpensesSchema,
 createGuestExpensesSchema,
 defaultValues,
} from '../../../schemas/guest-expenses/guestExpensesSchema';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import StayExpensesFilters from './StayExpensesFilters';
import StayExpensesList from './StayExpensesList';
import { type StayRevenueProps } from '../../../utils/guest-expenses/StayRevenueProps';
import { type EditStayRevenueProps } from '../../../utils/guest-expenses/EditStayRevenueProps';
import { useState } from 'react';
import NewStayExpense from './NewStayExpense';

export default function StayExpenses({
 dic,
 registerID,
}: {
 dic: RoomsRackDictionary;
 registerID: number;
}) {
 const filtersUseForm = useForm<GuestExpensesSchema>({
  resolver: zodResolver(createGuestExpensesSchema()),
  defaultValues: {
   ...defaultValues,
  },
 });
 const [selectedRevenueID, setSelectedRevenueID] = useState<number | null>(
  null,
 );
 const [showEditRevenue, setShowEditRevenue] = useState(false);
 const [dateValue, revenueTypeValue] = filtersUseForm.watch([
  'date',
  'revenueType',
 ]);

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

 const {
  data: revenues,
  isSuccess: revenuesIsSuccess,
  isLoading: revenuesIsLoading,
  isError: revenuesIsError,
  isFetching: revenuesIsFetching,
  refetch: revenuesRefetch,
 } = useQuery({
  queryKey: [
   roomsRackBaseKey,
   'guest-expenses',
   'revenues',
   registerID.toString(),
   dateValue?.toISOString(),
   revenueTypeValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getRevenues({
    signal,
    registerID: registerID,
    date: dateValue?.toISOString(),
    itemID: revenueTypeValue?.key,
    deleted: 'false',
   });
   return res.data;
  },
 });
 const selectedRevenue =
  selectedRevenueID && revenuesIsSuccess
   ? revenues.find((rev) => rev.id === selectedRevenueID) || null
   : null;

 function handleShowEditRevenue(id: number | null) {
  setSelectedRevenueID(id);
  setShowEditRevenue(true);
 }

 function handleCloseEditRevenue() {
  setSelectedRevenueID(null);
  setShowEditRevenue(false);
 }

 const stayRevenueTypes: StayRevenueProps = {
  data: revenues,
  isError: revenuesIsError,
  isFetching: revenuesIsFetching,
  isSuccess: revenuesIsSuccess,
  isLoading: revenuesIsLoading,
  refetch: revenuesRefetch,
 };

 const editRevenueProps: EditStayRevenueProps = {
  showEdit: showEditRevenue,
  selectedRevenue,
  selectedRevenueID,
  onCloseEditRevenue: handleCloseEditRevenue,
  onShowEditRevenue: handleShowEditRevenue,
 };

 return (
  <div>
   <FormProvider {...filtersUseForm}>
    <StayExpensesFilters
     dic={dic}
     initialData={initialData}
     initialDataIsLoading={initialDataIsLoading}
     editRevenueProps={editRevenueProps}
    />
    <StayExpensesList
     dic={dic}
     stayRevenueTypes={stayRevenueTypes}
     editRevenue={editRevenueProps}
    />
   </FormProvider>
   <NewStayExpense editRevenue={editRevenueProps} dic={dic} />
  </div>
 );
}
