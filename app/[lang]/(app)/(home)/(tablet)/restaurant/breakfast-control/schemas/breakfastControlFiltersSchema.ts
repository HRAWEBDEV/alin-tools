import { z } from 'zod';

const defaultValues: BreakfastControlFilters = {
 search: '',
 showServed: true,
 showNotServed: true,
};

function createBreakfastControlFiltersSchema() {
 return z.object({
  search: z.string(),
  showServed: z.boolean(),
  showNotServed: z.boolean(),
 });
}

type BreakfastControlFiltersSchema = z.infer<
 ReturnType<typeof createBreakfastControlFiltersSchema>
>;

export type { BreakfastControlFiltersSchema };
export { defaultValues, createBreakfastControlFiltersSchema };
