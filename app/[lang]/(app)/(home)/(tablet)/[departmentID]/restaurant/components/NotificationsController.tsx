'use client';
import { IoIosNotifications } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationContext } from '../services/notifications/notificationsContext';

function NotificationsController() {
 const { toggleProfile } = useNotificationContext();
 return (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='relative rounded-full size-11 bg-transparent text-neutral-600 dark:text-neutral-400'
   onClick={() => toggleProfile(true)}
  >
   <div className='absolute -top-1 -end-2'>
    <Badge variant='destructive' className='p-1 size-6'>
     {2}
    </Badge>
   </div>
   <IoIosNotifications className='size-6' />
  </Button>
 );
}

export { NotificationsController };
