import { type InitiData, type Table } from '../salonsApiActions';
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
  data: InitiData['salons'];
  selectedHall: InitiData['salons'][number] | null;
  isFetching: boolean;
  isLoading: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  changeHall: (newHall: InitiData['salons'][number]) => unknown;
  nextHall: () => unknown;
  prevHall: () => unknown;
 };
 tablesInfo: {
  data: Table[];
  filteredData: Table[];
  selectedTable: Table | null;
  isLoading: boolean;
  lastTablesUpdate: Date | null;
  tablesReport: TablesReport;
  filters: TablesFilters;
  showChangeTableState: boolean;
  showTransferTable: boolean;
  onShowChangeTableState: (open?: boolean) => unknown;
  changeShowTransferTable: (open?: boolean) => unknown;
  changeFilters: (filters: TablesFilters) => unknown;
  changeSelectedTable: (newTable: Table | null) => unknown;
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
