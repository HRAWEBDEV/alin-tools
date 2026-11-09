'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
 DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import PaymentInvoice from './PaymentInvoice';
import PaymentOrderInfo from './PaymentOrderInfo';
import PaymentShop from './PaymentShop';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
 getOrder,
 getOrderPaymentApi,
 getOrderApi,
 getOrderItems,
 getOrderItemsApi,
 getOtpCodesApi,
 getOrderOtpCodes,
} from '../../../new-order/services/newOrderApiActions';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getHallKey, getTableOrders } from '../../services/salonsApiActions';
import { Button } from '@/components/ui/button';
import { useN950Pos } from '@/app/[lang]/(app)/(home)/(tablet)/hooks/useN950Pos';
import { Spinner } from '@/components/ui/spinner';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { AlertTriangleIcon, AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { saveAndCloseOrder } from '../../../new-order/services/orderInvoicePaymentApiActions';
import { PaymentType } from '../../../new-order/utils/PaymentTypes';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useSalonBaseConfigContext } from '../../services/salon-base-config/salonBaseConfigContext';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function TablePaymentModal({
 dic,
 open,
 orderId,
 tableID,
 onOpenChange,
}: {
 dic: SalonsDictionary;
 open: boolean;
 orderId: number;
 tableID: number;
 onOpenChange: (open: boolean) => unknown;
}) {
 const queryClient = useQueryClient();
 const {
  status,
  lastOperation,
  posResponse,
  connect,
  handlePurchase,
  handlePrintInvoice,
 } = useN950Pos();
 const [activeOrderId, setActiveOrderId] = useState(orderId);
 const { localeInfo } = useBaseConfig();
 const [activeTab, setActiveTab] = useState('invoice');
 const { salonsSettings, initData } = useSalonBaseConfigContext();
 const { routeOwner, routeProgram } = useUserInfoRouter();

 const {
  data: userOrder,
  isLoading: userOrderLoading,
  isError: userOrderError,
  isSuccess: userOrderSuccess,
 } = useQuery({
  staleTime: 'static',
  gcTime: 0,
  queryKey: [getOrderApi, activeOrderId.toString()],
  async queryFn({ signal }) {
   const { data } = await getOrder({ signal, orderID: activeOrderId });
   return data;
  },
 });

 const {
  data: ordersList,
  isLoading: isLoadingOrdersList,
  isSuccess: isSuccessOrdersList,
 } = useQuery({
  queryKey: [getHallKey, 'ordersList', tableID.toString()],
  async queryFn({ signal }) {
   const res = await getTableOrders({
    tableID: tableID,
    signal,
   });
   return res.data;
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
  enabled: !!activeOrderId,
  queryKey: [getOrderItemsApi, activeOrderId],
  async queryFn({ signal }) {
   const { data } = await getOrderItems({ signal, orderID: activeOrderId! });
   return data;
  },
 });

 const {
  data: orderOtps,
  isLoading: orderOtpsLoading,
  isFetching: orderOtpsIsFetching,
  isError: orderOtpsIsError,
  isSuccess: orderOtpsIsSuccess,
 } = useQuery({
  staleTime: 'static',
  gcTime: 0,
  enabled: !!orderId,
  queryKey: [getOtpCodesApi, orderId?.toString()],
  async queryFn({ signal }) {
   const { data } = await getOrderOtpCodes({ signal, orderID: orderId! });
   return data;
  },
 });

 const userOrderItemsTotalNetValue = useMemo(() => {
  if (!userOrderItemsSuccess) return 0;
  return userOrderItems.reduce((acc, cur) => cur.price * cur.amount + acc, 0);
 }, [userOrderItemsSuccess, userOrderItems]);

 const confirmPrintInvoice = useCallback(() => {
  if (!userOrderSuccess || !userOrderItemsSuccess) return;
  handlePrintInvoice({
   invoice: {
    num: userOrder.orderNo,
    creationTime: new Date().toLocaleTimeString('fa', {
     hour: '2-digit',
     minute: '2-digit',
     second: '2-digit',
    }),
    customerName: userOrder.customerName || '',
    phoneNumber: '',
    waiterName: userOrder.waiterPersonFullName || '',
    tableName: userOrder.tableNo?.toString() || '',
    guestQty: userOrder.persons || 0,
    sumQty: userOrderItems.length || 0,
    sumPrice: userOrderItemsTotalNetValue,
    description: '',
    taxAmount: userOrder.tax,
    discountAmount: userOrder.discount || 0,
    creditPrice: 0,
    serviceAmount: userOrder.service,
    price: Math.ceil(userOrder.payableValue),
    roundedAmount: 0,
    restaurantName: routeOwner.name + ' - ' + routeProgram.name,
    farsiDate: new Date().toLocaleDateString('fa', {
     year: 'numeric',
     month: '2-digit',
     day: '2-digit',
    }),
    invoices: null,
    invoiceDetails: userOrderItems.map((item) => ({
     sumUnitPrice: item.netValue,
     name: item.itemName || '',
     qty: item.amount,
     toz: '',
    })),
   },
  });
 }, [
  userOrderSuccess,
  userOrderItemsSuccess,
  userOrder,
  handlePrintInvoice,
  routeOwner,
  routeProgram,
  userOrderItems,
  userOrderItemsTotalNetValue,
 ]);

 const { mutate: confirmPayment, isPending: isPendingConfirmPayment } =
  useMutation({
   mutationFn({ refNo }: { refNo: string }) {
    return saveAndCloseOrder({
     order: userOrder!,
     orderItems: userOrderItems!,
     sendToKitchen: false,
     printToCashBox: false,
     otpCodes: orderOtps || [],
     cash: {
      bankAccountID: initData.pocTabletBankID,
      payRefNo: refNo,
      payTypeID: Number(PaymentType.creditCard),
      sValue: userOrder!.payableValue,
     },
    });
   },
   onSuccess() {
    queryClient.invalidateQueries({
     queryKey: [getOrderApi, orderId.toString()],
    });
    queryClient.invalidateQueries({
     queryKey: [getOrderPaymentApi, orderId.toString()],
    });
    queryClient.invalidateQueries({
     queryKey: [getOrderItemsApi, orderId],
    });
    toast.success(dic.orderPayment.confirmPaymentSuccessfullyDone);
    if (salonsSettings.autoTablePaymentReceiptPrint) {
     confirmPrintInvoice();
    }
    onOpenChange(false);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data || '');
    toast.error(dic.orderPayment.confirmPaymentUnSuccessfull);
   },
  });

 function render() {
  if (userOrderError || userOrderItemsError || orderOtpsIsError) {
   return (
    <div className='my-2'>
     <UnExpectedError />
    </div>
   );
  }
  if (
   userOrderLoading ||
   userOrderItemsLoading ||
   !userOrderSuccess ||
   !userOrderItemsSuccess ||
   orderOtpsLoading ||
   !orderOtpsIsSuccess
  ) {
   return (
    <div className='my-2'>
     <Skeleton className='w-full h-44' />
    </div>
   );
  }
  if (activeTab === 'invoice' && isSuccessOrdersList) {
   return (
    <PaymentInvoice
     dic={dic}
     order={userOrder}
     userOrderItemsTotalNetValue={userOrderItemsTotalNetValue}
    />
   );
  }
  if (activeTab === 'shop') {
   return (
    <PaymentShop
     orderItems={userOrderItems}
     dic={dic}
     userOrderItemsTotalNetValue={userOrderItemsTotalNetValue}
    />
   );
  }
  if (activeTab === 'orderInfo' && isSuccessOrdersList) {
   return (
    <PaymentOrderInfo
     dic={dic}
     ordersList={ordersList}
     activeOrderId={activeOrderId}
     setActiveOrderId={setActiveOrderId}
    />
   );
  }
  return null;
 }

 useEffect(() => {
  if (!posResponse) return;
  if (posResponse.RC === '0') {
   if (lastOperation === 'purchase') {
    confirmPayment({
     refNo: posResponse.referenceNumber,
    });
    toast.success(dic.orderPayment.paymentSuccessfullyDone);
   }
  } else {
   toast.error(dic.orderPayment.paymentUnSuccessfull);
  }
 }, [posResponse, lastOperation, confirmPayment, dic, confirmPrintInvoice]);

 return (
  <Dialog
   open={open}
   onOpenChange={(newValue) => {
    if (isPendingConfirmPayment) return;
    onOpenChange(newValue);
   }}
  >
   <DialogContent className='flex flex-col w-[min(95%,30rem)] max-h-[95svh] min-h-[450px] max-w-none! p-0 overflow-hidden gap-0'>
    <DialogHeader className='px-2 py-4 border-b border-border'>
     <DialogTitle>{dic.orderPayment.title}</DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto p-4 py-2 pt-0 scroll-smooth'>
     <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val)}
      className='mx-auto sticky top-0 bg-popover pt-2'
      dir={localeInfo.contentDirection}
     >
      <TabsList className='self-center min-h-10 z-2 bg-neutral-200 dark:bg-neutral-800'>
       <TabsTrigger value='invoice' className='w-28'>
        {dic.orderPayment.invoice}
       </TabsTrigger>
       <TabsTrigger value='shop' className='w-28'>
        {dic.orderPayment.shop}
        {userOrderItemsSuccess && (
         <Badge className='p-1 size-6 rounded-full text-base font-medium'>
          {userOrderItems.length}
         </Badge>
        )}
       </TabsTrigger>
       {isSuccessOrdersList && ordersList.length > 1 && (
        <TabsTrigger value='orderInfo' className='w-28'>
         {dic.orderPayment.orders}
         <Badge className='p-1 size-6 rounded-full text-base font-medium'>
          {ordersList.length}
         </Badge>
        </TabsTrigger>
       )}
      </TabsList>
     </Tabs>
     {status !== 'connected' && (
      <div className='mt-2'>
       {status === 'connecting' && (
        <div>
         <Alert className='max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50'>
          <AlertTriangleIcon />
          <AlertTitle className='hidden'></AlertTitle>
          <AlertDescription>
           {dic.orderPayment.connectingToPaymentDevice} ...
          </AlertDescription>
          <div className='col-span-full mt-1'>
           <LinearLoading />
          </div>
         </Alert>
        </div>
       )}
       {(status === 'disconnected' || status === 'error') && (
        <div>
         <Alert className='max-w-md border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50'>
          <AlertCircleIcon />
          <AlertTitle className='hidden'></AlertTitle>
          <AlertDescription>
           {dic.orderPayment.noDeviceDetected}.
          </AlertDescription>
          <div className='col-span-full mt-1'>
           <Button size='sm' variant='destructive' onClick={() => connect()}>
            {dic.orderPayment.searchForDeviceAgain}
           </Button>
          </div>
         </Alert>
        </div>
       )}
      </div>
     )}
     <div>{render()}</div>
    </div>
    <DialogFooter className='py-2 px-4 border-t border-border'>
     <Button
      variant={'outline'}
      disabled={isPendingConfirmPayment}
      onClick={() => {
       if (isPendingConfirmPayment) return;
       onOpenChange(false);
      }}
     >
      {dic.orderPayment.close}
     </Button>
     <Button
      disabled={
       status !== 'connected' ||
       !userOrderSuccess ||
       !userOrder.payableValue ||
       isPendingConfirmPayment ||
       !orderOtpsIsSuccess
      }
      className='sm:w-36'
      onClick={() => {
       if (!userOrderSuccess) return;
       const roundPayableValue = userOrder.payableValue;
       if (!roundPayableValue) return;
       handlePurchase({
        paymentValue: Math.ceil(userOrder.payableValue).toString(),
       });
      }}
     >
      {isPendingConfirmPayment && <Spinner />}
      {dic.orderPayment.pay}
     </Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
