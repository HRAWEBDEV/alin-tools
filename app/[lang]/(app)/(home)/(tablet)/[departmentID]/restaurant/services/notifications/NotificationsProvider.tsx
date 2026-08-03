'use client';
import { useState, ReactNode } from 'react';
import {
 type NotificationContext,
 notificationContext,
} from './notificationsContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { useRestaurantShareDictionary } from '../share-dictionary/restaurantShareDictionaryContext';

export default function NotificationsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const {
  restaurantShareDictionary: {
   components: { notifications: notificationsDic },
  },
 } = useRestaurantShareDictionary();
 const [isOpen, setIsOpen] = useState(false);
 function handleToggleNotifications(open?: boolean) {
  setIsOpen((pre) => (open === undefined ? !pre : open));
 }

 const ctx: NotificationContext = {
  isOpen,
  toggleProfile: handleToggleNotifications,
 };

 return (
  <notificationContext.Provider value={ctx}>
   {children}
   <Drawer open={isOpen} onOpenChange={setIsOpen}>
    <DrawerContent className='h-[min(80svh,35rem)]'>
     <DrawerHeader className='hidden'>
      <DrawerTitle>{notificationsDic.title}</DrawerTitle>
     </DrawerHeader>
     <div>test</div>
    </DrawerContent>
   </Drawer>
  </notificationContext.Provider>
 );
}
