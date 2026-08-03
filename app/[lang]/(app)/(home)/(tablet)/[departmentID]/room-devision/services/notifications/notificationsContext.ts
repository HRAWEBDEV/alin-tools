import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type InitialData } from './services/notificationApiActions';

interface NotificationContext {
 isOpen: boolean;
 toggleProfile: (open?: boolean) => unknown;
 initialData: {
  data?: InitialData;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
 };
}

const notificationContext = createContext<NotificationContext | null>(null);

function useNotificationContext() {
 const val = use(notificationContext);
 if (!val) throw new OutOfContext('notifications context');
 return val;
}

export type { NotificationContext };
export { notificationContext, useNotificationContext };
