import { z } from 'zod';
import { timeNoOptions } from '../utils/timeNo';

const defaultValues: Partial<DailyTasksSchema> = {
 maid: null,
 date: null,
 roomType: null,
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
  timeNo: z.enum(timeNoOptions),
 });
}

type DailyTasksSchema = z.infer<ReturnType<typeof createDailyTasksSchema>>;

export type { DailyTasksSchema };
export { defaultValues, createDailyTasksSchema };
