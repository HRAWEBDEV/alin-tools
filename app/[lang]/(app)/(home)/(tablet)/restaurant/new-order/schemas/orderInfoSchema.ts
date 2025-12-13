import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { z } from 'zod';

const defaultOrderInfo: Partial<OrderInfo> = {};

function createOrderInfoSchema({ dic }: { dic: NewOrderDictionary }) {
 return z.object({
  orderDate: z.date(),
  orderTime: z.date(),
  saleTime: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  saleType: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
 });
}

type OrderInfo = z.infer<ReturnType<typeof createOrderInfoSchema>>;

export type { OrderInfo };
export { defaultOrderInfo, createOrderInfoSchema };
