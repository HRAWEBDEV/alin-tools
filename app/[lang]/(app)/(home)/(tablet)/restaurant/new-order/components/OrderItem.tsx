import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { FaCirclePlus } from 'react-icons/fa6';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';

export default function OrderItem() {
 return (
  <div className='flex flex-col min-h-60 pt-17'>
   <div className='grow rounded-xl shadow-xl dark:border dark:border-input'>
    <div className='grid place-content-center -mt-17 mb-2'>
     <div className='rounded-full size-34 bg-neutral-100 dark:bg-neutral-900 overflow-hidden'>
      <img
       alt='food image'
       src='/images/faseenjoon.jpg'
       className='object-center object-cover w-full h-full'
      />
     </div>
    </div>
    <div className='text-center'>
     <h3 className='text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-1'>
      خورشت فسنجان
     </h3>
     <p className='px-2 text-xs text-neutral-600 dark:text-neutral-400 font-light mb-3'>
      توضیحات مختصری در مورد غذا توضیحات مختصری در مورد غذا
     </p>
     <div className='flex flex-col mb-2'>
      <div className='text-[0.85rem] font-medium text-red-600 dark:text-red-400 line-through'>
       <Badge variant='destructive' className='p-1 me-2 text-sm'>
        12%
       </Badge>
       <span>14,000,000</span>
      </div>
      <span className='text-lg font-medium text-neutral-600 dark:text-neutral-400'>
       14,000,000
      </span>
     </div>
     <div className='flex justify-center items-center mb-2'>
      <Button
       variant='ghost'
       size='icon-lg'
       className='text-rose-600 dark:text-rose-400 rounded-full'
      >
       <CiCircleMinus className='size-10' />
      </Button>
      <div className='text-lg px-2 shrink-0 text-center basis-8 font-medium'>
       12
      </div>
      <Button
       variant='ghost'
       size='icon-lg'
       className='text-secondary rounded-full'
      >
       <CiCirclePlus className='size-10' />
      </Button>
     </div>
    </div>
   </div>
  </div>
 );
}
