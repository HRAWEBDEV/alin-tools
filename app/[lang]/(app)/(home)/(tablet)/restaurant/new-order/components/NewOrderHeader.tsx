'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import {
 Dialog,
 DialogTrigger,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogClose,
} from '@/components/ui/dialog';
import { BiError } from 'react-icons/bi';
import { useFormContext } from 'react-hook-form';
import { type OrderInfo } from '../schemas/orderInfoSchema';
import {
 getHallKey,
 getTableOrders,
} from '../../salons/services/salonsApiActions';
import { useQuery } from '@tanstack/react-query';
import { IoAlbums } from 'react-icons/io5';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import TableOrders from '../../salons/components/table-orders/TableOrders';
import { TableStateTypes } from '../../salons/utils/tableStates';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function NewOrderHeader({ dic }: { dic: NewOrderDictionary }) {
 const { watch } = useFormContext<OrderInfo>();
 const { locale } = useBaseConfig();
 const router = useRouter();
 const {
  queries: { fromSalons, salonName, salonID },
  order: { orderInfoName },
  userOrder,
 } = useOrderBaseConfigContext();
 const [tableValue, saleTimeValue, saleTypeValue] = watch([
  'table',
  'saleTime',
  'saleType',
 ]);

 const { data: ordersList, isLoading: isLoadingOrdersList } = useQuery({
  enabled: !!tableValue,
  queryKey: [getHallKey, 'ordersList', tableValue?.key],
  async queryFn({ signal }) {
   const res = await getTableOrders({
    tableID: Number(tableValue!.key),
    signal,
   });
   return res.data;
  },
 });
 const orderRedirectLink = tableValue
  ? (`/${locale}/restaurant/new-order?salonID=${salonID}&salonName=${salonName}&tableID=${Number(tableValue.key)}&tableNo=${Number(tableValue.value)}&fromSalons=true` as const)
  : '';

 const orderListButton =
  ordersList && ordersList?.length > 1 ? (
   <Drawer>
    <DrawerTrigger asChild>
     <Button
      size='icon-lg'
      variant='outline'
      className='text-primary border-primary'
     >
      <IoAlbums className='size-5' />
     </Button>
    </DrawerTrigger>
    <DrawerContent className='h-[min(80svh,35rem)]'>
     <DrawerHeader className='text-xl border-b border-input'>
      <DrawerTitle>
       {dic.multiOrder.title} {dic.orderInfo.tableNo} {tableValue?.key}
      </DrawerTitle>
     </DrawerHeader>
     <div className='overflow-hidden overflow-y-auto p-4'>
      <TableOrders
       dic={dic.multiOrder}
       data={ordersList}
       isLoading={isLoadingOrdersList}
       orderRedirectLink={orderRedirectLink}
       orderCount={0}
       tableCapacity={0}
       tableStateType={TableStateTypes.regularCustomer}
       fromNewOrder
      />
     </div>
    </DrawerContent>
   </Drawer>
  ) : null;

 return (
  <div className='flex flex-col gap-2'>
   <div className='flex justify-between items-center gap-4'>
    <div className='basis-11 md:hidden'>{orderListButton}</div>
    <div>
     <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl'>
      {dic.title}
      <span className='text-2xl text-neutral-600 dark:text-neutral-400'>
       {' '}
       ({userOrder.order.data?.orderNo || ''})
      </span>
     </h1>
    </div>
    <div className='basis-11 flex gap-4'>
     <div className='hidden md:block'>{orderListButton}</div>
     <Dialog>
      {fromSalons && (
       <DialogTrigger asChild>
        <Button
         size='icon-lg'
         variant='outline'
         className='ltr:rotate-180 border-rose-600 dark:border-rose-400'
        >
         <FaArrowLeft className='size-5 text-rose-600 dark:text-rose-400' />
        </Button>
       </DialogTrigger>
      )}
      <DialogContent className='p-0 gap-0'>
       <DialogHeader className='p-4'></DialogHeader>
       <div className='p-4'>
        <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
         <BiError className='size-12' />
         <p>{dic.orderLeaveConfirm.leaveOrderConfirmMessage}</p>
        </div>
       </div>
       <DialogFooter className='p-4'>
        <DialogClose asChild>
         <Button className='sm:w-24' variant='outline'>
          {dic.orderLeaveConfirm.cancel}
         </Button>
        </DialogClose>
        <DialogClose asChild>
         <Button
          className='sm:w-24'
          variant='destructive'
          onClick={() => router.back()}
         >
          {dic.orderLeaveConfirm.confirm}
         </Button>
        </DialogClose>
       </DialogFooter>
      </DialogContent>
     </Dialog>
    </div>
   </div>
   <div className='text-sm grid grid-cols-2 md:grid-cols-5 gap-2'>
    <div className='col-span-full md:col-span-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.orderInfo.customerName}:{' '}
     </span>
     <span className='font-medium text-primary'>{orderInfoName || '---'}</span>
    </div>
    <div>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.orderInfo.salonName}:{' '}
     </span>
     <span className='font-medium text-primary'>{salonName || '---'}</span>
    </div>
    <div>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.orderInfo.tableNo}:{' '}
     </span>
     <span className='font-medium text-primary'>
      {tableValue?.value || '---'}
     </span>
    </div>
    <div>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.orderInfo.saleTime}:{' '}
     </span>
     <span className='font-medium text-primary'>
      {saleTimeValue?.value || '---'}
     </span>
    </div>
    <div>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.orderInfo.saleType}:{' '}
     </span>
     <span className='font-medium text-primary'>
      {saleTypeValue?.value || '---'}
     </span>
    </div>
   </div>
  </div>
 );
}
