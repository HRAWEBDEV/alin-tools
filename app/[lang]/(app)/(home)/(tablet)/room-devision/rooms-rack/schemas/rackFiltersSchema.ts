import { z } from 'zod';

const defaultValues: Partial<RackFiltersSchema> = {
 building: null,
 customers: null,
 date: null,
 floor: null,
 previewType: 'current',
 rackType: null,
 roomStateGroup: null,
 roomStateInOutState: null,
 roomStateKind: null,
 roomStateType: null,
 roomType: null,
};

function createRackFiltersSchema() {
 return z.object({
  previewType: z.enum(['current', 'future']),
  date: z.date().nullable(),
  floor: z.object({ key: z.string(), value: z.string() }).nullable(),
  building: z.object({ key: z.string(), value: z.string() }).nullable(),
  rackType: z.object({ key: z.string(), value: z.string() }).nullable(),
  roomType: z.object({ key: z.string(), value: z.string() }).nullable(),
  roomStateGroup: z.object({ key: z.string(), value: z.string() }).nullable(),
  roomStateType: z.object({ key: z.string(), value: z.string() }).nullable(),
  roomStateKind: z.object({ key: z.string(), value: z.string() }).nullable(),
  roomStateInOutState: z
   .object({ key: z.string(), value: z.string() })
   .nullable(),
  customers: z.object({ key: z.string(), value: z.string() }).nullable(),
 });
}

type RackFiltersSchema = z.infer<ReturnType<typeof createRackFiltersSchema>>;

export type { RackFiltersSchema };
export { defaultValues, createRackFiltersSchema };
