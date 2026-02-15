'use client';

import React, { useState } from 'react';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';
import { motion } from 'motion/react';

const STORAGE_KEY = 'initialOrderConfig';

export default function InitialOrderConfigView() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 const activeValue = settings.components.initialOrderConfig.tabs.active;
 const inactiveValue = settings.components.initialOrderConfig.tabs.inactive;

 const [initialOrderConfig, setInitialOrderConfig] = useState(() => {
  if (typeof window !== 'undefined') {
   const stored = localStorage.getItem(STORAGE_KEY);
   return stored === 'active' ? activeValue : inactiveValue;
  }
  return inactiveValue;
 });

 const handleTabChange = (value: string) => {
  setInitialOrderConfig(value);

  if (typeof window !== 'undefined') {
   if (value === activeValue) {
    localStorage.setItem(STORAGE_KEY, 'active');
   } else {
    localStorage.setItem(STORAGE_KEY, 'inactive');
   }
  }
 };

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
  <motion.div
   initial={{ y: 300, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   exit={{ y: 300, opacity: 0 }}
   transition={{ duration: 0.3 }}
   className='flex flex-col justify-start gap-4 px-8 mt-4'
  >
   <h4 className='font-medium text-lg'>
    {settings.components.initialOrderConfig.title}
   </h4>

   <AnimatedTabs
    tabs={tabs}
    activeTab={initialOrderConfig}
    onTabChange={handleTabChange}
    activeBgColor='bg-primary'
    activeTextColor='text-white'
    inactiveTextColor='text-gray-700 dark:text-gray-400'
    inactiveBgColor='bg-gray-200 dark:bg-gray-400'
   />

   <p className='text-sm text-muted-foreground'>
    Initial order type: <strong>{initialOrderConfig}</strong>
   </p>
  </motion.div>
 );
}
