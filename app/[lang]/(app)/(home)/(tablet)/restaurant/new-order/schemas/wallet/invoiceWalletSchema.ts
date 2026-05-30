import { z } from 'zod';

const defaultValues: InvoiceWalletSchema = {
 phoneNumber: '',
 otpCode: '',
};

function createInvoiceWalletSchema() {
 return z.object({
  phoneNumber: z.string(),
  otpCode: z.string(),
 });
}

type InvoiceWalletSchema = z.infer<
 ReturnType<typeof createInvoiceWalletSchema>
>;

export type { InvoiceWalletSchema };
export { defaultValues, createInvoiceWalletSchema };
