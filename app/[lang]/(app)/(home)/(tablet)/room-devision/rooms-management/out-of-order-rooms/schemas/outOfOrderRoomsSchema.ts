import { z } from 'zod';

const defaultValues: Partial<OutOfOrderRoomsSchema> = {
 fromDate: null,
 toDate: null,
 reason: null,
 roomType: null,
 room: null,
 floor: null,
 comment: '',
};

function createOutOfOrderRoomsSchema() {
 return z.object({
  fromDate: z.date().nullable(),
  toDate: z.date().nullable(),
  reason: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  room: z
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
  floor: z
   .object({
    key: z.string(),
    value: z.string(),
   })
   .nullable(),
  comment: z.string(),
 });
}

type OutOfOrderRoomsSchema = z.infer<
 ReturnType<typeof createOutOfOrderRoomsSchema>
>;

export type { OutOfOrderRoomsSchema };
export { createOutOfOrderRoomsSchema, defaultValues };
