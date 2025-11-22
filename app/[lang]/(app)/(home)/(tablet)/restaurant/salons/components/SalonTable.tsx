'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function SalonTable({}: { dic: SalonsDictionary }) {
 const { locale } = useBaseConfig();
 return (
  <div className='relative grid h-40'>
   <div className='absolute inset-0 z-[-1] py-2 grid gap-1 content-center'>
    {Array.from({ length: 5 }, (_, i) => i).map((i) => (
     <div
      key={i}
      className='bg-neutral-200 dark:bg-neutral-800 h-6 rounded-2xl grid grid-cols-2 overflow-hidden'
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
     className='flex! flex-col grow items-stretch bg-background! p-2'
    >
     <div className='bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 p-1 rounded-2xl border border-dashed border-teal-600 dark:border-teal-400 text-center'>
      <span className='text-base font-medium'>رزرو شده</span>
     </div>
     <div className='text-start ps-2 grow'>
      <h3 className='text-2xl lg:text-3xl text-teal-600 dark:text-teal-400'>
       {(1).toString().padStart(2, '0')}
      </h3>
     </div>
     <div>
      <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium'>
       <span>
        {new Date().toLocaleTimeString(locale, {
         hour: 'numeric',
         minute: '2-digit',
        })}
       </span>
       -
       <span>
        {new Date().toLocaleTimeString(locale, {
         hour: 'numeric',
         minute: '2-digit',
        })}
       </span>
      </div>
     </div>
    </Link>
   </Button>
  </div>
 );
}
