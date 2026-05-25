import { z } from 'zod';

const defaultValues: Partial<GuestExpensesSchema> = {
 date: null,
 revenueType: null,
};

function createGuestExpensesSchema() {
 return z.object({
  date: z.date().nullable(),
  revenueType: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
 });
}

type GuestExpensesSchema = z.infer<
 ReturnType<typeof createGuestExpensesSchema>
>;

export type { GuestExpensesSchema };
export { defaultValues, createGuestExpensesSchema };
