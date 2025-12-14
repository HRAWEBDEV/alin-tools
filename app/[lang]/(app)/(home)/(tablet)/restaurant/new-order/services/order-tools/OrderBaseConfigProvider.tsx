'use client';
import { useState, useReducer } from 'react';
import { ReactNode } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 type OrderBaseConfig,
 type ConfirmOrderType,
 orderBaseConfigContext,
} from './orderBaseConfigContext';
import {
 type ItemGroup,
 newOrderKey,
 getInitData,
 getItemPrograms,
 getOrderItems,
 getOrder,
 getOrderServiceRates,
 closeOrder,
} from '../newOrderApiActions';
import { useQuery, useMutation } from '@tanstack/react-query';
import { filterItemPrograms } from '../../utils/filterItemPrograms';
import { orderItemsReducer } from '../../utils/orderItemsActionsReducer';
import { useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import {
 type OrderInfo,
 defaultOrderInfo,
 createOrderInfoSchema,
} from '../../schemas/orderInfoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { effectOrderItemsServiceRates } from '../../utils/effectOrderItemsServiceRates';
import { shopCalculator } from '../../utils/shopCalculator';
import { BiError } from 'react-icons/bi';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function OrderBaseConfigProvider({
 children,
 dic,
}: {
 children: ReactNode;
 dic: NewOrderDictionary;
}) {
 const router = useRouter();
 const { locale } = useBaseConfig();
 // order info
 const orderInfoForm = useForm<OrderInfo>({
  resolver: zodResolver(createOrderInfoSchema({ dic })),
  defaultValues: {
   ...defaultOrderInfo,
   orderDate: new Date(),
  },
 });
 const [
  saleTypeValue,
  hasServiceValue,
  userDiscountValue,
  deliveryValue,
  tipValue,
  roundingValue,
 ] = orderInfoForm.watch([
  'saleType',
  'hasService',
  'discountRate',
  'deliveryValue',
  'employeeTip',
  'rounding',
 ]);
 //
 const searchQuery = useSearchParams();
 const fromSalonsQuery = searchQuery.get('fromSalons') === 'true';
 const orderIDQuery = Number(searchQuery.get('orderID')) || null;
 //
 const [showCloseOrder, setShowCloseOrder] = useState(false);
 const [selectedItemGroup, setSelectedItemGroup] = useState<ItemGroup | null>(
  null,
 );
 const [searchedItemName, setSearchedItemName] = useState('');
 const [confirmOrderIsOpen, setConfirmOrderIsOpen] = useState(false);
 const [confirmOrderActiveType, setConfirmOrderActiveType] =
  useState<ConfirmOrderType>('orderInfo');
 // order items reducer
 const [orderItems, orderItemsDispatch] = useReducer(orderItemsReducer, []);
 //
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
  gcTime: 0,
  queryKey: [newOrderKey, 'initial-data'],
  async queryFn({ signal }) {
   const res = await getInitData({ signal });
   const data = res.data;
   if (data.itemGroups.length) {
    handleChangeSelectedItemGroup(data.itemGroups[0]);
   }
   if (data.saleTimes) {
    const activeSaleTime = data.defaultSaleTimeID
     ? data.saleTimes.find(
        (item) => item.key === data.defaultSaleTimeID.toString(),
       ) || data.saleTimes[0]
     : data.saleTimes[0];
    orderInfoForm.setValue('saleTime', activeSaleTime);
   }
   if (data.saleTypes) {
    const activeSaleType = data.defaultSaleTypeID
     ? data.saleTypes.find(
        (item) => item.key === data.defaultSaleTypeID.toString(),
       ) || data.saleTypes[0]
     : data.saleTypes[0];
    orderInfoForm.setValue('saleType', activeSaleType);
   }
   if (data.bonNo) {
    orderInfoForm.setValue('bonNo', data.bonNo);
   }
   return data;
  },
 });

 // item program search
 function handleChangeSearchedItemName(newSearch: string) {
  setSearchedItemName(newSearch);
 }
 // get item get item programs
 const {
  data: itemProgramsData,
  isLoading: itemProgramsLoading,
  isFetching: itemProgramsFetching,
  isSuccess: itemProgramsSuccess,
  isError: itemProgramsError,
 } = useQuery({
  enabled: !!selectedItemGroup,
  queryKey: [newOrderKey, 'item-programs', selectedItemGroup?.key || ''],
  async queryFn({ signal }) {
   const res = await getItemPrograms({
    signal,
    contractMenuID: null,
    itemGroupID: Number(selectedItemGroup!.key),
    orderDateTime: new Date().toISOString(),
   });
   return res.data;
  },
 });
 const filteredItemPrograms = filterItemPrograms({
  items: itemProgramsData,
  searchedItemName,
 });
 // get Order

 const {
  data: userOrder,
  isLoading: userOrderLoading,
  isError: userOrderError,
  isSuccess: userOrderSuccess,
 } = useQuery({
  staleTime: 'static',
  gcTime: 0,
  enabled: !!orderIDQuery,
  queryKey: [newOrderKey, 'order-info', orderIDQuery],
  async queryFn({ signal }) {
   const { data } = await getOrder({ signal, orderID: orderIDQuery! });
   return data;
  },
 });

 const {
  data: userOrderItems,
  isLoading: userOrderItemsLoading,
  isError: userOrderItemsError,
  isSuccess: userOrderItemsSuccess,
 } = useQuery({
  staleTime: 'static',
  gcTime: 0,
  enabled: !!orderIDQuery,
  queryKey: [newOrderKey, 'order-items', orderIDQuery],
  async queryFn({ signal }) {
   const { data } = await getOrderItems({ signal, orderID: orderIDQuery! });
   orderItemsDispatch({
    type: 'insertOrderItems',
    payload: data,
   });
   return data;
  },
 });

 // service rates
 const {
  data: serviceRatesData,
  isLoading: serviceRatesLoading,
  isError: serviceRatesIsError,
 } = useQuery({
  enabled: !!saleTypeValue,
  queryKey: [
   newOrderKey,
   'service-rates',
   userOrder?.id.toString() || '',
   saleTypeValue?.key || '',
  ],
  staleTime: 'static',
  gcTime: 0,
  async queryFn({ signal }) {
   const res = await getOrderServiceRates({
    signal,
    orderID: userOrder?.id || 0,
    saleTypeID: Number(saleTypeValue!.key),
   });
   return res.data;
  },
 });
 //
 const pricedOrderItems = effectOrderItemsServiceRates({
  orderItems,
  hasService: hasServiceValue,
  serviceRates: serviceRatesData || null,
  userDiscount: Number(userDiscountValue) || 0,
 });
 //
 const invoiceShopResult = shopCalculator(
  pricedOrderItems,
  0,
  (Number(tipValue) || 0) +
   (Number(deliveryValue) || 0) +
   (Number(roundingValue) || 0),
 );
 // close order
 function onCloseOrder() {
  setShowCloseOrder(true);
 }
 const { mutate: handleConfirmCloseOrder, isPending: isPendingCloseOrder } =
  useMutation({
   mutationFn() {
    return closeOrder({ orderID: userOrder!.id });
   },
   onSuccess() {
    router.push(`/${locale}/restaurant/salons`);
    setShowCloseOrder(false);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.message || '');
   },
  });
 // loadings
 const shopLoading =
  initLoading ||
  userOrderItemsLoading ||
  userOrderLoading ||
  serviceRatesLoading;
 const shopInfoLoading = shopLoading;
 //

 const ctx: OrderBaseConfig = {
  shopLoading,
  shopInfoLoading,
  confirmOrderIsOpen,
  changeConfirmType,
  confirmOrderActiveType,
  showConfirmOrder,
  closeConfirmOrder,
  queries: {
   fromSalons: fromSalonsQuery,
   orderID: orderIDQuery,
  },
  initialDataInfo: {
   data: initData,
   isError: initError,
   isSuccess: initSuccess,
   isFetching: initFetching,
   isLoading: initLoading,
  },
  itemsInfo: {
   selectedItemGroup,
   data: itemProgramsData,
   filteredData: filteredItemPrograms,
   isLoading: itemProgramsLoading,
   isFetching: itemProgramsFetching,
   isSuccess: itemProgramsSuccess,
   isError: itemProgramsError,
   searchedItemName,
   changeSearchedItemName: handleChangeSearchedItemName,
   changeSelectedItemGroup: handleChangeSelectedItemGroup,
  },
  userOrder: {
   order: {
    data: userOrder,
    isLoading: userOrderLoading,
    isError: userOrderError,
    isSuccess: userOrderSuccess,
   },
   orderItems: {
    data: userOrderItems,
    isLoading: userOrderItemsLoading,
    isError: userOrderItemsError,
    isSuccess: userOrderItemsSuccess,
   },
  },
  order: {
   onCloseOrder,
   serviceRates: {
    data: serviceRatesData,
    isLoading: serviceRatesLoading,
    isError: serviceRatesIsError,
   },
   orderItems: pricedOrderItems,
   orderItemsDispatch,
  },
  invoice: {
   orderTotals: invoiceShopResult,
  },
 };

 return (
  <orderBaseConfigContext.Provider value={ctx}>
   <FormProvider {...orderInfoForm}>{children}</FormProvider>
   <Dialog
    open={showCloseOrder}
    onOpenChange={(newValue) => setShowCloseOrder(newValue)}
   >
    <DialogContent className='p-0 gap-0'>
     <DialogHeader className='p-4'></DialogHeader>
     <div className='p-4'>
      <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
       <BiError className='size-12' />
       <p>{dic.closeOrder.confirmMessage}</p>
      </div>
     </div>
     <DialogFooter className='p-4'>
      <DialogClose asChild>
       <Button
        disabled={isPendingCloseOrder}
        className='sm:w-24 h-11'
        variant='outline'
       >
        {isPendingCloseOrder && <Spinner />}
        {dic.closeOrder.cancel}
       </Button>
      </DialogClose>
      <DialogClose asChild>
       <Button
        disabled={isPendingCloseOrder}
        className='sm:w-24 h-11'
        variant='destructive'
        onClick={() => handleConfirmCloseOrder()}
       >
        {isPendingCloseOrder && <Spinner />}
        {dic.closeOrder.confirm}
       </Button>
      </DialogClose>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </orderBaseConfigContext.Provider>
 );
}
