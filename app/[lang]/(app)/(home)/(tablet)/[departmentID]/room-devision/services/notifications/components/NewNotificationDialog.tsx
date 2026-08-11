import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
 DialogFooter,
 DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { MdTouchApp } from 'react-icons/md';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useRoomDevisionShareDictionary } from '../../share-dictionary/roomDevisionShareDictionaryContext';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
} from '@/components/ui/input-group';
import { useForm } from 'react-hook-form';
import {
 type NewNotificationSchema,
 createNewNotificationSchema,
} from '../schemas/newNotificationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveEventBoard } from '../services/notificationApiActions';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function NewNotificationDialog({
 open,
 selectedId,
 onChangeOpen,
}: {
 open: boolean;
 selectedId: number | null;
 onChangeOpen: (state: boolean) => unknown;
}) {
 const { routeProgram } = useUserInfoRouter();
 const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
 } = useForm<NewNotificationSchema>({
  resolver: zodResolver(createNewNotificationSchema()),
 });
 const {
  roomDevisionShareDictionary: {
   components: { notifications },
  },
 } = useRoomDevisionShareDictionary();
 const { mutate, isPending } = useMutation({
  mutationFn(data: NewNotificationSchema) {
   return saveEventBoard({
    eventBoard: {
     id: 0,
     title: data.title,
     note: data.description,
     createDateTimeOffset: new Date().toISOString(),
     dateTimeDateTimeOffset: new Date().toISOString(),
     programID: routeProgram.id,
    },
    eventBoardShows: [routeProgram.id],
   });
  },
  onSuccess() {},
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 return (
  <Dialog
   open={open}
   onOpenChange={(newValue) => {
    if (isPending) return;
    onChangeOpen(newValue);
   }}
  >
   <form className='max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogContent className='gap-0 p-0 overflow-hidden flex flex-col grow'>
     <DialogHeader className='p-4 border-b border-border'>
      <DialogHeader>
       <DialogTitle className='text-md'>
        {selectedId
         ? notifications.newEvent.editEvent
         : notifications.newEvent.addEvent}
       </DialogTitle>
      </DialogHeader>
     </DialogHeader>
     <div className='p-4 grow overflow-auto'>
      {true && (
       <div className='flex justify-end'>
        <Button
         variant={'outline'}
         className='w-24 border-destructive text-destructive'
        >
         {notifications.newEvent.remove}
        </Button>
       </div>
      )}
      <FieldGroup className='gap-4'>
       <Field data-invalid={!!errors.title}>
        <FieldLabel htmlFor='title'>
         {notifications.newEvent.title} *
        </FieldLabel>
        <InputGroup data-invalid={!!errors.title}>
         <InputGroupInput id='title' {...register('title')} />
        </InputGroup>
       </Field>
       <Field data-invalid={!!errors.description}>
        <FieldLabel htmlFor='description'>
         {notifications.newEvent.description} *
        </FieldLabel>
        <InputGroup data-invalid={!!errors.description}>
         <InputGroupTextarea id='title' {...register('description')} />
        </InputGroup>
       </Field>
       {selectedId && (
        <div className='flex justify-between text-sm text-neutral-600 dark:text-neutral-400'>
         <div>مدیر سیستم</div>
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
       )}
      </FieldGroup>
     </div>
     <DialogFooter className='p-4 py-2 border-t border-border'>
      <DialogClose asChild>
       <Button
        type='button'
        disabled={isPending}
        className='md:w-24'
        variant='outline'
       >
        {isPending && <Spinner />}
        {notifications.newEvent.cancel}
       </Button>
      </DialogClose>
      <Button
       type='submit'
       className='md:w-24'
       disabled={isPending}
       onClick={(e) => {
        e.preventDefault();
        handleSubmit((data) => {
         mutate(data);
        })();
       }}
      >
       {isPending && <Spinner />}
       {notifications.newEvent.confirm}
      </Button>
     </DialogFooter>
    </DialogContent>
   </form>
  </Dialog>
 );
}
