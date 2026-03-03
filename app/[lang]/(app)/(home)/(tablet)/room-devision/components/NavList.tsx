'use client';
import { Button } from '@/components/ui/button';
import { useRoomDevisionShareDictionary } from '../services/share-dictionary/roomDevisionShareDictionaryContext';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { usePathname } from 'next/navigation';

export default function NavList() {
 const { locale } = useBaseConfig();
 const pathname = usePathname();
 const pathSegments = pathname.split('/');
 const activePath = pathSegments.at(-1);
 const {
  roomDevisionShareDictionary: {
   components: { navigation },
  },
 } = useRoomDevisionShareDictionary();
 return (
  <ul className='p-2 w-[min(100%,15rem)] mx-auto grid gap-2'>
   {/*<li>
    <Button
     data-active={activePath === 'new-order'}
     variant='ghost'
     className='w-full h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'new-order' ? '#' : `/${locale}/restaurant/new-order`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.newOrder}</p>
     </Link>
    </Button>
   </li>*/}
  </ul>
 );
}
