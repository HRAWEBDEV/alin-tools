'use client';
import { useFormContext, Controller } from 'react-hook-form';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import { ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { SaleTypes } from '../../utils/SaleTypes';

export default function QuickOrderInfoDialog({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const {
  quickOrderInfoIsOpen,
  closeQuickOrderInfo,
  initialDataInfo: { data },
 } = useOrderBaseConfigContext();

 const {
  register,
  control,
  setValue,
  clearErrors,
  formState: { errors },
 } = useFormContext<OrderInfo>();

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  closeQuickOrderInfo();
 };

 return (
  <Dialog open={quickOrderInfoIsOpen} onOpenChange={closeQuickOrderInfo}>
   <DialogContent className='w-[min(95%,35rem)] max-w-none p-0'>
    <DialogHeader className='p-4'>
     <DialogTitle>{dic.tools.orderInfo}</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit} className='p-4 pt-0 space-y-4'>
     <div>
      <label className='block mb-2 font-medium'>{dic.orderInfo.saleType}</label>
      <Controller
       control={control}
       name='saleType'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='saleType'
           variant='outline'
           role='combobox'
           className='justify-between h-11 w-full'
           onBlur={field.onBlur}
           ref={field.ref}
          >
           <span>{field.value?.value || ''}</span>
           <ChevronsUpDown />
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[min(80svh,35rem)]'>
          <DrawerHeader className='hidden'>
           <DrawerTitle>{dic.orderInfo.saleType}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.orderInfo.saleType}
           </h1>
          </div>
          <div className='overflow-hidden overflow-y-auto'>
           {data?.saleTypes.length ? (
            <ul>
             {data.saleTypes.map((item) => (
              <DrawerClose asChild key={item.key}>
               <li
                className='flex gap-1 items-center ps-6 py-2'
                onClick={() => {
                 field.onChange(item);
                 setValue('room', null);
                 setValue('subscriber', null);
                 setValue('contract', null);
                 setValue('customer', null);
                 setValue('deliveryAgent', item?.key === SaleTypes.delivery);
                 clearErrors(['room', 'subscriber']);
                }}
               >
                <Checkbox
                 className='size-6'
                 checked={field.value?.key === item.key}
                />
                <Button
                 tabIndex={-1}
                 variant='ghost'
                 className='w-full justify-start h-auto text-lg'
                >
                 <span>{item.value}</span>
                </Button>
               </li>
              </DrawerClose>
             ))}
            </ul>
           ) : (
            <div className='text-center font-medium'></div>
           )}
          </div>
         </DrawerContent>
        </Drawer>
       )}
      />
     </div>

     <div>
      <label className='block mb-2 font-medium'>
       {dic.orderInfo.guestCount}
      </label>
      <input
       type='number'
       {...register('persons')}
       className='w-full border rounded p-2 h-11'
      />
      {errors.persons && (
       <p className='text-red-500 text-sm mt-1'>{errors.persons.message}</p>
      )}
     </div>
     <div>
      <label className='block mb-2 font-medium'>
       {dic.orderInfo.customerName}
      </label>
      <input
       type='text'
       {...register('customerName')}
       className='w-full border rounded p-2 h-11'
      />
      {errors.customerName && (
       <p className='text-red-500 text-sm mt-1'>
        {errors.customerName.message}
       </p>
      )}
     </div>
     <div>
      <label className='block mb-2 font-medium'>{dic.orderInfo.bonNo}</label>
      <input
       type='text'
       {...register('bonNo')}
       className='w-full border rounded p-2 h-11'
      />
      {errors.bonNo && (
       <p className='text-red-500 text-sm mt-1'>{errors.bonNo.message}</p>
      )}
     </div>
     <div>
      <label className='block mb-2 font-medium'>
       {dic.orderInfo.description}
      </label>
      <textarea
       {...register('comment')}
       className='w-full border rounded p-2'
       rows={3}
      />
      {errors.comment && (
       <p className='text-red-500 text-sm mt-1'>{errors.comment.message}</p>
      )}
     </div>

     <DialogFooter className='pt-4 felx items-center justify-between'>
      <Button
       type='button'
       variant='outline'
       onClick={() => closeQuickOrderInfo()}
       className='flex-1'
      >
       {dic.orderConfirm.cancel}
      </Button>
      <Button className='flex-1' type='submit'>
       {dic.orderConfirm.confirm}
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 );
}
