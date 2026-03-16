'use client';
import { ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import {
 type ChangePageActions,
 type RackConfig,
 type SidebarPanel,
 type RackView,
 rackConfigContext,
} from './roomsRackConfigContext';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 type Rack,
 type RackDetails,
 roomsRackBaseKey,
 getInitialData,
 getRackInfo,
} from '../roomsRackApiActions';
import { useQuery } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import {
 type RackFiltersSchema,
 createRackFiltersSchema,
} from '../../schemas/rackFiltersSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import {
 buildingKeyQuery,
 buildingValueQuery,
 customersKeyQuery,
 customersValueQuery,
 dateQuery,
 floorKeyQuery,
 floorValueQuery,
 rackTypeKeyQuery,
 rackTypeValueQuery,
 roomStateGroupKeyQuery,
 roomStateGroupValueQuery,
 roomStateInOutStateKeyQuery,
 roomStateInOutStateValueQuery,
 roomStateKindKeyQuery,
 roomStateKindValueQuery,
 roomStateTypeKeyQuery,
 roomStateTypeValueQuery,
 roomTypeKeyQuery,
 roomTypeValueQuery,
 showTypeKeyQuery,
 showTypeValueQuery,
 limitQuery,
 offsetQuery,
} from '../../utils/rackQueries';
import { rackShowTypes } from '../../utils/rackShowTypes';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import * as signalR from '@microsoft/signalr';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import { getUserLoginToken } from '@/app/[lang]/(app)/login/utils/loginTokenManager';
import { type PagedData, type Paging } from '../../../utils/apiTypes';
import { rackLimitOptions } from '../../utils/rackLimitOptions';
import { useDateFns } from '@/hooks/useDateFns';
import RoomMenu from '../../components/rooms/RoomMenu';

export function RoomsRackConfigProvider({
 children,
 dic,
}: {
 children: ReactNode;
 dic: RoomsRackDictionary;
}) {
 const dateFns = useDateFns();
 const { userInfoRouterStorage } = useUserInfoRouter();
 const [rackIsError, setRackIsError] = useState(false);
 const [rackIsSuccess, setRackIsSuccess] = useState(false);
 const [rackIsLoading, setRackIsLoading] = useState(false);
 const [rackRooms, setRackRooms] = useState<Rack[]>([]);
 const [rackLastUpdate, setRackLastUpdate] = useState<Date | null>(null);
 const [rackDetails, setRackDetails] = useState<RackDetails | null>(null);
 const { locale } = useBaseConfig();
 const searchParams = useSearchParams();
 const router = useRouter();
 const [activeSidebarPanel, setActiveSidebarPanel] =
  useState<SidebarPanel>('filters');
 const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
 const [sidebarIsPin, setSidebarIsPin] = useState(false);
 const [selectedRoom, setSelectedRoom] = useState<Rack | null>(null);
 const [showRackMenu, setShowRackMenu] = useState(false);
 const [showRoomStateKind, setShowRoomStateKind] = useState(false);
 const [showRoomStateType, setShowRoomStateType] = useState(false);
 const [rackView, setRackView] = useState<RackView>('detailed');
 const targetSelectedRoom = selectedRoom
  ? rackRooms.find((item) => item.roomLabel === selectedRoom.roomLabel) || null
  : null;
 //
 const [connection, setConnection] = useState<signalR.HubConnection | null>(
  null,
 );
 // queries
 const buildingKeyQueryValue = searchParams.get(buildingKeyQuery);
 const buildingValueQueryValue = searchParams.get(buildingValueQuery);
 const customersKeyQueryValue = searchParams.get(customersKeyQuery);
 const customersValueQueryValue = searchParams.get(customersValueQuery);
 const dateQueryValue = searchParams.get(dateQuery);
 const floorKeyQueryValue = searchParams.get(floorKeyQuery);
 const floorValueQueryValue = searchParams.get(floorValueQuery);
 const rackTypeKeyQueryValue = searchParams.get(rackTypeKeyQuery);
 const rackTypeValueQueryValue = searchParams.get(rackTypeValueQuery);
 const roomStateGroupKeyQueryValue = searchParams.get(roomStateGroupKeyQuery);
 const limitQueryValue = searchParams.get(limitQuery);
 const offsetQueryValue = searchParams.get(offsetQuery);
 const roomStateGroupValueQueryValue = searchParams.get(
  roomStateGroupValueQuery,
 );
 const roomStateInOutStateKeyQueryValue = searchParams.get(
  roomStateInOutStateKeyQuery,
 );
 const roomStateInOutStateValueQueryValue = searchParams.get(
  roomStateInOutStateValueQuery,
 );
 const roomStateKindKeyQueryValue = searchParams.get(roomStateKindKeyQuery);
 const roomStateKindValueQueryValue = searchParams.get(roomStateKindValueQuery);
 const roomStateTypeKeyQueryValue = searchParams.get(roomStateTypeKeyQuery);
 const roomStateTypeValueQueryValue = searchParams.get(roomStateTypeValueQuery);
 const roomTypeKeyQueryValue = searchParams.get(roomTypeKeyQuery);
 const roomTypeValueQueryValue = searchParams.get(roomTypeValueQuery);
 const showTypeKeyQueryValue = searchParams.get(showTypeKeyQuery);
 const showTypeValueQueryValue = searchParams.get(showTypeValueQuery);

 // paging
 const [rackPaging, setRackPaging] = useState<Paging>({
  limit: Number(limitQueryValue) || rackLimitOptions[0],
  offset: Number(offsetQueryValue) || 0,
 });
 const [rowsCount, setRowsCount] = useState(0);

 const pageCount =
  rowsCount && rackPaging.limit ? Math.ceil(rowsCount / rackPaging.limit) : 0;

 const isLastPage = rackPaging.offset + 1 >= pageCount;
 const isFirstPage = rackPaging.offset + 1 === 1;

 function handleChangeRackView(view: RackView) {
  setRackView(view);
 }

 function handleChangePage(action: ChangePageActions) {
  if (action === 'first') {
   setRackPaging((pre) => ({ ...pre, offset: 0 }));
   return;
  }
  if (action === 'last') {
   setRackPaging((pre) => ({ ...pre, offset: pageCount - 1 }));
   return;
  }
  if (action === 'next') {
   if (rackPaging.offset === pageCount) return;
   setRackPaging((pre) => ({ ...pre, offset: pre.offset + 1 }));
   return;
  }
  if (action === 'prev') {
   if (rackPaging.offset === 0) return;
   setRackPaging((pre) => ({ ...pre, offset: pre.offset - 1 }));
   return;
  }
 }

 const rackFiltersUseForm = useForm<RackFiltersSchema>({
  resolver: zodResolver(createRackFiltersSchema()),
  defaultValues: {
   building:
    buildingKeyQueryValue && buildingValueQueryValue
     ? {
        key: buildingKeyQueryValue,
        value: buildingValueQueryValue,
       }
     : null,
   customers:
    customersKeyQueryValue && customersValueQueryValue
     ? {
        key: customersKeyQueryValue,
        value: customersValueQueryValue,
       }
     : null,
   date: dateQueryValue ? new Date(dateQueryValue) : null,
   floor:
    floorKeyQueryValue && floorValueQueryValue
     ? {
        key: floorKeyQueryValue,
        value: floorValueQueryValue,
       }
     : null,
   rackType:
    rackTypeKeyQueryValue && rackTypeValueQueryValue
     ? {
        key: rackTypeKeyQueryValue,
        value: rackTypeValueQueryValue,
       }
     : null,
   roomStateGroup:
    roomStateGroupKeyQueryValue && roomStateGroupValueQueryValue
     ? {
        key: roomStateGroupKeyQueryValue,
        value: roomStateGroupValueQueryValue,
       }
     : null,
   roomStateInOutState:
    roomStateInOutStateKeyQueryValue && roomStateInOutStateValueQueryValue
     ? {
        key: roomStateInOutStateKeyQueryValue,
        value: roomStateInOutStateValueQueryValue,
       }
     : null,
   roomStateKind:
    roomStateKindKeyQueryValue && roomStateKindValueQueryValue
     ? {
        key: roomStateKindKeyQueryValue,
        value: roomStateKindValueQueryValue,
       }
     : null,
   roomStateType:
    roomStateTypeKeyQueryValue && roomStateTypeValueQueryValue
     ? {
        key: roomStateTypeKeyQueryValue,
        value: roomStateTypeValueQueryValue,
       }
     : null,
   roomType:
    roomTypeKeyQueryValue && roomTypeValueQueryValue
     ? {
        key: roomTypeKeyQueryValue,
        value: roomTypeValueQueryValue,
       }
     : null,
   showType:
    showTypeKeyQueryValue && showTypeValueQueryValue
     ? {
        key: showTypeKeyQueryValue,
        value:
         showTypeValueQueryValue as (typeof rackShowTypes)[number]['value'],
       }
     : rackShowTypes[0],
  },
 });
 //watch
 const [
  rackTypeValue,
  showTypeValue,
  dateValue,
  buildingValue,
  customersValue,
  floorValue,
  roomStateGroupValue,
  roomStateInOutStateValue,
  roomStateKindValue,
  roomStateTypeValue,
  roomTypeValue,
 ] = rackFiltersUseForm.watch([
  'rackType',
  'showType',
  'date',
  'building',
  'customers',
  'floor',
  'roomStateGroup',
  'roomStateInOutState',
  'roomStateKind',
  'roomStateType',
  'roomType',
 ]);
 // * signal r setup
 const getRackRooms = useCallback(async () => {
  if (!connection || !rackTypeValue || !showTypeValue) return;
  if (showTypeValue.value === 'future' && !dateValue) return;
  setRackIsLoading(true);
  setRackIsError(false);
  try {
   await connection.invoke(
    'GetRackUpdate',
    connection.connectionId,
    rackPaging.limit,
    rackPaging.offset + 1,
    {
     floorNo: Number(floorValue?.key) || null,
     buildingNo: Number(buildingValue?.key) || null,
     roomTypeID: Number(roomTypeValue?.key) || null,
     groupID: Number(roomStateGroupValue?.key) || null,
     kindID: Number(roomStateKindValue?.key) || null,
     typeID: Number(roomStateTypeValue?.key) || null,
     inOutStateID: Number(roomStateInOutStateValue?.key) || null,
     customerID: Number(customersValue?.key) || null,
     rackID: Number(rackTypeValue.key) || null,
     date: showTypeValue.value === 'current' ? null : dateValue?.toISOString(),
    },
   );
   setRackIsSuccess(true);
  } catch (error) {
   console.log('signalR get salon rack rooms failed: ', error);
   setRackIsError(true);
  } finally {
   setRackIsLoading(false);
  }
 }, [
  connection,
  buildingValue,
  floorValue,
  rackTypeValue,
  roomStateInOutStateValue,
  roomStateKindValue,
  roomStateTypeValue,
  showTypeValue,
  roomTypeValue,
  roomStateGroupValue,
  customersValue,
  rackPaging,
  dateValue,
 ]);

 function handleToggleSidebar(open?: boolean, activePanel?: SidebarPanel) {
  const sidebarState = open === undefined ? !sidebarIsOpen : open;
  if (sidebarState && activePanel) {
   setActiveSidebarPanel(activePanel);
  }
  setSidebarIsOpen(sidebarState);
 }

 function handleToggleSidebarPin(pin?: boolean) {
  setSidebarIsPin((pre) => (pin === undefined ? !pre : pin));
 }

 function handleChangeActivePanel(panel: SidebarPanel) {
  setActiveSidebarPanel(panel);
 }

 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isSuccess: initDataIsSuccess,
  isError: initDataIsError,
 } = useQuery({
  staleTime: 'static',
  queryKey: [roomsRackBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // rack info
 const {
  data: rackInfo,
  isLoading: rackInfoIsLoading,
  isSuccess: rackInfoIsSucess,
  isError: rackInfoIsError,
  refetch: rackInfoRefetch,
 } = useQuery({
  enabled:
   showTypeValue?.value === 'current' ||
   (showTypeValue?.value === 'future' && !!dateValue),
  staleTime: 'static',
  queryKey: [
   roomsRackBaseKey,
   'info',
   showTypeValue?.key,
   dateValue?.toISOString() || 'now',
  ],
  async queryFn({ signal }) {
   const res = await getRackInfo({
    signal,
    date:
     showTypeValue?.value === 'current'
      ? dateFns.startOfToday().toISOString()
      : dateValue!.toISOString(),
   });
   return res.data;
  },
 });

 // select room and toggle rack menu
 function handleChangeSelectedRoom(newRoom: Rack | null) {
  setSelectedRoom(newRoom);
 }
 function handleShowRackMenu(room: Rack) {
  handleChangeSelectedRoom(room);
  setShowRackMenu(true);
 }
 function handleHideRackMenu() {
  handleChangeSelectedRoom(null);
  setShowRackMenu(false);
 }

 useEffect(() => {
  getRackRooms();
 }, [getRackRooms]);

 useEffect(() => {
  if (!connection) return;
  connection.on('RackLastUpdate', (rackUpdate) => {
   const {
    rack: { rows, rowsCount },
    rackInfos,
   } = rackUpdate as {
    rack: PagedData<Rack[]>;
    rackInfos: RackDetails;
   };
   setRackRooms(rows);
   setRackDetails(rackInfos);
   rackInfoRefetch();
   setRowsCount(rowsCount);
   setRackLastUpdate(new Date());
  });
  return () => connection && connection.off('RackLastUpdate');
 }, [connection, rackInfoRefetch]);

 useEffect(() => {
  if (!connection) return;
  connection.on('RackChanged', () => {
   getRackRooms();
  });
  return () => connection && connection.off('RackChanged');
 }, [getRackRooms, connection]);

 useEffect(() => {
  const rackSignalRConnection = new signalR.HubConnectionBuilder()
   .withUrl(
    `${
     process.env.NEXT_PUBLIC_API_URI
    }/datachangenotifHub?token=${getUserLoginToken()}&programid=${userInfoRouterStorage.programID}&departmentid=${userInfoRouterStorage.departmentID}&ownerid=${userInfoRouterStorage.ownerID}&systemid=${userInfoRouterStorage.systemID}`,
   )
   .configureLogging(signalR.LogLevel.Information)
   .build();
  const startConnection = async () => {
   setConnection(null);
   try {
    await rackSignalRConnection.start();
    setConnection(rackSignalRConnection);
   } catch (error) {
    console.log('start rack connection error', error);
   }
  };
  startConnection();
  return () => {
   rackSignalRConnection.stop();
  };
 }, [userInfoRouterStorage]);

 useEffect(() => {
  const newSearchParams = new URLSearchParams(location.search);
  if (rackTypeValue) {
   newSearchParams.set(rackTypeKeyQuery, rackTypeValue.key);
   newSearchParams.set(rackTypeValueQuery, rackTypeValue.value);
  } else {
   newSearchParams.delete(rackTypeKeyQuery);
   newSearchParams.delete(rackTypeValueQuery);
  }

  if (showTypeValue) {
   newSearchParams.set(showTypeKeyQuery, showTypeValue.key);
   newSearchParams.set(showTypeValueQuery, showTypeValue.value);
  } else {
   newSearchParams.delete(showTypeKeyQuery);
   newSearchParams.delete(showTypeValueQuery);
  }

  if (dateValue) {
   newSearchParams.set(dateQuery, dateValue.toISOString());
  } else {
   newSearchParams.delete(dateQuery);
  }

  if (buildingValue) {
   newSearchParams.set(buildingKeyQuery, buildingValue.key);
   newSearchParams.set(buildingValueQuery, buildingValue.value);
  } else {
   newSearchParams.delete(buildingKeyQuery);
   newSearchParams.delete(buildingValueQuery);
  }

  if (customersValue) {
   newSearchParams.set(customersKeyQuery, customersValue.key);
   newSearchParams.set(customersValueQuery, customersValue.value);
  } else {
   newSearchParams.delete(customersKeyQuery);
   newSearchParams.delete(customersValueQuery);
  }

  if (customersValue) {
   newSearchParams.set(customersKeyQuery, customersValue.key);
   newSearchParams.set(customersValueQuery, customersValue.value);
  } else {
   newSearchParams.delete(customersKeyQuery);
   newSearchParams.delete(customersValueQuery);
  }

  if (floorValue) {
   newSearchParams.set(floorKeyQuery, floorValue.key);
   newSearchParams.set(floorValueQuery, floorValue.value);
  } else {
   newSearchParams.delete(floorKeyQuery);
   newSearchParams.delete(floorValueQuery);
  }

  if (roomStateGroupValue) {
   newSearchParams.set(roomStateGroupKeyQuery, roomStateGroupValue.key);
   newSearchParams.set(roomStateGroupValueQuery, roomStateGroupValue.value);
  } else {
   newSearchParams.delete(roomStateGroupKeyQuery);
   newSearchParams.delete(roomStateGroupValueQuery);
  }

  if (roomStateInOutStateValue) {
   newSearchParams.set(
    roomStateInOutStateKeyQuery,
    roomStateInOutStateValue.key,
   );
   newSearchParams.set(
    roomStateInOutStateValueQuery,
    roomStateInOutStateValue.value,
   );
  } else {
   newSearchParams.delete(roomStateInOutStateKeyQuery);
   newSearchParams.delete(roomStateInOutStateValueQuery);
  }

  if (roomStateKindValue) {
   newSearchParams.set(roomStateKindKeyQuery, roomStateKindValue.key);
   newSearchParams.set(roomStateKindValueQuery, roomStateKindValue.value);
  } else {
   newSearchParams.delete(roomStateKindKeyQuery);
   newSearchParams.delete(roomStateKindValueQuery);
  }

  if (roomStateTypeValue) {
   newSearchParams.set(roomStateTypeKeyQuery, roomStateTypeValue.key);
   newSearchParams.set(roomStateTypeValueQuery, roomStateTypeValue.value);
  } else {
   newSearchParams.delete(roomStateTypeKeyQuery);
   newSearchParams.delete(roomStateTypeValueQuery);
  }

  if (roomTypeValue) {
   newSearchParams.set(roomTypeKeyQuery, roomTypeValue.key);
   newSearchParams.set(roomTypeValueQuery, roomTypeValue.value);
  } else {
   newSearchParams.delete(roomTypeKeyQuery);
   newSearchParams.delete(roomTypeValueQuery);
  }

  newSearchParams.set(limitQuery, rackPaging.limit.toString());
  newSearchParams.set(offsetQuery, rackPaging.offset.toString());

  router.replace(
   `/${locale}/room-devision/rooms-rack?${newSearchParams.toString()}`,
  );
 }, [
  locale,
  router,
  rackPaging,
  rackTypeValue,
  roomTypeValue,
  showTypeValue,
  roomStateInOutStateValue,
  roomStateTypeValue,
  roomStateKindValue,
  dateValue,
  buildingValue,
  customersValue,
  floorValue,
  roomStateGroupValue,
 ]);

 const rackFutureDateStart = useMemo(() => {
  const today = new Date();
  const todayHour = today.getHours();
  let rackFutureDateStart = dateFns.addDays(new Date(), 1);
  if (initDataIsSuccess && todayHour < initData.roomingTime.item1) {
   rackFutureDateStart = new Date();
  }
  return rackFutureDateStart;
 }, [dateFns, initDataIsSuccess, initData]);

 useEffect(() => {
  if (!initDataIsSuccess) return;
  const rackTypeValue = rackFiltersUseForm.getValues('rackType');
  if (!rackTypeValue) {
   rackFiltersUseForm.setValue('rackType', initData.racks[0]);
  }
 }, [initDataIsSuccess, rackFiltersUseForm, initData]);

 useEffect(() => {
  if (showTypeValue?.value === 'current') {
   rackFiltersUseForm.setValue('date', null);
   return;
  }
  const dateValue = rackFiltersUseForm.getValues('date');
  if (!!dateValue) return;
  rackFiltersUseForm.setValue('date', rackFutureDateStart);
 }, [showTypeValue, rackFiltersUseForm, dateFns, rackFutureDateStart]);

 useEffect(() => {
  if (!rackIsSuccess) return;
  if (rackPaging.offset + 1 >= pageCount) {
   setRackPaging((pre) => ({
    ...pre,
    offset: pageCount - 1,
   }));
   return;
  }
  if (rackPaging.offset + 1 < pageCount) {
   setRackPaging((pre) => ({
    ...pre,
    offset: pageCount - 1,
   }));
   return;
  }
 }, [rackPaging.offset, rackIsSuccess, pageCount]);

 const ctx: RackConfig = {
  sidebar: {
   isPin: sidebarIsPin,
   isOpen: sidebarIsOpen,
   activePanel: activeSidebarPanel,
   toggle: handleToggleSidebar,
   togglePin: handleToggleSidebarPin,
   onChangeActivePanel: handleChangeActivePanel,
  },
  initData: {
   data: initData,
   isLoading: initDataIsLoading,
   isSuccess: initDataIsSuccess,
   isError: initDataIsError,
  },
  rackInfo: {
   data: rackInfo,
   isLoading: rackInfoIsLoading,
   isSuccess: rackInfoIsSucess,
   isError: rackInfoIsError,
  },
  rack: {
   data: rackRooms,
   rackView,
   onChangeRackView: handleChangeRackView,
   selectedRoom,
   onChangeSelectedRoom: handleChangeSelectedRoom,
   showRackMenu,
   onHideRackMenu: handleHideRackMenu,
   onShowRackMenu: handleShowRackMenu,
   isError: rackIsError,
   isLoading: rackIsLoading,
   isSuccess: rackIsSuccess,
   isFirstPage,
   isLastPage,
   pageCount,
   onChangePage: handleChangePage,
   onChangePaging: setRackPaging,
   paging: rackPaging,
   rowsCount,
   lastUpdate: rackLastUpdate,
   rackDetails,
   rackFutureDateStart,
  },
 };

 return (
  <rackConfigContext.Provider value={ctx}>
   <FormProvider {...rackFiltersUseForm}>
    {children}
    <RoomMenu
     isOpen={showRackMenu}
     showRoomStateKind={showRoomStateKind}
     setShowRoomStateKind={setShowRoomStateKind}
     showRoomStateType={showRoomStateType}
     setShowRoomStateType={setShowRoomStateType}
     setIsOpen={(value) => {
      if (value) {
       return;
      } else {
       handleHideRackMenu();
      }
     }}
     dic={dic}
     room={targetSelectedRoom}
    />
   </FormProvider>
  </rackConfigContext.Provider>
 );
}
