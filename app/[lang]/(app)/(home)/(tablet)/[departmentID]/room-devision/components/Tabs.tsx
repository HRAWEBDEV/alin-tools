'use client';
import { useRoomDevisionShareDictionary } from '../services/share-dictionary/roomDevisionShareDictionaryContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaUserFriends } from 'react-icons/fa';
import { FaHotel, FaClipboardList, FaHouseUser } from 'react-icons/fa6';
import { MdDoneAll } from 'react-icons/md';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function Tabs() {
 const { locale } = useBaseConfig();
 const { routeDepartment, routeProgram } = useUserInfoRouter();
 const {
  roomDevisionShareDictionary: {
   components: { tabs: tabsDic },
  },
 } = useRoomDevisionShareDictionary();

 const tabClass = 'h-auto flex-col p-1! grow basis-0 sm:text-base';
 const tabIconClass = 'size-7';

 return (
  <nav className=' shrink-0 flex items-center lg:hidden fixed end-0 start-0 bottom-0 z-(--app-restaurant-tabs-zindex) bg-neutral-100 dark:bg-neutral-900 *:shrink-0 border-t border-border text-neutral-700 dark:text-neutral-300 transition-transform in-data-[scroll-dicretion="down"]:translate-y-20'>
   <Button variant='ghost' className={tabClass} asChild>
    <Link
     href={`/${locale}/${routeDepartment.id}/room-devision/${routeProgram.id}/rooms-rack`}
    >
     <FaHotel className={tabIconClass} />
     <p className='text-sm'>{tabsDic.roomsRack}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link
     href={`/${locale}/${routeDepartment.id}/room-devision/${routeProgram.id}/rooms-management`}
    >
     <FaHouseUser className={tabIconClass} />
     <p className='text-sm'>{tabsDic.roomsManagement}</p>
    </Link>
   </Button>
   <Button
    variant='ghost'
    className={`${tabClass} rounded-none bg-primary/30`}
    asChild
   >
    <Link
     href={`/${locale}/${routeDepartment.id}/room-devision/${routeProgram.id}/room-control`}
    >
     <MdDoneAll className={tabIconClass} />
     <p className='text-sm'>{tabsDic.roomsControl}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link
     href={`/${locale}/${routeDepartment.id}/room-devision/${routeProgram.id}/guests-management`}
    >
     <FaUserFriends className={tabIconClass} />
     <p className='text-sm'>{tabsDic.guestsManagement}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link
     href={`/${locale}/${routeDepartment.id}/room-devision/${routeProgram.id}/execution-management`}
    >
     <FaClipboardList className={tabIconClass} />
     <p className='text-sm'>{tabsDic.executionManagement}</p>
    </Link>
   </Button>
  </nav>
 );
}
