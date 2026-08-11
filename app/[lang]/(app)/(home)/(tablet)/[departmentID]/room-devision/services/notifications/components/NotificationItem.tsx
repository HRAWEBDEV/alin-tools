import { Button } from '@/components/ui/button';
import { type EventBoard } from '../services/notificationApiActions';

export default function NotificationItem({ event }: { event: EventBoard }) {
 return (
  <Button
   variant='outline'
   className='w-full flex-col h-auto min-h-20 whitespace-normal text-start justify-start items-stretch gap-0 bg-neutral-100 dark:bg-neutral-900 shadow'
  >
   <div className='border-b border-border pb-2 mb-1'>
    <h2 className='mb-1 font-medium text-primary'>{event.title}</h2>
    <p className='text-neutral-700 dark:text-neutral-400 text-sm'>
     {event.note}
    </p>
   </div>
   <div className='flex justify-between text-sm text-neutral-600 dark:text-neutral-400'>
    <div></div>
    <div>
     {new Date().toLocaleDateString('fa', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
     })}{' '}
    </div>
   </div>
  </Button>
 );
}
