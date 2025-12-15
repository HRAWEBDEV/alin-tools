import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { z } from 'zod';

const defaultOrderInfo: Partial<OrderInfo> = {
 saleTime: null,
 saleType: null,
 waiter: null,
 contract: null,
 subscriber: null,
 customer: null,
 room: null,
 comment: '',
};

function createOrderInfoSchema({}: { dic: NewOrderDictionary }) {
 return z.object({
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
  subscriber: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  room: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
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
  comment: z.string(),
  persons: z.literal('').or(z.number()),
  discountRate: z.literal('').or(z.number()),
  bonNo: z.literal('').or(z.number()),
  rounding: z.literal('').or(z.number()),
  employeeTip: z.literal('').or(z.number()),
  deliveryValue: z.literal('').or(z.number()),
  hasService: z.boolean(),
  hasTableNo: z.boolean(),
  sendToKitchen: z.boolean(),
  printCash: z.boolean(),
  deliveryAgent: z.boolean(),
 });
}

type OrderInfo = z.infer<ReturnType<typeof createOrderInfoSchema>>;

export type { OrderInfo };
export { defaultOrderInfo, createOrderInfoSchema };
