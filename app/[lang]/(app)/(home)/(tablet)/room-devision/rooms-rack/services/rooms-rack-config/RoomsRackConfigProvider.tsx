'use client';
import { ReactNode, useState } from 'react';
import {
 type RackConfig,
 type SidebarPanel,
 rackConfigContext,
} from './roomsRackConfigContext';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { roomsRackBaseKey, getInitialData } from '../roomsRackApiActions';
import { useQuery } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import {
 type RackFiltersSchema,
 defaultValues,
 createRackFiltersSchema,
} from '../../schemas/rackFiltersSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export function RoomsRackConfigProvider({
 children,
}: {
 children: ReactNode;
 dic: RoomsRackDictionary;
}) {
 const [activeSidebarPanel, setActiveSidebarPanel] =
  useState<SidebarPanel>('filters');
 const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
 const [sidebarIsPin, setSidebarIsPin] = useState(true);

 const rackFiltersUseForm = useForm<RackFiltersSchema>({
  resolver: zodResolver(createRackFiltersSchema()),
  defaultValues,
 });

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
 };
 return (
  <rackConfigContext.Provider value={ctx}>
   <FormProvider {...rackFiltersUseForm}>{children}</FormProvider>
  </rackConfigContext.Provider>
 );
}
