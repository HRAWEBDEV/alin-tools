'use client';
import { useRoomDevisionShareDictionary } from '../services/share-dictionary/roomDevisionShareDictionaryContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useProfileContext } from '../services/profile/profileContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaUserFriends, FaUserCircle } from 'react-icons/fa';
import { FaHotel, FaClipboardList, FaHouseUser } from 'react-icons/fa6';

export default function Tabs() {
 const { locale } = useBaseConfig();
 const { toggleProfile } = useProfileContext();
 const {
  roomDevisionShareDictionary: {
   components: { tabs: tabsDic },
  },
 } = useRoomDevisionShareDictionary();

 const tabClass = 'h-auto flex-col p-1! grow sm:text-base';
 const tabIconClass = 'size-7';

 return (
  <nav className=' shrink-0 flex items-center lg:hidden fixed end-0 start-0 bottom-0 z-(--app-restaurant-tabs-zindex) bg-neutral-100 dark:bg-neutral-900 *:shrink-0 border-t border-input text-neutral-700 dark:text-neutral-300 transition-transform in-data-[scroll-dicretion="down"]:translate-y-20'>
   <Button variant='ghost' className={tabClass} asChild>
    <Link href={`/${locale}/room-devision/rooms-rack`}>
     <FaHotel className={tabIconClass} />
     <p className='text-sm'>{tabsDic.roomsRack}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link href={`/${locale}/room-devision/execution-management`}>
     <FaClipboardList className={tabIconClass} />
     <p className='text-sm'>{tabsDic.executionManagement}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link href={`/${locale}/room-devision/guests-management`}>
     <FaUserFriends className={tabIconClass} />
     <p className='text-sm'>{tabsDic.guestsManagement}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link href={`/${locale}/room-devision/rooms-management`}>
     <FaHouseUser className={tabIconClass} />
     <p className='text-sm'>{tabsDic.roomsManagement}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} onClick={() => toggleProfile()}>
    <FaUserCircle className={tabIconClass} />
    <p className='text-sm'>{tabsDic.profile}</p>
   </Button>
  </nav>
 );
}
