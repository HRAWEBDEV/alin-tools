import { MdTouchApp } from 'react-icons/md';
import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog';
import { BiError, BiTrash } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
import {
 type TaskNote,
 removeDailyTaskNote,
} from '../../services/dailyTasksApiActions';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function DailyTaskNote({
 dic,
 note,
 onEdit,
 onInvalideNotes,
}: {
 dic: DailyTasksChecklistDictionary;
 note: TaskNote;
 onInvalideNotes: () => void;
 onEdit: (id: number) => unknown;
}) {
 const { mutate, isPending } = useMutation({
  mutationFn() {
   return removeDailyTaskNote(note.id);
  },
  onSuccess() {
   onInvalideNotes();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });
 return (
  <button
   className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate text-start w-full min-h-28 mb-4 flex gap-4'
   onClick={() => {
    if (isPending) return;
    onEdit(note.id);
   }}
  >
   <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>
   <div className='grow'>
    <p className='font-medium text-primary mb-2'>
     {note.name} {note.lastName}
    </p>
    <p>{note.comment}</p>
   </div>
   <Dialog>
    <DialogTrigger asChild>
     <Button
      variant='outline'
      className='text-destructive border-destructive'
      size='icon-lg'
      onClick={(e) => {
       e.stopPropagation();
      }}
     >
      {isPending ? (
       <Spinner className='size-5' />
      ) : (
       <BiTrash className='size-5' />
      )}
     </Button>
    </DialogTrigger>
    <DialogContent className='p-0 gap-0'>
     <DialogHeader className='p-4'>
      <DialogTitle className='hidden'>
       {dic.notes.removeNoteConfirmMessage}
      </DialogTitle>
     </DialogHeader>
     <div className='p-4'>
      <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
       <BiError className='size-12' />
       <p>{dic.notes.removeNoteConfirmMessage}</p>
      </div>
     </div>
     <DialogFooter className='p-4'>
      <DialogClose asChild>
       <Button className='sm:w-24' variant='outline'>
        {dic.notes.cancel}
       </Button>
      </DialogClose>
      <DialogClose asChild>
       <Button
        className='sm:w-24'
        variant='destructive'
        onClick={() => mutate()}
       >
        {dic.notes.confirm}
       </Button>
      </DialogClose>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </button>
 );
}
