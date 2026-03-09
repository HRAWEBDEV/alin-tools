import { use, createContext, Dispatch, SetStateAction } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type RackInfo,
 type RackDetails,
 type Rack,
} from '../roomsRackApiActions';
import { type Paging } from '../../../utils/apiTypes';

type ChangePageActions = 'next' | 'prev' | 'last' | 'first';
type SidebarPanel = 'info' | 'help' | 'filters';
type RackConfig = {
 sidebar: {
  isPin: boolean;
  isOpen: boolean;
  activePanel: SidebarPanel;
  onChangeActivePanel: (panel: SidebarPanel) => unknown;
  toggle: (open?: boolean, activePanel?: SidebarPanel) => unknown;
  togglePin: (pin?: boolean) => unknown;
 };
 initData: {
  data?: InitialData;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
 };
 rackInfo: {
  data?: RackInfo;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
 };
 rack: {
  data: Rack[];
  showRackMenu: boolean;
  onShowRackMenu: (room: Rack) => unknown;
  onHideRackMenu: () => unknown;
  selectedRoom: Rack | null;
  onChangeSelectedRoom: (room: Rack | null) => unknown;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  rowsCount: number;
  paging: Paging;
  pageCount: number;
  isLastPage: boolean;
  isFirstPage: boolean;
  onChangePage: (action: ChangePageActions) => unknown;
  lastUpdate: Date | null;
  onChangePaging: Dispatch<SetStateAction<Paging>>;
  rackDetails: RackDetails | null;
  rackFutureDateStart: Date;
 };
};

const rackConfigContext = createContext<RackConfig | null>(null);

function useRackConfigContext() {
 const val = use(rackConfigContext);
 if (!val) throw new OutOfContext('rack-config-context');
 return val;
}

export { type RackConfig, type SidebarPanel, type ChangePageActions };
export { rackConfigContext, useRackConfigContext };
