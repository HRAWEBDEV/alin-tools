import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type RackInfo,
 type RackDetails,
 type Rack,
} from '../roomsRackApiActions';
import { type Paging } from '../../../utils/apiTypes';
import { type RackLayout } from '../../utils/rackLayout';
import { getRackReport } from '../../utils/rackReport';
import { type InitialData as NoteTypes } from '../room-notes/RackRoomNotesApiActions';

type RackView = RackLayout;
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
  toggleRackReport: (open?: boolean) => unknown;
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
 noteTypes: {
  data?: NoteTypes;
  isLoading: boolean;
 };
 rack: {
  data: Rack[];
  rackView: RackView;
  onChangeRackView: (view: RackView) => unknown;
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
  onChangePaging: (newPaging: Paging) => unknown;
  rackDetails: RackDetails | null;
  rackFutureDateStart: Date;
 };
 rackReport: ReturnType<typeof getRackReport>;
};

const rackConfigContext = createContext<RackConfig | null>(null);

function useRackConfigContext() {
 const val = use(rackConfigContext);
 if (!val) throw new OutOfContext('rack-config-context');
 return val;
}

export {
 type RackConfig,
 type SidebarPanel,
 type ChangePageActions,
 type RackView,
};
export { rackConfigContext, useRackConfigContext };
