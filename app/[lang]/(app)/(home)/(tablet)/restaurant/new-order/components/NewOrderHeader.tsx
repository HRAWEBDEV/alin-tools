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

export default function NewOrderHeader({ dic }: { dic: NewOrderDictionary }) {
 const { watch } = useFormContext<OrderInfo>();
 const router = useRouter();
 const {
  queries: { fromSalons, salonName },
  order: { orderInfoName },
 } = useOrderBaseConfigContext();
 const [tableValue, saleTimeValue, saleTypeValue] = watch([
  'table',
  'saleTime',
  'saleType',
 ]);
 return (
  <div className='flex flex-col gap-2'>
   <div className='flex justify-between items-center gap-4'>
    <div className='basis-11 md:hidden'></div>
    <div>
     <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl'>
      {dic.title}
     </h1>
    </div>
    <div className='basis-11'>
     <Dialog>
      {fromSalons && (
       <DialogTrigger asChild>
        <Button size='icon-lg' variant='outline' className='ltr:rotate-180'>
         <FaArrowLeft />
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
     <span>{dic.orderInfo.customerName}: </span>
     <span className='font-medium text-primary'>{orderInfoName || '---'}</span>
    </div>
    <div>
     <span>{dic.orderInfo.salonName}: </span>
     <span className='font-medium text-primary'>{salonName || '---'}</span>
    </div>
    <div>
     <span>{dic.orderInfo.tableNo}: </span>
     <span className='font-medium text-primary'>
      {tableValue?.value || '---'}
     </span>
    </div>
    <div>
     <span>{dic.orderInfo.saleTime}: </span>
     <span className='font-medium text-primary'>
      {saleTimeValue?.value || '---'}
     </span>
    </div>
    <div>
     <span>{dic.orderInfo.saleType}: </span>
     <span className='font-medium text-primary'>
      {saleTypeValue?.value || '---'}
     </span>
    </div>
   </div>
  </div>
 );
}
