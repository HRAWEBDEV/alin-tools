import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 type RoomGuestMessage as Message,
 type RoomGuestMessage,
 removeGuestMessage,
 receiveMessage,
} from '../../services/guest-messages/roomGuestMessagesApiActions';
import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { FaCheck } from 'react-icons/fa';
import { type EditRoomGuestMessagesProps } from '../../utils/editRoomGuestMessagesProps';
import { BiError } from 'react-icons/bi';
import {
 Dialog,
 DialogTrigger,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogClose,
} from '@/components/ui/dialog';

export default function RoomGuestMessage({
 dic,
 message,
 onInvalidateQuery,
 editRoomGuestMessages,
}: {
 dic: RoomsRackDictionary;
 message: Message;
 onInvalidateQuery: () => unknown;
 editRoomGuestMessages: EditRoomGuestMessagesProps;
}) {
 const { locale } = useBaseConfig();

 const { mutate: removeMessageMutate, isPending: removeMessageIsPending } =
  useMutation({
   mutationFn() {
    return removeGuestMessage(message.id);
   },
   onSuccess() {
    onInvalidateQuery();
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
  });

 const { mutate: receiveMessageMutate, isPending: receiveMessageIsPending } =
  useMutation({
   mutationFn() {
    return receiveMessage(message.id);
   },
   onSuccess() {
    onInvalidateQuery();
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
  });

 const actionIsPending = removeMessageIsPending || receiveMessageIsPending;

 return (
  <div
   data-received={message.readed}
   className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 data-[received=true]:bg-secondary/5 isolate relative'
  >
   <div className='absolute bottom-0 end-6 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>
   <button
    onClick={() => {
     if (actionIsPending) return;
     editRoomGuestMessages.onShowEdit(message.id);
    }}
   >
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
     <Button
      variant='outline'
      className='text-primary border-primary'
      disabled={actionIsPending}
      onClick={() => {
       if (actionIsPending) return;
       editRoomGuestMessages.onShowEdit(message.id);
      }}
     >
      {actionIsPending && <Spinner />}
      {dic.roomGuestMessages.edit}
     </Button>
     <Dialog>
      <DialogTrigger asChild>
       <Button
        variant='outline'
        className='text-secondary border-secondary'
        disabled={actionIsPending || message.readed}
       >
        {actionIsPending && <Spinner />}
        {message.readed && <FaCheck />}
        {dic.roomGuestMessages.received}
       </Button>
      </DialogTrigger>
      <DialogContent className='p-0 gap-0'>
       <DialogHeader className='p-4'></DialogHeader>
       <div className='p-4'>
        <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
         <BiError className='size-12' />
         <p>{dic.roomGuestMessages.confirmReceiveMessage}</p>
        </div>
       </div>
       <DialogFooter className='p-4'>
        <DialogClose asChild>
         <Button className='sm:w-24' variant='outline'>
          {dic.roomGuestMessages.cancel}
         </Button>
        </DialogClose>
        <DialogClose asChild>
         <Button
          className='sm:w-24'
          variant='destructive'
          onClick={() => receiveMessageMutate()}
         >
          {dic.roomGuestMessages.confirm}
         </Button>
        </DialogClose>
       </DialogFooter>
      </DialogContent>
     </Dialog>
     <Dialog>
      <DialogTrigger asChild>
       <Button
        variant='outline'
        className='text-destructive border-destructive'
        disabled={actionIsPending}
       >
        {actionIsPending && <Spinner />}
        {dic.roomGuestMessages.remove}
       </Button>
      </DialogTrigger>
      <DialogContent className='p-0 gap-0'>
       <DialogHeader className='p-4'></DialogHeader>
       <div className='p-4'>
        <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
         <BiError className='size-12' />
         <p>{dic.roomGuestMessages.confirmRemoveMessage}</p>
        </div>
       </div>
       <DialogFooter className='p-4'>
        <DialogClose asChild>
         <Button className='sm:w-24' variant='outline'>
          {dic.roomGuestMessages.cancel}
         </Button>
        </DialogClose>
        <DialogClose asChild>
         <Button
          className='sm:w-24'
          variant='destructive'
          onClick={() => removeMessageMutate()}
         >
          {dic.roomGuestMessages.confirm}
         </Button>
        </DialogClose>
       </DialogFooter>
      </DialogContent>
     </Dialog>
    </div>
   </div>
  </div>
 );
}
