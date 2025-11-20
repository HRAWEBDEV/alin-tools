'use client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import HeaderDate from './HeaderDate';
import { useProfileContext } from '../services/profile/profileContext';

export default function NavProfile() {
 const { toggleProfile } = useProfileContext();
 const { locale } = useBaseConfig();
 const date = new Date();
 const {
  restaurantShareDictionary: {
   components: {
    profile: { lastLoginDate },
   },
  },
 } = useRestaurantShareDictionary();
 return (
  <div className='mt-2'>
   <div className='mb-1 ps-4'>
    <HeaderDate />
   </div>
   <Button
    variant='ghost'
    className='w-full p-1 pt-2 justify-start h-auto rounded-none border-t border-input'
    onClick={() => toggleProfile()}
   >
    <Avatar className='size-14'>
     <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
     <AvatarFallback className='bg-neutral-200'>H</AvatarFallback>
    </Avatar>
    <div className='grow text-start overflow-hidden'>
     <p className='text-sm truncate w-full'>حمیدرضا اکبری</p>
     <p className='text-xs truncate w-full text-primary mb-1'>هتل عباسی</p>
     <p className='text-[0.65rem] text-neutral-600 dark:text-neutral-300'>
      <span>{lastLoginDate}: </span>
      <span>
       {date.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
       })}
      </span>
     </p>
    </div>
    <IoMdArrowDropdown className='size-6 text-neutral-500' />
   </Button>
  </div>
 );
}
