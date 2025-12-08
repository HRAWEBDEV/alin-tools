'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { FaShoppingBag } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FaCircleInfo } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Spinner } from '@/components/ui/spinner';

export default function OrderTools({ dic }: { dic: NewOrderDictionary }) {
 const {
  showConfirmOrder,
  initialDataInfo: { isLoading },
 } = useOrderBaseConfigContext();
 return (
  <div className='flex md:items-center md:justify-between gap-2 mb-2 flex-col md:flex-row'>
   <div className='text-sm flex gap-3 text-neutral-600 dark:text-neutral-400 flex-wrap'>
    <div>
     <span>{dic.orderInfo.salonName}: </span>
     <span className='text-primary font-medium'>سالن یک</span>
    </div>
    <div>
     <span>{dic.orderInfo.table}: </span>
     <span className='text-primary font-medium'>111</span>
    </div>
    <div>
     <span>{dic.orderInfo.customer}: </span>
     <span className='text-primary font-medium'>حمیدرضا اکبری</span>
    </div>
   </div>
   <div className='md:flex md:justify-end grid grid-cols-2 gap-2'>
    <Button
     className='md:w-36 text-primary border-primary'
     variant='outline'
     disabled={isLoading}
     onClick={() => showConfirmOrder('orderInfo')}
    >
     {!isLoading ? <FaCircleInfo /> : <Spinner />}
     <span>{dic.tools.orderInfo}</span>
    </Button>
    <Button
     variant='secondary'
     className='relative md:w-36'
     disabled={isLoading}
     onClick={() => showConfirmOrder('shoppingCard')}
    >
     {!isLoading ? <FaShoppingBag /> : <Spinner />}
     <span>{dic.tools.shoppingCard}</span>
     <Badge className='p-1 size-6 bg-orange-600 dark:bg-orange-400'>12</Badge>
    </Button>
   </div>
  </div>
 );
}
