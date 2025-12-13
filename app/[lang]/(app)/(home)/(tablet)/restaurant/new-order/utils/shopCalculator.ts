import { type OrderItem } from '../services/newOrderApiActions';

type ShopCalculator = ReturnType<typeof shopCalculator>;
interface ShopCalculatorResult {
 totalSValue: number;
 totalPrice: number;
 totalService: number;
 totalTax: number;
 other: number;
 totalDiscount: number;
 remained: number;
 payment: number;
}

const shopCalculator = (
 orderItems: OrderItem[],
 orderPayment: number,
 other: number,
) => {
 return orderItems.reduce(
  (
   {
    totalDiscount,
    totalPrice,
    totalSValue,
    totalService,
    totalTax,
    payment,
    other,
   },
   { discount, service, tax, sValue, price },
  ) => {
   const newSValue = Number((sValue + totalSValue).toFixed(4));
   const newPrice = Number((price + totalPrice).toFixed(4));
   const newService = Number((service + totalService).toFixed(4));
   const newTax = Number((tax + totalTax).toFixed(4));
   const newDiscount = Number((discount + totalDiscount).toFixed(4));
   const newRemained = Number(
    (newSValue - newDiscount + newService + newTax + other - payment).toFixed(
     4,
    ),
   );
   return {
    totalSValue: newSValue,
    totalPrice: newPrice,
    totalService: newService,
    totalTax: newTax,
    other: other,
    totalDiscount: newDiscount,
    remained: newRemained,
    payment: payment,
   };
  },
  {
   totalSValue: 0,
   totalPrice: 0,
   totalService: 0,
   totalTax: 0,
   other: other,
   totalDiscount: 0,
   remained: 0,
   payment: orderPayment,
  },
 );
};

export type { ShopCalculator, ShopCalculatorResult };
export { shopCalculator };
