import { z } from 'zod';

function createNewNotificationSchema() {
 return z.object({
  title: z.string().min(1),
  description: z.string().min(1),
 });
}

type NewNotificationSchema = z.infer<
 ReturnType<typeof createNewNotificationSchema>
>;

export type { NewNotificationSchema };
export { createNewNotificationSchema };
