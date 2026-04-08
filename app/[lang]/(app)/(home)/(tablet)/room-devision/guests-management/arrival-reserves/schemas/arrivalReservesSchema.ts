import { z } from 'zod';

const defaultValues: ArrivalReservesSchema = {
 date: null,
 roomTypeID: null,
 customerID: null,
 withRoomNo: false,
 withoutRoomNo: false,
 charged: false,
 notCharged: false,
 noShow: false,
 canceled: false,
};

function createArrivalReservesSchema() {
 return z.object({
  date: z.union([z.string(), z.date()]).nullable(),
  roomTypeID: z.string().nullable(),
  customerID: z.string().nullable(),
  withRoomNo: z.boolean(),
  withoutRoomNo: z.boolean(),
  charged: z.boolean(),
  notCharged: z.boolean(),
  noShow: z.boolean(),
  canceled: z.boolean(),
 });
}

type ArrivalReservesSchema = z.infer<
 ReturnType<typeof createArrivalReservesSchema>
>;

export type { ArrivalReservesSchema };
export { createArrivalReservesSchema, defaultValues };
