'use client';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderShoppingItem from './OrderShoppingItem';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';

export default function OrderShoppingList({
 dic,
 searchedOrder,
}: {
 dic: NewOrderDictionary;
 searchedOrder: string;
}) {
 const {
  order: { orderItems },
 } = useOrderBaseConfigContext();
 const visibleOrderItems = searchedOrder
  ? orderItems.filter((item) => item.itemName?.includes(searchedOrder))
  : orderItems;
 return (
  <>
   {visibleOrderItems.length ? (
    <ul>
     {visibleOrderItems.map((orderItem) => (
      <OrderShoppingItem
       key={orderItem.itemID}
       dic={dic}
       orderItem={orderItem}
       searchedOrder={searchedOrder}
      />
     ))}
    </ul>
   ) : (
    <div className='flex flex-col items-center'>
     <NoItemFound />
     {searchedOrder && (
      <div className='text-neutral-600 dark:text-neutral-400'>
       <span>{dic.tools.search}: </span>
       <span>{searchedOrder}</span>
      </div>
     )}
    </div>
   )}
  </>
 );
}
