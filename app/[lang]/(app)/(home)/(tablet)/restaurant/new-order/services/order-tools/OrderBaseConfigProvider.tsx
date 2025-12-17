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
 type Order,
 newOrderKey,
 getInitData,
 getItemPrograms,
 getOrderItems,
 getOrder,
 getOrderServiceRates,
 closeOrder,
 getFreeTables,
 getOrderPayment,
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
import { FaUncharted } from 'react-icons/fa6';

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
 // get free tables
 const { data: freeTables, isLoading: freeTablesIsLoading } = useQuery({
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
 function getNewOrderSavePackage({
  userOrder,
  orderInfo: {},
 }: {
  orderInfo: OrderInfo;
  userOrder?: Order;
 }) {
  const newOrderSavePackage = {
   ...(userOrder || {}),
   id: userOrder ? userOrder.id : 0,
   // occupied: isOnTableDisable ? false : onTable,
   // registerID: room ? Number(room.key) : null,
   // orderNo: initialData.orderNo,
   // orderStateID: initialData.orderStateID,
   // dailyNo: initialData.dailyNo,
   // customerID: customer ? Number(customer.key) : null,
   // tableID: table ? Number(table.key) : null,
   // waiterPersonID: waiter ? Number(waiter.key) : null,
   // subscriberPersonID: subscriber ? Number(subscriber.key) : null,
   // saleTimeID: Number(saleTime.key),
   // saleTypeID: Number(saleType.key),
   // bonNo: bonNo || null,
   // orderDateTimeOffset: orderDateTimeOffset.toISOString(),
   // dateTimeDateTimeOffset: dateTimeDateTimeOffset.toISOString(),
   // persons: persons || null,
   // roundingValue: roundingValue || 0,
   // tipValue: tipValue || 0,
   // delivaryValue: deliveryValue || 0,
   // discountRate: discountRate || null,
   // sValue: totalOrderResult.totalSValue,
   // tax: totalOrderResult.totalTax,
   // service: totalOrderResult.totalService,
   // payment: totalOrderResult.payment,
   // discount: totalOrderResult.totalDiscount,
   // payableValue: totalOrderResult.remained,
   // name: name || null,
   // comment: comment || null,
   // personID: orderPersonID,
   // arzID: 1,
   // orderTypeID: getOrderTypeID({
   //  tableID: table ? table.key : null,
   //  saleTypeID: saleType ? saleType.key : null,
   // }),
   // contractMenuID: contract ? Number(contract.key) : null,
   // seatID: null,
   // employeePersonID: null,
   // deliveryByAgent:
   //  saleType.key == SaleTypes.delivery ? deliveryByAgent : false,
  };
 }

 // loadings
 const shopLoading =
  initLoading ||
  userOrderItemsLoading ||
  userOrderLoading ||
  serviceRatesLoading ||
  orderPaymentLoading;
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
   salonName: salonNameQuery,
  },
  initialDataInfo: {
   data: initData,
   freeTables,
   freeTablesLoading: freeTablesIsLoading,
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
