'use client';
import { ReactNode, useEffect, useState } from 'react';
import {
 type SalonBaseConfig,
 salonBaseConfigContext,
} from './salonBaseConfigContext';
import { type Hall, getHallKey, getHalls } from '../salonsApiActions';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function SalonBaseConfigProvider({
 children,
}: {
 children: ReactNode;
}) {
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

 function handleChangeHall(newHall: Hall) {
  const newSearchQueries = new URLSearchParams(searchQueries.toString());
  newSearchQueries.set('selectedHall', newHall.key);
  router.replace(`/${locale}/restaurant/salons?${newSearchQueries.toString()}`);
  setSelectedHall(newHall);
 }
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
 };

 useEffect(() => {
  const querySelectedhall = searchQueries.get('selectedHall');
  const findQueryHall = hallsData.find(
   (item) => item.key === querySelectedhall,
  );
  if (findQueryHall) setSelectedHall(findQueryHall);
 }, [handleChangeHall, searchQueries, hallsData]);

 return (
  <salonBaseConfigContext.Provider value={ctx}>
   {children}
  </salonBaseConfigContext.Provider>
 );
}
