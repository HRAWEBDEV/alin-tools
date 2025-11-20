'use client';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import Link from 'next/link';

export default function NavList() {
 const {
  restaurantShareDictionary: {
   components: { navigation },
  },
 } = useRestaurantShareDictionary();
 return (
  <ul className='p-2 w-[min(100%,15rem)] mx-auto grid gap-2'>
   <li>
    <Button
     data-active='true'
     variant='outline'
     className='relative w-full h-auto justify-start data-[active="true"]:text-primary border-primary'
     asChild
    >
     <Link href='#' className='flex w-auto h-auto items-center gap-4'>
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.salons}</p>
      <div className='absolute end-0 top-1/2 -translate-y-1/2 -translate-x-1/2'>
       <Badge className='size-7 text-base'>12</Badge>
      </div>
     </Link>
    </Button>
   </li>
   <li>
    <Button
     data-active='false'
     variant='ghost'
     className='w-full h-auto justify-start data-[active="true"]:text-primary border-primary'
     asChild
    >
     <Link href='#' className='flex w-auto h-auto items-center gap-4'>
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.newOrder}</p>
     </Link>
    </Button>
   </li>
  </ul>
 );
}
