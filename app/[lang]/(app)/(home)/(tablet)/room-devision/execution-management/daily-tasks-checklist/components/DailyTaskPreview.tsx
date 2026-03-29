import { useEffect, useState } from 'react';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { type EditDailyTaskProps } from '../utils/editDailyTaskProps';
import {
 type SaveNote,
 dailyTasksBaseKey,
 getDailyTaskNotes,
 saveNote,
 updateNote,
} from '../services/dailyTasksApiActions';
import { FaCheck } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import DailyTaskNote from './notes/DailyTaskNote';
import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { FieldLabel, Field } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function DailyTaskPreview({
 dic,
 editChecklist,
}: {
 dic: DailyTasksChecklistDictionary;
 editChecklist: EditDailyTaskProps;
}) {
 const queryClient = useQueryClient();
 const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
 const [noteComment, setNoteComment] = useState('');
 const [showEdit, setShowEdit] = useState(false);
 const {
  data: notes,
  isFetching: notesIsFetching,
  isSuccess: notesIsSuccess,
 } = useQuery({
  enabled: !!editChecklist.selectedCheckListID,
  queryKey: [
   dailyTasksBaseKey,
   'notes',
   editChecklist.selectedCheckListID?.toString(),
  ],
  async queryFn({ signal }) {
   const res = await getDailyTaskNotes({
    signal,
    dailyTaskID: editChecklist.selectedCheckListID!,
   });
   return res.data;
  },
 });

 function handleInvalideNotes() {
  queryClient.invalidateQueries({
   queryKey: [
    dailyTasksBaseKey,
    'notes',
    editChecklist.selectedCheckListID?.toString(),
   ],
  });
 }
 function handleEdit(id: number | null) {
  setSelectedNoteId(id);
  setShowEdit(true);
 }
 function handleCloseEdit() {
  setShowEdit(false);
  setSelectedNoteId(null);
  setNoteComment('');
 }
 const targetNote = selectedNoteId
  ? notes?.find((note) => note.id === selectedNoteId) || null
  : null;

 const { mutate: saveNoteMutate, isPending: saveNoteIsPending } = useMutation({
  mutationFn() {
   const newNote: SaveNote = {
    id: targetNote?.id || 0,
    comment: noteComment || '',
    dailyTaskDataID: editChecklist.selectedCheckListID!,
    userPersonID: targetNote?.userPersonID || 0,
   };
   return targetNote?.id ? updateNote(newNote) : saveNote(newNote);
  },
  onSuccess() {
   handleInvalideNotes();
   handleCloseEdit();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 useEffect(() => {
  setNoteComment(targetNote?.comment || '');
 }, [targetNote]);

 return (
  <>
   <Drawer
    open={editChecklist.showNew}
    onOpenChange={(newValue) => {
     if (newValue) return;
     editChecklist.onCloseEdit();
     handleCloseEdit();
    }}
   >
    <DrawerContent className='h-[min(60svh,40rem)] flex flex-col'>
     <DrawerHeader>
      <DrawerTitle className='text-xl'>{dic.info.preview}</DrawerTitle>
     </DrawerHeader>
     <div className='grow overflow-auto p-4'>
      <div className='relative isolate w-[min(100%,30rem)] mx-auto'>
       <div className='mb-2 flex justify-end gap-2'>
        <Button
         variant='outline'
         className='border-primary text-primary w-28'
         onClick={() => handleEdit(null)}
        >
         {dic.info.addMessage}
        </Button>
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           variant='outline'
           className='border-secondary text-secondary w-28'
          >
           {dic.info.messages}
           {notesIsFetching ? (
            <Spinner className='size-5' />
           ) : (
            <Badge variant='destructive' className='size-5'>
             {notes?.length}
            </Badge>
           )}
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[min(70svh,40rem)] flex flex-col'>
          <DrawerHeader>
           <DrawerTitle className='text-xl'>
            {dic.notes.title} {editChecklist.targetEditChecklist?.roomLabel}
           </DrawerTitle>
          </DrawerHeader>
          <div className='grow overflow-auto p-4 w-[min(100%,50rem)] mx-auto'>
           {notesIsFetching && <LinearLoading />}
           <div className='mb-2 flex justify-end'>
            <Button
             variant='outline'
             className='border-primary text-primary w-28'
             onClick={() => handleEdit(null)}
            >
             {dic.info.addMessage}
            </Button>
           </div>
           {notesIsSuccess && notes.length ? (
            notes?.map((note) => (
             <DailyTaskNote
              key={note.id}
              note={note}
              dic={dic}
              onEdit={handleEdit}
              onInvalideNotes={handleInvalideNotes}
             />
            ))
           ) : (
            <NoItemFound />
           )}
          </div>
         </DrawerContent>
        </Drawer>
       </div>
       <div className='flex flex-wrap justify-between gap-1 mb-2'>
        <div>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.roomNo}:{' '}
         </span>
         <span className='font-medium text-6xl text-primary'>
          {editChecklist.targetEditChecklist?.roomLabel}
         </span>
        </div>
       </div>
       <div className='flex flex-wrap justify-between gap-1 mb-1'>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.occupied}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidOccupied ? '' : 'opacity-0'}`}
         />
        </div>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.ready}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidReady ? '' : 'opacity-0'}`}
         />
        </div>
       </div>
       <div className='flex flex-wrap justify-between gap-1 mb-1'>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.clean}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidClean ? '' : 'opacity-0'}`}
         />
        </div>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.outOfService}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidOutOfService ? '' : 'opacity-0'}`}
         />
        </div>
       </div>
       <div className='flex flex-wrap justify-between gap-1 mb-1'>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.outOfOrder}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidOutOfOrder ? '' : 'opacity-0'}`}
         />
        </div>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.houseUse}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidHouseUse ? '' : 'opacity-0'}`}
         />
        </div>
       </div>
       <div className='flex flex-wrap justify-between gap-1 mb-1'>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.dnd}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.dnd ? '' : 'opacity-0'}`}
         />
        </div>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.sleptOut}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.sleptOut ? '' : 'opacity-0'}`}
         />
        </div>
       </div>
       <div className='flex flex-wrap justify-between gap-1 mb-1'>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.noLuggage}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.noLuggage ? '' : 'opacity-0'}`}
         />
        </div>
        <div className='flex gap-1 items-center'>
         <span className='text-neutral-600 dark:text-neutral-400'>
          {dic.info.lightLuggage}:{' '}
         </span>
         <FaCheck
          className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.lightLuggage ? '' : 'opacity-0'}`}
         />
        </div>
       </div>
      </div>
     </div>
    </DrawerContent>
   </Drawer>
   <Dialog
    open={showEdit}
    onOpenChange={() => {
     handleCloseEdit();
    }}
   >
    <DialogContent className='p-0 gap-0'>
     <DialogHeader className='p-4 border-b border-input'>
      <DialogTitle>
       {selectedNoteId ? dic.notes.edit : dic.notes.new}
      </DialogTitle>
     </DialogHeader>
     <div className='p-4'>
      <Field>
       <FieldLabel htmlFor='comment'>{dic.notes.comment}</FieldLabel>
       <InputGroup>
        <InputGroupTextarea
         id='comment'
         value={noteComment}
         onChange={(e) => {
          setNoteComment(e.target.value);
         }}
        />
       </InputGroup>
      </Field>
     </div>
     <DialogFooter className='p-4 py-2 border-t border-input'>
      <DialogClose asChild>
       <Button
        className='sm:w-24'
        variant='outline'
        disabled={saveNoteIsPending}
        onClick={() => {
         handleCloseEdit();
        }}
       >
        {saveNoteIsPending && <Spinner />}
        {dic.notes.cancel}
       </Button>
      </DialogClose>
      <Button
       className='sm:w-24'
       disabled={saveNoteIsPending}
       onClick={() => {
        if (!noteComment) {
         handleCloseEdit();
         return;
        }
        saveNoteMutate();
       }}
      >
       {saveNoteIsPending && <Spinner />}
       {dic.notes.confirm}
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </>
 );
}
