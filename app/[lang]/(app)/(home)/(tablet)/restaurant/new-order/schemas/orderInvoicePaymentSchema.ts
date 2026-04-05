import { z } from 'zod';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

const defaultValues: Partial<OrderInvoicePayment> = {
 paymentRefNo: '',
 bank: null,
 cardReader: null,
 paymentType: null,
 mobileNo: '',
 nationalCode: '',
 otpCode: '',
 walletKey: '',
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
   paymentRefNo: z.string().optional(),
   nationalCode: z.string().optional(),
   mobileNo: z.string().optional(),
   otpCode: z.string().optional(),
   walletKey: z.string().optional(),
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
    return paymentType?.key !== '1' &&
     paymentType?.key !== '2' &&
     paymentType?.key !== '6'
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
    return paymentType?.key !== '1' && paymentType?.key !== '6' ? !!bank : true;
   },
   {
    path: ['bank'],
    message: dic.invoice.selectBank,
   },
  )
  .refine(
   ({ paymentType, cardReader }) => {
    return paymentType?.key === '2' ? !!cardReader : true;
   },
   {
    path: ['cardReader'],
    message: dic.invoice.selectCardReader,
   },
  )
  .refine(
   ({ paymentType, nationalCode, mobileNo }) => {
    if (paymentType?.key === '6') {
     return !!nationalCode || !!mobileNo;
    }
    return true;
   },
   {
    path: ['nationalCode'],
    message: dic.invoice.fillMobileNoOrNationalCode,
   },
  );
}

type OrderInvoicePayment = z.infer<
 ReturnType<typeof createOrderInvoicePaymentSchema>
>;

export type { OrderInvoicePayment };
export { defaultValues, createOrderInvoicePaymentSchema };
