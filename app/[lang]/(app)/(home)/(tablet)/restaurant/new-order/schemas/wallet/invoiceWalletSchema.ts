import { z } from 'zod';

const defaultValues: InvoiceWalletSchema = {
 phoneNumber: '',
 otpCode: '',
};

function createInvoiceWalletSchema() {
 return z.object({
  phoneNumber: z.string().min(1),
  otpCode: z.string().min(1),
 });
}

type InvoiceWalletSchema = z.infer<
 ReturnType<typeof createInvoiceWalletSchema>
>;

export type { InvoiceWalletSchema };
export { defaultValues, createInvoiceWalletSchema };
