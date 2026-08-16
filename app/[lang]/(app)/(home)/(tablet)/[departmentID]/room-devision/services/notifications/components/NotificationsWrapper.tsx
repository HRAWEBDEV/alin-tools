import { Fragment, useState } from 'react';
import { DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { Field } from '@/components/ui/field';
import { useShareDictionary } from '@/app/[lang]/(app)/services/share-dictionary/shareDictionaryContext';
import { useNotificationContext } from '../notificationsContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Spinner } from '@/components/ui/spinner';
import NotificationItem from './NotificationItem';
import NewNotificationDialog from './NewNotificationDialog';
import { type EditNotifProps } from '../utils/editNotifProps';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';

export default function NotificationsWrapper() {
 const { eventBoards } = useNotificationContext();
 const [showNewNotif, setShowNewNotif] = useState(false);
 const [selectedNotfiId, setSelectedNotifId] = useState<number | null>(null);
 const {
  shareDictionary: {
   components: { notifications: notificationsDic },
  },
 } = useShareDictionary();

 const selectedNotif = selectedNotfiId
  ? eventBoards.data?.pages[0].rows.find((row) => row.id === selectedNotfiId) ||
    null
  : null;

 function handleShowEditNotif(id: number | null) {
  setShowNewNotif(true);
  setSelectedNotifId(id);
 }

 function handleCloseEditNotif() {
  setShowNewNotif(false);
  setSelectedNotifId(null);
 }

 const editNotif: EditNotifProps = {
  showNewNotif,
  selectedNotfiId,
  selectedNotif,
  onShowEditNotif: handleShowEditNotif,
  onCloseEditNotif: handleCloseEditNotif,
  onInvalidate: eventBoards.onInvalidateEventBoards,
 };

 return (
  <div className='grow flex flex-col overflow-hidden'>
   {eventBoards.isFetching && <LinearLoading />}
   <div className='flex justify-end bg-background p-2 sticky top-0 gap-2 items-center'>
    <div className='grow grid grid-cols-1 gap-2'>
     <Field>
      <InputGroup className='h-10'>
       <InputGroupInput disabled placeholder={notificationsDic.search} />
      </InputGroup>
     </Field>
    </div>
    <Button size='lg' onClick={() => editNotif.onShowEditNotif(null)}>
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
           <NotificationItem
            key={event.id}
            event={event}
            editEvent={editNotif}
           />
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
   <NewNotificationDialog
    open={showNewNotif}
    editEvent={editNotif}
    selectedId={selectedNotfiId}
   />
  </div>
 );
}
