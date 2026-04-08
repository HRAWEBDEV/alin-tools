import { z } from 'zod';

const defaultValues: Partial<RoomControlSchema> = {
 floor: null,
 roomType: null,
};

function createRoomControlSchema() {
 return z.object({
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

type RoomControlSchema = z.infer<ReturnType<typeof createRoomControlSchema>>;

export type { RoomControlSchema };
export { defaultValues, createRoomControlSchema };
