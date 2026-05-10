import { useEffect } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown } from 'lucide-react';
import {
 type RoomNotesSchema,
 createRoomNotesSchema,
 defaultValues,
} from '../../schemas/room-notes/roomNotesSchema';
import { Button } from '@/components/ui/button';
import { type EditRoomNotesProps } from '../../utils/room-notes/editRoomNotesProps';
import {
 type SaveNote,
 saveRoomNote,
 updateRoomNote,
} from '../../services/room-notes/RackRoomNotesApiActions';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewRoomNote({
 dic,
 editRoomNote,
}: {
 dic: RoomsRackDictionary;
 editRoomNote: EditRoomNotesProps;
}) {
 const {
  register,
  setValue,
  control,
  formState: { errors },
  handleSubmit,
 } = useForm<RoomNotesSchema>({
  resolver: zodResolver(createRoomNotesSchema()),
  defaultValues,
 });

 const { mutate, isPending } = useMutation({
  mutationFn({ comment, noteType }: RoomNotesSchema) {
   const newNote: SaveNote = {
    ...(editRoomNote.targetNote || {}),
    id: editRoomNote.selectedId || 0,
    dateTimeDateTimeOffset:
     editRoomNote.targetNote?.dateTimeDateTimeOffset ||
     new Date().toISOString(),
    registerID: editRoomNote.registerId,
    roomID: editRoomNote.roomId,
    message: comment,
    messageTypeID: Number(noteType!.key),
   };
   return editRoomNote.selectedId
    ? updateRoomNote(newNote)
    : saveRoomNote(newNote);
  },
  onSuccess() {
   editRoomNote.closeShowEdit();
   editRoomNote.onInvalidateQuery();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 const isEditable = !editRoomNote.targetNote?.deleted;

 useEffect(() => {
  setValue(
   'noteType',
   editRoomNote.targetNote?.messageTypeID
    ? {
       key: editRoomNote.targetNote.messageTypeID.toString(),
       value: editRoomNote.targetNote.messageTypeName,
      }
    : null,
  );
  setValue('comment', editRoomNote.targetNote?.message || '');
 }, [editRoomNote, setValue]);

 return (
  <Dialog
   open={editRoomNote.showEdit}
   onOpenChange={() => {
    if (isPending) return;
    editRoomNote.closeShowEdit();
   }}
  >
   <DialogContent className='flex flex-col w-[min(95%,35rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogTitle>
      {editRoomNote.selectedId ? dic.roomNotes.edit : dic.roomNotes.new}
     </DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto p-4 mb-4'>
     <FieldGroup className='gap-5'>
      <Field>
       <FieldLabel htmlFor='type'>{dic.roomNotes.noteType}</FieldLabel>
       <Controller
        control={control}
        name='noteType'
        render={({ field }) => (
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            id='note-type'
            variant='outline'
            role='combobox'
            className='justify-between h-11'
            onBlur={field.onBlur}
            ref={field.ref}
            disabled={!isEditable}
           >
            <span className='text-start grow overflow-hidden text-ellipsis'>
             {field.value ? field.value.value : ''}
            </span>
            <div className='flex gap-1 items-center -me-2'>
             {editRoomNote.initialDataIsLoading && <Spinner />}
             <ChevronsUpDown className='opacity-50' />
            </div>
           </Button>
          </DrawerTrigger>
          <DrawerContent className='h-[min(60svh,35rem)]'>
           <DrawerHeader className='hidden'>
            <DrawerTitle>{dic.roomNotes.noteType}</DrawerTitle>
           </DrawerHeader>
           <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
            <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
             {dic.roomNotes.noteType}
            </h1>
           </div>
           <div>
            <ul>
             {editRoomNote.initialData?.messageTypes.map((item) => (
              <DrawerClose asChild key={item.key}>
               <li
                className='flex gap-1 items-center ps-6 py-2'
                onClick={() => {
                 field.onChange(item);
                }}
               >
                <Checkbox
                 className='size-6'
                 checked={field.value?.key === item.key}
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
           </div>
          </DrawerContent>
         </Drawer>
        )}
       />
      </Field>
      <Field className='gap-3' data-invalid={!!errors.comment}>
       <FieldLabel htmlFor='comment'>
        {dic.roomGuestMessages.comment}
       </FieldLabel>
       <InputGroup data-invalid={!!errors.comment}>
        <InputGroupTextarea
         id='comment'
         {...register('comment')}
         readOnly={!isEditable}
        />
       </InputGroup>
      </Field>
     </FieldGroup>
    </div>
    {isEditable && (
     <DialogFooter className='p-4 border-t border-input'>
      <Button
       variant='outline'
       size='lg'
       className='sm:w-28'
       onClick={() => editRoomNote.closeShowEdit()}
       disabled={isPending}
      >
       {isPending && <Spinner />}
       {dic.roomGuestMessages.cancel}
      </Button>
      <Button
       size='lg'
       className='sm:w-28'
       disabled={isPending}
       onClick={() => {
        handleSubmit((data) => mutate(data))();
       }}
      >
       {isPending && <Spinner />}
       {dic.roomGuestMessages.confirm}
      </Button>
     </DialogFooter>
    )}
   </DialogContent>
  </Dialog>
 );
}
