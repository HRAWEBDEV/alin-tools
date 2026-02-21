'use client';
import { useRef } from 'react';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 type ConfirmOrderType,
 useOrderBaseConfigContext,
} from '../../services/order-tools/orderBaseConfigContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderShoppingCard from '../order-shop/OrderShoppingCard';
import OrderInfo from '../order-info/OrderInfo';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Badge } from '@/components/ui/badge';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import OrderInvoice from '../order-invoice/OrderInvoice';
import { BiError } from 'react-icons/bi';
import { Activity } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function ConfirmOrderModal({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const dialogBodyRef = useRef<HTMLDivElement>(null);
 const { localeInfo } = useBaseConfig();
 const {
  confirmOrderIsOpen,
  confirmOrderActiveType,
  changeConfirmType,
  showConfirmOrder,
  closeConfirmOrder,
  shopInfoLoading,
  order: { orderItems, orderItemsDispatch, onCloseOrder, onSaveOrder },
 } = useOrderBaseConfigContext();
 return (
  <Dialog
   open={confirmOrderIsOpen}
   onOpenChange={(open) => {
    if (open) {
     showConfirmOrder();
     return;
    }
    closeConfirmOrder();
   }}
  >
   <DialogContent className='flex flex-col w-[min(95%,45rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden'>
    <DialogHeader className='p-4'>
     <DialogTitle className='hidden'></DialogTitle>
     <DialogDescription className='hidden'></DialogDescription>
    </DialogHeader>
    <div
     ref={dialogBodyRef}
     className='grow overflow-auto p-4 pt-0 scroll-smooth'
    >
     <Tabs
      dir={localeInfo.contentDirection}
      value={confirmOrderActiveType}
      onValueChange={(newValue) => {
       changeConfirmType(newValue as ConfirmOrderType);
       if (dialogBodyRef.current) {
        dialogBodyRef.current.scrollTop = 0;
       }
      }}
     >
      <TabsList className='self-center sticky top-0 min-h-12 z-2'>
       <TabsTrigger value='orderInfo' className='w-28'>
        {dic.tools.orderInfo}
       </TabsTrigger>
       <TabsTrigger value='shoppingCard' className='w-28'>
        {dic.tools.shoppingCard}
        {!!orderItems.length && (
         <Badge className='p-1 size-6 rounded-full text-base font-medium'>
          {orderItems.length}
         </Badge>
        )}
       </TabsTrigger>
       <TabsTrigger value='invoice' className='w-28'>
        {dic.tools.invoice}
       </TabsTrigger>
      </TabsList>
      <Activity
       mode={confirmOrderActiveType === 'orderInfo' ? 'visible' : 'hidden'}
      >
       <OrderInfo dic={dic} />
      </Activity>
      <Activity
       mode={confirmOrderActiveType === 'shoppingCard' ? 'visible' : 'hidden'}
      >
       <OrderShoppingCard dic={dic} />
      </Activity>
      <Activity
       mode={confirmOrderActiveType === 'invoice' ? 'visible' : 'hidden'}
      >
       <OrderInvoice dic={dic} />
      </Activity>
     </Tabs>
    </div>
    <DialogFooter className='p-4'>
     <div className='grow flex flex-col-reverse sm:flex-row sm:justify-between gap-4'>
      <div>
       {confirmOrderActiveType === 'shoppingCard' && orderItems.length > 1 && (
        <Dialog>
         <DialogTrigger asChild>
          <Button className='w-full sm:min-w-24 h-11' variant='outline'>
           {dic.orderConfirm.clearOrderItems}
          </Button>
         </DialogTrigger>
         <DialogContent className='p-0 gap-0'>
          <DialogHeader className='p-4'></DialogHeader>
          <div className='p-4'>
           <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
            <BiError className='size-12' />
            <p>{dic.orderConfirm.clearOrderItemsConfirmMessage}</p>
           </div>
          </div>
          <DialogFooter className='p-4'>
           <DialogClose asChild>
            <Button className='sm:w-24 h-11' variant='outline'>
             {dic.orderConfirm.cancel}
            </Button>
           </DialogClose>
           <DialogClose asChild>
            <Button
             className='sm:w-24 h-11'
             variant='destructive'
             onClick={() => {
              orderItemsDispatch({
               type: 'clearOrderItems',
              });
             }}
            >
             {dic.orderConfirm.confirm}
            </Button>
           </DialogClose>
          </DialogFooter>
         </DialogContent>
        </Dialog>
       )}
      </div>
      <div className='flex gap-2 sm:gap-4'>
       {confirmOrderActiveType === 'shoppingCard' && !!orderItems.length && (
        <Button
         disabled={shopInfoLoading}
         variant='destructive'
         className='h-11 max-sm:p-3 max-sm:grow'
         onClick={onCloseOrder}
        >
         {shopInfoLoading && <Spinner />}
         {dic.invoice.closeOrder}
        </Button>
       )}
       {confirmOrderActiveType === 'shoppingCard' && !!orderItems.length && (
        <Button
         variant='secondary'
         className='h-11 max-sm:p-3 max-sm:grow'
         disabled={shopInfoLoading}
         onClick={() => {
          onSaveOrder();
         }}
        >
         {shopInfoLoading && <Spinner />}
         {dic.invoice.confirmOrder}
        </Button>
       )}
       {confirmOrderActiveType === 'shoppingCard' && (
        <Button
         className='h-11 max-sm:p-3 max-sm:grow'
         disabled={!orderItems.length || shopInfoLoading}
         onClick={() => {
          changeConfirmType('invoice');
         }}
        >
         {shopInfoLoading && <Spinner />}
         {dic.orderConfirm.invoice}
        </Button>
       )}
      </div>
     </div>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
