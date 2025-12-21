import { z } from 'zod';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

const defaultValues: Partial<OrderInvoicePayment> = {
 paymentRefNo: '',
 bank: null,
 cardReader: null,
 paymentType: null,
};

function createOrderInvoicePaymentSchema({ dic }: { dic: NewOrderDictionary }) {
 return z.object({
  paymentType: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  bank: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  cardReader: z
   .object({
    key: z.string(),
    value: z.string(),
    posTablet: z.boolean(),
   })
   .nullable(),
  paymentRefNo: z.string(),
 });
}

type OrderInvoicePayment = z.infer<
 ReturnType<typeof createOrderInvoicePaymentSchema>
>;

export type { OrderInvoicePayment };
export { defaultValues, createOrderInvoicePaymentSchema };
