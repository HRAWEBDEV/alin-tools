import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

type SidebarPanel = 'stats' | 'help' | 'filters';
type RackConfig = {
 sidebar: {
  isOpen: boolean;
  activePanel: SidebarPanel;
  toggle: (open?: boolean, activePanel?: SidebarPanel) => unknown;
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
