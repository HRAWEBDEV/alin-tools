import { z } from 'zod';
import { typeOptions } from '../utils/typeOptions';

const defaultValues: Partial<EntranceAndExitSchema> = {
 date: null,
 type: typeOptions[0],
 floor: null,
 roomType: null,
};

function createEntranceAndExitSchema() {
 return z.object({
  date: z.date().nullable(),
  type: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  floor: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  roomType: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
 });
}

type EntranceAndExitSchema = z.infer<
 ReturnType<typeof createEntranceAndExitSchema>
>;

export type { EntranceAndExitSchema };
export { createEntranceAndExitSchema, defaultValues };
