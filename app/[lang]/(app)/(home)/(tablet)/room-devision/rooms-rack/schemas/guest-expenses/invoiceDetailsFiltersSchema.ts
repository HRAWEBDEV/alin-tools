import { z } from 'zod';

const defaultValues: InvoiceDetailsFiltersSchema = {
 date: null,
 costCenter: null,
 payBy: 'guest',
};

function createInvoiceDetailsFiltersSchema() {
 return z.object({
  date: z.date().nullable(),
  costCenter: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  payBy: z.enum(['guest', 'group']),
 });
}

type InvoiceDetailsFiltersSchema = z.infer<
 ReturnType<typeof createInvoiceDetailsFiltersSchema>
>;

export type { InvoiceDetailsFiltersSchema };
export { defaultValues, createInvoiceDetailsFiltersSchema };
