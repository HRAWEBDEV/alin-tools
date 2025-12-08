'use client';
import { useState } from 'react';
import { ReactNode } from 'react';
import {
 type OrderBaseConfig,
 type ConfirmOrderType,
 orderBaseConfigContext,
} from './orderBaseConfigContext';
import {
 type ItemGroup,
 newOrderKey,
 getInitData,
} from '../newOrderApiActions';
import { useQuery } from '@tanstack/react-query';
import LoadingLogo from '@/app/[lang]/(app)/components/LoadingLogo';

export default function OrderBaseConfigProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [selectedItemGroup, setSelectedItemGroup] = useState<ItemGroup | null>(
  null,
 );
 const [confirmOrderIsOpen, setConfirmOrderIsOpen] = useState(false);
 const [confirmOrderActiveType, setConfirmOrderActiveType] =
  useState<ConfirmOrderType>('orderInfo');

 function showConfirmOrder(confirmType?: ConfirmOrderType) {
  setConfirmOrderIsOpen(true);
  setConfirmOrderActiveType(confirmType || 'orderInfo');
 }

 function closeConfirmOrder() {
  setConfirmOrderIsOpen(false);
  setConfirmOrderActiveType('orderInfo');
 }

 function changeConfirmType(type: ConfirmOrderType) {
  setConfirmOrderActiveType(type);
 }
 // selected group item
 function handleChangeSelectedItemGroup(newItemGroup: ItemGroup) {
  setSelectedItemGroup(newItemGroup);
 }

 // initial Data
 const {
  data: initData,
  isLoading: initLoading,
  isError: initError,
  isSuccess: initSuccess,
  isFetching: initFetching,
 } = useQuery({
  staleTime: 'static',
  queryKey: [newOrderKey, 'initial-data'],
  async queryFn({ signal }) {
   const res = await getInitData({ signal });
   const data = res.data;
   if (data.itemGroups.length) {
    handleChangeSelectedItemGroup(data.itemGroups[0]);
   }
   return data;
  },
 });

 const ctx: OrderBaseConfig = {
  confirmOrderIsOpen,
  changeConfirmType,
  confirmOrderActiveType,
  showConfirmOrder,
  closeConfirmOrder,
  initialDataInfo: {
   data: initData!,
   isError: initError,
   isSuccess: initSuccess,
   isFetching: initFetching,
   isLoading: initLoading,
  },
  itemsInfo: {
   selectedItemGroup,
   changeSelectedItemGroup: handleChangeSelectedItemGroup,
  },
 };
 if (initError) return <></>;
 if (initLoading || !initSuccess)
  return (
   <div className='grid place-content-center'>
    <div>
     <LoadingLogo className='size-96' />
    </div>
   </div>
  );
 return (
  <orderBaseConfigContext.Provider value={ctx}>
   {children}
  </orderBaseConfigContext.Provider>
 );
}
