import {
 type OrderItem,
 type OrderServiceRates,
} from '../services/newOrderApiActions';
import { orderItemsPricingCalculator } from './orderItemsPricingCalculator';

export function effectOrderItemsServiceRates({
 orderItems,
 serviceRates,
 userDiscount,
 hasService,
}: {
 orderItems: OrderItem[];
 serviceRates: OrderServiceRates;
 userDiscount: number;
 hasService: boolean;
}) {
 return orderItems.map((orderItem) => {
  const pricing = orderItemsPricingCalculator({
   orderItem,
   hasService,
   serviceDiscountRates: serviceRates,
   defaultDiscountRate: userDiscount,
   amount: orderItem.amount,
  });
  return {
   ...orderItem,
   ...pricing,
  };
 });
}
