import { Button } from '@/components/ui/button';
import React from 'react';
import { RiArrowGoForwardFill } from 'react-icons/ri';
import { useSettingsContext } from '../settingsContext';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';

export default function BackBtn({ bgClasses }: { bgClasses?: string }) {
 const { setActiveView } = useSettingsContext();
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 return (
  <Button
   className={`px-8! py-3! h-full flex items-center justify-center gap-2 rounded-lg text-gray-200 hover:text-gray-200! dark:text-gray-500 dark:hover:text-gray-500 ${bgClasses ? bgClasses : ' bg-primary/80 hover:bg-primary '}`}
   onClick={() => setActiveView(null)}
   variant='ghost'
  >
   <RiArrowGoForwardFill className='font-medium sm:size-5 size-4' />
   <span className='font-medium sm:text-sm text-xs'>{settings.backBtn}</span>
  </Button>
 );
}
