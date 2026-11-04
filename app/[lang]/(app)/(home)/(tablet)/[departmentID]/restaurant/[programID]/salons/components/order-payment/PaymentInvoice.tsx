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
}: {
 dic: SalonsDictionary;
 order: Order;
}) {
 const { format } = useCurrencyFormatter();
 return (
  <div className='mt-2'>
   <div className='grid grid-cols-2 gap-1 text-sm'>
    <div>
     <span>{dic.orderPayment.orderNo}: </span>
     <span>{order.orderNo}</span>
    </div>
    <div>
     <span>{dic.orderPayment.tableNo}: </span>
     <span>{order.tableNo}</span>
    </div>
    <div>
     <span>{dic.orderPayment.customer}: </span>
     <span>{order.customerName}</span>
    </div>
    <div>
     <span>{dic.orderPayment.name}: </span>
     <span>{order.name}</span>
    </div>
   </div>
   <div className='w-[min(100%,35rem)] mx-auto pt-2'>
    <div className='p-4 py-2 border border-border rounded-md bg-neutral-50 dark:bg-neutral-950 mb-2'>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.orderPayment.service}
      </span>
      <span>{format(order.service)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.orderPayment.tax}
      </span>
      <span>{format(order.tax)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '} {dic.orderPayment.other}
      </span>
      <span>
       {format(order.delivaryValue + order.tipValue + order.roundingValue)} ریال
      </span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.orderPayment.discount}
      </span>
      <span>{format(order.discount)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.orderPayment.payment}
      </span>
      <span>{format(order.payment)} ریال</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-primary/5 border-none text-primary rounded-md text-xl! mb-0!'
      }
     >
      <span className={invoiceLabelClass}>{dic.orderPayment.remained}</span>
      <span>{format(order.payableValue)} ریال</span>
     </div>
    </div>
   </div>
  </div>
 );
}
