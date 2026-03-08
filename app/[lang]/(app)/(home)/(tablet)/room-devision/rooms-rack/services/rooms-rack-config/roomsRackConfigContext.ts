import { use, createContext, Dispatch, SetStateAction } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type RackInfo,
 type RackDetails,
 type Rack,
} from '../roomsRackApiActions';
import { type Paging } from '../../../utils/apiTypes';

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
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  rowsCount: number;
  paging: Paging;
  lastUpdate: Date | null;
  onChangePaging: Dispatch<SetStateAction<Paging>>;
  rackDetails: RackDetails | null;
 };
};

const rackConfigContext = createContext<RackConfig | null>(null);

function useRackConfigContext() {
 const val = use(rackConfigContext);
 if (!val) throw new OutOfContext('rack-config-context');
 return val;
}

export { type RackConfig, type SidebarPanel };
export { rackConfigContext, useRackConfigContext };
