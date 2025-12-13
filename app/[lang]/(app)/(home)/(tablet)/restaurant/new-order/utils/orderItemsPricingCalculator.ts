import {
 type OrderItem,
 type OrderServiceRates,
} from '../services/newOrderApiActions';

const orderItemsPricingCalculator = ({
 orderItem,
 serviceDiscountRates,
 defaultDiscountRate,
 hasService,
 amount,
}: {
 orderItem: OrderItem;
 serviceDiscountRates: OrderServiceRates;
 defaultDiscountRate: number;
 hasService: boolean;
 amount: number;
}) => {
 const serviceRate = serviceDiscountRates
  ? serviceDiscountRates.serviceRate
  : hasService
    ? orderItem.serviceRate
    : 0;
 const discountRate = serviceDiscountRates
  ? serviceDiscountRates.discountRate
  : defaultDiscountRate || 0;
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
