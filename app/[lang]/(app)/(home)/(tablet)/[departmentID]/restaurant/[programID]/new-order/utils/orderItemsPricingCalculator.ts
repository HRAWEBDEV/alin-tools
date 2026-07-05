import { type OrderItem } from '../services/newOrderApiActions';

const orderItemsPricingCalculator = ({
 orderItem,
 defaultDiscountRate,
 amount,
 fixedDiscount,
 shopSValue,
 remainedFixedDiscount,
 usedRemainedFixedDiscount,
 isLastItem,
}: {
 orderItem: OrderItem;
 defaultDiscountRate: number;
 fixedDiscount: number;
 hasService: boolean;
 amount: number;
 shopSValue: number;
 remainedFixedDiscount: number;
 usedRemainedFixedDiscount: (used: number) => number;
 isLastItem: boolean;
}) => {
 const sValue = orderItem.price * amount;
 let discountRate = 0;
 if (!orderItem.noDiscount) {
  if (fixedDiscount && shopSValue) {
   const itemWeight = Number((sValue / shopSValue).toFixed(2));
   let usedDiscount = fixedDiscount * itemWeight;
   const discountDiffenrence = usedRemainedFixedDiscount(usedDiscount);
   if (isLastItem) {
    usedDiscount = usedDiscount + discountDiffenrence;
   }
   discountRate = (usedDiscount / sValue) * 100;
  } else if (defaultDiscountRate || defaultDiscountRate === 0) {
   discountRate = defaultDiscountRate;
  } else if (orderItem.discountRate) {
   discountRate = orderItem.discountRate;
  }
 }
 const serviceRate = orderItem.serviceRate;
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
