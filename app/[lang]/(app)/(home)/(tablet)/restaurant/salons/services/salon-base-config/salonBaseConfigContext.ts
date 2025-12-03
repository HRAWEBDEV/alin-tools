import { type Hall, type Table } from '../salonsApiActions';
import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type TablesReport } from '../../utils/getTablesReport';

interface TablesFilters {
 showOccupiedTables: boolean;
 showOutOfServiceTables: boolean;
 showReservedTables: boolean;
 showEmptyTables: boolean;
}

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
 tablesInfo: {
  data: Table[];
  filteredData: Table[];
  isLoading: boolean;
  lastTablesUpdate: Date | null;
  tablesReport: TablesReport;
  filters: TablesFilters;
  changeFilters: (filters: TablesFilters) => unknown;
 };
}

const salonBaseConfigContext = createContext<SalonBaseConfig | null>(null);

function useSalonBaseConfigContext() {
 const val = use(salonBaseConfigContext);
 if (!val) throw new OutOfContext('salonBaseConfigContext');
 return val;
}

export type { SalonBaseConfig, TablesFilters };
export { salonBaseConfigContext, useSalonBaseConfigContext };
