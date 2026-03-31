import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 type RoomNote,
 deleteRoomNote,
 activeRoomNote,
 deactiveRoomNote,
} from '../../services/room-notes/RackRoomNotesApiActions';
import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { FaCheck } from 'react-icons/fa';
import { EditRoomNotesProps } from '../../utils/room-notes/editRoomNotesProps';
import { BiError } from 'react-icons/bi';
import {
 Dialog,
 DialogTrigger,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogClose,
} from '@/components/ui/dialog';

export default function RoomNoteItem({
 dic,
 note,
 editRoomNote,
}: {
 dic: RoomsRackDictionary;
 note: RoomNote;
 editRoomNote: EditRoomNotesProps;
}) {
 const { locale } = useBaseConfig();

 const { mutate: removeMessageMutate, isPending: removeMessageIsPending } =
  useMutation({
   mutationFn() {
    return deleteRoomNote(note.id);
   },
   onSuccess() {
    editRoomNote.onInvalidateQuery();
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
  });

 const {
  mutate: changeStateMessageMutate,
  isPending: changeStateMessageIsPending,
 } = useMutation({
  mutationFn() {
   return note.disabled ? activeRoomNote(note.id) : deactiveRoomNote(note.id);
  },
  onSuccess() {
   editRoomNote.onInvalidateQuery();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 const actionIsPending = removeMessageIsPending || changeStateMessageIsPending;

 return (
  <div className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 isolate relative'>
   <div className='absolute bottom-0 end-6 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>
   <button
    onClick={() => {
     if (actionIsPending) return;
     editRoomNote.onShowEdit(note.id);
    }}
   >
    <div className='flex flex-wrap items-center gap-4 gap-y-2 mb-4'>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomNotes.fromPerson}:{' '}
      </span>
      <span className='font-medium text-primary'>{note.userPersonName}</span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomNotes.noteType}:{' '}
      </span>
      <span className='font-medium text-secondary'>{note.messageTypeName}</span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomNotes.registerNo}:{' '}
      </span>
      <span className='font-medium'>{note.folioNo}</span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.roomNotes.dateTime}:{' '}
      </span>
      <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400'>
       {new Date(note.dateTimeDateTimeOffset).toLocaleString(locale, {
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
      {note.message}
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
       editRoomNote.onShowEdit(note.id);
      }}
     >
      {actionIsPending && <Spinner />}
      {dic.roomGuestMessages.edit}
     </Button>
     <Dialog>
      <DialogTrigger asChild>
       <Button
        variant='outline'
        className={`${note.disabled ? 'text-destructive border-destructive' : 'text-secondary border-secondary'}`}
        disabled={actionIsPending}
       >
        {actionIsPending && <Spinner />}
        {note.disabled ? dic.roomNotes.deactive : dic.roomNotes.active}
       </Button>
      </DialogTrigger>
      <DialogContent className='p-0 gap-0'>
       <DialogHeader className='p-4'></DialogHeader>
       <div className='p-4'>
        <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
         <BiError className='size-12' />
         <p>
          {dic.roomNotes.confirmChangeStateTo}{' '}
          <span
           className={`${!note.disabled ? 'text-destructive border-destructive' : 'text-secondary border-secondary'}`}
          >
           {note.disabled ? dic.roomNotes.active : dic.roomNotes.deactive}
          </span>
         </p>
        </div>
       </div>
       <DialogFooter className='p-4'>
        <DialogClose asChild>
         <Button className='sm:w-24' variant='outline'>
          {dic.roomNotes.cancel}
         </Button>
        </DialogClose>
        <DialogClose asChild>
         <Button
          className='sm:w-24'
          variant='destructive'
          onClick={() => changeStateMessageMutate()}
         >
          {dic.roomNotes.confirm}
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
        disabled={actionIsPending || note.deleted}
       >
        {actionIsPending && <Spinner />}
        {note.deleted && <FaCheck />}
        {dic.roomNotes.remove}
       </Button>
      </DialogTrigger>
      <DialogContent className='p-0 gap-0'>
       <DialogHeader className='p-4'></DialogHeader>
       <div className='p-4'>
        <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
         <BiError className='size-12' />
         <p>{dic.roomNotes.confirmRemoveMessage}</p>
        </div>
       </div>
       <DialogFooter className='p-4'>
        <DialogClose asChild>
         <Button className='sm:w-24' variant='outline'>
          {dic.roomNotes.cancel}
         </Button>
        </DialogClose>
        <DialogClose asChild>
         <Button
          className='sm:w-24'
          variant='destructive'
          onClick={() => removeMessageMutate()}
         >
          {dic.roomNotes.confirm}
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
