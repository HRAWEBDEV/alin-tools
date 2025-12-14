'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { Spinner } from '@/components/ui/spinner';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 const {
  shopLoading,
  queries: { orderID },
  order: { orderItems },
  invoice: {
   orderTotals: {
    totalTax,
    other,
    payment,
    remained,
    totalDiscount,
    totalService,
    totalSValue,
   },
  },
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();

 return orderItems.length ? (
  <div>
   <div className='w-[min(100%,30rem)] mx-auto pt-2'>
    <div className='p-4 border border-input rounded-md bg-neutral-50 dark:bg-neutral-950 mb-4'>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.service}
      </span>
      <span>{format(totalService)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.tax}
      </span>
      <span>{format(totalTax)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.other}
      </span>
      <span>{format(other)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.invoice.discount}
      </span>
      <span>{format(totalDiscount)}</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-rose-50 dark:bg-rose-950 border-none text-rose-700 dark:text-rose-400 rounded-md text-xl'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.total}</span>
      <span>{format(totalSValue)}</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-teal-50 dark:bg-teal-950 border-secondary text-secondary rounded-md text-xl mb-0!'
      }
     >
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.invoice.payment}
      </span>
      <span>{payment}</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-orange-50 dark:bg-orange-950 border-none text-orange-700 dark:text-orange-400 rounded-md text-xl mb-0!'
      }
     >
      <span className={invoiceLabelClass}>
       {'= '}
       {dic.invoice.remained}
      </span>
      <span>{format(remained)}</span>
     </div>
    </div>
    <div className='grid sm:grid-cols-3 gap-3'>
     <Button disabled={shopLoading} size='lg' className='font-medium'>
      {shopLoading && <Spinner />}
      {dic.invoice.confirmOrder}
     </Button>
     <Button
      disabled={!orderID || shopLoading}
      variant='destructive'
      size='lg'
      className='font-medium disabled:bg-neutral-400 disabled:dark:bg-neutral-600'
     >
      {shopLoading && <Spinner />}
      {dic.invoice.closeOrder}
     </Button>
     <Button
      disabled={shopLoading}
      variant='secondary'
      size='lg'
      className='font-medium'
     >
      {shopLoading && <Spinner />}
      {dic.invoice.confirmPayment}
     </Button>
    </div>
   </div>
  </div>
 ) : (
  <NoItemFound />
 );
}
