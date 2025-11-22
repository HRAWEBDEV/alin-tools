import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaRegCalendarCheck } from 'react-icons/fa';

export default function SalonTables({ dic }: { dic: SalonsDictionary }) {
 return (
  <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(8rem,10rem))] justify-center'>
   {Array.from({ length: 10 }, (_, i) => i).map((i) => (
    <Button
     variant={'outline'}
     className='h-40 flex-col justify-start text-start p-0 overflow-hidden border-teal-600 dark:border-teal-400 '
     asChild
     key={i}
    >
     <Link href='#' className='flex! flex-col grow items-stretch'>
      <div className='p-2'>
       <div className='bg-teal-100 text-teal-800 p-1 rounded border border-dashed border-teal-800 flex justify-start items-center gap-2'>
        <FaRegCalendarCheck className='size-7' />
        <span className='font-medium'>رزرو شده</span>
       </div>
       <div className='text-start ps-2 pt-2'>
        <h3 className='text-2xl lg:text-3xl text-teal-600 dark:text-teal-400'>
         {i + 1}
        </h3>
       </div>
      </div>
     </Link>
    </Button>
   ))}
  </div>
 );
}
