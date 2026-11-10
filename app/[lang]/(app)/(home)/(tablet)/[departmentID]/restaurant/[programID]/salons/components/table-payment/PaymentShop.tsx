import { type OrderItem } from '../../../new-order/services/newOrderApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';

export default function PaymentShop({
 orderItems,
 dic,
}: {
 orderItems: OrderItem[];
 dic: SalonsDictionary;
 userOrderItemsTotalNetValue: number;
}) {
 const { format } = useCurrencyFormatter();
 return (
  <div className='my-2'>
   <ul>
    {orderItems.map((item) => (
     <li
      key={item.id}
      className='not-last:border-b not-last:border-border py-2'
     >
      <h3 className='mb-2 text-md font-medium'>{item.itemName}</h3>
      <div className='flex gap-4 gap-x-8 flex-wrap'>
       <div>
        <span className='text-neutral-700 dark:text-neutral-400'>
         {dic.orderPayment.amount}:{' '}
        </span>
        <span className='font-medium'>{item.amount}</span>
       </div>
       <div>
        <span className='text-neutral-700 dark:text-neutral-400'>
         {dic.orderPayment.tatalPrice}:{' '}
        </span>
        <span className='font-medium'>
         {format(Math.ceil(item.netValue))} ریال
        </span>
       </div>
      </div>
     </li>
    ))}
   </ul>
  </div>
 );
}
