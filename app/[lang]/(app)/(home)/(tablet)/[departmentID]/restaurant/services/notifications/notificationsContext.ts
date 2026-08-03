import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

interface NotificationContext {
 isOpen: boolean;
 toggleProfile: (open?: boolean) => unknown;
}

const notificationContext = createContext<NotificationContext | null>(null);

function useNotificationContext() {
 const val = use(notificationContext);
 if (!val) throw new OutOfContext('notifications context');
 return val;
}

export type { NotificationContext };
export { notificationContext, useNotificationContext };
