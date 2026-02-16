'use client';

import React, { useState } from 'react';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';
import { motion } from 'motion/react';
import { RiQuestionLine } from 'react-icons/ri';

const STORAGE_KEY = 'initialOrderConfig';

export default function InitialOrderConfigView() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 const activeValue = settings.components.initialOrderConfig.tabs.active;
 const inactiveValue = settings.components.initialOrderConfig.tabs.inactive;
 const activeTabMessage =
  settings.components.initialOrderConfig.tabs.activeMessage;
 const inactiveTabMessage =
  settings.components.initialOrderConfig.tabs.inactiveMesage;
 const [initialOrderConfig, setInitialOrderConfig] = useState(() => {
  if (typeof window !== 'undefined') {
   const stored = localStorage.getItem(STORAGE_KEY);
   return stored === 'active' ? activeValue : inactiveValue;
  }
  return inactiveValue;
 });
 const [tabGuideMessage, setTabGuideMessage] = useState(() => {
  if (typeof window !== 'undefined') {
   const stored = localStorage.getItem(STORAGE_KEY);
   return stored === 'active' ? activeTabMessage : inactiveTabMessage;
  }
  return inactiveTabMessage;
 });

 const handleTabChange = (value: string) => {
  setInitialOrderConfig(value);
  if (typeof window !== 'undefined') {
   if (value === activeValue) {
    setTabGuideMessage(activeTabMessage);
    localStorage.setItem(STORAGE_KEY, 'active');
   } else {
    setTabGuideMessage(inactiveTabMessage);
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
   initial={{ y: -200, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   exit={{ y: -200, opacity: 0 }}
   transition={{ duration: 0.3 }}
   className='flex flex-col justify-start gap-6 sm:px-4 px-0 mt-4'
  >
   <h4 className='font-medium sm:text-lg text-sm'>
    {settings.components.tablesDisplayMode.title}
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

   <p className='flex sm:flex-row flex-col sm:items-center items-start justify-start gap-2'>
    <RiQuestionLine className='sm:size-6 size-5 text-primary' />
    <strong className='sm:text-base text-xs text-destructive '>
     {tabGuideMessage}
    </strong>
   </p>
  </motion.div>
 );
}
