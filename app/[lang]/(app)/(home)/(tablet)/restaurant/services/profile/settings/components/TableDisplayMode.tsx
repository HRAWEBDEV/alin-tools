import { useState } from 'react';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';
import { motion } from 'motion/react';
import SalonTableDemoShowcase from './SalonTableModeShowcase';

const TABLE_VIEW_MODE_KEY = 'tablesDisplayMode';
export default function TableDisplayMode() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 const normalMode = settings.components.tablesDisplayMode.normalMode;
 const minimalMode = settings.components.tablesDisplayMode.minimalMode;
 const normalModeDescription =
  settings.components.tablesDisplayMode.normalModeDescription;
 const minimalModeDescription =
  settings.components.tablesDisplayMode.minimalModeDescription;

 const tabs = [
  {
   value: normalMode,
   label: normalMode,
  },
  {
   value: minimalMode,
   label: minimalMode,
  },
 ];

 const [activeTab, setActiveTab] = useState(() => {
  if (typeof window !== 'undefined') {
   const stored = localStorage.getItem(TABLE_VIEW_MODE_KEY);
   return stored === 'minimal' ? minimalMode : normalMode;
  }
  return normalMode;
 });
 const [activeTabDescription, setActiveTabDescription] = useState(() => {
  if (typeof window !== 'undefined') {
   const stored = localStorage.getItem(TABLE_VIEW_MODE_KEY);
   return stored === 'minimal' ? minimalModeDescription : normalModeDescription;
  }
  return normalModeDescription;
 });

 const handleModeChange = (value: string) => {
  setActiveTab(value);
  if (typeof window !== 'undefined') {
   if (value === normalMode) {
    setActiveTabDescription(normalModeDescription);
    localStorage.setItem(TABLE_VIEW_MODE_KEY, 'normalMode');
   } else {
    setActiveTabDescription(minimalModeDescription);
    localStorage.setItem(TABLE_VIEW_MODE_KEY, 'minimalMode');
   }
  }
 };
 return (
  <motion.div
   initial={{ y: 100, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   exit={{ y: 100, opacity: 0 }}
   transition={{ duration: 0.3 }}
   className='flex flex-col justify-start gap-6 sm:px-4 px-0 mt-4 overflow-y-auto overflow-x-hidden'
  >
   <h4 className='text-xl font-medium text-right'>
    {settings.components.tablesDisplayMode.title}
   </h4>

   <AnimatedTabs
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={handleModeChange}
    activeBgColor='bg-primary'
    activeTextColor='text-white'
    inactiveTextColor='text-gray-700 dark:text-gray-400'
    inactiveBgColor='bg-gray-200 dark:bg-gray-400'
   />
   <SalonTableDemoShowcase />
  </motion.div>
 );
}
