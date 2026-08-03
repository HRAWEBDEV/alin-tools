'use client';
import { useState, ReactNode } from 'react';
import {
 type NotificationContext,
 notificationContext,
} from './notificationsContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { useRoomDevisionShareDictionary } from '../share-dictionary/roomDevisionShareDictionaryContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 useInfiniteQuery,
 useQuery,
 useQueryClient,
} from '@tanstack/react-query';
import {
 getEventBoardInitialApi,
 getInitialData,
 getEventBoardApi,
 getEventBoard,
} from './services/notificationApiActions';
import NotificationsWrapper from './components/NotificationsWrapper';

export default function NotificationsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const queryClient = useQueryClient();
 const { localeInfo } = useBaseConfig();
 const {
  roomDevisionShareDictionary: {
   components: { notifications: notificationsDic },
  },
 } = useRoomDevisionShareDictionary();
 const [isOpen, setIsOpen] = useState(false);
 const [showNewNotification, setShowNewNotification] = useState(false);
 const [selectedNotificationId, setSelectedNotificationId] = useState<
  number | null
 >(null);

 function handleToggleNotifications(open?: boolean) {
  setIsOpen((pre) => (open === undefined ? !pre : open));
 }

 const {
  data: initialData,
  isLoading: isLoadingInitialData,
  isSuccess: isSuccessInitialData,
  isError: isErrorInitialData,
 } = useQuery({
  queryKey: [getEventBoardInitialApi],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 const eventBoardQueryKey = [getEventBoardApi];
 const { data, hasNextPage, fetchNextPage, isFetching, refetch, isSuccess } =
  useInfiniteQuery({
   queryKey: eventBoardQueryKey,
   initialPageParam: {
    limit: 300,
    offset: 1,
   },
   async queryFn({ signal, pageParam }) {
    const res = await getEventBoard({
     signal,
     limit: pageParam.limit,
     offset: pageParam.offset,
    });
    return res.data;
   },
   getNextPageParam(lastPage) {
    const nextOffset = lastPage.offset + 1;
    if (lastPage.offset * lastPage.limit >= lastPage.rowsCount) {
     return undefined;
    }
    return {
     offset: nextOffset,
     limit: lastPage.limit,
    };
   },
   getPreviousPageParam(firstPage) {
    if (firstPage.offset <= 1) {
     return undefined;
    }
    return {
     limit: firstPage.limit,
     offset: firstPage.offset - 1,
    };
   },
  });

 const selectedNotification =
  isSuccess && !!data.pages.length
   ? !!data.pages[0].rowsCount
     ? data.pages[0].rows.find((item) => item.id === selectedNotificationId) ||
       null
     : null
   : null;

 function handleInvalidateEventBoards() {
  queryClient.invalidateQueries({ queryKey: eventBoardQueryKey });
 }

 //  edit setup
 function handleEditNotification(id: number) {
  setSelectedNotificationId(id);
  setShowNewNotification(true);
 }
 function handleCloseNotifiction() {
  setShowNewNotification(false);
  setSelectedNotificationId(null);
 }

 const ctx: NotificationContext = {
  isOpen,
  toggleProfile: handleToggleNotifications,
  initialData: {
   data: initialData,
   isLoading: isLoadingInitialData,
   isSuccess: isSuccessInitialData,
   isError: isErrorInitialData,
  },
  eventBoards: {
   data: data,
   onInvalidateEventBoards: handleInvalidateEventBoards,
   hasNextPage,
   fetchNextPage,
   isFetching,
   refetch,
   isSuccess,
  },
  editEventBoard: {
   show: showNewNotification,
   selectedNotificationId,
   selectedEventBoard: selectedNotification,
   onEditEventBoard: handleEditNotification,
   onCloseEditEventBoard: handleCloseNotifiction,
  },
 };
 // get init data
 return (
  <notificationContext.Provider value={ctx}>
   {children}
   <Drawer
    direction={localeInfo.contentDirection === 'rtl' ? 'right' : 'left'}
    open={isOpen}
    onOpenChange={setIsOpen}
   >
    <DrawerContent className='w-[min(80%,35rem)] overflow-hidden'>
     <DrawerHeader className='border-b border-border'>
      <DrawerTitle className='text-start text-lg'>
       {notificationsDic.title}
      </DrawerTitle>
     </DrawerHeader>
     <NotificationsWrapper />
    </DrawerContent>
   </Drawer>
  </notificationContext.Provider>
 );
}
