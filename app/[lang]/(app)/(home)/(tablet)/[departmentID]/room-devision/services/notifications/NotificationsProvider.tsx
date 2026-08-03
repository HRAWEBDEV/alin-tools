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
 DrawerClose,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { useRoomDevisionShareDictionary } from '../share-dictionary/roomDevisionShareDictionaryContext';
import { ChevronsUpDown } from 'lucide-react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import {
 getEventBoardInitialApi,
 getInitialData,
} from './services/notificationApiActions';
import { Field, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';

export default function NotificationsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const { localeInfo } = useBaseConfig();
 const {
  roomDevisionShareDictionary: {
   components: { notifications: notificationsDic },
  },
 } = useRoomDevisionShareDictionary();
 const [isOpen, setIsOpen] = useState(false);
 function handleToggleNotifications(open?: boolean) {
  setIsOpen((pre) => (open === undefined ? !pre : open));
 }

 const {
  data: initialData,
  isLoading: isLoadingInitialData,
  isSuccess: isSuccessInitialData,
  isError: isErrorInitialData,
 } = useQuery({
  queryKey: [getEventBoardInitialApi],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 const ctx: NotificationContext = {
  isOpen,
  toggleProfile: handleToggleNotifications,
  initialData: {
   data: initialData,
   isLoading: isLoadingInitialData,
   isSuccess: isSuccessInitialData,
   isError: isErrorInitialData,
  },
 };
 // get init data

 return (
  <notificationContext.Provider value={ctx}>
   {children}
   <Drawer
    direction={localeInfo.contentDirection === 'rtl' ? 'right' : 'left'}
    open={isOpen}
    onOpenChange={setIsOpen}
   >
    <DrawerContent className='w-[min(80%,35rem)] overflow-hidden'>
     <DrawerHeader className='border-b border-border'>
      <DrawerTitle className='text-start text-lg'>
       {notificationsDic.title}
      </DrawerTitle>
     </DrawerHeader>
     <div className='grow flex flex-col overflow-hidden'>
      <div className='flex justify-end bg-background p-2 sticky top-0 gap-2 items-center'>
       <div className='grow grid grid-cols-2 gap-2'>
        <Field>
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            id='program'
            variant='outline'
            role='combobox'
            className='justify-between h-11'
           >
            <span>{}</span>
            <ChevronsUpDown />
           </Button>
          </DrawerTrigger>
          <DrawerContent className='h-[min(80svh,35rem)]'>
           <DrawerHeader>
            <DrawerTitle className='text-xl'>
             {notificationsDic.filters.program}
            </DrawerTitle>
           </DrawerHeader>
           <div>
            {initialData?.prpgrams.length ? (
             <ul>
              {initialData.prpgrams.map((item) => (
               <DrawerClose asChild key={item.key}>
                <li
                 className='flex gap-1 items-center ps-6 py-2'
                 onClick={() => {
                  // field.onChange(item);
                 }}
                >
                 <Checkbox
                  className='size-6'
                  // checked={field.value?.value === item.value}
                 />
                 <Button
                  tabIndex={-1}
                  variant='ghost'
                  className='w-full justify-start h-auto text-lg'
                 >
                  <span>{item.value}</span>
                 </Button>
                </li>
               </DrawerClose>
              ))}
             </ul>
            ) : (
             <div className='text-center font-medium'></div>
            )}
           </div>
          </DrawerContent>
         </Drawer>
        </Field>
       </div>

       <Button size='lg'>
        <FaPlus />
       </Button>
      </div>
      <div className='grow overflow-auto'></div>
      <div className='sticky bottom-0'>
       <DrawerClose asChild>
        <Button
         variant='outline'
         className='w-full rounded-none h-11'
         size='lg'
        >
         {notificationsDic.close}
        </Button>
       </DrawerClose>
      </div>
     </div>
    </DrawerContent>
   </Drawer>
  </notificationContext.Provider>
 );
}
