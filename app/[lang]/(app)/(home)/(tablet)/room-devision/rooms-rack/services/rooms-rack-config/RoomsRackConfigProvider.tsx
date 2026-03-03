'use client';
import { ReactNode, useState } from 'react';
import {
 type RackConfig,
 type SidebarPanel,
 rackConfigContext,
} from './roomsRackConfigContext';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';

export function RoomsRackConfigProvider({
 children,
}: {
 children: ReactNode;
 dic: RoomsRackDictionary;
}) {
 const [activeSidebarPanel, setActiveSidebarPanel] =
  useState<SidebarPanel>('filters');
 const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

 function handleToggleSidebar(
  open?: boolean,
  activePanel: SidebarPanel = 'filters',
 ) {
  if (open) {
   setSidebarIsOpen(true);
   setActiveSidebarPanel(activePanel);
   return;
  }
  setSidebarIsOpen((pre) => (open === undefined ? !pre : open));
 }

 const ctx: RackConfig = {
  sidebar: {
   isOpen: sidebarIsOpen,
   activePanel: activeSidebarPanel,
   toggle: handleToggleSidebar,
  },
 };
 return (
  <rackConfigContext.Provider value={ctx}>
   {children}
  </rackConfigContext.Provider>
 );
}
