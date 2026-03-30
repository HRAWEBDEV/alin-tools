import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 RoomGuestMessage as Message,
 type RoomGuestMessage,
} from '../../services/guest-messages/roomGuestMessagesApiActions';
import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Button } from '@/components/ui/button';

export default function RoomGuestMessage({
 dic,
 message,
}: {
 dic: RoomsRackDictionary;
 message: Message;
}) {
 const { locale } = useBaseConfig();
 return (
  <div className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 isolate relative'>
   <div className='absolute bottom-0 end-6 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>
   <button>
    <div className='flex flex-wrap items-center gap-4 gap-y-2 mb-4'>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomGuestMessages.fromPerson}:{' '}
      </span>
      <span className='font-medium text-lg text-primary'>
       {message.messageFrom}
      </span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomGuestMessages.toPerson}:{' '}
      </span>
      <span className='font-medium text-lg text-destructive'>
       {message.messageTo}
      </span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomGuestMessages.dateTime}:{' '}
      </span>
      <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400'>
       {new Date(message.dateTimeDateTimeOffset).toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
       })}
      </span>
     </div>
    </div>
    <div className='flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start'>
      {message.message}
     </p>
    </div>
   </button>
   <div className='flex justify-between gap-4 items-center border-t border-input pt-2 mt-2'>
    <div></div>
    <div className='flex flex-wrap gap-2'>
     <Button variant='outline' className='text-primary border-primary'>
      {dic.roomGuestMessages.edit}
     </Button>
     <Button variant='outline' className='text-secondary border-secondary'>
      {dic.roomGuestMessages.received}
     </Button>
     <Button variant='outline' className='text-destructive border-destructive'>
      {dic.roomGuestMessages.remove}
     </Button>
    </div>
   </div>
  </div>
 );
}
