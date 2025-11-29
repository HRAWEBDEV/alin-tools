import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderItem from './OrderItem';

export default function OrderItems({}: { dic: NewOrderDictionary }) {
 return (
  <div className='p-4 pt-0'>
   <div className='grid justify-center gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,10.2rem))] sm:grid-cols-[repeat(auto-fill,minmax(12rem,13rem))]'>
    {Array.from({ length: 10 }, (_, i) => i).map((i) => (
     <OrderItem key={i} />
    ))}
   </div>
  </div>
 );
}
