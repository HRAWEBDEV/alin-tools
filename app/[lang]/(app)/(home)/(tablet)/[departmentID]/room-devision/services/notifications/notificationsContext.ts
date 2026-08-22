import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type EventBoard,
} from './services/notificationApiActions';
import { InfiniteData } from '@tanstack/react-query';
import { PagedData } from '../../utils/apiTypes';

interface NotificationContext {
 isOpen: boolean;
 toggleProfile: (open?: boolean) => unknown;
 initialData: {
  data?: InitialData;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
 };
 eventBoards: {
  data?: InfiniteData<PagedData<EventBoard[]>>;
  onInvalidateEventBoards: () => unknown;
  hasNextPage: boolean;
  fetchNextPage: () => unknown;
  isFetching: boolean;
  refetch: () => unknown;
  isSuccess: boolean;
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
