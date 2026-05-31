import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { z } from 'zod';

const defaultValues: InvoiceWalletSchema = {
 phoneNumber: '',
};

function createInvoiceWalletSchema({ dic }: { dic: NewOrderDictionary }) {
 return z.object({
  phoneNumber: z.string().min(1, dic.invoice.fillMobileNo),
 });
}

type InvoiceWalletSchema = z.infer<
 ReturnType<typeof createInvoiceWalletSchema>
>;

export type { InvoiceWalletSchema };
export { defaultValues, createInvoiceWalletSchema };
