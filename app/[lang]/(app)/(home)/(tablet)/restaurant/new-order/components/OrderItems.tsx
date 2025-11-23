import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';

export default function OrderItems({ dic }: { dic: NewOrderDictionary }) {
 return (
  <div className='p-8 pt-0'>
   <div className='grid justify-center gap-4 grid-cols-[repeat(auto-fill,minmax(12rem,14rem))]'>
    {Array.from({ length: 10 }, (_, i) => i).map((i) => (
     <div key={i} className='flex flex-col h-60 pt-17'>
      <div className='grow rounded-xl shadow-xl border border-input'>
       <div className='grid place-content-center -mt-17 mb-2'>
        <div className='rounded-full size-34 border border-input bg-background'></div>
       </div>
       <div className='text-center'>
        <h3 className='font-medium text-neutral-700 dark:text-neutral-300'>
         خورشت فسنجان
        </h3>
       </div>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
}
