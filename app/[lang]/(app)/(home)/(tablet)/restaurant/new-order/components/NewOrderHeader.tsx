'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

export default function NewOrderHeader({ dic }: { dic: NewOrderDictionary }) {
 return (
  <div className='mb-4 p-4 lg:p-8'>
   <h1 className='font-medium text-2xl lg:text-3xl'>{dic.title}</h1>
  </div>
 );
}
