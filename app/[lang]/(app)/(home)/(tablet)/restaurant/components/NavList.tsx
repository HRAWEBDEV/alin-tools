'use client';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { usePathname } from 'next/navigation';

export default function NavList() {
 const { locale } = useBaseConfig();
 const pathname = usePathname();
 const pathSegments = pathname.split('/');
 const activePath = pathSegments.at(-1);
 const {
  restaurantShareDictionary: {
   components: { navigation },
  },
 } = useRestaurantShareDictionary();
 return (
  <ul className='p-2 w-[min(100%,15rem)] mx-auto grid gap-2'>
   <li>
    <Button
     data-active={activePath === 'salons'}
     variant='ghost'
     className='relative w-full h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={`/${locale}/restaurant/salons`}
      className='flex w-auto h-auto items-center gap-4'
     >
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.salons}</p>
      {activePath === 'salons' && (
       <div className='absolute end-0 top-1/2 -translate-y-1/2 -translate-x-1/2'>
        <Badge className='size-7 text-base'>12</Badge>
       </div>
      )}
     </Link>
    </Button>
   </li>
   <li>
    <Button
     data-active={activePath === 'new-order'}
     variant='ghost'
     className='w-full h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={`/${locale}/restaurant/new-order`}
      className='flex w-auto h-auto items-center gap-4'
     >
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.newOrder}</p>
     </Link>
    </Button>
   </li>
  </ul>
 );
}
