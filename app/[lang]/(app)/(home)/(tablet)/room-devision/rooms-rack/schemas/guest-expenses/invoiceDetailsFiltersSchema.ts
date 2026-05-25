import { z } from 'zod';

const defaultValues: Partial<InvoiceDetailsFiltersSchema> = {
 date: null,
 costCenter: null,
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
 });
}

type InvoiceDetailsFiltersSchema = z.infer<
 ReturnType<typeof createInvoiceDetailsFiltersSchema>
>;

export type { InvoiceDetailsFiltersSchema };
export { defaultValues, createInvoiceDetailsFiltersSchema };
