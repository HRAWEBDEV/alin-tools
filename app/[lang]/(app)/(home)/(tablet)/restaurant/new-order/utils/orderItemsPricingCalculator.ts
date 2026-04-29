import { type OrderItem } from '../services/newOrderApiActions';

const orderItemsPricingCalculator = ({
 orderItem,
 defaultDiscountRate,
 amount,
}: {
 orderItem: OrderItem;
 defaultDiscountRate: number;
 hasService: boolean;
 amount: number;
}) => {
 let discountRate = 0;
 if (!orderItem.noDiscount) {
  if (defaultDiscountRate || defaultDiscountRate === 0) {
   discountRate = defaultDiscountRate;
  } else if (orderItem.discountRate) {
   discountRate = orderItem.discountRate;
  }
 }
 const serviceRate = orderItem.serviceRate;
 const sValue = orderItem.price * amount;
 const discount = Number(((sValue * discountRate) / 100).toFixed(4));
 const service = Number((((sValue - discount) * serviceRate) / 100).toFixed(4));
 const tax = Number(
  (((sValue - discount + service) * orderItem.taxRate) / 100).toFixed(4),
 );
 return {
  service,
  serviceRate,
  tax,
  taxRate: orderItem.taxRate,
  sValue,
  discount,
  discountRate,
  price: orderItem.price,
  netValue: sValue - discount + tax + service,
 };
};

export { orderItemsPricingCalculator };
