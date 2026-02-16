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
   className='rounded-none hover:bg-transparent px-0!'
   onClick={() => setActiveView(null)}
   variant='ghost'
  >
   <RiArrowGoForwardFill className='font-medium text-primary size-5' />
   <span className='font-medium text-primary text-[18px]'>
    {settings.backBtn}
   </span>
  </Button>
 );
}
