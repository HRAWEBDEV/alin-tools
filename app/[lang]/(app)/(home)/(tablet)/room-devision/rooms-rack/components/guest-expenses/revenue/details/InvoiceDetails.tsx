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
import { InvoiceDetailProps } from '../../../../utils/guest-expenses/InvoiceDetailProps';
import InvoiceDetailsList from './InvoiceDetailsList';
import InvoiceDetailsFooter from './InvoiceDetailsFooter';

export default function InvoiceDetails({
 dic,
 editInvoice,
}: {
 dic: RoomsRackDictionary;
 editInvoice: EditInvoiceProps;
}) {
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
         <span> _ {dic.guestExpensesInvoice.room}: </span>
         <span className='text-xl text-primary'>
          {editInvoice.selectedInvoice.roomLabel}
         </span>
        </>
       )}
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-2 px-4 grow overflow-auto flex flex-col'>
     <InvoiceDetailsList dic={dic} invoiceDetailProps={invoiceDetailProps} />
     {invoiceDetailProps.isSuccess && !!invoiceDetailProps.data?.length && (
      <InvoiceDetailsFooter dic={dic} invoiceDetailProps={invoiceDetailProps} />
     )}
    </div>
   </DialogContent>
  </Dialog>
 );
}
