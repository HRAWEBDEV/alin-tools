import { useEffect } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
} from '@/components/ui/input-group';
import { zodResolver } from '@hookform/resolvers/zod';
import {
 type RoomGuestMessageSchema,
 defaultValues,
 createRoomGuestMessageSchema,
} from '../../schemas/room-guest-message/roomGuestMessageSchema';
import { Button } from '@/components/ui/button';
import { type EditRoomGuestMessagesProps } from '../../utils/editRoomGuestMessagesProps';
import {
 type SaveRoomGuestMessage,
 saveMessage,
 updateMessage,
} from '../../services/guest-messages/roomGuestMessagesApiActions';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function NewRoomGuestMessage({
 dic,
 editRoomGuestMessage,
}: {
 dic: RoomsRackDictionary;
 editRoomGuestMessage: EditRoomGuestMessagesProps;
}) {
 const {
  register,
  setValue,
  formState: { errors },
  handleSubmit,
 } = useForm<RoomGuestMessageSchema>({
  resolver: zodResolver(createRoomGuestMessageSchema()),
  defaultValues,
 });

 const { mutate, isPending } = useMutation({
  mutationFn({ comment, fromPerson, toPerson }: RoomGuestMessageSchema) {
   const newMessage: SaveRoomGuestMessage = {
    ...(editRoomGuestMessage.targetNote || {}),
    id: editRoomGuestMessage.selectedId || 0,
    messageFrom: fromPerson,
    messageTo: toPerson,
    message: comment,
    registerID: editRoomGuestMessage.registerId,
    dateTimeDateTimeOffset:
     editRoomGuestMessage.targetNote?.dateTimeDateTimeOffset ||
     new Date().toISOString(),
    readed: editRoomGuestMessage.targetNote
     ? editRoomGuestMessage.targetNote.readed
     : false,
   };
   return editRoomGuestMessage.selectedId
    ? updateMessage(newMessage)
    : saveMessage(newMessage);
  },
  onSuccess() {
   editRoomGuestMessage.closeShowEdit();
   editRoomGuestMessage.onInvalidateQuery();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 useEffect(() => {
  setValue('fromPerson', editRoomGuestMessage.targetNote?.messageFrom || '');
  setValue('toPerson', editRoomGuestMessage.targetNote?.messageTo || '');
  setValue('comment', editRoomGuestMessage.targetNote?.message || '');
 }, [editRoomGuestMessage, setValue]);

 return (
  <Dialog
   open={editRoomGuestMessage.showEdit}
   onOpenChange={() => editRoomGuestMessage.closeShowEdit()}
  >
   <DialogContent className='flex flex-col w-[min(95%,35rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogTitle>
      {editRoomGuestMessage.selectedId
       ? dic.roomGuestMessages.edit
       : dic.roomGuestMessages.new}
     </DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto p-4 mb-4'>
     <FieldGroup className='gap-5'>
      <div className='grid grid-cols-2 gap-4'>
       <Field className='gap-3' data-invalid={!!errors.fromPerson}>
        <FieldLabel htmlFor='from-person'>
         {dic.roomGuestMessages.fromPerson}
        </FieldLabel>
        <InputGroup data-invalid={!!errors.fromPerson}>
         <InputGroupInput id='from-person' {...register('fromPerson')} />
        </InputGroup>
       </Field>
       <Field className='gap-3' data-invalid={!!errors.toPerson}>
        <FieldLabel htmlFor='to-person'>
         {dic.roomGuestMessages.toPerson}
        </FieldLabel>
        <InputGroup data-invalid={!!errors.toPerson}>
         <InputGroupInput id='to-person' {...register('toPerson')} />
        </InputGroup>
       </Field>
      </div>
      <Field className='gap-3' data-invalid={!!errors.comment}>
       <FieldLabel htmlFor='comment'>
        {dic.roomGuestMessages.comment}
       </FieldLabel>
       <InputGroup data-invalid={!!errors.comment}>
        <InputGroupTextarea id='comment' {...register('comment')} />
       </InputGroup>
      </Field>
     </FieldGroup>
    </div>
    <DialogFooter className='p-4 border-t border-input'>
     <Button
      variant='outline'
      size='lg'
      className='sm:w-28'
      onClick={() => editRoomGuestMessage.closeShowEdit()}
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
   </DialogContent>
  </Dialog>
 );
}
