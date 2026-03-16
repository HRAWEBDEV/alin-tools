'use client';
import { ReactNode, useState } from 'react';
import { SettingsContext, type Settings, ActiveView } from './settingsContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { useRoomDevisionShareDictionary } from '../../share-dictionary/roomDevisionShareDictionaryContext';
import { RiSettings4Fill } from 'react-icons/ri';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { getModeIcon } from '@/app/[lang]/(app)/utils/getModeIcons';
import { useTheme } from 'next-themes';
import { AppModes } from '@/theme/appModes';
import { appVersion } from '@/services/base-config/baseConfigContext';

export default function SettingsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const { theme } = useTheme();

 const [isOpen, setIsOpen] = useState(false);
 const [activeView, setActiveView] = useState<ActiveView | null>(null);

 const {} = useRoomDevisionShareDictionary();

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
    {/*<li>
     <Button
      variant='ghost'
      size={'icon-lg'}
      className='text-base p-4 px-8 w-full justify-start h-[unset] gap-4 items-center text-orange-600 hover:text-orange-500 hover:bg-orange-600/10 transition-colors'
      onClick={() => setActiveView('salonsConfig')}
     >
      <DinnerIcon className='size-8' />
      <span>{settings.buttons.salonsConfig}</span>
     </Button>
    </li>*/}
   </motion.ul>
  );
 }

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
     ></DrawerContent>
    </AnimatePresence>
   </Drawer>
  </SettingsContext.Provider>
 );
}
