import { z } from 'zod';

const defaultValues: Partial<NewStayExpenseSchema> = {
 amount: 1,
 arz: null,
 item: null,
 discount: '',
 discountPercentage: '',
 comment: '',
};

function createNewStayExpenseSchema() {
 return z
  .object({
   dateTime: z.date().nullable(),
   arz: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
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
  .refine(({ dateTime }) => !!dateTime, {
   path: ['dateTime'],
  })
  .refine(({ arz }) => !!arz, {
   path: ['arz'],
  })
  .refine(({ item }) => !!item, {
   path: ['item'],
  });
}

type NewStayExpenseSchema = z.infer<
 ReturnType<typeof createNewStayExpenseSchema>
>;
export type { NewStayExpenseSchema };
export { defaultValues, createNewStayExpenseSchema };
