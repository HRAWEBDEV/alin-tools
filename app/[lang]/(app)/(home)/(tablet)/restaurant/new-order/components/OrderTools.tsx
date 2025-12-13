'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { FaShoppingBag } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FaCircleInfo } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { IoSearch } from 'react-icons/io5';

export default function OrderTools({ dic }: { dic: NewOrderDictionary }) {
 const {
  showConfirmOrder,
  initialDataInfo: { isLoading },
  itemsInfo: { searchedItemName, changeSearchedItemName },
  order: { orderItems },
  userOrder: {
   order: { isLoading: userOrderIsLoading },
   orderItems: { isLoading: userOrderItemsLoading },
  },
 } = useOrderBaseConfigContext();
 return (
  <div className='flex md:items-center md:justify-between gap-2 mb-2 flex-col md:flex-row'>
   <div className='md:grid md:grid-cols-[minmax(0,18rem)]'>
    <InputGroup className='bg-neutral-100 dark:bg-neutral-900 h-10'>
     <InputGroupAddon align='inline-start'>
      <IoSearch className='text-primary size-5' />
     </InputGroupAddon>
     <InputGroupInput
      value={searchedItemName}
      onChange={(e) => changeSearchedItemName(e.target.value)}
      type='search'
      placeholder={dic.tools.search + ' ...'}
      className='placeholder:text-base'
     />
    </InputGroup>
   </div>
   <div className='md:flex md:justify-end grid grid-cols-2 gap-2'>
    <Button
     className='md:w-36 text-primary border-primary h-10'
     variant='outline'
     disabled={isLoading || userOrderItemsLoading || userOrderIsLoading}
     onClick={() => showConfirmOrder('orderInfo')}
    >
     {!isLoading && !userOrderItemsLoading && !userOrderIsLoading ? (
      <FaCircleInfo />
     ) : (
      <Spinner />
     )}
     <span>{dic.tools.orderInfo}</span>
    </Button>
    <Button
     variant='secondary'
     className='relative md:w-36 h-10'
     disabled={isLoading || userOrderItemsLoading || userOrderIsLoading}
     onClick={() => showConfirmOrder('shoppingCard')}
    >
     {!userOrderIsLoading && !isLoading && !userOrderItemsLoading ? (
      <FaShoppingBag />
     ) : (
      <Spinner />
     )}
     <span>{dic.tools.shoppingCard}</span>
     {!!orderItems.length && (
      <Badge className='p-1 size-6 bg-orange-600 dark:bg-orange-400 font-medium text-base'>
       {orderItems.length}
      </Badge>
     )}
    </Button>
   </div>
  </div>
 );
}
