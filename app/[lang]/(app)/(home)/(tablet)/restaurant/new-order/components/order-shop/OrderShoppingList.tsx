'use client';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderShoppingItem from './OrderShoppingItem';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';

export default function OrderShoppingList({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const {
  order: { orderItems },
 } = useOrderBaseConfigContext();
 return (
  <>
   {orderItems.length ? (
    <ul>
     {orderItems.map((orderItem) => (
      <OrderShoppingItem
       key={orderItem.itemID}
       dic={dic}
       orderItem={orderItem}
      />
     ))}
    </ul>
   ) : (
    <NoItemFound />
   )}
  </>
 );
}
