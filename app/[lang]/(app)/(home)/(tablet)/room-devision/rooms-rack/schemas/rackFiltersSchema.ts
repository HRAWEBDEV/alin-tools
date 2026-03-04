import { z } from 'zod';

const defaultValues: Partial<RackFiltersSchema> = {
 rackType: null,
 roomType: null,
 building: null,
 floor: null,
 roomStateGroup: null,
 roomStateInOutState: null,
 roomStateKind: null,
 roomStateType: null,
 customers: null,
};

function createRackFiltersSchema() {
 return z.object({
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
