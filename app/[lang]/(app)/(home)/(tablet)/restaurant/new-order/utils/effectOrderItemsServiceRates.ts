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
  return acc + cur.amount * cur.price;
 }, 0);

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
   isLastItem: i === orderItems.length - 1,
  });
  return {
   ...orderItem,
   ...pricing,
  };
 });
}
