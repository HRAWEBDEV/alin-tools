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
  data: hallsData,
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

 const ctx: SalonBaseConfig = {
  hallsInfo: {
   data: hallsData || [],
   isFetching: hallsIsFetching,
   isLoading: hallsIsLoading,
   selectedHall,
   changeHall: handleChangeHall,
  },
 };

 return (
  <salonBaseConfigContext.Provider value={ctx}>
   {children}
  </salonBaseConfigContext.Provider>
 );
}
