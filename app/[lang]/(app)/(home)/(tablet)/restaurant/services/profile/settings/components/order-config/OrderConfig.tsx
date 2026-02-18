'use client';
import { useRestaurantShareDictionary } from '../../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';
import { motion } from 'motion/react';
import { getInitInfoOptions } from '../../utils/OrderConfigSetting';
import { useSettingsContext } from '../../settingsContext';

export default function OrderConfig() {
 const {
  orderConfigSetup: { orderConfig, onChangeOrderConfig },
 } = useSettingsContext();
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 const orderGetInfoOptions = getInitInfoOptions.map((item) => {
  return {
   key: item,
   value: settings.components.initialOrderConfig.tabs[item],
  };
 });

 const orderInfoActiveOption = orderGetInfoOptions.find(
  (option) => option.key === orderConfig.getInitInfo,
 );

 return (
  <motion.div
   initial={{ y: -200, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   exit={{ y: -200, opacity: 0 }}
   transition={{ duration: 0.3 }}
   className='flex flex-col justify-start gap-6  px-0 mt-8'
  >
   <div className='flex flex-wrap items-center flex-1 gap-4'>
    <h4 className='text-lg'>{settings.components.initialOrderConfig.title}</h4>
    <AnimatedTabs
     className='basis-[20rem]'
     tabs={orderGetInfoOptions}
     activeTab={orderInfoActiveOption}
     onTabChange={(tab) => {
      onChangeOrderConfig('getInitInfo', tab.key);
     }}
     getTabId={(tab) => tab.key}
     getTabLabel={(tab) => tab.value}
     activeBgColor='bg-primary'
     activeTextColor='text-white'
     inactiveTextColor='text-gray-700 dark:text-gray-400'
     inactiveBgColor='bg-gray-200 dark:bg-gray-600'
    />
   </div>
  </motion.div>
 );
}
