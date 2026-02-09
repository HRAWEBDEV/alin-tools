'use client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import HeaderDate from './HeaderDate';
import { useProfileContext } from '../services/profile/profileContext';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function NavProfile() {
 const { data, userInfoRouterStorage } = useUserInfoRouter();
 const { toggleProfile } = useProfileContext();
 const {
  restaurantShareDictionary: {
   components: {},
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
     {/* <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' /> */}
     <AvatarFallback className='bg-neutral-200'>H</AvatarFallback>
    </Avatar>
    <div className='grow text-start overflow-hidden'>
     <p className='text-md truncate w-full'>{data.user.personFullName}</p>
     <p className='text-sm truncate w-full text-primary mb-1'>
      {userInfoRouterStorage?.ownerName}
     </p>
     <p className='text-xs truncate w-full mb-1'>
      {userInfoRouterStorage?.departmentName} -{' '}
      {userInfoRouterStorage?.programName}
     </p>
    </div>
    <IoMdArrowDropdown className='size-6 text-neutral-500' />
   </Button>
  </div>
 );
}
