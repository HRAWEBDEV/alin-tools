'use client';
import { ReactNode, useState } from 'react';
import {
 type SalonBaseConfig,
 salonBaseConfigContext,
} from './salonBaseConfigContext';
import { type Hall, getHallKey, getHalls } from '../salonsApiActions';
import { useQuery } from '@tanstack/react-query';

export default function SalonBaseConfigProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
 const {
  data: hallsData = [],
  isFetching: hallsIsFetching,
  isLoading: hallsIsLoading,
  // isSuccess: hallsIsSuccess,
 } = useQuery({
  queryKey: [getHallKey, 'list'],
  async queryFn({ signal }) {
   const res = await getHalls({ signal });
   return res.data.halls;
  },
 });

 function handleChangeHall(newHall: Hall) {
  setSelectedHall(newHall);
 }
 const selectedHallIndex =
  hallsData?.findIndex((item) => item.key === selectedHall?.key) || 0;
 const hasPrevHall = !!selectedHall && selectedHallIndex !== 0;
 const hasNextHall = !!selectedHall && selectedHallIndex < hallsData.length - 1;

 function handleNextHall() {
  if (!hasNextHall) return;
  setSelectedHall(hallsData[selectedHallIndex + 1]);
 }
 function handlePrevHall() {
  if (!hasPrevHall) return;
  setSelectedHall(hallsData[selectedHallIndex - 1]);
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

 return (
  <salonBaseConfigContext.Provider value={ctx}>
   {children}
  </salonBaseConfigContext.Provider>
 );
}
