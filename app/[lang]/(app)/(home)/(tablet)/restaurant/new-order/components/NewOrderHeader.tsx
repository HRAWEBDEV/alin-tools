'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function NewOrderHeader({ dic }: { dic: NewOrderDictionary }) {
 const router = useRouter();
 const {
  queries: { fromSalons },
 } = useOrderBaseConfigContext();
 return (
  <div className='flex flex-col gap-2'>
   <div className='flex justify-between items-center gap-4'>
    <div className='basis-11 md:hidden'></div>
    <div>
     <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl'>
      {dic.title}
     </h1>
    </div>
    <div className='basis-11'>
     {fromSalons && (
      <Button size='icon-lg' variant='outline' onClick={() => router.back()}>
       <FaArrowLeft />
      </Button>
     )}
    </div>
   </div>
  </div>
 );
}
