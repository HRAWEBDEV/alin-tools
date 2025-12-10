import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import { type OrderItem } from '../../services/newOrderApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import ServeDishIcon from '@/app/[lang]/(app)/components/icons/ServeDishIcon';

export default function OrderShoppingItem({
 orderItem,
}: {
 dic: NewOrderDictionary;
 orderItem: OrderItem;
}) {
 const {
  order: { orderItemsDispatch },
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();
 return (
  <div className='border-b border-input p-2'>
   <div className='flex gap-4 items-center'>
    <div className='flex items-center justify-center  shrink-0 rounded-full size-20 bg-neutral-100 dark:bg-neutral-800 overflow-hidden object-center object-contain'>
     {false ? (
      <img
       alt={''}
       src=''
       loading='lazy'
       className='object-center object-cover w-full h-full'
      />
     ) : (
      <ServeDishIcon className='size-12 text-neutral-300 dark:text-neutral-700' />
     )}
    </div>
    <div className='grow flex flex-col sm:flex-row sm:items-center'>
     <div className='grow'>
      <h3 className='font-medium text-neutral-700 dark:text-neutral-300 mb-1'>
       {orderItem.itemName}
      </h3>
      <p className='px-2 text-xs text-neutral-600 dark:text-neutral-400 font-light mb-3 w-[min(100%,20rem)]'>
       --
      </p>
      <div className='flex mb-6 sm:mb-2 gap-4'>
       <div className='text-[0.85rem] font-medium text-red-600 dark:text-red-400 line-through'>
        <Badge variant='destructive' className='p-1 me-2 text-sm'>
         12%
        </Badge>
        <span>14,000,000</span>
       </div>
       <p className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {format(orderItem.price)}
        <span className='ms-1 text-sm'>ریال</span>
       </p>
      </div>
     </div>
     <div className='flex gap-2 justify-end sm:justify-start sm:flex-col items-center shrink-0'>
      <div>
       <p className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {format(orderItem.price)}
        <span className='ms-1 text-sm'>ریال</span>
       </p>
      </div>
      <div className='flex items-center justify-center sm:mb-2'>
       <Button
        variant='ghost'
        size='icon-lg'
        className='text-rose-600 dark:text-rose-400 rounded-full'
        disabled={orderItem.amount <= 1}
        onClick={() => {
         orderItemsDispatch({
          type: 'decreaseOrderItemsAmount',
          payload: {
           decreaseBy: 1,
           itemsIDs: [orderItem.itemID],
          },
         });
        }}
       >
        <CiCircleMinus className='size-10' />
       </Button>
       <div className='text-primary text-xl px-2 shrink-0 text-center basis-8 font-medium'>
        {orderItem.amount}
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
           itemsIDs: [orderItem.itemID],
          },
         });
        }}
       >
        <CiCirclePlus className='size-10' />
       </Button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
