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
 getFreeTables,
 getOrderPayment,
 saveOrder,
} from '../newOrderApiActions';
import {
 saveAndCloseOrder,
 sendToPcPos,
} from '../orderInvoicePaymentApiActions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { type OrderInvoicePayment } from '../../schemas/orderInvoicePaymentSchema';

export default function OrderBaseConfigProvider({
 children,
 dic,
}: {
 children: ReactNode;
 dic: NewOrderDictionary;
}) {
 const queryClient = useQueryClient();
 const router = useRouter();
 const { locale } = useBaseConfig();
 const searchQuery = useSearchParams();
 const fromSalonsQuery = searchQuery.get('fromSalons') === 'true';
 const orderIDQuery = Number(searchQuery.get('orderID')) || null;
 const salonIDQuery = searchQuery.get('salonID');
 const salonNameQuery = searchQuery.get('salonName');
 const tableIDQuery = Number(searchQuery.get('tableID')) || null;
 const tableNoQuery = searchQuery.get('tableNo');
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
  subscriberValue,
  customerValue,
  roomValue,
  contractValue,
 ] = orderInfoForm.watch([
  'saleType',
  'hasService',
  'discountRate',
  'deliveryValue',
  'employeeTip',
  'rounding',
  'saleTime',
  'orderDate',
  'subscriber',
  'customer',
  'room',
  'contract',
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
 const [orderItems, orderItemsDispatch] = useReducer(orderItemsReducer, []);
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

 const [quickOrderInfoIsOpen, setQuickOrderInfoIsOpen] = useState(false);

 function openQuickOrderInfo() {
  setQuickOrderInfoIsOpen(true);
 }

 function closeQuickOrderInfo() {
  setQuickOrderInfoIsOpen(false);
 }
 function handleChangeSelectedItemGroup(newItemGroup: ItemGroup) {
  setSelectedItemGroup(newItemGroup);
 }

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

 function handleChangeSearchedItemName(newSearch: string) {
  setSearchedItemName(newSearch);
 }
 const {
  data: itemProgramsData,
  isLoading: itemProgramsLoading,
  isFetching: itemProgramsFetching,
  isSuccess: itemProgramsSuccess,
  isError: itemProgramsError,
 } = useQuery({
  enabled: !!selectedItemGroup && !!saleTypeValue,
  queryKey: [
   newOrderKey,
   'item-programs',
   saleTypeValue?.key || '',
   selectedItemGroup?.key || '',
   String(hasServiceValue),
   roomValue?.key || 'all',
   contractValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getItemPrograms({
    signal,
    contractMenuID: contractValue?.key,
    itemGroupID: selectedItemGroup!.key,
    orderDateTime: new Date().toISOString(),
    saleTypeID: saleTypeValue!.key,
    hasService: hasServiceValue,
    registerID: roomValue?.key,
   });
   return res.data;
  },
 });
 const filteredItemPrograms = filterItemPrograms({
  items: itemProgramsData,
  searchedItemName,
 });

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
 const pricedOrderItems = effectOrderItemsServiceRates({
  orderItems,
  hasService: hasServiceValue,
  userDiscount: Number(userDiscountValue) || 0,
 });
 const invoiceShopResult = shopCalculator(
  pricedOrderItems,
  orderPaymentValue,
  (Number(tipValue) || 0) +
   (Number(deliveryValue) || 0) +
   (Number(roundingValue) || 0),
 );
 function onCloseOrder() {
  setShowCloseOrder(true);
 }
 const { mutate: handleConfirmCloseOrder, isPending: isPendingCloseOrder } =
  useMutation({
   mutationFn({
    newOrder,
    orderInfo,
   }: {
    orderInfo: OrderInfo;
    newOrder: SaveOrderPackage['order'];
   }) {
    return saveAndCloseOrder({
     order: newOrder,
     orderItems: pricedOrderItems,
     printToCashBox: orderInfo.printCash,
     sendToKitchen: orderInfo.sendToKitchen,
    });
   },
   onSuccess(res) {
    if (orderIDQuery) {
     queryClient.invalidateQueries({
      queryKey: [newOrderKey, 'order-items', orderIDQuery],
     });
    }
    if (res.data.message) {
     toast.warning(res.data.message);
    }
    router.push(`/${locale}/restaurant/salons`);
    setShowCloseOrder(false);
    setConfirmOrderIsOpen(false);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.message || '');
   },
  });

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
  onSuccess(res) {
   if (orderIDQuery) {
    queryClient.invalidateQueries({
     queryKey: [newOrderKey, 'order-items', orderIDQuery],
    });
   }
   if (res.data.message) {
    toast.warning(res.data.message);
   }
   router.push(`/${locale}/restaurant/salons`);
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data || '');
  },
 });

 let orderInfoName =
  roomValue?.customerName ||
  subscriberValue?.customerName ||
  customerValue?.value ||
  '';
 if (
  (roomValue || subscriberValue || customerValue) &&
  !orderInfoName &&
  userOrder?.name
 ) {
  orderInfoName = userOrder.name;
 }

 async function validateOrderInfo(): Promise<{
  newOrderData: SaveOrderPackage['order'];
  orderInfoData: OrderInfo;
 } | null> {
  let newOrderData: SaveOrderPackage['order'] | null = null;
  let orderInfoData: OrderInfo | null = null;
  if (!initData) return null;
  await orderInfoForm.handleSubmit(
   (data) => {
    const newOrder = {
     ...(userOrder || {}),
     id: userOrder?.id || 0,
     orderStateID: initData.orderStateID || 1,
     occupied: data.table ? data.hasTableNo : false,
     registerID: data.room ? Number(data.room.key) : null,
     orderNo: newOrderData?.orderNo || initData.orderNo,
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
     name: data.customerName || orderInfoName || null,
     personID: userOrder?.personID || null,
     dateTimeDateTimeOffset:
      userOrder?.dateTimeDateTimeOffset || new Date().toISOString(),
    } as SaveOrderPackage['order'];
    newOrderData = newOrder;
    orderInfoData = data;
   },
   (err) => {
    const errorKeys = Object.keys(err) as (keyof typeof err)[];
    showConfirmOrder('orderInfo');
    errorKeys.forEach((errKey) => toast.error(err[errKey]?.message));
   },
  )();
  if (!orderInfoData || !newOrderData) return null;
  return {
   orderInfoData,
   newOrderData,
  };
 }

 async function handleSaveOrder() {
  const orderInfoRes = await validateOrderInfo();
  if (!orderInfoRes) return;
  confirmSaveOrder({
   data: orderInfoRes.orderInfoData,
   order: orderInfoRes.newOrderData,
  });
 }
 const { mutate: handleConfirmPayment, isPending: isPendingConfirmPayment } =
  useMutation({
   async mutationFn({
    newOrder,
    orderInfo,
    paymentData,
   }: {
    paymentData: OrderInvoicePayment;
    newOrder: SaveOrderPackage['order'];
    orderInfo: OrderInfo;
   }) {
    return paymentData.paymentType?.key === '2'
     ? sendToPcPos({
        order: newOrder,
        orderItems: pricedOrderItems,
        sendToKitchen: orderInfo.sendToKitchen,
        printToCashBox: orderInfo.sendToKitchen,
        bankID: Number(paymentData.bank!.key),
        posID: Number(paymentData.cardReader!.key),
       })
     : saveAndCloseOrder({
        order: newOrder,
        orderItems: pricedOrderItems,
        sendToKitchen: orderInfo.sendToKitchen,
        printToCashBox: orderInfo.sendToKitchen,
        cash: {
         bankAccountID: Number(paymentData.bank?.key) || null,
         payRefNo: paymentData.paymentRefNo || null,
         payTypeID: Number(paymentData.paymentType?.key) || null,
         sValue: invoiceShopResult.remained,
        },
       });
   },
   onSuccess(res) {
    if (orderIDQuery) {
     queryClient.invalidateQueries({
      queryKey: [newOrderKey, 'order-items', orderIDQuery],
     });
    }
    if (res.data.message) {
     toast.warning(res.data.message);
    }
    router.push(`/${locale}/restaurant/salons`);
    setConfirmOrderIsOpen(false);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.message || '');
   },
  });

 async function handlePayment(paymentData: OrderInvoicePayment) {
  const newOrderRes = await validateOrderInfo();
  if (!newOrderRes) return;
  handleConfirmPayment({
   newOrder: newOrderRes.newOrderData,
   orderInfo: newOrderRes.orderInfoData,
   paymentData,
  });
 }
 const shopLoading =
  initLoading ||
  userOrderItemsLoading ||
  userOrderLoading ||
  orderPaymentLoading ||
  saveOrderPending ||
  isPendingCloseOrder ||
  isPendingConfirmPayment;
 const shopInfoLoading = shopLoading;
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
   name,
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
  orderInfoForm.setValue('customerName', name || '');
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

 const ctx: OrderBaseConfig = {
  shopLoading,
  shopInfoLoading,
  confirmOrderIsOpen,
  changeConfirmType,
  confirmOrderActiveType,
  showConfirmOrder,
  closeConfirmOrder,
  quickOrderInfoIsOpen,
  openQuickOrderInfo,
  closeQuickOrderInfo,
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
   orderInfoName,
   orderItems: pricedOrderItems,
   onCloseOrder,
   onSaveOrder: handleSaveOrder,
   orderItemsDispatch,
  },
  invoice: {
   isPayable: saleTypeValue?.key !== SaleTypes.room,
   orderTotals: invoiceShopResult,
   payment: {
    data: orderPaymentValue,
    isLoading: orderPaymentLoading,
    isError: orderPaymentError,
   },
   onPayment: handlePayment,
   onPaymentPcPos: handlePayment,
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
        onClick={async () => {
         const newOrderRes = await validateOrderInfo();
         if (!newOrderRes) return;
         handleConfirmCloseOrder({
          newOrder: newOrderRes.newOrderData,
          orderInfo: newOrderRes.orderInfoData,
         });
        }}
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
