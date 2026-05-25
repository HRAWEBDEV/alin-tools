import { useEffect } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { type EditInvoiceProps } from '../../../../utils/guest-expenses/EditInvoiceProps';
import { useQuery } from '@tanstack/react-query';
import {
 getRevenueInvoicesApi,
 getRevenueInvoices,
} from '../../../../services/guest-expenses/guestExpensesApiActions';
import { type InvoiceDetailProps } from '../../../../utils/guest-expenses/InvoiceDetailProps';
import InvoiceDetailsFilters from './InvoiceDetailsFilters';
import InvoiceDetailsList from './InvoiceDetailsList';
import InvoiceDetailsFooter from './InvoiceDetailsFooter';
import { type InitialData } from '../../../../services/guest-expenses/guestExpensesApiActions';
import {
 type InvoiceDetailsFiltersSchema,
 defaultValues,
 createInvoiceDetailsFiltersSchema,
} from '../../../../schemas/guest-expenses/invoiceDetailsFiltersSchema';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function InvoiceDetails({
 dic,
 editInvoice,
 costCenters,
 defaultCostCenter,
}: {
 dic: RoomsRackDictionary;
 editInvoice: EditInvoiceProps;
 costCenters: InitialData['minibarPrograms'];
 defaultCostCenter: InitialData['minibarPrograms'][number];
}) {
 const filtersUseForm = useForm<InvoiceDetailsFiltersSchema>({
  defaultValues,
  resolver: zodResolver(createInvoiceDetailsFiltersSchema()),
 });
 const {
  data: detailInvoices = [],
  isFetching: detailIsFetching,
  isLoading: detailIsLoading,
  isError: detailIsError,
  isSuccess: detailIsSuccess,
  refetch: detailRefetch,
 } = useQuery({
  enabled: !!editInvoice.selectedInvoice?.orderID,
  queryKey: [getRevenueInvoicesApi, editInvoice.selectedInvoice?.orderID],
  placeholderData: [],
  async queryFn({ signal }) {
   const res = await getRevenueInvoices({
    signal,
    orderID: editInvoice.selectedInvoice!.orderID!,
   });
   return res.data.revenues;
  },
 });

 const invoiceDetailProps: InvoiceDetailProps = {
  data: detailInvoices,
  isFetching: detailIsFetching,
  isLoading: detailIsLoading,
  isError: detailIsError,
  refetch: detailRefetch,
  isSuccess: detailIsSuccess,
 };

 useEffect(() => {
  if (editInvoice.selectedInvoice) {
   filtersUseForm.setValue(
    'date',
    new Date(editInvoice.selectedInvoice.dateTimeDateTimeOffset),
   );
   if (editInvoice.selectedInvoice.refProgramID) {
    filtersUseForm.setValue('costCenter', {
     key: editInvoice.selectedInvoice.refProgramID?.toString(),
     value: editInvoice.selectedInvoice.refProgramName || '',
    });
   }
  } else {
   filtersUseForm.setValue('costCenter', defaultCostCenter);
   filtersUseForm.setValue('date', new Date());
  }
 }, [
  editInvoice.selectedInvoice,
  invoiceDetailProps.isSuccess,
  defaultCostCenter,
  filtersUseForm,
 ]);

 return (
  <Dialog
   open={editInvoice.showEdit}
   onOpenChange={() => {
    editInvoice.onCloseEditInvoice();
   }}
  >
   <DialogContent className='w-full h-full max-sm:rounded-none max-w-[unset]! sm:w-[min(98%,70rem)] gap-0 p-0 sm:h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>
       {editInvoice.selectedInvoice
        ? dic.invoiceDetails.editTitle
        : dic.invoiceDetails.addTitle}
       {editInvoice.selectedInvoice && (
        <span className='text-xl text-primary'>
         {' '}
         {editInvoice.selectedInvoice.orderNo}
        </span>
       )}
       {editInvoice.selectedInvoice && (
        <>
         <span> _ {dic.invoiceDetails.room}: </span>
         <span className='text-xl text-primary'>
          {editInvoice.selectedInvoice.roomLabel}
         </span>
        </>
       )}
       {editInvoice.selectedInvoice && (
        <>
         <span> _ {dic.invoiceDetails.bonNo}: </span>
         <span className='text-xl text-primary'>
          {editInvoice.selectedInvoice.bonNo}
         </span>
        </>
       )}
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-2 px-4 grow overflow-auto flex flex-col'>
     <FormProvider {...filtersUseForm}>
      <InvoiceDetailsFilters
       dic={dic}
       results={detailInvoices.length || 0}
       costCenters={costCenters}
      />
      <InvoiceDetailsList dic={dic} invoiceDetailProps={invoiceDetailProps} />
      {invoiceDetailProps.isSuccess && !!invoiceDetailProps.data?.length && (
       <InvoiceDetailsFooter
        dic={dic}
        invoiceDetailProps={invoiceDetailProps}
       />
      )}
     </FormProvider>
    </div>
   </DialogContent>
  </Dialog>
 );
}
