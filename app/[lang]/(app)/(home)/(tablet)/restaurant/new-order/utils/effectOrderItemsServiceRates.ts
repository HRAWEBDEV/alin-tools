import { type OrderItem } from '../services/newOrderApiActions';
import { orderItemsPricingCalculator } from './orderItemsPricingCalculator';
import { shopCalculator } from './shopCalculator';

export function effectOrderItemsServiceRates({
 orderItems,
 userDiscount,
 fixedDiscount,
 hasService,
}: {
 orderItems: OrderItem[];
 userDiscount: number;
 fixedDiscount: number;
 hasService: boolean;
}) {
 let remainedFixedDiscount = fixedDiscount;
 function usedRemainedFixedDiscount(usedValue: number) {
  remainedFixedDiscount = remainedFixedDiscount - usedValue;
  return remainedFixedDiscount;
 }
 const totalSValue = orderItems.reduce((acc, cur) => {
  if (cur.noDiscount) return acc;
  return acc + cur.amount * cur.price;
 }, 0);
 const lastNoDiscountItemIndex = orderItems.findLastIndex(
  (item) => !item.noDiscount,
 );
 return orderItems.map((orderItem, i) => {
  const pricing = orderItemsPricingCalculator({
   orderItem,
   hasService,
   defaultDiscountRate: userDiscount,
   amount: orderItem.amount,
   fixedDiscount,
   remainedFixedDiscount,
   usedRemainedFixedDiscount,
   shopSValue: totalSValue,
   isLastItem: i === lastNoDiscountItemIndex,
  });
  return {
   ...orderItem,
   ...pricing,
  };
 });
}
