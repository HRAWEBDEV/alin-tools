import { z } from 'zod';

const defaultValues: Partial<RoomNotesSchema> = {
 fromDate: null,
 untilDate: null,
 noteState: null,
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
     value: z.string(),
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
