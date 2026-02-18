import { Button } from '@/components/ui/button';
import React from 'react';
import { RiArrowGoForwardFill } from 'react-icons/ri';
import { useSettingsContext } from '../settingsContext';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';

export default function BackBtn() {
 const { setActiveView } = useSettingsContext();
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 return (
  <Button
   className='px-0! py-2! h-full flex items-center justify-center gap-2 rounded-lg bg-primary/80 hover:bg-primary text-gray-200 hover:text-gray-200! dark:text-gray-500 dark:hover:text-gray-500 '
   onClick={() => setActiveView(null)}
   variant='ghost'
  >
   <RiArrowGoForwardFill className='font-medium sm:size-5 size-4' />
   <span className='font-medium sm:text-sm text-xs'>{settings.backBtn}</span>
  </Button>
 );
}
