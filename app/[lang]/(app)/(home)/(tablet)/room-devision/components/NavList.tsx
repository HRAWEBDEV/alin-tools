'use client';
import { Button } from '@/components/ui/button';
import { useRoomDevisionShareDictionary } from '../services/share-dictionary/roomDevisionShareDictionaryContext';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { usePathname } from 'next/navigation';
import { FaHotel } from 'react-icons/fa6';

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
   <li>
    <Button
     data-active={activePath === 'rooms-rack'}
     variant='ghost'
     className='w-full min-h-16 h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'rooms-rack' ? '#' : `/${locale}/room-devision/rooms-rack`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <FaHotel className='size-9' />
      <p className='text-base'>{navigation.roomsRack}</p>
     </Link>
    </Button>
   </li>
  </ul>
 );
}
