import { z } from 'zod';

const defaultValues: GuestsExpensesSchema = {
 room: null,
 item: null,
 date: null,
};

function createGuestsExpensesFilterSchema() {
 return z.object({
  room: z.string().nullable(),
  item: z.string().nullable(),
  date: z.union([z.string(), z.date()]).nullable(),
 });
}

type GuestsExpensesSchema = z.infer<
 ReturnType<typeof createGuestsExpensesFilterSchema>
>;

export type { GuestsExpensesSchema };
export { createGuestsExpensesFilterSchema, defaultValues };
