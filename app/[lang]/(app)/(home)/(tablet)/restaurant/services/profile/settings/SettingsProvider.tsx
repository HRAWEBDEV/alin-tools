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
import { RiSettings4Fill } from 'react-icons/ri';
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
 displayModeOptions,
 getStorageSalonsConfig,
 setStorageSalonsConfig,
} from './utils/SalonsConfigSetting';
import DinnerIcon from '@/app/[lang]/(app)/components/icons/DinnerIcon';
import CloseButton from './components/CloseButton';
import { getModeIcon } from '@/app/[lang]/(app)/utils/getModeIcons';
import { useTheme } from 'next-themes';
import { AppModes } from '@/theme/appModes';
import { appVersion } from '@/services/base-config/baseConfigContext';

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

 const [tempDisplayMode, setTempDisplayMode] = useState(() => {
  if (typeof window !== 'undefined') {
   return getStorageSalonsConfig();
  }
  return defaultStorageSalonsConfig;
 });

 const { theme } = useTheme();

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
  setTempDisplayMode(newConfig);
 }

 function toggleIsOpen() {
  setIsOpen(!isOpen);
 }

 function handleToggleDisplayMode(type: (typeof displayModeOptions)[number]) {
  setTempDisplayMode((prev) => ({ ...prev, displayMode: type }));
 }
 function handleToggleBoldStyle(boldStyle: SalonsConfig['boldStyle']) {
  setTempDisplayMode((prev) => ({ ...prev, boldStyle }));
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
  tempDisplayMode,
  handleToggleDisplayMode,
  handleToggleBoldStyle,
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
      {getModeIcon(theme as AppModes, { className: 'size-8' })}
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
      <DishIcon className='size-8' />
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
      <DinnerIcon className='size-8' />
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
     <DrawerHeader className='px-0 relative border-b border-input'>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-8'>
       <RiSettings4Fill className='text-gray-400 size-12' />
       <div>
        {title} <span className='text-sm'>(v{appVersion})</span>
       </div>
      </DrawerTitle>
     </DrawerHeader>
    );

   case 'themeToggler':
    return (
     <DrawerHeader className='px-2 flex-row items-center justify-between relative border-b border-input'>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        {getModeIcon(theme as AppModes, { className: 'size-12 text-pink-600' })}
        <RiSettings4Fill className='text-pink-400 size-6 absolute -left-1 -bottom-2 ' />
       </div>
       {title}
      </DrawerTitle>
      <div className='flex items-center justify-center gap-2'>
       <BackBtn className='border-pink-600/80 hover:border-pink-600 dark:border-pink-600 text-pink-600 hover:text-pink-700' />
       <CloseButton className='border-pink-600/80 hover:border-pink-600 text-pink-600 hover:text-pink-800 ' />
      </div>
     </DrawerHeader>
    );

   case 'orderConfig':
    return (
     <DrawerHeader className='px-0 flex-row items-center justify-between relative border-b border-input'>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <DishIcon className='text-primary size-12' />
        <RiSettings4Fill className='text-primary size-6 absolute -left-1.5 -bottom-1.5' />
       </div>
       {title}
      </DrawerTitle>
      <div className='flex items-center justify-center gap-2'>
       <BackBtn className='text-primary/80  hover:text-primary dark:border-primary border-primary' />
       <CloseButton className='text-primary/80  hover:text-primary dark:border-primary border-primary' />
      </div>
     </DrawerHeader>
    );
   case 'salonsConfig':
    return (
     <DrawerHeader className='px-2 flex-row items-center justify-between relative border-b border-input'>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <DinnerIcon className='text-orange-600 hover:text-orange-500 size-12' />
        <RiSettings4Fill className='text-orange-600 size-6 absolute -left-1.5 -bottom-1.5' />
       </div>
       {title}
      </DrawerTitle>
      <div className='flex items-center justify-center gap-2'>
       <BackBtn className='border-orange-600 hover:border-orange-500 dark:border-orange-500 text-orange-600 hover:text-orange-700' />
       <CloseButton className='border-orange-600 hover:border-orange-500 dark:border-orange-500 text-orange-600 hover:text-orange-700' />
      </div>
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
