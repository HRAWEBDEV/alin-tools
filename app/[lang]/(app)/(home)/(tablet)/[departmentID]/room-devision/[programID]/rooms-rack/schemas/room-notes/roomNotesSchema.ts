import { z } from 'zod';
import { noteStateTypes } from '../../utils/room-notes/noteStateTypes';

const defaultValues: RoomNotesSchema = {
 fromDate: null,
 untilDate: null,
 noteState: noteStateTypes[0],
 noteType: null,
 comment: '',
};

function createRoomNotesSchema() {
 return z
  .object({
   fromDate: z.date().nullable(),
   untilDate: z.date().nullable(),
   noteType: z
    .object({
     key: z.string(),
     value: z.string(),
    })
    .nullable(),
   noteState: z
    .object({
     key: z.string(),
     value: z.enum(noteStateTypes.map((item) => item.value)),
    })
    .nullable(),
   comment: z.string().min(1),
  })
  .refine(({ noteType }) => !!noteType, {
   path: ['noteType'],
  });
}

type RoomNotesSchema = z.infer<ReturnType<typeof createRoomNotesSchema>>;

export type { RoomNotesSchema };
export { defaultValues, createRoomNotesSchema };
