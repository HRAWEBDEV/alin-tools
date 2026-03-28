import { z } from 'zod';

const defaultValues: Partial<DailyTasksSchema> = {
 date: null,
 roomType: null,
 maid: null,
 timeNo: 'firstTurn',
};

function createDailyTasksSchema() {
 return z.object({
  date: z.date().nullable(),
  roomType: z
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
  timeNo: z.enum(['firstTurn', 'secondTurn', 'thirdTurn']),
 });
}

type DailyTasksSchema = z.infer<ReturnType<typeof createDailyTasksSchema>>;

export type { DailyTasksSchema };
export { defaultValues, createDailyTasksSchema };
