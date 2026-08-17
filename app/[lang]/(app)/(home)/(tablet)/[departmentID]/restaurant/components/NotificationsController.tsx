'use client';
import { IoIosNotifications } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationContext } from '../../room-devision/services/notifications/notificationsContext';

function NotificationsController() {
 const { toggleProfile, eventBoards } = useNotificationContext();
 let badgeContent = '';
 if (!!eventBoards.data?.pages[0].rowsCount) {
  if (eventBoards.data?.pages[0].rowsCount > 99) {
   badgeContent = '99+';
  } else {
   badgeContent = eventBoards.data?.pages[0].rowsCount.toString();
  }
 }
 return (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='relative rounded-full size-11 bg-transparent text-neutral-600 dark:text-neutral-400'
   onClick={() => toggleProfile(true)}
  >
   {badgeContent && (
    <div className='absolute -top-1 -end-2'>
     <Badge variant='destructive' className='p-1 size-6'>
      {badgeContent}
     </Badge>
    </div>
   )}
   <IoIosNotifications className='size-6' />
  </Button>
 );
}

export { NotificationsController };
