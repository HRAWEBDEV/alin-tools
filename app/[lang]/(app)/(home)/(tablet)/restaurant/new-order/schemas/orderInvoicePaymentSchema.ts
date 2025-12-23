import { z } from 'zod';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

const defaultValues: Partial<OrderInvoicePayment> = {
 paymentRefNo: '',
 bank: null,
 cardReader: null,
 paymentType: null,
};

function createOrderInvoicePaymentSchema({ dic }: { dic: NewOrderDictionary }) {
 return z
  .object({
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
    .nullable()
    .optional(),
   cardReader: z
    .object({
     key: z.string(),
     value: z.string(),
     posTablet: z.boolean(),
    })
    .nullable()
    .optional(),
   paymentRefNo: z.string(),
  })
  .refine(
   ({ paymentType }) => {
    return !!paymentType;
   },
   {
    path: ['paymentType'],
    message: dic.invoice.selectPayType,
   },
  )
  .refine(
   ({ paymentType, paymentRefNo }) => {
    return paymentType?.key !== '1' && paymentType?.key !== '2'
     ? !!paymentRefNo
     : true;
   },
   {
    path: ['paymentRefNo'],
    message: dic.invoice.enterPaymentRefNo,
   },
  )
  .refine(
   ({ paymentType, bank }) => {
    return paymentType?.key !== '1' ? !!bank : true;
   },
   {
    path: ['bank'],
    message: dic.invoice.selectBank,
   },
  );
}

type OrderInvoicePayment = z.infer<
 ReturnType<typeof createOrderInvoicePaymentSchema>
>;

export type { OrderInvoicePayment };
export { defaultValues, createOrderInvoicePaymentSchema };
