import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CiCircleMinus } from 'react-icons/ci';
import { FaCirclePlus } from 'react-icons/fa6';
import { CiCirclePlus } from 'react-icons/ci';
import { MdOutlineKeyboardHide } from 'react-icons/md';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { motion } from 'motion/react';
import Highlighter from 'react-highlight-words';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import OrderItemImage from './OrderItemImage';
import ServeDishIcon from '@/app/[lang]/(app)/components/icons/ServeDishIcon';
import {
 Dialog,
 DialogHeader,
 DialogContent,
 DialogTitle,
} from '@/components/ui/dialog';
import { useState, useRef } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroupInput, InputGroup } from '@/components/ui/input-group';
import { NumericFormat } from 'react-number-format';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { MdTouchApp } from 'react-icons/md';
import { type ItemProgram } from '../services/newOrderApiActions';

export default function OrderItem({
 itemProgram,
 activeImageModalID,
 onChangeModalID,
 overlayVisible,
 onOverlayChange,
 dic,
}: {
 itemProgram: ItemProgram;
 activeImageModalID: null | number;
 onChangeModalID: (id: number | null) => void;
 overlayVisible: null | number;
 onOverlayChange: (id: number | null) => void;
 dic: NewOrderDictionary;
}) {
 const { contrastMode } = useBaseConfig();
 const showCountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const [showTypeOrderCount, setShowTypeOrderCount] = useState(false);
 const [pointingItem, setPointingItem] = useState(false);
 const [orderItemCount, setOrderItemCount] = useState(0);
 const {
  itemsInfo: { searchedItemName },
  order: { showOrderImage, showDescription, orderItems, orderItemsDispatch },
  userOrder: {
   order: { isLoading: userOrderIsLoading },
   orderItems: { isLoading: userOrderItemsLoading },
  },
  access,
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();
 const targetOrderItem = orderItems.filter(
  (order) => order.itemID === itemProgram.itemID,
 );
 const itemAmount = targetOrderItem.reduce((acc, cur) => {
  return acc + cur.amount;
 }, 0);

 let shopItemEditAccess = access['shopItem']['add'];
 let shopItemDeleteAccess = access['shopItem']['add'];

 if (!!targetOrderItem.length) {
  if (targetOrderItem[0].id > 0) {
   shopItemEditAccess = access['shopItem']['edit'];
   shopItemDeleteAccess = access['shopItem']['delete'];
  }
 }

 return (
  <>
   <motion.div
    layout
    className={`flex flex-col ${showOrderImage ? 'pt-17 min-h-60' : 'pt-0'}`}
    // onPointerDown={() => {
    //  if (!shopItemEditAccess) return;
    //  if (showCountTimeoutRef.current) clearTimeout(showCountTimeoutRef.current);
    //  setPointingItem(true);
    //  showCountTimeoutRef.current = setTimeout(() => {
    //   setShowTypeOrderCount(true);
    //   setPointingItem(false);
    //   setOrderItemCount(itemAmount || 0);
    //  }, 350);
    // }}
    // onPointerUp={() => {
    //  if (showCountTimeoutRef.current) clearTimeout(showCountTimeoutRef.current);
    //  setPointingItem(false);
    // }}
   >
    <div
     className={`grow relative isolate rounded-xl ${showOrderImage ? 'shadow-xl' : 'border shadow-lg border-border pt-2'} bg-background dark:bg-neutral-900 ${itemAmount ? 'bg-primary/15 dark:bg-primary/15' : ''} ${pointingItem ? 'bg-neutral-200! dark:bg-neutral-800!' : ''}`}
    >
     <div className='absolute bottom-0 start-0 z-1'></div>
     {showOrderImage && (
      <div
       className='grid place-content-center -mt-17 mb-2'
       onPointerDown={(e) => e.stopPropagation()}
      >
       <div className='flex items-center justify-center rounded-full size-28 sm:size-34 bg-neutral-100 dark:bg-neutral-800 overflow-hidden object-center object-contain'>
        <OrderItemImage
         src={itemProgram.imageURL || undefined}
         alt={itemProgram.itemName || undefined}
         id={itemProgram.id}
         activeID={activeImageModalID}
         onChangeID={onChangeModalID}
         overlayVisible={overlayVisible}
         onOverlayChange={onOverlayChange}
        >
         <ServeDishIcon className='size-20 text-neutral-300 dark:text-neutral-700' />
        </OrderItemImage>
       </div>
      </div>
     )}

     <div className='text-center'>
      <h3 className='text-base sm:text-lg font-medium text-neutral-800 dark:text-neutral-400 mb-1'>
       <Highlighter
        searchWords={[searchedItemName]}
        textToHighlight={itemProgram.itemName || ''}
       />
      </h3>
      {showDescription && (
       <>
        <p className='px-2 text-xs text-neutral-600 dark:text-neutral-400 font-light mb-3'>
         ---
        </p>
        <div className='flex flex-col mb-2'>
         {false && (
          <div className='text-[0.85rem] font-medium text-red-600 dark:text-red-400 line-through'>
           <Badge variant='destructive' className='p-1 me-2 text-sm'>
            12%
           </Badge>
           <span>14,000,000</span>
          </div>
         )}
         <p className='text-lg sm:text-xl font-medium text-neutral-600 dark:text-neutral-400'>
          {format(itemProgram.price)}
          <span className='ms-1 text-sm'>ریال</span>
         </p>
        </div>
       </>
      )}
      {!itemAmount && (
       <div className='flex justify-between items-center mb-2'>
        <div className='basis-10'>
         <Button
          variant='ghost'
          size='icon-lg'
          className={`rounded-full ${contrastMode ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-300 dark:text-neutral-700'}`}
          disabled={
           userOrderItemsLoading ||
           userOrderIsLoading ||
           !access['shopItem']['add']
          }
          onClick={() => {
           if (!access['shopItem']['add']) return;
           setShowTypeOrderCount(true);
           setOrderItemCount(itemAmount || 0);
          }}
         >
          {userOrderItemsLoading || userOrderIsLoading ? (
           <Spinner />
          ) : (
           <MdOutlineKeyboardHide className='size-8' />
          )}
         </Button>
        </div>
        <Button
         variant='ghost'
         size='icon-lg'
         className='text-primary rounded-full'
         disabled={
          userOrderItemsLoading ||
          userOrderIsLoading ||
          !access['shopItem']['add']
         }
         onClick={() => {
          if (!access['shopItem']['add']) return;
          orderItemsDispatch({
           type: 'addOrderItems',
           payload: [itemProgram],
          });
         }}
        >
         {userOrderItemsLoading || userOrderIsLoading ? (
          <Spinner />
         ) : (
          <FaCirclePlus className='size-11' />
         )}
        </Button>
        <div className='basis-10'></div>
       </div>
      )}
      {!userOrderIsLoading && !!itemAmount && (
       <div className='flex justify-center items-center mb-2 select-none'>
        <Button
         variant='ghost'
         size='icon-lg'
         className='text-rose-600 dark:text-rose-400 rounded-full'
         disabled={!shopItemDeleteAccess}
         onClick={() => {
          if (!shopItemDeleteAccess) return;
          orderItemsDispatch({
           type: 'decreaseOrderItemsAmount',
           payload: {
            decreaseBy: 1,
            itemsIDs: [itemProgram.itemID],
           },
          });
         }}
        >
         <CiCircleMinus className='size-11' />
        </Button>
        <div className='text-xl py-[0.2rem] px-1 shrink-0 text-center basis-8 font-medium text-primary rounded'>
         {itemAmount || 0}
        </div>
        <Button
         variant='ghost'
         size='icon-lg'
         className='text-secondary rounded-full'
         disabled={!shopItemEditAccess}
         onClick={() => {
          if (!shopItemEditAccess) return;
          orderItemsDispatch({
           type: 'increaseOrderItemsAmount',
           payload: {
            increaseBy: 1,
            itemsIDs: [itemProgram.itemID],
           },
          });
         }}
        >
         <CiCirclePlus className='size-11' />
        </Button>
       </div>
      )}
     </div>
    </div>
   </motion.div>
   <Dialog open={showTypeOrderCount}>
    <DialogContent showCloseButton={false}>
     <DialogHeader>
      <DialogTitle>{itemProgram.itemName}</DialogTitle>
     </DialogHeader>
     <form>
      <Field className='gap-1'>
       <FieldLabel htmlFor='count'>{dic.orderInfo.count}</FieldLabel>
       <InputGroup className='h-11'>
        <NumericFormat
         id='count'
         value={orderItemCount}
         onValueChange={({ floatValue }) => {
          setOrderItemCount(floatValue || 0);
         }}
         className='text-center text-lg font-medium'
         allowLeadingZeros={false}
         allowNegative={false}
         decimalScale={0}
         customInput={InputGroupInput}
        />
       </InputGroup>
      </Field>
      <div className='mt-4'>
       <Button
        type='submit'
        size='lg'
        className='h-11 w-full'
        onClick={(e) => {
         e.preventDefault();
         setShowTypeOrderCount(false);
         if (!itemAmount && !orderItemCount) {
          return;
         } else if (!itemAmount) {
          orderItemsDispatch({
           type: 'addOrderItems',
           payload: [itemProgram],
          });
          orderItemsDispatch({
           type: 'setShopOrderItemAmount',
           payload: {
            setTo: orderItemCount,
            itemsIDs: [itemProgram.itemID],
           },
          });
         } else if (!orderItemCount) {
          orderItemsDispatch({
           type: 'removeOrderItems',
           payload: [itemProgram.itemID],
          });
         } else {
          orderItemsDispatch({
           type: 'setShopOrderItemAmount',
           payload: {
            setTo: orderItemCount,
            itemsIDs: [itemProgram.itemID],
           },
          });
         }
        }}
       >
        {dic.orderInfo.confirm}
       </Button>
      </div>
     </form>
    </DialogContent>
   </Dialog>
  </>
 );
}
