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
 initData: InitiData;
 hallsInfo: {
  data: InitiData['salons'];
  selectedHall: InitiData['salons'][number] | null;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
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
  isSuccess: boolean;
  isError: boolean;
  lastTablesUpdate: Date | null;
  tablesReport: TablesReport;
  filters: TablesFilters;
  showChangeTableState: boolean;
  showTransferTable: boolean;
  showTransferTableConfirm: boolean;
  selectedTransferToTable: Table | null;
  showMergeTable: boolean;
  showMergeTableConfirm: boolean;
  selectedMergeToTable: Table | null;
  transferTableTo: (newTable: Table) => unknown;
  mergeTableTo: (newTable: Table) => unknown;
  onShowChangeTableState: (open?: boolean) => unknown;
  changeShowTransferTable: (open?: boolean) => unknown;
  changeShowMergeTable: (open?: boolean) => unknown;
  changeFilters: (filters: TablesFilters) => unknown;
  changeSelectedTable: (newTable: Table | null) => unknown;
  changeShowTransferTableConfirm: (open?: boolean) => unknown;
  changeShowMergeTableConfirm: (open?: boolean) => unknown;
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
