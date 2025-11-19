'use client';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { Button } from '@/components/ui/button';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import Link from 'next/link';

export default function NavList() {
 const {
  restaurantShareDictionary: {
   components: { navigation },
  },
 } = useRestaurantShareDictionary();
 return (
  <ul className='p-2 w-[min(100%,15rem)] mx-auto'>
   <li>
    <Button variant='ghost' className='w-auto h-auto justify-start' asChild>
     <Link href='#' className='flex w-auto h-auto items-center gap-4'>
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.salons}</p>
     </Link>
    </Button>
   </li>
  </ul>
 );
}
