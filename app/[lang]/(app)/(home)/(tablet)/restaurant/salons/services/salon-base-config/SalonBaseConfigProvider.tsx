'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
 type SalonBaseConfig,
 salonBaseConfigContext,
} from './salonBaseConfigContext';
import {
 type Table,
 type Hall,
 getHallKey,
 getHalls,
} from '../salonsApiActions';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import * as signalR from '@microsoft/signalr';
import { getUserLoginToken } from '@/app/[lang]/(app)/login/utils/loginTokenManager';
import { getTablesReport } from '../../utils/getTablesReport';

export default function SalonBaseConfigProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [tables, setTables] = useState<Table[]>([]);
 const [isLoadingTables, setIsLoadingTables] = useState(false);
 const [lastTablesUpdate, setLastTablesUpdate] = useState<Date | null>(null);
 const [connection, setConnection] = useState<signalR.HubConnection | null>(
  null,
 );
 const { locale } = useBaseConfig();
 const router = useRouter();
 const searchQueries = useSearchParams();
 const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

 const {
  data: hallsData = [],
  isFetching: hallsIsFetching,
  isLoading: hallsIsLoading,
  // isSuccess: hallsIsSuccess,
 } = useQuery({
  queryKey: [getHallKey, 'list'],
  staleTime: 'static',
  async queryFn({ signal }) {
   const res = await getHalls({ signal });
   const halls = res.data.halls;
   return halls;
  },
 });

 const handleChangeHall = useCallback(
  (newHall: Hall) => {
   const newSearchQueries = new URLSearchParams(searchQueries.toString());
   newSearchQueries.set('selectedHall', newHall.key);
   router.replace(
    `/${locale}/restaurant/salons?${newSearchQueries.toString()}`,
   );
   setSelectedHall(newHall);
  },
  [locale, router, searchQueries],
 );

 const selectedHallIndex =
  hallsData?.findIndex((item) => item.key === selectedHall?.key) || 0;
 const hasPrevHall = !!selectedHall && selectedHallIndex !== 0;
 const hasNextHall = !!selectedHall && selectedHallIndex < hallsData.length - 1;

 function handleNextHall() {
  if (!hasNextHall) return;
  handleChangeHall(hallsData[selectedHallIndex + 1]);
 }
 function handlePrevHall() {
  if (!hasPrevHall) return;
  handleChangeHall(hallsData[selectedHallIndex - 1]);
 }

 // * signal r setup
 const getSalonTables = useCallback(async () => {
  if (!connection || !selectedHall) return;
  setIsLoadingTables(true);
  try {
   await connection.invoke(
    'GetOrderBoardUpdate',
    connection.connectionId,
    // salon id
    Number(selectedHall.key),
    // sale time id
    2,
    new Date().toISOString(),
   );
  } catch (error) {
   console.log('signalR get salon tables failed: ', error);
  } finally {
   setIsLoadingTables(false);
  }
 }, [connection, selectedHall]);

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
 }, []);
 useEffect(() => {
  getSalonTables();
 }, [getSalonTables]);

 //
 const tablesReport = getTablesReport(tables);
 // ctx

 const ctx: SalonBaseConfig = {
  hallsInfo: {
   data: hallsData,
   isFetching: hallsIsFetching,
   isLoading: hallsIsLoading,
   selectedHall,
   hasNext: hasNextHall,
   hasPrev: hasPrevHall,
   nextHall: handleNextHall,
   prevHall: handlePrevHall,
   changeHall: handleChangeHall,
  },
  tablesInfo: {
   data: tables,
   isLoading: isLoadingTables,
   lastTablesUpdate,
   tablesReport,
  },
 };

 useEffect(() => {
  if (!hallsData.length) return;
  const querySelectedhall = searchQueries.get('selectedHall');
  const findQueryHall = hallsData.find(
   (item) => item.key === querySelectedhall,
  );
  if (findQueryHall) {
   setSelectedHall(findQueryHall);
  } else {
   setSelectedHall(hallsData[0]);
  }
 }, [handleChangeHall, searchQueries, hallsData]);

 return (
  <salonBaseConfigContext.Provider value={ctx}>
   {children}
  </salonBaseConfigContext.Provider>
 );
}
