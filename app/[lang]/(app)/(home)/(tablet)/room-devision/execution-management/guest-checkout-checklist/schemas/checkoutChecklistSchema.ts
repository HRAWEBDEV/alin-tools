import { z } from 'zod';

const defaultValues: Partial<CheckoutChecklistSchema> = {
 fromDate: null,
 toDate: null,
 room: null,
 maid: null,
 comment: '',
};

function createCheckoutChecklistSchema() {
 return z.object({
  fromDate: z.date().nullable(),
  toDate: z.date().nullable(),
  room: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  maid: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  comment: z.string(),
 });
}

type CheckoutChecklistSchema = z.infer<
 ReturnType<typeof createCheckoutChecklistSchema>
>;

export type { CheckoutChecklistSchema };
export { createCheckoutChecklistSchema, defaultValues };
