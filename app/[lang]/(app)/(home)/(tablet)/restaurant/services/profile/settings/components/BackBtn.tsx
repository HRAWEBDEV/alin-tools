import { Button } from '@/components/ui/button';
import React from 'react';
import { RiArrowGoForwardFill } from 'react-icons/ri';
import { useSettingsContext } from '../settingsContext';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';

export default function BackBtn({ className }: { className?: string }) {
 const { setActiveView } = useSettingsContext();
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 return (
  <Button
   className={`px-8! py-3! h-full flex items-center justify-center gap-2 rounded-lg  ${className ? className : ' border border-primary/80 hover:border-primary text-gray-200 hover:text-gray-200! dark:text-gray-500 dark:hover:text-gray-500'}`}
   onClick={() => setActiveView(null)}
   variant='outline'
  >
   <RiArrowGoForwardFill className='font-medium sm:size-5 size-4' />
   <span className='font-medium sm:text-sm text-xs'>{settings.backBtn}</span>
  </Button>
 );
}
