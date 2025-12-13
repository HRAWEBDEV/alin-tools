import {
 type ItemProgram,
 type OrderServiceRates,
} from '../services/newOrderApiActions';

const orderItemsPricingCalculator = ({
 itemProgram,
 serviceDiscountRates,
 defaultDiscountRate,
 hasService,
 amount,
}: {
 itemProgram: ItemProgram;
 serviceDiscountRates: OrderServiceRates;
 defaultDiscountRate: number;
 hasService: boolean;
 amount: number;
}) => {
 const serviceRate = serviceDiscountRates
  ? serviceDiscountRates.serviceRate
  : hasService
    ? itemProgram.serviceRate
    : 0;
 const discountRate = serviceDiscountRates
  ? serviceDiscountRates.discountRate
  : defaultDiscountRate || 0;
 const sValue = itemProgram.price * amount;
 const discount = Number(((sValue * discountRate) / 100).toFixed(4));
 const service = Number((((sValue - discount) * serviceRate) / 100).toFixed(4));
 const tax = Number(
  (((sValue - discount + service) * itemProgram.taxRate) / 100).toFixed(4),
 );
 return {
  service,
  serviceRate,
  tax,
  taxRate: itemProgram.taxRate,
  sValue,
  discount,
  discountRate,
  price: itemProgram.price,
  netValue: sValue - discount + tax + service,
 };
};

export { orderItemsPricingCalculator };
