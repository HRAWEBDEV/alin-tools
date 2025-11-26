import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderShoppingItem from './OrderShoppingItem';

export default function OrderShoppingList({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 return (
  <ul>
   {Array.from({ length: 10 }, (_, i) => i).map((i) => (
    <OrderShoppingItem key={i} dic={dic} />
   ))}
  </ul>
 );
}
