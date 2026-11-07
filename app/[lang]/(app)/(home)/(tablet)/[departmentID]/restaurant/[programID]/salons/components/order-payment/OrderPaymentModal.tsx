'use client';
import { useState, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import {
 getOrder,
 getOrderItems,
 newOrderKey,
} from '../../../new-order/services/newOrderApiActions';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getHallKey, getTableOrders } from '../../services/salonsApiActions';

export default function OrderPaymentModal({
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
 const [activeOrderId, setActiveOrderId] = useState(orderId);
 const { localeInfo } = useBaseConfig();
 const [activeTab, setActiveTab] = useState('invoice');

 const {
  data: userOrder,
  isLoading: userOrderLoading,
  isError: userOrderError,
  isSuccess: userOrderSuccess,
 } = useQuery({
  staleTime: 'static',
  gcTime: 0,
  queryKey: [newOrderKey, 'order-info', activeOrderId.toString()],
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
  queryKey: [newOrderKey, 'order-items', activeOrderId],
  async queryFn({ signal }) {
   const { data } = await getOrderItems({ signal, orderID: activeOrderId! });
   return data;
  },
 });

 const userOrderItemsTotalNetValue = useMemo(() => {
  if (!userOrderItemsSuccess) return 0;
  return userOrderItems.reduce((acc, cur) => cur.price * cur.amount + acc, 0);
 }, [userOrderItemsSuccess, userOrderItems]);

 function render() {
  if (userOrderError || userOrderItemsError) {
   return (
    <div className='mt-2'>
     <UnExpectedError />
    </div>
   );
  }
  if (
   userOrderLoading ||
   userOrderItemsLoading ||
   !userOrderSuccess ||
   !userOrderItemsSuccess
  ) {
   return (
    <div className='mt-2'>
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

 return (
  <Dialog
   open={open}
   onOpenChange={(newValue) => {
    onOpenChange(newValue);
   }}
  >
   <DialogContent className='flex flex-col w-[min(95%,30rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
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
       {isSuccessOrdersList && (
        <TabsTrigger value='orderInfo' className='w-28'>
         {dic.orderPayment.orders}
         <Badge className='p-1 size-6 rounded-full text-base font-medium'>
          {ordersList.length}
         </Badge>
        </TabsTrigger>
       )}
      </TabsList>
     </Tabs>
     <div>{render()}</div>
    </div>
    <DialogFooter className='border-t border-border py-2 px-4'>
     <Button
      variant='outline'
      className='sm:w-24'

      onClick={() => onOpenChange(false)}
     >
      {dic.orderPayment.close}
     </Button>
     <Button className='sm:w-36'>{dic.orderPayment.pay}</Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
