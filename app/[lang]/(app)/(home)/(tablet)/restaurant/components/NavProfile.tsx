'use client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';

export default function NavProfile() {
 const { locale } = useBaseConfig();
 const date = new Date();
 const {
  restaurantShareDictionary: {
   components: {
    navigation: { loginDate },
   },
  },
 } = useRestaurantShareDictionary();
 return (
  <div className='p-2 border-t border-input'>
   <Button
    variant='ghost'
    className='w-full p-1 justify-start h-auto bg-transparent'
   >
    <Avatar className='size-14'>
     <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
     <AvatarFallback className='bg-neutral-200'>H</AvatarFallback>
    </Avatar>
    <div className='grow text-start overflow-hidden'>
     <p className='truncate w-full'>حمیدرضا اکبری</p>
     <p className='truncate w-full text-primary mb-2'>هتل عباسی</p>
     <p className='text-[0.7rem] text-neutral-600 dark:text-neutral-300'>
      <span>{loginDate}: </span>
      <span>
       {date.toLocaleTimeString(locale, {
        hour12: false,
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
