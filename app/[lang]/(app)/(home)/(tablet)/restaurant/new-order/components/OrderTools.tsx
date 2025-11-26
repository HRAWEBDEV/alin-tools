import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { FaShoppingBag } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FaCircleInfo } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';

export default function OrderTools({ dic }: { dic: NewOrderDictionary }) {
 return (
  <div className='flex justify-end mb-2'>
   <div className='flex gap-2'>
    <Button className='w-36 text-primary border-primary' variant='outline'>
     <FaCircleInfo />
     <span>{dic.tools.orderInfo}</span>
    </Button>
    <Button variant='secondary' className='relative w-36'>
     <FaShoppingBag />
     <span>{dic.tools.shoppingCard}</span>
     <Badge className='p-1 size-6 bg-orange-600 dark:bg-orange-400'>12</Badge>
    </Button>
   </div>
  </div>
 );
}
