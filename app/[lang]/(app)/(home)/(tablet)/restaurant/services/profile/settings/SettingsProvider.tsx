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
 RiKeyboardFill,
 RiPaintFill,
} from 'react-icons/ri';
import SpinnerLoading from './components/SpinnerLoading';

const views: Record<ActiveView, React.ComponentType> = {
 'initial-order-config': dynamic(
  () => import('./components/InitialOrderConfig'),
  {
   loading: () => <SpinnerLoading />,
  },
 ),
 'tables-display-mode': dynamic(() => import('./components/TableDisplayMode'), {
  loading: () => <SpinnerLoading />,
 }),
 'table-theme': dynamic(() => import('./components/TableTheme'), {
  loading: () => <SpinnerLoading />,
 }),
 'theme-toggler': dynamic(() => import('./components/AppThemeToggler'), {
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

 function toggleIsOpen() {
  setIsOpen(!isOpen);
 }
 const ctx: Settings = {
  isOpen,
  toggleIsOpen,
  activeView,
  setActiveView,
 };

 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 function optionsList() {
  return (
   <ul>
    <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base text-pink-600 hover:text-pink-500 hover:bg-pink-600/10 p-4 px-8 w-full justify-start h-[unset] gap-4 items-center  transition-colors'
      onClick={() => setActiveView('theme-toggler')}
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
      onClick={() => setActiveView('initial-order-config')}
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
      onClick={() => setActiveView('tables-display-mode')}
     >
      <RiKeyboardFill className='size-8' />
      <span>{settings.buttons.tablesDisplayMode}</span>
     </Button>
    </li>
    <li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-secondary hover:text-secondary/80 hover:bg-secondary/10 transition-colors'
      onClick={() => setActiveView('table-theme')}
     >
      <RiPaintFill className='size-8' />
      <span>{settings.buttons.tableTheme}</span>
     </Button>
    </li>
   </ul>
  );
 }
 const ActiveComponent = activeView ? views[activeView] : null;

 return (
  <SettingsContext.Provider value={ctx}>
   {children}

   <Drawer open={isOpen} onOpenChange={setIsOpen}>
    <DrawerContent className='p-4 [&_div.bg-muted]:bg-primary! min-h-[400px]'>
     <DrawerHeader className='text-right px-0'>
      <DrawerTitle className='dark:text-gray-300 text-gray-700 text-xl'>
       {settings.title}
      </DrawerTitle>
     </DrawerHeader>
     {ActiveComponent ? <ActiveComponent /> : optionsList()}
    </DrawerContent>
   </Drawer>
  </SettingsContext.Provider>
 );
}
