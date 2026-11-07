import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type Order } from '../../../new-order/services/newOrderApiActions';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-2 mb-2 border-b border-border font-medium text-sm';
const invoiceLabelClass =
 'shrink-0 w-32 text-neutral-700 dark:text-neutral-400';

export default function PaymentInvoice({
 dic,
 order,
 userOrderItemsTotalNetValue,
}: {
 dic: SalonsDictionary;
 order: Order;
 userOrderItemsTotalNetValue: number;
}) {
 const { format } = useCurrencyFormatter();
 return (
  <div className='mt-2'>
   <div className='grid grid-cols-2 gapy-1 text-sm'>
    <div>
     <span className='text-neutral-700 dark:text-neutral-400'>
      {dic.orderPayment.orderNo}:{' '}
     </span>
     <span className='font-medium'>{order.orderNo}</span>
    </div>
    <div>
     <span className='text-neutral-700 dark:text-neutral-400'>
      {dic.orderPayment.tableNo}:{' '}
     </span>
     <span className='font-medium'>{order.tableNo}</span>
    </div>
    <div>
     <span className='text-neutral-700 dark:text-neutral-400'>
      {dic.orderPayment.customer}:{' '}
     </span>
     <span className='font-medium'>{order.customerName || '---'}</span>
    </div>
    <div>
     <span className='text-neutral-700 dark:text-neutral-400'>
      {dic.orderPayment.name}:{' '}
     </span>
     <span className='font-medium'>{order.name || '---'} </span>
    </div>
   </div>
   <div className='w-[min(100%,35rem)] mx-auto pt-2'>
    <div className='p-4 py-2 border border-border rounded-md bg-neutral-50 dark:bg-neutral-950 mb-2'>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.orderPayment.service}
      </span>
      <span className='font-medium'>{format(order.service)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.orderPayment.tax}
      </span>
      <span className='font-medium'>{format(order.tax)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '} {dic.orderPayment.other}
      </span>
      <span className='font-medium'>
       {format(order.delivaryValue + order.tipValue + order.roundingValue)} ریال
      </span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '} {dic.orderPayment.itemsTotalPrice}
      </span>
      <span className='font-medium'>
       {format(userOrderItemsTotalNetValue)} ریال
      </span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.orderPayment.discount}
      </span>
      <span className='font-medium'>{format(order.discount)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.orderPayment.payment}
      </span>
      <span className='font-medium'>{format(order.payment)} ریال</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-primary/5 border-none text-primary rounded-md text-xl! mb-0!'
      }
     >
      <span className={invoiceLabelClass}>{dic.orderPayment.remained}</span>
      <span className='font-medium'>{format(order.payableValue)} ریال</span>
     </div>
    </div>
   </div>
  </div>
 );
}
