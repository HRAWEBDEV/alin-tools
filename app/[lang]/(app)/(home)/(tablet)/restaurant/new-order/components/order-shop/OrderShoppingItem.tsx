import { useState } from 'react';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import { type OrderItem } from '../../services/newOrderApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import ServeDishIcon from '@/app/[lang]/(app)/components/icons/ServeDishIcon';
import { BsTrash } from 'react-icons/bs';
import { BiError } from 'react-icons/bi';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogClose,
} from '@/components/ui/dialog';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import FindTags from '../find-tags/FindTags';
import HighlightWords from 'react-highlight-words';
import { motion } from 'motion/react';
import { GoPlus } from 'react-icons/go';
import { IoTrashOutline } from 'react-icons/io5';
import { MdOutlineSplitscreen } from 'react-icons/md';
import OrderItemImage from '../OrderItemImage';

export default function OrderShoppingItem({
 dic,
 orderItem,
 searchedOrder,
}: {
 dic: NewOrderDictionary;
 orderItem: OrderItem;
 searchedOrder: string;
}) {
 const [showRemoveOrderItemConfirm, setShowRemoveOrderItemConfirm] =
  useState(false);
 const {
  itemsInfo: { data: itemsPrograms },
  order: { orderItemsDispatch },
  accessibility,
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();
 const targetItemProgram = itemsPrograms?.find(
  (item) => item.itemID === orderItem.itemID,
 );
 return (
  <motion.div layout className='border-b border-input p-2'>
   <div className='flex flex-row gap-2 sm:gap-0 sm:items-center'>
    <div className='flex flex-col items-center'>
     <div className='flex items-center justify-center shrink-0 rounded-full size-18 lg:size-24 bg-neutral-100 dark:bg-neutral-800 overflow-hidden object-center object-contain'>
      <OrderItemImage
       src={targetItemProgram?.imageURL || undefined}
       alt={orderItem.itemName || undefined}
      >
       <ServeDishIcon className='size-12 text-neutral-300 dark:text-neutral-700' />
      </OrderItemImage>
     </div>
     <Button
      variant='ghost'
      size='icon-lg'
      className='text-red-600/50 dark:text-red-400/50 rounded-full'
      disabled={!accessibility}
      onClick={() => {
       orderItemsDispatch({
        type: 'removeShopOrderItems',
        payload: [orderItem.id],
       });
      }}
     >
      <BsTrash className='size-6 sm:size-5' />
     </Button>
    </div>
    <div className='text-start grow flex flex-col sm:flex-row sm:items-center'>
     <div className='grow'>
      <h3 className='text-base lg:text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-1'>
       <HighlightWords
        textToHighlight={orderItem.itemName || ''}
        searchWords={[searchedOrder]}
       />
      </h3>
      <p className='px-2 text-sm text-neutral-600 dark:text-neutral-400 font-light mb-2 w-[min(100%,20rem)]'>
       {orderItem.tagComment || '---'}
      </p>
      <div className='mb-1 flex items-center gap-4'>
       {orderItem.tagID ? (
        <Button
         variant='outline'
         className='text-sm p-0.5 py-1 gap-1 text-red-700 border-red-700 dark:text-red-400 dark:border-red-400 h-auto'
         disabled={!accessibility}
         onClick={() => {
          orderItemsDispatch({
           type: 'removeTag',
           payload: {
            id: orderItem.id,
            tagID: orderItem.tagID!,
           },
          });
         }}
        >
         <IoTrashOutline />
         {dic.orderInfo.addTag}
        </Button>
       ) : (
        <Drawer>
         <DrawerTrigger>
          <Button
           variant='outline'
           className='text-sm p-0.5 py-1 gap-1 text-primary border-primary h-auto'
           disabled={!accessibility}
          >
           <GoPlus />
           {dic.orderInfo.addTag}
          </Button>
         </DrawerTrigger>
         <FindTags id={orderItem.id} dic={dic} />
        </Drawer>
       )}
       <Button
        variant='outline'
        className='text-sm p-0.5 py-1 gap-1 text-destructive border-destructive h-auto'
        disabled={!accessibility}
        onClick={() => {
         orderItemsDispatch({
          type: 'splitShopOrderItem',
          payload: {
           id: orderItem.id,
           itemCode: orderItem.itemCode,
           itemID: orderItem.itemID,
           itemName: orderItem.itemName,
           price: orderItem.price,
           serviceRate: orderItem.service,
           taxRate: orderItem.taxRate,
           noDiscount: orderItem.noDiscount,
          },
         });
        }}
       >
        <MdOutlineSplitscreen />
        {dic.orderInfo.duplicateOrderItem}
       </Button>
      </div>
      <div className='flex justify-center sm:justify-start mb-2 gap-4'>
       {!!orderItem.discountRate && (
        <div className='text-[0.85rem] font-medium text-red-600 dark:text-red-400 line-through'>
         <Badge variant='destructive' className='p-1 me-2 text-sm'>
          {orderItem.discountRate}%
         </Badge>
         <span>{format(orderItem.price)}</span>
        </div>
       )}
       <p className='text-lg lg:text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {format(
         orderItem.price - (orderItem.discountRate * orderItem.price) / 100,
        )}
        <span className='ms-1 text-sm'>ریال</span>
       </p>
      </div>
     </div>
     <div className='flex flex-wrap gap-2 justify-between sm:justify-start sm:flex-col items-center shrink-0'>
      <div>
       <p className='text-lg lg:text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {format(
         orderItem.sValue -
          orderItem.discount +
          orderItem.service +
          orderItem.tax,
        )}
        <span className='ms-1 text-sm'>ریال</span>
       </p>
      </div>
      <div className='flex items-center justify-center sm:mb-2'>
       <Button
        variant='ghost'
        size='icon-lg'
        className='text-orange-600 dark:text-orange-400 rounded-full'
        disabled={!accessibility}
        onClick={() => {
         if (orderItem.amount <= 1) {
          setShowRemoveOrderItemConfirm(true);
         } else {
          orderItemsDispatch({
           type: 'decreaseShopOrderItemsAmount',
           payload: {
            decreaseBy: 1,
            id: orderItem.id,
           },
          });
         }
        }}
       >
        <CiCircleMinus className='size-9 lg:size-10' />
       </Button>
       <div className='text-primary text-base lg:text-xl px-2 shrink-0 text-center basis-8 font-medium'>
        {orderItem.amount}
       </div>
       <Button
        variant='ghost'
        size='icon-lg'
        className='text-secondary rounded-full'
        disabled={!accessibility}
        onClick={() => {
         orderItemsDispatch({
          type: 'increaseShopOrderItemAmount',
          payload: {
           increaseBy: 1,
           id: orderItem.id,
          },
         });
        }}
       >
        <CiCirclePlus className='size-9 lg:size-10' />
       </Button>
      </div>
     </div>
    </div>
   </div>
   <Dialog
    open={showRemoveOrderItemConfirm}
    onOpenChange={(newValue) => setShowRemoveOrderItemConfirm(newValue)}
   >
    <DialogContent className='p-0 gap-0'>
     <DialogHeader className='p-4'></DialogHeader>
     <div className='p-4'>
      <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
       <BiError className='size-12' />
       <p>{dic.orderConfirm.removeOrderItemConfirmMessage}</p>
      </div>
     </div>
     <DialogFooter className='p-4'>
      <DialogClose asChild>
       <Button className='sm:w-24' variant='outline'>
        {dic.orderConfirm.cancel}
       </Button>
      </DialogClose>
      <DialogClose asChild>
       <Button
        className='sm:w-24'
        variant='destructive'
        onClick={() => {
         orderItemsDispatch({
          type: 'decreaseShopOrderItemsAmount',
          payload: {
           decreaseBy: 1,
           id: orderItem.id,
          },
         });
        }}
       >
        {dic.orderConfirm.confirm}
       </Button>
      </DialogClose>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </motion.div>
 );
}
