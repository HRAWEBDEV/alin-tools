import { z } from 'zod';

const defaultValues: Partial<InvoiceDetailsFiltersSchema> = {
 date: null,
};

function invoiceDetailsFiltersSchema() {
 return z.object({
  date: z.date().nullable(),
 });
}

type InvoiceDetailsFiltersSchema = z.infer<
 ReturnType<typeof invoiceDetailsFiltersSchema>
>;

export type { InvoiceDetailsFiltersSchema };
export { defaultValues, invoiceDetailsFiltersSchema };
