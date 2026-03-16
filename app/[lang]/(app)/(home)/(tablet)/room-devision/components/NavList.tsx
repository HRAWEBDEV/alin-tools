'use client';
import { Button } from '@/components/ui/button';
import { useRoomDevisionShareDictionary } from '../services/share-dictionary/roomDevisionShareDictionaryContext';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { usePathname } from 'next/navigation';
import { FaUserFriends } from 'react-icons/fa';
import { FaHotel, FaClipboardList, FaHouseUser } from 'react-icons/fa6';

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
      <FaHotel className='size-8' />
      <p className='text-base'>{navigation.roomsRack}</p>
     </Link>
    </Button>
    <Button
     data-active={activePath === 'execution-management'}
     variant='ghost'
     className='w-full min-h-16 h-auto justify-start data-[active=""]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'execution-management'
        ? '#'
        : `/${locale}/room-devision/execution-management`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <FaClipboardList className='size-8' />
      <p className='text-base'>{navigation.executionManagement}</p>
     </Link>
    </Button>
    <Button
     data-active={activePath === 'guests-management'}
     variant='ghost'
     className='w-full min-h-16 h-auto justify-start data-[active=""]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'guests-management'
        ? '#'
        : `/${locale}/room-devision/guests-management`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <FaUserFriends className='size-8' />
      <p className='text-base'>{navigation.guestsManagement}</p>
     </Link>
    </Button>
    <Button
     data-active={activePath === 'rooms-management'}
     variant='ghost'
     className='w-full min-h-16 h-auto justify-start data-[active=""]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'rooms-management'
        ? '#'
        : `/${locale}/room-devision/rooms-management`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <FaHouseUser className='size-8' />
      <p className='text-base'>{navigation.roomsManagement}</p>
     </Link>
    </Button>
   </li>
  </ul>
 );
}
