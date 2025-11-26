import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderShoppingList from './OrderShoppingList';

export default function OrderShoppingCard({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 return (
  <div>
   <OrderShoppingList dic={dic} />
  </div>
 );
}
