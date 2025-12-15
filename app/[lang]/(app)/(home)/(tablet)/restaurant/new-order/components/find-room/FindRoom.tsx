import { useRef } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

export default function FindRoom({ dic }: { dic: NewOrderDictionary }) {
 const containerRef = useRef<HTMLDivElement>(null);

 return (
  <div ref={containerRef} className='overflow-hidden overflow-y-auto py-4'>
   <div></div>
  </div>
 );
}
