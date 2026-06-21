import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { z } from 'zod';
import { SaleTypes } from '../utils/SaleTypes';

const defaultOrderInfo: Partial<OrderInfo> = {
 saleTime: null,
 saleType: null,
 waiter: null,
 contract: null,
 customerContract: null,
 subscriber: null,
 customer: null,
 employee: null,
 room: null,
 comment: '',
 hasService: true,
 hasTableNo: true,
 sendToKitchen: false,
 printCash: false,
 deliveryAgent: false,
 persons: '',
 discountRate: '',
 fixedDiscount: '',
 bonNo: '',
 rounding: '',
 employeeTip: '',
 deliveryValue: '',
 customerName: '',
 phoneNumber: '',
 firstName: '',
 lastName: '',
 walletOtpCode: '',
};

function createOrderInfoSchema({ dic }: { dic: NewOrderDictionary }) {
 return z
  .object({
   orderDate: z.date(),
   saleTime: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   waiter: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   contract: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   customerContract: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   subscriber: z
    .object({
     key: z.string(),
     value: z.string(),
     customerName: z.string(),
    })
    .nullable(),
   room: z
    .object({
     key: z.string(),
     value: z.string(),
     customerName: z.string(),
    })
    .nullable(),
   customerName: z.string(),
   customer: z
    .object({
     key: z.string(),
     value: z.string(),
     code: z.string(),
    })
    .nullable(),
   saleType: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   table: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   employee: z
    .object({
     key: z.string(),
     code: z.string(),
     value: z.string(),
    })
    .nullable(),
   comment: z.string(),
   persons: z.literal('').or(z.number()),
   discountRate: z.literal('').or(z.number()),
   fixedDiscount: z.literal('').or(z.number()),
   bonNo: z.literal('').or(z.number()),
   rounding: z.literal('').or(z.number()),
   employeeTip: z.literal('').or(z.number()),
   deliveryValue: z.literal('').or(z.number()),
   hasService: z.boolean(),
   hasTableNo: z.boolean(),
   sendToKitchen: z.boolean(),
   printCash: z.boolean(),
   deliveryAgent: z.boolean(),
   phoneNumber: z.string(),
   firstName: z.string(),
   lastName: z.string(),
   walletOtpCode: z.string(),
  })
  .refine(
   ({ phoneNumber, firstName, walletOtpCode }) => {
    return phoneNumber && !walletOtpCode ? !!firstName : true;
   },
   {
    path: ['firstName'],
    message: dic.orderInfo.enterFirstName,
   },
  )
  .refine(
   ({ phoneNumber, lastName, walletOtpCode }) => {
    return phoneNumber && !walletOtpCode ? !!lastName : true;
   },
   {
    path: ['lastName'],
    message: dic.orderInfo.enterLastName,
   },
  )
  .refine(
   ({ room, saleType }) => {
    return saleType?.key === SaleTypes.room ? !!room : true;
   },
   {
    path: ['room'],
    message: dic.orderInfo.noRoomSelected,
   },
  )
  .refine(
   ({ employee, saleType }) => {
    return saleType?.key === SaleTypes.employee ? !!employee : true;
   },
   {
    path: ['employee'],
    message: dic.orderInfo.noEmployeeSelected,
   },
  )
  .refine(
   ({ subscriber, saleType }) => {
    return saleType?.key === SaleTypes.delivery ? !!subscriber : true;
   },
   {
    path: ['subscriber'],
    message: dic.orderInfo.noSubscriberSelected,
   },
  );
}

type OrderInfo = z.infer<ReturnType<typeof createOrderInfoSchema>>;

export type { OrderInfo };
export { defaultOrderInfo, createOrderInfoSchema };
