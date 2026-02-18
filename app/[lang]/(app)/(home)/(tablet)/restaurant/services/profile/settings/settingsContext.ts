import { OutOfContext } from '@/utils/OutOfContext';
import { use, createContext, Dispatch, SetStateAction } from 'react';
import { type OrderConfig } from './utils/OrderConfigSetting';

export type ActiveView = 'orderConfig' | 'salonsConfig' | 'themeToggler';

interface Settings {
 isOpen: boolean;
 toggleIsOpen: () => void;
 activeView: string | null;
 setActiveView: Dispatch<SetStateAction<ActiveView | null>>;
 orderConfigSetup: {
  orderConfig: OrderConfig;
  onChangeOrderConfig: <T extends keyof OrderConfig>(
   key: T,
   value: OrderConfig[T],
  ) => unknown;
 };
}

const SettingsContext = createContext<null | Settings>(null);

function useSettingsContext(): Settings {
 const val = use(SettingsContext);
 if (!val) throw new OutOfContext('SettingsContext');
 return val;
}

export type { Settings };
export { SettingsContext, useSettingsContext };
