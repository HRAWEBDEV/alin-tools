import { Fragment } from 'react';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { ChevronsUpDown } from 'lucide-react';
import { Field } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { useRoomDevisionShareDictionary } from '../../share-dictionary/roomDevisionShareDictionaryContext';
import { useNotificationContext } from '../notificationsContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Spinner } from '@/components/ui/spinner';
import NotificationItem from './NotificationItem';

export default function NotificationsWrapper() {
 const { initialData, eventBoards } = useNotificationContext();
 const {
  roomDevisionShareDictionary: {
   components: { notifications: notificationsDic },
  },
 } = useRoomDevisionShareDictionary();

 return (
  <div className='grow flex flex-col overflow-hidden'>
   {eventBoards.isFetching && <LinearLoading />}
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
         {initialData.data?.prpgrams.length ? (
          <ul>
           {initialData.data.prpgrams.map((item) => (
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
         {initialData.data?.prpgrams.length ? (
          <ul>
           {initialData.data.prpgrams.map((item) => (
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
   <div className='grow overflow-auto px-2 py-3'>
    {eventBoards.isSuccess && !eventBoards.data?.pages.length ? (
     <NoItemFound />
    ) : (
     <>
      <div className='grid gap-3 content-start'>
       {eventBoards.data?.pages.map((group, i) => (
        <Fragment key={i}>
         {group.rowsCount === 0 ? (
          <div>
           <NoItemFound />
          </div>
         ) : (
          group.rows.map((event) => (
           <NotificationItem key={event.id} event={event} />
          ))
         )}
        </Fragment>
       ))}
      </div>
      {eventBoards.hasNextPage && (
       <div className='py-4 text-center'>
        <Button
         size='lg'
         disabled={eventBoards.isFetching}
         onClick={() => eventBoards.fetchNextPage()}
        >
         {eventBoards.isFetching && <Spinner />}
         {notificationsDic.loadMore}
        </Button>
       </div>
      )}
     </>
    )}
   </div>
   <div className='sticky bottom-0'>
    <DrawerClose asChild>
     <Button variant='outline' className='w-full rounded-none h-11' size='lg'>
      {notificationsDic.close}
     </Button>
    </DrawerClose>
   </div>
  </div>
 );
}
