import { z } from 'zod';

const defaultValues: Pick<
 NewInvoiceSchema,
 'amount' | 'discount' | 'discountPercentage' | 'comment' | 'itemName'
> = {
 amount: 1,
 discount: '',
 discountPercentage: '',
 comment: '',
 itemName: '',
};

function createNewInvoiceSchema() {
 return z.object({
  itemName: z.string().min(1),
  amount: z.number().min(1),
  price: z.number().positive(),
  discount: z.literal('').or(z.number()),
  discountPercentage: z.literal('').or(z.number().max(100)),
  comment: z.string(),
 });
}

type NewInvoiceSchema = z.infer<ReturnType<typeof createNewInvoiceSchema>>;
export type { NewInvoiceSchema };
export { defaultValues, createNewInvoiceSchema };
