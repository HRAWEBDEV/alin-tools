'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

export default function NewOrderHeader({ dic }: { dic: NewOrderDictionary }) {
 return (
  <div>
   <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl'>
    {dic.title}
   </h1>
  </div>
 );
}
