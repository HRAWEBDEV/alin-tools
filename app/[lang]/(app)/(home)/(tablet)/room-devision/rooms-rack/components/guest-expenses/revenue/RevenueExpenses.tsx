import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { roomsRackBaseKey } from '../../../services/roomsRackApiActions';
import {
 getInitialData,
 getInvoices,
} from '../../../services/guest-expenses/guestExpensesApiActions';
import {
 type GuestExpensesInvoice,
 createGuestExpensesInvoice,
 defaultValues,
} from '../../../schemas/guest-expenses/guestExpensesInvoice';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type InvoicesProps } from '../../../utils/guest-expenses/InvoicesProps';
import { type EditInvoiceProps } from '../../../utils/guest-expenses/EditInvoiceProps';
// import StayExpensesFilters from './StayExpensesFilters';
// import StayExpensesList from './StayExpensesList';
import RevenueExpensesFilters from './RevenueExpensesFilters';
import RevenueExpensesList from './RevenueExpensesList';
import { useState } from 'react';

export default function RevenueExpenses({
 dic,
 registerID,
 roomID,
}: {
 dic: RoomsRackDictionary;
 registerID: number;
 roomID: number;
}) {
 const queryClient = useQueryClient();
 const filtersUseForm = useForm<GuestExpensesInvoice>({
  resolver: zodResolver(createGuestExpensesInvoice()),
  defaultValues: {
   ...defaultValues,
  },
 });
 const [selectedInvoiceID, setSelectedInvoiceID] = useState<number | null>(
  null,
 );
 const [showEditInvoice, setShowEditInvoice] = useState(false);
 const [dateValue, costCenterValue] = filtersUseForm.watch([
  'date',
  'costCenter',
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
  data: invoices,
  isSuccess: invoicesIsSuccess,
  isLoading: invoicesIsLoading,
  isError: invoicesIsError,
  isFetching: invoicesIsFetching,
  refetch: invoicesRefetch,
 } = useQuery({
  queryKey: [
   roomsRackBaseKey,
   'guest-expenses',
   'invoices',
   registerID.toString(),
   dateValue?.toISOString(),
   costCenterValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getInvoices({
    signal,
    registerID: registerID,
    date: dateValue?.toISOString(),
    programID: costCenterValue?.key,
   });
   return res.data;
  },
 });
 const selectedInvoice =
  selectedInvoiceID && invoicesIsSuccess
   ? invoices.find((rev) => rev.id === selectedInvoiceID) || null
   : null;

 function handleShowEditInvoice(id: number | null) {
  setSelectedInvoiceID(id);
  setShowEditInvoice(true);
 }

 function handleCloseEditInvoice() {
  setSelectedInvoiceID(null);
  setShowEditInvoice(false);
 }

 function invalidateInvoices() {
  queryClient.invalidateQueries({
   queryKey: [roomsRackBaseKey, 'guest-expenses', 'invoices'],
  });
 }

 const invoicesProps: InvoicesProps = {
  data: invoices,
  isError: invoicesIsError,
  isFetching: invoicesIsFetching,
  isSuccess: invoicesIsSuccess,
  isLoading: invoicesIsLoading,
  refetch: invoicesRefetch,
 };

 const editInvoiceProps: EditInvoiceProps = {
  registerID,
  roomID,
  showEdit: showEditInvoice,
  selectedInvoice,
  selectedInvoiceID,
  onCloseEditInvoice: handleCloseEditInvoice,
  invalidateInvoices,
  onShowEditInvoice: handleShowEditInvoice,
  arzs: initialData?.arzs,
 };

 return (
  <div>
   <FormProvider {...filtersUseForm}>
    <RevenueExpensesFilters
     dic={dic}
     initialData={initialData}
     initialDataIsLoading={initialDataIsLoading}
     editRevenueProps={editInvoiceProps}
    />
    <RevenueExpensesList
     dic={dic}
     invoicesProps={invoicesProps}
     editRevenue={editInvoiceProps}
    />
   </FormProvider>
  </div>
 );
}
