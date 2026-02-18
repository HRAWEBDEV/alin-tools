import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { AnimatedTabs } from '@/app/[lang]/(app)/components/AnimatedTabs';
import { motion } from 'motion/react';
import SalonTableDemoShowcase from './SalonTableModeShowcase';
import {
 useTablePreferences,
 TABLE_DISPLAY_MODES,
} from '@/app/[lang]/(app)/(home)/(tablet)/restaurant/hooks/useTablePreferences';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function TableDisplayMode() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 const { displayMode, isBold, setDisplayMode, setBoldStyle } =
  useTablePreferences();

 const normalMode = settings.components.tablesDisplayMode.normalMode;
 const minimalMode = settings.components.tablesDisplayMode.minimalMode;
 const normalModeDescription =
  settings.components.tablesDisplayMode.normalModeDescription;
 const minimalModeDescription =
  settings.components.tablesDisplayMode.minimalModeDescription;

 const tabs = [
  {
   value: TABLE_DISPLAY_MODES.NORMAL,
   label: normalMode,
  },
  {
   value: TABLE_DISPLAY_MODES.MINIMAL,
   label: minimalMode,
  },
 ];

 const activeTabDescription =
  displayMode === TABLE_DISPLAY_MODES.MINIMAL
   ? minimalModeDescription
   : normalModeDescription;

 return (
  <motion.div
   initial={{ y: 100, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   exit={{ y: 100, opacity: 0 }}
   transition={{ duration: 0.3 }}
   className='flex flex-col justify-start gap-6 px-0 mt-4 overflow-y-auto overflow-x-hidden'
  >
   <div className='flex items-center justify-between sm:flex-row flex-col flex-1 gap-8 px-6'>
    <h4 className='text-xl text-right '>
     {settings.components.tablesDisplayMode.title}
    </h4>

    <AnimatedTabs
     className='flex-1 w-full sm:max-w-[40%]'
     tabs={tabs}
     activeTab={displayMode as string}
     onTabChange={setDisplayMode}
     activeBgColor='bg-orange-600'
     activeTextColor='text-white'
     inactiveTextColor='text-gray-700 dark:text-gray-400'
     inactiveBgColor='bg-gray-200 dark:bg-gray-400'
    />
   </div>

   <div className='flex items-center justify-between px-6'>
    <div className='flex items-center gap-4'>
     <Switch
      id='bold-mode-switch'
      checked={isBold}
      onCheckedChange={setBoldStyle}
      dir='ltr'
      className='cursor-pointer'
     />
     <Label htmlFor='bold-mode-switch' className='text-lg'>
      {settings.components.tablesDisplayMode.boldStyle}
     </Label>
    </div>
   </div>

   <SalonTableDemoShowcase
    mode={displayMode === TABLE_DISPLAY_MODES.MINIMAL ? 'minimal' : 'normal'}
    isBold={isBold}
   />
   <p className='w-fit p-6 sm:mt-8 mt-4 mb-4 mx-auto font-medium rounded-2xl bg-orange-600/10 text-orange-950'>
    {activeTabDescription}
   </p>
  </motion.div>
 );
}
