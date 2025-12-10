import { type OrderItem } from '../services/newOrderApiActions';

type ShopCalculator = ReturnType<typeof shopCalculator>;

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
   const newSValue = Number(sValue + totalSValue);
   const newPrice = Number(price + totalPrice);
   const newService = Number(service + totalService);
   const newTax = Number(tax + totalTax);
   const newDiscount = Number(discount + totalDiscount);
   const newRemained = Number(
    newSValue - newDiscount + newService + newTax + other - payment,
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

export { type ShopCalculator, shopCalculator };
