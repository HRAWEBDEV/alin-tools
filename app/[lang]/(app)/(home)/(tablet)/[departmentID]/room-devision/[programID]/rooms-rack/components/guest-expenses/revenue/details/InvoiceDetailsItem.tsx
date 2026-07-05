import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { MdTouchApp } from 'react-icons/md';
import { type Invoice } from '../../../../services/guest-expenses/guestExpensesApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { calculateInvoiceTotalValue } from '../../../../utils/guest-expenses/invoiceCalculator';
import { type EditInvoiceDetailProps } from '../../../../utils/guest-expenses/EditInvoiceDetailProps';

export default function InvoiceDetailsItem({
 dic,
 invoice,
 editInvoiceProps,
}: {
 dic: RoomsRackDictionary;
 invoice: Invoice;
 editInvoiceProps: EditInvoiceDetailProps;
}) {
 const { format } = useCurrencyFormatter();

 return (
  <>
   <button
    className='border border-border rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate'
    onClick={() => editInvoiceProps.onShowEditInvoice(invoice.id)}
   >
    <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
     <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.invoiceDetails.code}:{' '}
      </span>
      <span className='font-medium text-xl'>{invoice.itemCode}</span>
     </div>
    </div>
    <div className='flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-lg mb-1 font-medium text-primary text-start grow overflow-hidden text-ellipsis'>
      {invoice.itemName}
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      {dic.invoiceDetails.amount}:{' '}
     </span>
     <span className='font-medium text-lg'>{invoice.amount}</span>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      {dic.invoiceDetails.sValue}:{' '}
     </span>
     <p className='font-medium text-lg'>{format(invoice.sValue)}</p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      - {dic.invoiceDetails.discount}:{' '}
     </span>
     <p className='font-medium text-lg text-secondary'>
      {format(invoice.discount)}
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      + {dic.invoiceDetails.service}:{' '}
     </span>
     <p className='font-medium text-lg text-destructive'>
      {format(invoice.service)}
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      + {dic.invoiceDetails.tax}:{' '}
     </span>
     <p className='font-medium text-lg text-destructive'>
      {format(invoice.tax)}
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center mt-2 border-t border-neutral-400 dark:border-neutral-600'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      = {dic.invoiceDetails.totalPrice}:{' '}
     </span>
     <p className='font-medium text-lg text-primary'>
      {format(
       calculateInvoiceTotalValue({
        price: invoice.sValue / invoice.amount,
        amount: invoice.amount,
        discount: invoice.discount,
        service: invoice.service,
        tax: invoice.tax,
       }),
      )}
     </p>
    </div>
   </button>
  </>
 );
}
