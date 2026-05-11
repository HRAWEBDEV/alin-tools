import { type OrderItem } from '../services/newOrderApiActions';
import { orderItemsPricingCalculator } from './orderItemsPricingCalculator';

export function effectOrderItemsServiceRates({
 orderItems,
 userDiscount,
 fixedDiscountRate,
 hasService,
}: {
 orderItems: OrderItem[];
 userDiscount: number;
 fixedDiscountRate: number;
 hasService: boolean;
}) {
 return orderItems.map((orderItem) => {
  const pricing = orderItemsPricingCalculator({
   orderItem,
   hasService,
   defaultDiscountRate: userDiscount,
   amount: orderItem.amount,
  });
  return {
   ...orderItem,
   ...pricing,
  };
 });
}
