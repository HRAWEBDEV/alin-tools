import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ServeDishIcon from '@/app/[lang]/(app)/components/icons/ServeDishIcon';
import { CiCircleMinus } from 'react-icons/ci';
import { FaCirclePlus } from 'react-icons/fa6';
import { CiCirclePlus } from 'react-icons/ci';
import { type ItemProgram } from '../services/newOrderApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { motion } from 'motion/react';
import Highlighter from 'react-highlight-words';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Spinner } from '@/components/ui/spinner';

export default function OrderItem({
 itemProgram,
}: {
 itemProgram: ItemProgram;
}) {
 const {
  itemsInfo: { searchedItemName },
  order: { orderItems, orderItemsDispatch },
  userOrder: {
   orderItems: { isLoading: userOrderItemsLoading },
  },
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();
 const targetOrderItem = orderItems.find(
  (order) => order.itemID === itemProgram.itemID,
 );
 return (
  <motion.div layout className='flex flex-col min-h-60 pt-17'>
   <div className='grow rounded-xl shadow-xl dark:bg-neutral-900'>
    <div className='grid place-content-center -mt-17 mb-2'>
     <div className='flex items-center justify-center rounded-full size-34 bg-neutral-100 dark:bg-neutral-800 overflow-hidden object-center object-contain'>
      {itemProgram.imageURL ? (
       <img
        alt={itemProgram.itemName || 'food image'}
        src={itemProgram.imageURL}
        loading='lazy'
        className='object-center object-cover w-full h-full'
       />
      ) : (
       <ServeDishIcon className='size-20 text-neutral-300 dark:text-neutral-700' />
      )}
     </div>
    </div>
    <div className='text-center'>
     <h3 className='text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
      <Highlighter
       searchWords={[searchedItemName]}
       textToHighlight={itemProgram.itemName || ''}
      />
     </h3>
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
      <p className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
       {format(itemProgram.price)}
       <span className='ms-1 text-sm'>ریال</span>
      </p>
     </div>
     {!targetOrderItem?.amount && (
      <div className='flex justify-center items-center mb-2'>
       <Button
        variant='ghost'
        size='icon-lg'
        className='text-primary rounded-full'
        disabled={userOrderItemsLoading}
        onClick={() => {
         orderItemsDispatch({
          type: 'addOrderItems',
          payload: [itemProgram],
         });
        }}
       >
        {userOrderItemsLoading ? (
         <Spinner />
        ) : (
         <FaCirclePlus className='size-9' />
        )}
       </Button>
      </div>
     )}
     {!!targetOrderItem?.amount && (
      <div className='flex justify-center items-center mb-2 select-none'>
       <Button
        variant='ghost'
        size='icon-lg'
        className='text-rose-600 dark:text-rose-400 rounded-full'
        onClick={() => {
         orderItemsDispatch({
          type: 'decreaseOrderItemsAmount',
          payload: {
           decreaseBy: 1,
           itemsIDs: [itemProgram.itemID],
          },
         });
        }}
       >
        <CiCircleMinus className='size-10' />
       </Button>
       <div className='text-xl py-[0.2rem] px-1 shrink-0 text-center basis-8 font-medium text-primary rounded'>
        {targetOrderItem.amount}
       </div>
       <Button
        variant='ghost'
        size='icon-lg'
        className='text-secondary rounded-full'
        onClick={() => {
         orderItemsDispatch({
          type: 'increaseOrderItemsAmount',
          payload: {
           increaseBy: 1,
           itemsIDs: [itemProgram.itemID],
          },
         });
        }}
       >
        <CiCirclePlus className='size-10' />
       </Button>
      </div>
     )}
    </div>
   </div>
  </motion.div>
 );
}
