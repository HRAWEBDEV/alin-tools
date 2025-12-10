'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 return true ? (
  <div>
   <div className='w-[min(100%,30rem)] mx-auto pt-2'>
    <div className='p-4 border border-input rounded-md bg-neutral-50 mb-4'>
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
       ' p-2 sm:px-8 bg-rose-50 dark:bg-rose-950 border-none text-rose-700 dark:text-rose-400 rounded-md text-xl'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.total}: </span>
      <span>12,000,000</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-teal-50 dark:bg-teal-950 border-secondary text-secondary rounded-md text-xl mb-0!'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.payment}: </span>
      <span>12,000,000</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-orange-50 dark:bg-orange-950 border-none text-orange-700 dark:text-orange-400 rounded-md text-xl mb-0!'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.remained}: </span>
      <span>12,000,000</span>
     </div>
    </div>
    <div className='grid sm:grid-cols-3 gap-3'>
     <Button size='lg' className='font-medium'>
      {dic.invoice.confirmOrder}
     </Button>
     <Button variant='destructive' size='lg' className='font-medium'>
      {dic.invoice.closeOrder}
     </Button>
     <Button variant='secondary' size='lg' className='font-medium'>
      {dic.invoice.confirmPayment}
     </Button>
    </div>
   </div>
  </div>
 ) : (
  <NoItemFound />
 );
}
