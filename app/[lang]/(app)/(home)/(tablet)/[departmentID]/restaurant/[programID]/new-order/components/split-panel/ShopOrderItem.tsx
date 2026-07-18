import { Dispatch, SetStateAction, useState } from 'react';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import { type OrderItem } from '../../services/newOrderApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { BiError } from 'react-icons/bi';
import { TbFileDescription } from 'react-icons/tb';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogClose,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog';
import {
 Field,
 FieldLabel,
 FieldContent,
 FieldDescription,
} from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import FindTags from '../find-tags/FindTags';
import HighlightWords from 'react-highlight-words';
import { IoTrashOutline } from 'react-icons/io5';
import { MdOutlineSplitscreen } from 'react-icons/md';
import { FaTags } from 'react-icons/fa6';

export default function ShopOrderItem({
 dic,
 orderItem,
 searchedOrder,
 selectedOrderItemId,
 setSelectedOrderItemId,
}: {
 dic: NewOrderDictionary;
 orderItem: OrderItem;
 searchedOrder: string;
 selectedOrderItemId: number | null;
 setSelectedOrderItemId: Dispatch<SetStateAction<number | null>>;
}) {
 const [showRemoveOrderItemConfirm, setShowRemoveOrderItemConfirm] =
  useState(false);
 const {
  order: { orderItemsDispatch },
  invoice: { isFixedDiscount },
  access,
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();

 let shopItemEditAccess = access['shopItem']['add'];
 let shopItemDeleteAccess = access['shopItem']['add'];

 if (orderItem.id > 0) {
  shopItemEditAccess = access['shopItem']['edit'];
  shopItemDeleteAccess = access['shopItem']['delete'];
 }

 let previewOrderItemComment = orderItem.comment || '';
 if (previewOrderItemComment.length > 100) {
  previewOrderItemComment = `${previewOrderItemComment?.slice(0, 100)}...`;
 }

 return (
  <div
   className='border-b border-border p-2'
   onClick={() => setSelectedOrderItemId(orderItem.id)}
  >
   <div className='flex flex-row gap-2 sm:gap-0 sm:items-start'>
    <div className='text-start grow flex flex-col sm:flex-row sm:items-start'>
     <div className='grow'>
      <h3 className='text-base lg:text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-1'>
       <HighlightWords
        textToHighlight={orderItem.itemName || ''}
        searchWords={[searchedOrder]}
       />
      </h3>
      <div className='flex justify-center sm:justify-start mb-2 gap-4 text-center pe-1'>
       {!isFixedDiscount && !!orderItem.discountRate && (
        <div className='text-[0.85rem] font-medium text-red-600 dark:text-red-400 line-through'>
         <Badge variant='destructive' className='p-1 me-2 text-sm'>
          {orderItem.discountRate}%
         </Badge>
         <span>{format(orderItem.price)}</span>
        </div>
       )}
       <p className='text-md font-medium text-neutral-600 dark:text-neutral-400'>
        {format(
         orderItem.price - (orderItem.discountRate * orderItem.price) / 100,
        )}
        <span className='ms-1 text-sm'>ریال</span>
       </p>
      </div>
     </div>
     <div className='flex flex-wrap gap-2 justify-between sm:justify-start sm:flex-col items-center shrink-0'>
      <div>
       <p className='text-md font-medium text-neutral-600 dark:text-neutral-400'>
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
        disabled={!shopItemDeleteAccess}
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
        disabled={!shopItemEditAccess}
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
   {selectedOrderItemId === orderItem.id && (
    <div>
     <div className='mb-1 flex items-center gap-2 flex-wrap'>
      <Button
       variant='outline'
       className='gap-1 text-red-700 border-red-700 dark:text-red-400 dark:border-red-400 h-auto'
       disabled={!shopItemEditAccess}
       onClick={() => {
        setShowRemoveOrderItemConfirm(true);
       }}
      >
       <IoTrashOutline className='size-5' />
      </Button>
      <Drawer>
       <DrawerTrigger>
        <Button
         variant='outline'
         className='gap-1 text-primary border-primary h-auto'
         disabled={!shopItemEditAccess}
        >
         <FaTags className='size-5' />
         {orderItem.tagID && <Badge>1</Badge>}
        </Button>
       </DrawerTrigger>
       <FindTags
        id={orderItem.id}
        dic={dic}
        selectedTag={
         orderItem.tagID && orderItem.tagComment
          ? {
             tegId: orderItem.tagID,
             tagComment: orderItem.tagComment,
            }
          : undefined
        }
       />
      </Drawer>
      <Button
       variant='outline'
       className='gap-1 text-destructive border-destructive h-auto'
       disabled={!access['shopItem']['add']}
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
       <MdOutlineSplitscreen className='size-5' />
      </Button>
      <Dialog>
       <DialogTrigger asChild>
        <Button
         variant='outline'
         className='gap-1 text-secondary border-secondary h-auto'
         disabled={!access['shopItem']['add']}
         onClick={() => {}}
        >
         <TbFileDescription className='size-5' />
         {orderItem.comment && <Badge>1</Badge>}
        </Button>
       </DialogTrigger>
       <form
        onSubmit={(e) => {
         e.preventDefault();
        }}
       >
        <DialogContent className='p-0 gap-0 flex flex-col w-[min(90%,45rem)] sm:max-h-[95svh] overflow-hidden'>
         <DialogHeader className='p-4'>
          <DialogTitle>{dic.orderInfo.description}</DialogTitle>
         </DialogHeader>
         <div className='p-4 overflow-auto grow'>
          <Field data-disabled={orderItem.id > 0}>
           <FieldLabel htmlFor='description' className='hidden'>
            {dic.orderInfo.description}
           </FieldLabel>
           <InputGroup data-disabled={orderItem.id > 0}>
            <InputGroupTextarea
             className='field-sizing-fixed'
             rows={5}
             id='description'
             value={orderItem.comment || ''}
             readOnly={orderItem.id > 0}
             onChange={(e) => {
              const val = e.target.value;
              orderItemsDispatch({
               type: 'updateComment',
               payload: {
                id: orderItem.id,
                comment: val || null,
               },
              });
             }}
            />
           </InputGroup>
           {orderItem.id > 0 && (
            <FieldContent>
             <FieldDescription className='text-destructive'>
              {dic.orderInfo.noEdit}
             </FieldDescription>
            </FieldContent>
           )}
          </Field>
         </div>
         <DialogFooter className='p-4 py-2 pt-0'>
          <DialogTrigger asChild>
           <Button variant='outline' type='submit' className='w-32 h-11'>
            {dic.orderInfo.close}
           </Button>
          </DialogTrigger>
         </DialogFooter>
        </DialogContent>
       </form>
      </Dialog>
     </div>
    </div>
   )}

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
          type: 'removeShopOrderItems',
          payload: [orderItem.id],
         });
        }}
       >
        {dic.orderConfirm.confirm}
       </Button>
      </DialogClose>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </div>
 );
}
