import { OutOfContext } from '@/utils/OutOfContext';
import { use, createContext, Dispatch, SetStateAction } from 'react';
import { type OrderConfig } from './utils/OrderConfigSetting';
import { type SalonsConfig } from './utils/SalonsConfigSetting';

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
 salonsConfigSetup: {
  salonsConfig: SalonsConfig;
  onChangeSalonsConfig: <T extends keyof SalonsConfig>(
   key: T,
   value: SalonsConfig[T],
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
