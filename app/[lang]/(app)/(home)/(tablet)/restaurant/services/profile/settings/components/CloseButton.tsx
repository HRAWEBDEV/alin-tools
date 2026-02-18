import { DrawerClose } from '@/components/ui/drawer';
import React from 'react';
import { RiCloseLargeFill } from 'react-icons/ri';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { cx } from 'class-variance-authority';

export default function CloseButton({ className }: { className?: string }) {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 return (
  <DrawerClose
   className={cx(
    `flex items-center gap-2 border py-3 sm:px-8 px-4 rounded-lg cursor-pointer transition-colors`,
    className,
   )}
  >
   <RiCloseLargeFill className='font-medium sm:size-5 size-4' />
   <span className='font-medium sm:text-sm text-xs sm:block hidden'>
    {settings.closeBtn}
   </span>
  </DrawerClose>
 );
}
