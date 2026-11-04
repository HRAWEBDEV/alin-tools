import { type OrderItem } from '../../../new-order/services/newOrderApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

export default function PaymentShop({
 orderItems,
}: {
 orderItems: OrderItem[];
}) {
 const { format } = useCurrencyFormatter();
 return (
  <div className='mt-2'>
   <ul>
    {orderItems.map((item) => (
     <li key={item.id} className='border-b border-border py-2'>
      <h3 className='mb-2 text-md'>{item.itemName}</h3>
      <div className='flex gap-1'>
       <span>{item.amount} x</span>
       <div> {format(item.netValue)} ریال</div>
      </div>
     </li>
    ))}
   </ul>
  </div>
 );
}
