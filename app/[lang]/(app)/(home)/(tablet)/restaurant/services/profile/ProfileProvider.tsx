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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useRestaurantShareDictionary } from '../share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';
import { useRouter } from 'next/navigation';

export default function ProfileProvider({ children }: { children: ReactNode }) {
 const router = useRouter();
 const { locale } = useBaseConfig();
 const date = new Date();
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

 return (
  <profileContext.Provider value={ctx}>
   {children}
   <Drawer open={isOpen} onOpenChange={setIsOpen}>
    <DrawerContent className='h-[70svh]'>
     <DrawerHeader className='hidden'>
      <DrawerTitle>{profile.title}</DrawerTitle>
     </DrawerHeader>
     <div className='flex gap-4 border-b border-input p-4 mb-2'>
      <Avatar className='size-20'>
       <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
       <AvatarFallback className='bg-neutral-200'>H</AvatarFallback>
      </Avatar>
      <div className='grow text-start overflow-hidden'>
       <p className='text-lg truncate w-full font-medium'>حمیدرضا اکبری</p>
       <p className='text-base truncate w-full text-primary mb-3 font-medium'>
        هتل عباسی
       </p>
       <p className='text-sm text-neutral-600 dark:text-neutral-300'>
        <span>{profile.lastLoginDate}: </span>
        <span>
         {date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
         })}
        </span>
       </p>
      </div>
     </div>
     <div>
      <ul>
       <li>
        <Button
         variant='ghost'
         size={'icon-lg'}
         className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-neutral-600 dark:text-neutral-400'
        >
         <IoMdSettings className='size-8' />
         <span>{profile.sttings}</span>
        </Button>
       </li>
       <li>
        <Button
         variant='ghost'
         size={'icon-lg'}
         className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-rose-600 dark:text-rose-400'
         onClick={() => {
          router.push('/fa/login');
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
