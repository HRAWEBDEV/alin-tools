import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

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
};

const rackConfigContext = createContext<RackConfig | null>(null);

function useRackConfigContext() {
 const val = use(rackConfigContext);
 if (!val) throw new OutOfContext('rack-config-context');
 return val;
}

export { type RackConfig, type SidebarPanel };
export { rackConfigContext, useRackConfigContext };
