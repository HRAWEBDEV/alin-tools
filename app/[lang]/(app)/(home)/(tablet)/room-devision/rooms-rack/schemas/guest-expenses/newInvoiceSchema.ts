import { z } from 'zod';

const defaultValues: Pick<
 NewInvoiceSchema,
 'amount' | 'item' | 'discount' | 'discountPercentage' | 'comment'
> = {
 amount: 1,
 item: null,
 discount: '',
 discountPercentage: '',
 comment: '',
};

function createNewInvoiceSchema() {
 return z
  .object({
   item: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   amount: z.number().min(1),
   price: z.number().positive(),
   discount: z.literal('').or(z.number()),
   discountPercentage: z.literal('').or(z.number().max(100)),
   comment: z.string(),
  })
  .refine(({ item }) => !!item, {
   path: ['item'],
  });
}

type NewInvoiceSchema = z.infer<ReturnType<typeof createNewInvoiceSchema>>;
export type { NewInvoiceSchema };
export { defaultValues, createNewInvoiceSchema };
