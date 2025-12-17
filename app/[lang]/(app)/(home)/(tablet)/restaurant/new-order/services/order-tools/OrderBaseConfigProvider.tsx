'use client';
import { useState, useReducer, useEffect } from 'react';
import { ReactNode } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 type OrderBaseConfig,
 type ConfirmOrderType,
 orderBaseConfigContext,
} from './orderBaseConfigContext';
import {
 type ItemGroup,
 type SaveOrderPackage,
 newOrderKey,
 getInitData,
 getItemPrograms,
 getOrderItems,
 getOrder,
 getOrderServiceRates,
 closeOrder,
 getFreeTables,
 getOrderPayment,
 saveOrder,
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
import { getOrderTypeID } from '../../utils/getOrderTypeID';
import { SaleTypes } from '../../utils/SaleTypes';

export default function OrderBaseConfigProvider({
 children,
 dic,
}: {
 children: ReactNode;
 dic: NewOrderDictionary;
}) {
 const router = useRouter();
 const { locale } = useBaseConfig();
 //
 const searchQuery = useSearchParams();
 const fromSalonsQuery = searchQuery.get('fromSalons') === 'true';
 const orderIDQuery = Number(searchQuery.get('orderID')) || null;
 const salonIDQuery = searchQuery.get('salonID');
 const salonNameQuery = searchQuery.get('salonName');
 const tableIDQuery = Number(searchQuery.get('tableID')) || null;
 const tableNoQuery = searchQuery.get('tableNo');
 // order info
 const orderInfoForm = useForm<OrderInfo>({
  resolver: zodResolver(createOrderInfoSchema({ dic })),
  defaultValues: {
   ...defaultOrderInfo,
   orderDate: new Date(),
   table:
    tableIDQuery && tableNoQuery
     ? {
        key: tableIDQuery.toString(),
        value: tableNoQuery,
       }
     : null,
  },
 });
 const [
  saleTypeValue,
  hasServiceValue,
  userDiscountValue,
  deliveryValue,
  tipValue,
  roundingValue,
  saleTimeValue,
  orderDateValue,
 ] = orderInfoForm.watch([
  'saleType',
  'hasService',
  'discountRate',
  'deliveryValue',
  'employeeTip',
  'rounding',
  'saleTime',
  'orderDate',
 ]);
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
   return res.data;
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
 // get free tables
 const {
  data: freeTables,
  isLoading: freeTablesIsLoading,
  isFetching: freeTablesIsFetching,
  refetch: freeTablesRefetch,
 } = useQuery({
  enabled: Boolean(saleTimeValue && orderDateValue),
  staleTime: 'static',
  gcTime: 0,
  queryKey: [
   newOrderKey,
   'free-tables',
   saleTimeValue?.key,
   orderDateValue,
   salonIDQuery,
  ],
  async queryFn({ signal }) {
   const res = await getFreeTables({
    signal,
    orderDate: orderDateValue.toISOString(),
    saleTimeID: saleTimeValue!.key,
    salonID: salonIDQuery || undefined,
   });
   const freeTables = [...res.data];
   if (orderIDQuery && tableIDQuery && tableNoQuery) {
    freeTables.unshift({
     key: tableIDQuery.toString(),
     value: tableNoQuery,
    });
   }
   return freeTables;
  },
 });

 // get order payment
 const {
  data: orderPaymentValue = 0,
  isLoading: orderPaymentLoading,
  isError: orderPaymentError,
 } = useQuery({
  enabled: !!userOrder?.id,
  queryKey: [newOrderKey, 'order-payment'],
  gcTime: 0,
  async queryFn({ signal }) {
   const res = await getOrderPayment({
    signal,
    orderID: userOrder!.id,
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
  orderPaymentValue,
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

 // get new order save package
 const { mutate: confirmSaveOrder, isPending: saveOrderPending } = useMutation({
  async mutationFn({
   order,
   data,
  }: {
   order: SaveOrderPackage['order'];
   data: OrderInfo;
  }) {
   return saveOrder({
    orderPackage: {
     order,
     orderItems: pricedOrderItems,
    },
    sendToKitchen: data.sendToKitchen,
    printToCashBox: data.printCash,
   });
  },
 });

 async function handleSaveOrder() {
  if (!initData) return;
  orderInfoForm.handleSubmit((data) => {
   const newOrder = {
    ...(userOrder || {}),
    id: userOrder?.id || 0,
    orderStateID: initData.orderStateID || 1,
    occupied: data.table ? data.hasTableNo : false,
    registerID: data.room ? Number(data.room.key) : null,
    orderNo: initData.orderNo,
    dailyNo: initData.dailyNo,
    customerID: data.customer ? Number(data.customer.key) : null,
    tableID: data.table ? Number(data.table.key) : null,
    waiterPersonID: data.waiter ? Number(data.waiter.key) : null,
    subscriberPersonID: data.subscriber ? Number(data.subscriber.key) : null,
    saleTimeID: data.saleTime ? Number(data.saleTime.key) : null,
    saleTypeID: Number(data.saleType!.key),
    bonNo: data.bonNo || null,
    orderDateTimeOffset: data.orderDate.toISOString(),
    persons: data.persons || null,
    roundingValue: data.rounding || 0,
    tipValue: data.employeeTip || 0,
    delivaryValue: deliveryValue || 0,
    discountRate: data.discountRate || null,
    sValue: invoiceShopResult.totalSValue,
    tax: invoiceShopResult.totalTax,
    service: invoiceShopResult.totalService,
    payment: invoiceShopResult.payment,
    discount: invoiceShopResult.totalDiscount,
    payableValue: invoiceShopResult.remained,
    comment: data.comment || null,
    arzID: 1,
    orderTypeID: getOrderTypeID({
     tableID: data.table ? data.table.key : null,
     saleTypeID: data.saleType ? data.saleType.key : null,
    }),
    contractMenuID: data.contract ? Number(data.contract.key) : null,
    seatID: null,
    employeePersonID: null,
    deliveryByAgent:
     data.saleType && data.saleType.key == SaleTypes.delivery
      ? data.deliveryAgent
      : false,
    name: null,
    personID: userOrder?.personID || null,
    dateTimeDateTimeOffset:
     userOrder?.dateTimeDateTimeOffset || new Date().toISOString(),
   } as SaveOrderPackage['order'];
   confirmSaveOrder({
    data,
    order: newOrder,
   });
  })();
 }

 // loadings
 const shopLoading =
  initLoading ||
  userOrderItemsLoading ||
  userOrderLoading ||
  serviceRatesLoading ||
  orderPaymentLoading ||
  saveOrderPending;
 const shopInfoLoading = shopLoading;
 // set defaults
 useEffect(() => {
  if (!initData || !initSuccess) return;
  if (initData.itemGroups.length) {
   handleChangeSelectedItemGroup(initData.itemGroups[0]);
  }
  orderInfoForm.setValue('sendToKitchen', initData.sendToKitchen);
  orderInfoForm.setValue('printCash', initData.printToCashbox);
  if (!!orderIDQuery) return;
  if (initData.saleTimes) {
   const activeSaleTime = initData.defaultSaleTimeID
    ? initData.saleTimes.find(
       (item) => item.key === initData.defaultSaleTimeID.toString(),
      ) || initData.saleTimes[0]
    : initData.saleTimes[0];
   orderInfoForm.setValue('saleTime', activeSaleTime);
  }
  if (initData.saleTypes) {
   const activeSaleType = initData.defaultSaleTypeID
    ? initData.saleTypes.find(
       (item) => item.key === initData.defaultSaleTypeID.toString(),
      ) || initData.saleTypes[0]
    : initData.saleTypes[0];
   orderInfoForm.setValue('saleType', activeSaleType);
  }
  if (initData.bonNo) {
   orderInfoForm.setValue('bonNo', initData.bonNo);
  }
 }, [initData, orderInfoForm, orderIDQuery, initSuccess]);

 useEffect(() => {
  if (!userOrder || !userOrderSuccess) return;
  const {
   tableID,
   tableNo,
   discountRate,
   roundingValue,
   subscriberPersonID,
   subscriberCode,
   customerID,
   customerName,
   customerCode,
   contractMenuID,
   contractMenuName,
   registerID,
   roomLabel,
   bonNo,
   persons,
   delivaryValue,
   tipValue,
   orderDateTimeOffset,
   saleTimeID,
   saleTimeName,
   saleTypeID,
   saleTypeName,
   waiterPersonFullName,
   waiterPersonID,
   deliveryByAgent,
   occupied,
   comment,
  } = userOrder;
  if (tableID && tableNo) {
   orderInfoForm.setValue('table', {
    key: tableID.toString(),
    value: tableNo.toString(),
   });
  }
  orderInfoForm.setValue('discountRate', discountRate || '');
  orderInfoForm.setValue('rounding', roundingValue || '');
  if (subscriberPersonID && subscriberCode) {
   orderInfoForm.setValue('subscriber', {
    key: subscriberPersonID.toString(),
    value: subscriberCode.toString(),
    customerName: '',
   });
  }
  if (customerID) {
   orderInfoForm.setValue('customer', {
    key: customerID.toString(),
    code: customerCode || '',
    value: customerName || '',
   });
  }
  if (contractMenuID) {
   orderInfoForm.setValue('contract', {
    key: contractMenuID.toString(),
    value: contractMenuName || '',
   });
  }
  if (registerID) {
   orderInfoForm.setValue('room', {
    key: registerID.toString(),
    value: roomLabel || '',
    customerName: '',
   });
  }
  orderInfoForm.setValue('bonNo', bonNo || '');
  orderInfoForm.setValue('comment', comment || '');
  orderInfoForm.setValue('persons', persons || '');
  orderInfoForm.setValue('deliveryValue', delivaryValue || '');
  orderInfoForm.setValue('employeeTip', tipValue || '');
  orderInfoForm.setValue('orderDate', new Date(orderDateTimeOffset));
  orderInfoForm.setValue('deliveryAgent', !!deliveryByAgent);
  orderInfoForm.setValue('hasTableNo', occupied);
  if (saleTimeID && saleTimeName) {
   orderInfoForm.setValue('saleTime', {
    key: saleTimeID.toString(),
    value: saleTimeName,
   });
  }
  if (saleTypeID && saleTypeName) {
   orderInfoForm.setValue('saleType', {
    key: saleTypeID.toString(),
    value: saleTypeName,
   });
  }
  if (waiterPersonID && waiterPersonFullName) {
   orderInfoForm.setValue('waiter', {
    key: waiterPersonID.toString(),
    value: waiterPersonFullName,
   });
  }
 }, [userOrder, userOrderSuccess, orderInfoForm]);
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
   salonName: salonNameQuery,
  },
  initialDataInfo: {
   data: initData,
   freeTables,
   freeTablesLoading: freeTablesIsLoading,
   freeTablesRefetch,
   freeTablesFetching: freeTablesIsFetching,
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
   serviceRates: {
    data: serviceRatesData,
    isLoading: serviceRatesLoading,
    isError: serviceRatesIsError,
   },
   orderItems: pricedOrderItems,
   onCloseOrder,
   onSaveOrder: handleSaveOrder,
   orderItemsDispatch,
  },
  invoice: {
   orderTotals: invoiceShopResult,
   payment: {
    data: orderPaymentValue,
    isLoading: orderPaymentLoading,
    isError: orderPaymentError,
   },
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
