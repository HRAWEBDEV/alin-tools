'use client';
import { ReactNode } from 'react';
import { useState } from 'react';
import { type Profile, profileContext } from './profileContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRestaurantShareDictionary } from '../share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';
import { RiLogoutBoxRLine, RiSettings5Line } from 'react-icons/ri';
import { useLogout } from '@/app/[lang]/(app)/login/hooks/useLogout';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import { useSettingsContext } from './settings/settingsContext';

export default function ProfileProvider({ children }: { children: ReactNode }) {
 const { userInfoRouterStorage, data } = useUserInfoRouter();
 const logout = useLogout();
 const {
  restaurantShareDictionary: {
   components: { profile },
  },
 } = useRestaurantShareDictionary();
 const [isOpen, setIsOpen] = useState(false);
 function handleToggleProfile(open?: boolean) {
  setIsOpen((pre) => (open === undefined ? !pre : open));
 }

 const ctx: Profile = {
  isOpen,
  toggleProfile: handleToggleProfile,
 };

 const { toggleIsOpen: toggleIsSettingsOpen } = useSettingsContext();
 return (
  <profileContext.Provider value={ctx}>
   {children}
   <Drawer open={isOpen} onOpenChange={setIsOpen}>
    <DrawerContent className='h-[min(80svh,35rem)]'>
     <DrawerHeader className='hidden'>
      <DrawerTitle>{profile.title}</DrawerTitle>
     </DrawerHeader>
     <div className='flex gap-4 border-b border-input p-4 mb-2'>
      <Avatar className='size-20'>
       {/* <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' /> */}
       <AvatarFallback className='bg-neutral-200'>H</AvatarFallback>
      </Avatar>
      <div className='grow text-start overflow-hidden'>
       <p className='text-lg truncate w-full font-medium'>
        {data.user.personFullName}
       </p>
       <p className='text-base truncate w-full text-primary mb-1 font-medium'>
        {userInfoRouterStorage.ownerName}
       </p>
       <p className='text-sm truncate w-full mb-3 font-medium'>
        {userInfoRouterStorage.departmentName} -{' '}
        {userInfoRouterStorage.programName}
       </p>
       {/* <p className='text-sm text-neutral-600 dark:text-neutral-300'> */}
       {/*  <span>{profile.lastLoginDate}: </span> */}
       {/*  <span> */}
       {/*   {date.toLocaleDateString(locale, { */}
       {/*    year: 'numeric', */}
       {/*    month: 'long', */}
       {/*    day: '2-digit', */}
       {/*    hour: '2-digit', */}
       {/*    minute: '2-digit', */}
       {/*   })} */}
       {/*  </span> */}
       {/* </p> */}
      </div>
     </div>
     <div>
      <ul>
       {/* <li> */}
       {/*  <Button */}
       {/*   variant='ghost' */}
       {/*   size={'icon-lg'} */}
       {/*   className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-neutral-600 dark:text-neutral-400' */}
       {/*  > */}
       {/*   <IoMdSettings className='size-8' /> */}
       {/*   <span>{profile.sttings}</span> */}
       {/*  </Button> */}
       {/* </li> */}
       <li>
        <Button
         variant='ghost'
         size={'icon-lg'}
         className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-gray-500 dark:text-gray-600'
         onClick={() => {
          toggleIsSettingsOpen();
          handleToggleProfile();
         }}
        >
         <RiSettings5Line className='size-8' />
         <span>{profile.settings}</span>
        </Button>
       </li>
       <li>
        <Button
         variant='ghost'
         size={'icon-lg'}
         className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-rose-600 dark:text-rose-400'
         onClick={() => {
          logout();
         }}
        >
         <RiLogoutBoxRLine className='size-8' />
         <span>{profile.logout}</span>
        </Button>
       </li>
      </ul>
     </div>
    </DrawerContent>
   </Drawer>
  </profileContext.Provider>
 );
}
