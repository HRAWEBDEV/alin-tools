'use client';
import { useState, ReactNode, useEffect, useRef } from 'react';
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
import { useShareDictionary } from '@/app/[lang]/(app)/services/share-dictionary/shareDictionaryContext';
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
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import * as signalR from '@microsoft/signalr';
import { getUserLoginToken } from '@/app/[lang]/(app)/login/utils/loginTokenManager';
import { toast } from 'sonner';

const notificationAudio = new Audio('/sounds/notification-sound.mp3');

export default function NotificationsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const notifcationsCountRef = useRef<null | number>(null);
 const [connection, setConnection] = useState<signalR.HubConnection | null>(
  null,
 );
 const { routeDepartment, routeOwner, routeProgram } = useUserInfoRouter();
 const queryClient = useQueryClient();
 const { localeInfo } = useBaseConfig();
 const {
  shareDictionary: {
   components: { notifications: notificationsDic },
  },
 } = useShareDictionary();
 const [isOpen, setIsOpen] = useState(false);

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

 const eventBoardQueryKey = [getEventBoardApi, routeProgram?.id.toString()];
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
     programID: routeProgram?.id.toString(),
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

 function handleInvalidateEventBoards() {
  queryClient.invalidateQueries({ queryKey: eventBoardQueryKey });
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
 };
 // get init data
 useEffect(() => {
  const rackSignalRConnection = new signalR.HubConnectionBuilder()
   .withUrl(
    `${
     process.env.NEXT_PUBLIC_API_URI
    }/EventBoardChangeNotifHub?token=${getUserLoginToken()}&programid=${routeProgram.id}&departmentid=${routeDepartment.id}&ownerid=${routeOwner.id}&systemid=${routeProgram.systemID}`,
   )
   .withAutomaticReconnect()
   .configureLogging(signalR.LogLevel.Information)
   .build();
  const startConnection = async () => {
   setConnection(null);
   try {
    await rackSignalRConnection.start();
    setConnection(rackSignalRConnection);
   } catch (error) {
    console.log('start event connection error', error);
   }
  };
  startConnection();
  return () => {
   rackSignalRConnection.stop();
  };
 }, [routeOwner, routeDepartment, routeProgram]);

 useEffect(() => {
  if (!connection) return;
  connection.on('EventBoardChanged', () => {
   refetch();
  });
  return () => connection && connection.off('EventBoardChanged');
 }, [connection, refetch]);

 useEffect(() => {
  if (!connection) return;
  connection.on('EventBoardUpdated', () => {});
  return () => connection && connection.off('EventBoardUpdated');
 }, [connection]);

 useEffect(() => {
  if (!isSuccess) return;
  const newCount = data?.pages[0].rowsCount || 0;
  if (
   notifcationsCountRef.current !== null &&
   newCount > notifcationsCountRef.current
  ) {
   notificationAudio.play();
   toast.success(notificationsDic.youHaveNewNotification);
  }
  notifcationsCountRef.current = newCount;
 }, [data, isSuccess, notificationsDic.youHaveNewNotification]);

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
       {notificationsDic.title} ({data?.pages[0].rowsCount || 0})
      </DrawerTitle>
     </DrawerHeader>
     <NotificationsWrapper />
    </DrawerContent>
   </Drawer>
  </notificationContext.Provider>
 );
}
