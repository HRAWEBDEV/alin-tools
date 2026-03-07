'use client';
import { ReactNode, useState, useEffect } from 'react';
import {
 type RackConfig,
 type SidebarPanel,
 rackConfigContext,
} from './roomsRackConfigContext';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
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
} from '../../utils/rackQueries';
import { rackShowTypes } from '../../utils/rackShowTypes';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export function RoomsRackConfigProvider({
 children,
}: {
 children: ReactNode;
 dic: RoomsRackDictionary;
}) {
 const { locale } = useBaseConfig();
 const searchParams = useSearchParams();
 const router = useRouter();
 const [activeSidebarPanel, setActiveSidebarPanel] =
  useState<SidebarPanel>('filters');
 const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
 const [sidebarIsPin, setSidebarIsPin] = useState(true);
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

 function handleToggleSidebar(
  open?: boolean,
  activePanel: SidebarPanel = 'filters',
 ) {
  const sidebarState = open === undefined ? !sidebarIsOpen : open;
  if (sidebarState) {
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
 } = useQuery({
  enabled: false,
  staleTime: 'static',
  queryKey: [roomsRackBaseKey, 'info'],
  async queryFn({ signal }) {
   const res = await getRackInfo({ signal, date: '' });
   return res.data;
  },
 });

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

  router.replace(
   `/${locale}/room-devision/rooms-rack?${newSearchParams.toString()}`,
  );
 }, [
  locale,
  router,
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
 };
 return (
  <rackConfigContext.Provider value={ctx}>
   <FormProvider {...rackFiltersUseForm}>{children}</FormProvider>
  </rackConfigContext.Provider>
 );
}
