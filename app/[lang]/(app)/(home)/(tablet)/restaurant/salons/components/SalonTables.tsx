import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SalonTables({}: { dic: SalonsDictionary }) {
 return (
  <div className='grid gap-8 grid-cols-[repeat(auto-fill,minmax(10rem,12rem))] justify-center p-4 pt-0'>
   {Array.from({ length: 10 }, (_, i) => i).map((i) => (
    <div key={i} className='relative grid h-40'>
     <div className='absolute inset-0 z-[-1] py-2 grid gap-1 content-center'>
      {Array.from({ length: 5 }, (_, i) => i).map((i) => (
       <div
        key={i}
        className='bg-neutral-200 h-6 rounded-2xl grid grid-cols-2 overflow-hidden'
       >
        <div
         data-occupied={i === 0 || i === 1}
         className='data-[occupied="true"]:bg-rose-400 data-[occupied="true"]:dark:bg-rose-600'
        ></div>
        <div
         data-occupied={i === 0 || i === 1}
         className='data-[occupied="true"]:bg-rose-400 data-[occupied="true"]:dark:bg-rose-600'
        ></div>
       </div>
      ))}
     </div>
     <Button
      variant={'outline'}
      className='rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden mx-4 shadow-lg'
      asChild
     >
      <Link
       href='#'
       className='flex! flex-col grow items-stretch bg-background!'
      >
       <div className='p-2'>
        <div className='bg-teal-50 text-teal-600 p-1 rounded-2xl border border-dashed border-teal-600 text-center'>
         <span className='text-base font-medium'>رزرو شده</span>
        </div>
        <div className='text-start ps-2 pt-2'>
         <h3 className='text-2xl lg:text-3xl text-teal-600 dark:text-teal-400'>
          {(i + 1).toString().padStart(2, '0')}
         </h3>
        </div>
       </div>
      </Link>
     </Button>
    </div>
   ))}
  </div>
 );
}
