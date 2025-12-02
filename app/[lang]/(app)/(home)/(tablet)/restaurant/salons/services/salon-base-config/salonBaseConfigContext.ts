import { type Hall } from '../salonsApiActions';
import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

interface SalonBaseConfig {
 hallsInfo: {
  data: Hall[];
  selectedHall: Hall | null;
  isFetching: boolean;
  isLoading: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  changeHall: (newHall: Hall) => unknown;
  nextHall: () => unknown;
  prevHall: () => unknown;
 };
}

const salonBaseConfigContext = createContext<SalonBaseConfig | null>(null);

function useSalonBaseConfigContext() {
 const val = use(salonBaseConfigContext);
 if (!val) throw new OutOfContext('salonBaseConfigContext');
 return val;
}

export type { SalonBaseConfig };
export { salonBaseConfigContext, useSalonBaseConfigContext };
