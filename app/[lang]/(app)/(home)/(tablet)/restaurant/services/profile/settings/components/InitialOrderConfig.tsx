'use client';

import React, { useState } from 'react';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';

export default function InitialOrderConfigView() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 const activeValue = settings.components.initialOrderConfig.tabs.active;
 const inactiveValue = settings.components.initialOrderConfig.tabs.inactive;

 const [initialOrder, setInitialOrder] = useState(activeValue);

 const tabs = [
  {
   value: activeValue,
   label: activeValue,
  },
  {
   value: inactiveValue,
   label: inactiveValue,
  },
 ];

 return (
  <div className='flex flex-col justify-start gap-4 px-8 mt-4'>
   <h4 className='font-medium text-lg'>
    {settings.components.initialOrderConfig.title}
   </h4>

   <AnimatedTabs
    tabs={tabs}
    activeTab={initialOrder}
    onTabChange={setInitialOrder}
    activeBgColor='bg-primary'
    activeTextColor='text-white'
    inactiveTextColor='text-gray-700 dark:text-gray-400'
    inactiveBgColor='bg-gray-200 dark:bg-gray-400'
   />

   <p className=' text-sm text-muted-foreground'>
    Initial order type: <strong>{initialOrder}</strong>
   </p>
  </div>
 );
}
