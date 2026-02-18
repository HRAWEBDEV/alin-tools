'use client';
import { ReactNode, useState } from 'react';
import { SettingsContext, type Settings, ActiveView } from './settingsContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import dynamic from 'next/dynamic';
import { useRestaurantShareDictionary } from '../../share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';
import {
 RiSunLine,
 RiListSettingsFill,
 RiSettings4Fill,
 RiMenu3Fill,
} from 'react-icons/ri';
import SpinnerLoading from './components/SpinnerLoading';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import BackBtn from './components/BackBtn';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import {
 type OrderConfig,
 defaultStorageOrderConfig,
 getStorageOrderConfig,
 setStorageOrderConfig,
} from './utils/OrderConfigSetting';
import {
 type SalonsConfig,
 defaultStorageSalonsConfig,
 getStorageSalonsConfig,
 setStorageSalonsConfig,
} from './utils/SalonsConfigSetting';

const views: Record<ActiveView, React.ComponentType> = {
 orderConfig: dynamic(() => import('./components/order-config/OrderConfig'), {
  loading: () => <SpinnerLoading />,
 }),
 salonsConfig: dynamic(
  () => import('./components/salons-config/SalonsConfig'),
  {
   loading: () => <SpinnerLoading />,
  },
 ),
 themeToggler: dynamic(() => import('./components/AppThemeToggler'), {
  loading: () => <SpinnerLoading />,
 }),
};

export default function SettingsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [orderConfig, setOrderConfig] = useState(() => {
  if (typeof window !== 'undefined') {
   return getStorageOrderConfig();
  }
  return defaultStorageOrderConfig;
 });

 const [salonsConfig, setSalonsConfig] = useState(() => {
  if (typeof window !== 'undefined') {
   return getStorageSalonsConfig();
  }
  return defaultStorageSalonsConfig;
 });

 const [isOpen, setIsOpen] = useState(false);
 const [activeView, setActiveView] = useState<ActiveView | null>(null);

 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 function handleChangeOrderConfig<T extends keyof OrderConfig>(
  key: T,
  value: OrderConfig[T],
 ) {
  const newConfig = {
   ...orderConfig,
   [key]: value,
  };
  setOrderConfig(newConfig);
  setStorageOrderConfig(newConfig);
 }

 function handleChangeSalonsConfig<T extends keyof SalonsConfig>(
  key: T,
  value: SalonsConfig[T],
 ) {
  const newConfig = {
   ...salonsConfig,
   [key]: value,
  };
  setSalonsConfig(newConfig);
  setStorageSalonsConfig(newConfig);
 }

 function toggleIsOpen() {
  setIsOpen(!isOpen);
 }

 const ctx: Settings = {
  isOpen,
  toggleIsOpen,
  activeView,
  setActiveView,
  orderConfigSetup: {
   orderConfig,
   onChangeOrderConfig: handleChangeOrderConfig,
  },
  salonsConfigSetup: {
   salonsConfig,
   onChangeSalonsConfig: handleChangeSalonsConfig,
  },
 };

 function optionsList() {
  return (
   <motion.ul
    initial={{ x: 200, y: 10, opacity: 0 }}
    animate={{ x: 0, y: 0, opacity: 1 }}
    exit={{ x: 200, y: 10, opacity: 0 }}
    transition={{ duration: 0.3 }}
   >
    <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base text-pink-600 hover:text-pink-500 hover:bg-pink-600/10 p-4 px-8 w-full justify-start h-[unset] gap-4 items-center  transition-colors'
      onClick={() => setActiveView('themeToggler')}
     >
      <RiSunLine className='size-8' />
      <span>{settings.buttons.themeToggler}</span>
     </Button>
    </li>
    <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors'
      onClick={() => setActiveView('orderConfig')}
     >
      <RiListSettingsFill className='size-8' />
      <span>{settings.buttons.orderConfig}</span>
     </Button>
    </li>
    <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-orange-600 hover:text-orange-500 hover:bg-orange-600/10 transition-colors'
      onClick={() => setActiveView('salonsConfig')}
     >
      <DishIcon className='size-8' />
      <span>{settings.buttons.salonsConfig}</span>
     </Button>
    </li>
   </motion.ul>
  );
 }

 function getActiveHeader(title: string) {
  switch (activeView) {
   default:
    return (
     <DrawerHeader className='px-0 relative border-b border-b-gray-400 dark:border-b-gray-300 '>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-8'>
       <RiSettings4Fill className='text-gray-400 size-12' />
       {title}
      </DrawerTitle>
     </DrawerHeader>
    );

   case 'themeToggler':
    return (
     <DrawerHeader className='px-2 flex-row items-center justify-between relative border-b border-b-gray-400 dark:border-b-gray-300 '>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <RiSunLine className='text-pink-600 size-12' />
        <RiSettings4Fill className='text-gray-500 dark:text-gray-400 size-6 absolute left-0 -bottom-1.5 ' />
       </div>
       {title}
      </DrawerTitle>
      <BackBtn className='border-pink-600/80 hover:border-pink-600 text-pink-600 hover:text-pink-800' />
     </DrawerHeader>
    );

   case 'orderConfig':
    return (
     <DrawerHeader className='px-0 flex-row items-center justify-between relative border-b border-b-gray-400 dark:border-b-gray-300 '>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <RiMenu3Fill className='text-primary size-12' />
        <RiSettings4Fill className='text-gray-500 dark:text-gray-400 size-6 absolute -left-[5px] bottom-[11px] ' />
       </div>
       {title}
      </DrawerTitle>
      <BackBtn className='text-primary/80  hover:text-primary dark:border-primary' />
     </DrawerHeader>
    );
   case 'salonsConfig':
    return (
     <DrawerHeader className='px-2 flex-row items-center justify-between relative border-b border-b-gray-400 dark:border-b-gray-300 '>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <DishIcon className='text-orange-600 hover:text-orange-500 size-12' />
        <RiSettings4Fill className='text-gray-500 dark:text-gray-400 size-6 absolute -left-1.5 -bottom-1.5 ' />
       </div>
       {title}
      </DrawerTitle>
      <BackBtn className='border-orange-600 hover:border-orange-500 dark:border-orange-500 text-orange-600 hover:text-orange-700' />
     </DrawerHeader>
    );
  }
 }
 const activeTitle = activeView ? settings.buttons[activeView] : settings.title;
 const ActiveComponent = activeView ? views[activeView] : null;

 return (
  <SettingsContext.Provider value={ctx}>
   {children}

   <Drawer
    open={isOpen}
    onOpenChange={() => {
     setActiveView(null);
     setIsOpen(false);
    }}
   >
    <AnimatePresence mode='wait'>
     <DrawerContent
      className={`p-4 [&_div.bg-muted]:bg-primary!  ${activeView ? 'min-h-svh' : 'min-h-[400px]'} transition-all! ease-in-out! duration-300!`}
     >
      {getActiveHeader(activeTitle)}
      {ActiveComponent ? <ActiveComponent /> : optionsList()}
     </DrawerContent>
    </AnimatePresence>
   </Drawer>
  </SettingsContext.Provider>
 );
}
