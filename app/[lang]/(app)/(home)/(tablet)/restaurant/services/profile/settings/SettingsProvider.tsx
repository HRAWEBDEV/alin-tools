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

const views: Record<ActiveView, React.ComponentType> = {
 initialOrderConfig: dynamic(() => import('./components/InitialOrderConfig'), {
  loading: () => <SpinnerLoading />,
 }),
 tablesDisplayMode: dynamic(() => import('./components/TableDisplayMode'), {
  loading: () => <SpinnerLoading />,
 }),
 tableTheme: dynamic(() => import('./components/TableTheme'), {
  loading: () => <SpinnerLoading />,
 }),
 themeToggler: dynamic(() => import('./components/AppThemeToggler'), {
  loading: () => <SpinnerLoading />,
 }),
};

export default function SettingsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [isOpen, setIsOpen] = useState(false);
 const [activeView, setActiveView] = useState<ActiveView | null>(null);

 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 function toggleIsOpen() {
  setIsOpen(!isOpen);
 }
 const ctx: Settings = {
  isOpen,
  toggleIsOpen,
  activeView,
  setActiveView,
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
      onClick={() => setActiveView('initialOrderConfig')}
     >
      <RiListSettingsFill className='size-8' />
      <span>{settings.buttons.initialOrderConfig}</span>
     </Button>
    </li>
    <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-orange-600 hover:text-orange-500 hover:bg-orange-600/10 transition-colors'
      onClick={() => setActiveView('tablesDisplayMode')}
     >
      <DishIcon className='size-8' />
      <span>{settings.buttons.tablesDisplayMode}</span>
     </Button>
    </li>
    {/* <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-secondary hover:text-secondary/80 hover:bg-secondary/10 transition-colors'
      onClick={() => setActiveView('tableTheme')}
     >
      <RiPaintFill className='size-8' />
      <span>{settings.buttons.tableTheme}</span>
     </Button>
    </li> */}
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
      <BackBtn bgClasses='bg-pink-600/80 hover:bg-pink-600' />
     </DrawerHeader>
    );

   case 'initialOrderConfig':
    return (
     <DrawerHeader className='px-0 flex-row items-center justify-between relative border-b border-b-gray-400 dark:border-b-gray-300 '>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <RiMenu3Fill className='text-primary size-12' />
        <RiSettings4Fill className='text-gray-500 dark:text-gray-400 size-6 absolute -left-[5px] bottom-[11px] ' />
       </div>
       {title}
      </DrawerTitle>
      <BackBtn />
     </DrawerHeader>
    );
   case 'tablesDisplayMode':
    return (
     <DrawerHeader className='px-2 flex-row items-center justify-between relative border-b border-b-gray-400 dark:border-b-gray-300 '>
      <DrawerTitle className='dark:text-gray-300 text-gray-600 sm:text-xl text-md flex items-center justify-start gap-4 px-0'>
       <div className='relative'>
        <DishIcon className='text-orange-600 hover:text-orange-500 size-12' />
        <RiSettings4Fill className='text-gray-500 dark:text-gray-400 size-6 absolute -left-1.5 -bottom-1.5 ' />
       </div>
       {title}
      </DrawerTitle>
      <BackBtn bgClasses='bg-orange-600 hover:bg-orange-500' />
     </DrawerHeader>
    );
  }
 }
 const activeTitle = activeView ? settings.buttons[activeView] : settings.title;
 const ActiveComponent = activeView ? views[activeView] : null;

 return (
  <SettingsContext.Provider value={ctx}>
   {children}

   <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
