'use client';
import { ReactNode, useState } from 'react';
import { SettingsContext, type Settings, ActiveView } from './settingsContext';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useRoomDevisionShareDictionary } from '../../share-dictionary/roomDevisionShareDictionaryContext';
import { AnimatePresence } from 'motion/react';

export default function SettingsProvider({
 children,
}: {
 children: ReactNode;
}) {
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
