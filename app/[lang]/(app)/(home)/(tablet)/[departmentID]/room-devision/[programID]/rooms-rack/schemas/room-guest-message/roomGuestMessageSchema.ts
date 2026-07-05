import { z } from 'zod';

const defaultValues: Partial<RoomGuestMessageSchema> = {
 comment: '',
 fromPerson: '',
 toPerson: '',
};

function createRoomGuestMessageSchema() {
 return z.object({
  fromPerson: z.string().min(1),
  toPerson: z.string().min(1),
  comment: z.string().min(1),
 });
}

type RoomGuestMessageSchema = z.infer<
 ReturnType<typeof createRoomGuestMessageSchema>
>;

export type { RoomGuestMessageSchema };
export { defaultValues, createRoomGuestMessageSchema };
