'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 return true ? (
  <div>
   <div className='w-[min(100%,30rem)] mx-auto p-4 border border-input rounded-md bg-neutral-50'>
    <div className={invoiceRowClass}>
     <span className={invoiceLabelClass}>
      {'+ '}
      {dic.invoice.service}:{' '}
     </span>
     <span>12,000,000</span>
    </div>
    <div className={invoiceRowClass}>
     <span className={invoiceLabelClass}>
      {'+ '}
      {dic.invoice.tax}:{' '}
     </span>
     <span>12,000,000</span>
    </div>
    <div className={invoiceRowClass}>
     <span className={invoiceLabelClass}>
      {'+ '}
      {dic.invoice.other}:{' '}
     </span>
     <span>12,000,000</span>
    </div>
    <div className={invoiceRowClass}>
     <span className={invoiceLabelClass}>
      {'- '}
      {dic.invoice.discount}:{' '}
     </span>
     <span>12,000,000</span>
    </div>
    <div
     className={
      invoiceRowClass +
      ' p-2 bg-rose-50 dark:bg-rose-950 border-none text-rose-700 dark:text-rose-400 rounded-md text-xl'
     }
    >
     <span className={invoiceLabelClass}>{dic.invoice.total}: </span>
     <span>12,000,000</span>
    </div>
    <div
     className={
      invoiceRowClass +
      ' p-2 bg-teal-50 dark:bg-teal-950 border-none text-secondary rounded-md text-xl mb-0!'
     }
    >
     <span className={invoiceLabelClass}>{dic.invoice.payment}: </span>
     <span>12,000,000</span>
    </div>
   </div>
  </div>
 ) : (
  <NoItemFound />
 );
}
