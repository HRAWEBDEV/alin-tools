import { OutOfContext } from '@/utils/OutOfContext';
import { use, createContext, Dispatch, SetStateAction } from 'react';

interface Settings {
 isOpen: boolean;
 toggleIsOpen: () => void;
 activeView: string | null;
}

const SettingsContext = createContext<null | Settings>(null);

function useSettingsContext(): Settings {
 const val = use(SettingsContext);
 if (!val) throw new OutOfContext('SettingsContext');
 return val;
}

export type { Settings };
export { SettingsContext, useSettingsContext };
