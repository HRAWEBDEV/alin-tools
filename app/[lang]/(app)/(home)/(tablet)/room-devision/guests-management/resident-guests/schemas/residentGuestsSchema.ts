import { z } from 'zod';

const defaultValues: Partial<GuestsListSchema> = {
 folio: '',
 reserveNo: '',
 nationality: null,
 specialGuest: null,
 group: null,
 room: null,
};

function createGuestsListSchema() {
 return z.object({
  folio: z.string().optional(),
  reserveNo: z.string().optional(),
  nationality: z.string().nullable(),
  specialGuest: z.string().nullable(),
  group: z.string().nullable(),
  room: z.string().nullable(),
 });
}

type GuestsListSchema = z.infer<ReturnType<typeof createGuestsListSchema>>;

export type { GuestsListSchema };
export { createGuestsListSchema, defaultValues };
