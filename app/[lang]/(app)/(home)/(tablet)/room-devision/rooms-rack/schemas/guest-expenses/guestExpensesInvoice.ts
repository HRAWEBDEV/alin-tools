import { z } from 'zod';

const defaultValues: Partial<GuestExpensesInvoice> = {
 date: null,
 costCenter: null,
};

function createGuestExpensesInvoice() {
 return z.object({
  date: z.date().nullable(),
  costCenter: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
 });
}

type GuestExpensesInvoice = z.infer<
 ReturnType<typeof createGuestExpensesInvoice>
>;

export type { GuestExpensesInvoice };
export { defaultValues, createGuestExpensesInvoice };
