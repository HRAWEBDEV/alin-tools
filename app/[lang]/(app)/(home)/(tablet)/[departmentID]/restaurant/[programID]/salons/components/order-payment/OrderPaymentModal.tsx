'use client';
import { useState } from 'react';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
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

export default function OrderPaymentModal({
 dic,
 open,
 orderId,
 onOpenChange,
}: {
 dic: SalonsDictionary;
 open: boolean;
 orderId: number;
 onOpenChange: (open: boolean) => unknown;
}) {
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
  queryKey: [newOrderKey, 'order-info', orderId.toString()],
  async queryFn({ signal }) {
   const { data } = await getOrder({ signal, orderID: orderId });
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
  enabled: !!orderId,
  queryKey: [newOrderKey, 'order-items', orderId],
  async queryFn({ signal }) {
   const { data } = await getOrderItems({ signal, orderID: orderId! });
   return data;
  },
 });

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
  if (activeTab === 'invoice') {
   return <PaymentInvoice dic={dic} order={userOrder} />;
  }
  if (activeTab === 'shop') {
   return <PaymentShop orderItems={userOrderItems} />;
  }
  if (activeTab === 'orderInfo') {
   return <PaymentOrderInfo dic={dic} />;
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
       </TabsTrigger>
       <TabsTrigger value='orderInfo' className='w-28'>
        {dic.orderPayment.orderInfo}
       </TabsTrigger>
      </TabsList>
     </Tabs>
     <div>{render()}</div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
