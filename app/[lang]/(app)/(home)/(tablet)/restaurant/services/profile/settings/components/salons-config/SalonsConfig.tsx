import { useRestaurantShareDictionary } from '../../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';
import { motion } from 'motion/react';
import SalonTableDemoShowcase from './SalonTableModeShowcase';
import { useSettingsContext } from '../../settingsContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { displayModeOptions } from '../../utils/SalonsConfigSetting';

export default function SalonsConfig() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 const {
  salonsConfigSetup: { salonsConfig, onChangeSalonsConfig },
 } = useSettingsContext();

 const salonsDisplayOptions = displayModeOptions.map((item) => {
  return {
   key: item,
   value: settings.components.tablesDisplayMode[`${item}Mode`],
  };
 });

 const salonDisplayActiveOption = salonsDisplayOptions.find(
  (option) => option.key === salonsConfig.displayMode,
 );

 return (
  <motion.div
   initial={{ y: 100, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   exit={{ y: 100, opacity: 0 }}
   transition={{ duration: 0.3 }}
   className='flex flex-col justify-start gap-6 px-0 mt-4 overflow-y-auto overflow-x-hidden'
  >
   <div className='flex items-center flex-wrap gap-4 px-6'>
    <h4 className='text-xl text-right '>
     {settings.components.tablesDisplayMode.title}:
    </h4>

    <AnimatedTabs
     className='basis-[20rem]'
     tabs={salonsDisplayOptions}
     activeTab={salonDisplayActiveOption}
     onTabChange={(newOption) => {
      onChangeSalonsConfig('displayMode', newOption.key);
     }}
     getTabId={(op) => op.key}
     getTabLabel={(op) => op.value}
     activeBgColor='bg-orange-600'
     activeTextColor='text-white'
     inactiveTextColor='text-gray-700 dark:text-gray-400'
     inactiveBgColor='bg-gray-200 dark:bg-gray-600'
    />
   </div>

   <div className='flex items-center justify-between px-6'>
    <div className='flex items-center gap-4'>
     <Switch
      id='bold-mode-switch'
      checked={salonsConfig.boldStyle}
      onCheckedChange={(newValue) =>
       onChangeSalonsConfig('boldStyle', newValue)
      }
      dir='ltr'
      className='cursor-pointer'
     />
     <Label htmlFor='bold-mode-switch' className='text-lg'>
      {settings.components.tablesDisplayMode.boldStyle}
     </Label>
    </div>
   </div>

   <SalonTableDemoShowcase
    mode={salonsConfig.displayMode}
    isBold={salonsConfig.boldStyle}
   />
   {/*<p className='w-fit p-6 sm:mt-8 mt-4 mb-4 mx-auto font-medium rounded-2xl bg-orange-600/10 text-orange-950'>
    {activeTabDescription}
   </p>*/}
  </motion.div>
 );
}
