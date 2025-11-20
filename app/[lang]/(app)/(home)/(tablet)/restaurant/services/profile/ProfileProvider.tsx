'use client';
import { ReactNode } from 'react';
import { useState } from 'react';
import { type Profile, profileContext } from './profileContext';
import {
 Drawer,
 DrawerClose,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useRestaurantShareDictionary } from '../share-dictionary/restaurantShareDictionaryContext';

export default function ProfileProvider({ children }: { children: ReactNode }) {
 const { locale } = useBaseConfig();
 const date = new Date();
 const {
  restaurantShareDictionary: {
   components: {
    profile: { lastLoginDate },
   },
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
      <DrawerTitle>test</DrawerTitle>
     </DrawerHeader>
     <div className='flex gap-4 border-b border-input p-4'>
      <Avatar className='size-20'>
       <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
       <AvatarFallback className='bg-neutral-200'>H</AvatarFallback>
      </Avatar>
      <div className='grow text-start overflow-hidden'>
       <p className='truncate w-full font-medium'>حمیدرضا اکبری</p>
       <p className='truncate w-full text-primary mb-2'>هتل عباسی</p>
       <p className='text-sm text-neutral-600 dark:text-neutral-300'>
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
     </div>
    </DrawerContent>
   </Drawer>
  </profileContext.Provider>
 );
}
