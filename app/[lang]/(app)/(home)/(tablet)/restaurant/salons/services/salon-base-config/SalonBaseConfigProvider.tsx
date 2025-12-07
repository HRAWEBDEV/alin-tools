'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
 type SalonBaseConfig,
 type TablesFilters,
 salonBaseConfigContext,
} from './salonBaseConfigContext';
import {
 type Table,
 type InitiData,
 getHallKey,
 getInitialData,
} from '../salonsApiActions';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import * as signalR from '@microsoft/signalr';
import { getUserLoginToken } from '@/app/[lang]/(app)/login/utils/loginTokenManager';
import { getTablesReport } from '../../utils/getTablesReport';
import { getFilteredTables } from '../../utils/getfilteredTables';
import { useMainWrapperSetupContext } from '../../../services/main-wrapper-setup/mainWrapperSetupContext';

export default function SalonBaseConfigProvider({
 children,
}: {
 children: ReactNode;
}) {
 const { scrollToTop } = useMainWrapperSetupContext();
 const [tableFilters, setTableFilters] = useState<TablesFilters>({
  showEmptyTables: true,
  showOccupiedTables: true,
  showOutOfServiceTables: true,
  showReservedTables: true,
 });
 const [selectedTable, setSelectedTable] = useState<Table | null>(null);
 const [tables, setTables] = useState<Table[]>([]);
 const [tablesSuccess, setTablesSuccess] = useState(false);
 const [tablesError, setTablesError] = useState(false);
 const [isLoadingTables, setIsLoadingTables] = useState(false);
 const [lastTablesUpdate, setLastTablesUpdate] = useState<Date | null>(null);
 const [showChangeTableState, setShowChangeTableState] = useState(false);
 const [showMergeTable, setShowMergeTable] = useState(false);
 const [showMergeTableConfirm, setShowMergeTableConfirm] = useState(false);
 const [showTransferTable, setShowTransferTable] = useState(false);
 const [showTransferTableConfirm, setShowTransferTableConfirm] =
  useState(false);
 const [transferToTable, setTrasnferToTable] = useState<Table | null>(null);
 const [mergeToTable, setMergeToTable] = useState<Table | null>(null);

 const [connection, setConnection] = useState<signalR.HubConnection | null>(
  null,
 );
 const { locale } = useBaseConfig();
 const router = useRouter();
 const searchQueries = useSearchParams();
 const [selectedHall, setSelectedHall] = useState<
  InitiData['salons'][number] | null
 >(null);

 const {
  data: initData,
  isFetching: initDataIsFetching,
  isLoading: initDataIsLoading,
  isSuccess: initDataSuccess,
  isError: initDataIsError,
 } = useQuery({
  placeholderData: {
   salons: [],
   saleTimes: [],
   tableStateTypes: [],
   tableTypes: [],
   defaultSaleTimeID: 0,
   defaultPrintCashBox: 0,
  },
  queryKey: [getHallKey, 'list'],
  staleTime: 1000 * 60 * 60,
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // tables filters
 function handleChangeTableFilters(tableFilters: TablesFilters) {
  setTableFilters(tableFilters);
 }
 // * signal r setup
 const getSalonTables = useCallback(async () => {
  if (!connection || !selectedHall || !initData?.defaultSaleTimeID) return;
  setIsLoadingTables(true);
  setTablesError(false);
  try {
   await connection.invoke(
    'GetOrderBoardUpdate',
    connection.connectionId,
    // salon id
    Number(selectedHall.key),
    // sale time id
    initData!.defaultSaleTimeID,
    new Date().toISOString(),
   );
   setTablesSuccess(true);
  } catch (error) {
   console.log('signalR get salon tables failed: ', error);
   setTablesError(true);
  } finally {
   setIsLoadingTables(false);
  }
 }, [connection, selectedHall, initData]);

 useEffect(() => {
  if (!connection) return;
  connection.on('TableRackUpdated', (newTables) => {
   setTables(newTables);
   setLastTablesUpdate(new Date());
  });
  return () => connection && connection.off('TableRackUpdated');
 }, [connection]);

 useEffect(() => {
  if (!connection) return;
  connection.on('TableRackChanged', () => {
   getSalonTables();
  });
  return () => connection && connection.off('TableRackChanged');
 }, [getSalonTables, connection]);

 useEffect(() => {
  if (!initDataSuccess) return;
  const salonSignalRConnection = new signalR.HubConnectionBuilder()
   .withUrl(
    `${
     process.env.NEXT_PUBLIC_API_URI
    }/tablerackchangenotifhub?token=${getUserLoginToken()}&programid=15&departmentid=4&ownerid=1&systemid=111`,
   )
   .configureLogging(signalR.LogLevel.Information)
   .build();
  const startConnection = async () => {
   setConnection(null);
   try {
    await salonSignalRConnection.start();
    setConnection(salonSignalRConnection);
   } catch (err) {
    console.log('salon signalR connection failed: ', err);
   }
  };
  startConnection();
  return () => {
   salonSignalRConnection.stop();
  };
 }, [initDataSuccess]);
 useEffect(() => {
  getSalonTables();
 }, [getSalonTables]);

 //
 function handleShowChangeStateTable(open?: boolean) {
  setShowChangeTableState((pre) => (open === undefined ? !pre : open));
 }
 //
 function changeShowMergeTableConfirm(open?: boolean) {
  setShowTransferTableConfirm((pre) => (open === undefined ? !pre : open));
  changeShowMergeTable(false);
 }
 async function handleMergeTableTo(newTable: Table) {
  setMergeToTable(newTable);
  setShowMergeTableConfirm(true);
 }
 const changeShowMergeTable = useCallback(
  (open?: boolean) => {
   scrollToTop();
   if (open) {
    setTableFilters({
     showEmptyTables: false,
     showOccupiedTables: true,
     showOutOfServiceTables: false,
     showReservedTables: true,
    });
   } else {
    setTableFilters({
     showEmptyTables: true,
     showOccupiedTables: true,
     showOutOfServiceTables: true,
     showReservedTables: true,
    });
   }
   setMergeToTable(null);
   setShowMergeTable((pre) => (open === undefined ? !pre : open));
  },
  [scrollToTop],
 );
 //
 function changeShowTransferTableConfirm(open?: boolean) {
  setShowTransferTableConfirm((pre) => (open === undefined ? !pre : open));
  changeShowTransferTable(false);
 }
 async function handleTransferTableTo(newTable: Table) {
  setTrasnferToTable(newTable);
  setShowTransferTableConfirm(true);
 }
 //
 const changeShowTransferTable = useCallback(
  (open?: boolean) => {
   scrollToTop();
   if (open) {
    setTableFilters({
     showEmptyTables: true,
     showOccupiedTables: false,
     showOutOfServiceTables: false,
     showReservedTables: false,
    });
   } else {
    setTableFilters({
     showEmptyTables: true,
     showOccupiedTables: true,
     showOutOfServiceTables: true,
     showReservedTables: true,
    });
   }
   setTrasnferToTable(null);
   setShowTransferTable((pre) => (open === undefined ? !pre : open));
  },
  [scrollToTop],
 );
 // table report
 const tablesReport = getTablesReport(tables);
 // change selectedTable
 function changeSelectedTable(newTable: Table | null) {
  setSelectedTable(newTable);
 }
 // hall
 const handleChangeHall = useCallback(
  (newHall: InitiData['salons'][number]) => {
   changeShowMergeTable(false);
   changeShowTransferTable(false);
   setTablesSuccess(false);
   const newSearchQueries = new URLSearchParams(searchQueries.toString());
   newSearchQueries.set('selectedHall', newHall.key);
   router.replace(
    `/${locale}/restaurant/salons?${newSearchQueries.toString()}`,
   );
   setSelectedHall(newHall);
  },
  [
   locale,
   router,
   searchQueries,
   changeShowMergeTable,
   changeShowTransferTable,
  ],
 );

 const selectedHallIndex =
  initData!.salons?.findIndex((item) => item.key === selectedHall?.key) || 0;
 const hasPrevHall = !!selectedHall && selectedHallIndex !== 0;
 const hasNextHall =
  !!selectedHall && selectedHallIndex < initData!.salons.length - 1;

 function handleNextHall() {
  if (!hasNextHall) return;
  handleChangeHall(initData!.salons[selectedHallIndex + 1]);
 }
 function handlePrevHall() {
  if (!hasPrevHall) return;
  handleChangeHall(initData!.salons[selectedHallIndex - 1]);
 }
 // ctx

 const ctx: SalonBaseConfig = {
  initData: initData!,
  hallsInfo: {
   data: initData!.salons,
   isFetching: initDataIsFetching,
   isLoading: initDataIsLoading,
   isError: initDataIsError,
   isSuccess: initDataSuccess,
   selectedHall,
   hasNext: hasNextHall,
   hasPrev: hasPrevHall,
   nextHall: handleNextHall,
   prevHall: handlePrevHall,
   changeHall: handleChangeHall,
  },
  tablesInfo: {
   data: tables,
   isSuccess: tablesSuccess,
   filteredData: getFilteredTables({
    tables,
    filters: tableFilters,
    showMergeTable,
    selectedTableID: selectedTable?.tableID,
   }),
   isError: tablesError,
   isLoading: isLoadingTables,
   lastTablesUpdate,
   tablesReport,
   filters: tableFilters,
   selectedTable,
   showChangeTableState,
   showTransferTable,
   selectedTransferToTable: transferToTable,
   showTransferTableConfirm,
   showMergeTableConfirm,
   selectedMergeToTable: mergeToTable,
   showMergeTable,
   onShowChangeTableState: handleShowChangeStateTable,
   changeFilters: handleChangeTableFilters,
   changeSelectedTable,
   changeShowTransferTable,
   transferTableTo: handleTransferTableTo,
   mergeTableTo: handleMergeTableTo,
   changeShowTransferTableConfirm,
   changeShowMergeTable,
   changeShowMergeTableConfirm,
  },
 };

 useEffect(() => {
  if (!initData!.salons.length) return;
  const querySelectedhall = searchQueries.get('selectedHall');
  const findQueryHall = initData!.salons.find(
   (item) => item.key === querySelectedhall,
  );
  if (findQueryHall) {
   setSelectedHall(findQueryHall);
  } else {
   setSelectedHall(initData!.salons[0]);
  }
 }, [handleChangeHall, searchQueries, initData]);

 return (
  <salonBaseConfigContext.Provider value={ctx}>
   {children}
  </salonBaseConfigContext.Provider>
 );
}
