import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { MdTouchApp } from 'react-icons/md';
import { type Revenue } from '../../../services/guest-expenses/guestExpensesApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { calculateTotalValue } from '../../../utils/guest-expenses/revenueCalculator';
import { EditInvoiceProps } from '../../../utils/guest-expenses/EditInvoiceProps';

export default function RevenueExpensesItem({
 dic,
 revenue,
 editRevenue,
}: {
 dic: RoomsRackDictionary;
 revenue: Revenue;
 editRevenue: EditInvoiceProps;
}) {
 const { locale } = useBaseConfig();
 const { format } = useCurrencyFormatter();

 return (
  <>
   <button
    className='border border-border rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate'
    onClick={() => editRevenue.onShowEditInvoice(revenue.id)}
   >
    <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
     <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.guestExpensesInvoice.orderNo}:{' '}
      </span>
      <span className='font-medium text-xl'>{revenue.orderNo}</span>
     </div>
     <div>
      <span className='font-medium text-sm text-neutral-800 dark:text-neutral-200'>
       {new Date(revenue.dateTimeDateTimeOffset).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
       })}
      </span>
     </div>
    </div>
    <div className='flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-lg mb-1 font-medium text-primary text-start grow overflow-hidden text-ellipsis'>
      {revenue.itemName}
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      {dic.guestExpensesInvoice.amount}:{' '}
     </span>
     <span className='font-medium text-lg'>{revenue.amount}</span>
     <p className='ms-2 text-neutral-400 dark:text-neutral-600'>
      <span>{dic.guestExpensesInvoice.payBy} </span>
      <span className='font-medium'>
       {!revenue.entityID || revenue.entityID == 1
        ? dic.guestExpensesInvoice.guest
        : dic.guestExpensesInvoice.group}
      </span>
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      {dic.guestExpensesInvoice.sValue}:{' '}
     </span>
     <p className='font-medium text-lg'>
      {format(revenue.sValue)}
      <span className='text-sm text-neutral-700 dark:text-neutral-400'>
       {' '}
       {revenue.arzName}
      </span>
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      - {dic.guestExpensesInvoice.discount}:{' '}
     </span>
     <p className='font-medium text-lg text-secondary'>
      {format(revenue.discount)}
      <span className='text-sm text-neutral-700 dark:text-neutral-400'>
       {' '}
       {revenue.arzName}
      </span>
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      + {dic.guestExpensesInvoice.service}:{' '}
     </span>
     <p className='font-medium text-lg text-destructive'>
      {format(revenue.service)}
      <span className='text-sm text-neutral-700 dark:text-neutral-400'>
       {' '}
       {revenue.arzName}
      </span>
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      + {dic.guestExpensesInvoice.tax}:{' '}
     </span>
     <p className='font-medium text-lg text-destructive'>
      {format(revenue.tax)}
      <span className='text-sm text-neutral-700 dark:text-neutral-400'>
       {' '}
       {revenue.arzName}
      </span>
     </p>
    </div>
    <div className='flex flex-wrap gap-1 items-center mt-2 border-t border-neutral-400 dark:border-neutral-600'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400 basis-16 text-start'>
      = {dic.guestExpensesInvoice.totalPrice}:{' '}
     </span>
     <p className='font-medium text-lg text-primary'>
      {format(
       calculateTotalValue({
        sValue: revenue.sValue,
        discount: revenue.discount,
        serviceRate: revenue.service,
        taxRate: revenue.tax,
       }),
      )}
      <span className='text-sm text-neutral-700 dark:text-neutral-400'>
       {' '}
       {revenue.arzName}
      </span>
     </p>
    </div>
    <div className='flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-base mb-1 font-medium text-destructive/70 text-start grow overflow-hidden text-ellipsis'>
      {/*{room.reasonName}*/}
     </p>
    </div>
   </button>
  </>
 );
}
