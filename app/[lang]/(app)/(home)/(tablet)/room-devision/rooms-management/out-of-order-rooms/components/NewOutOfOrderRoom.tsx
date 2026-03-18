import { useState, useEffect } from 'react';
import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
 type OutOfOrderRoomsSchema,
 defaultValues,
 createOutOfOrderRoomsSchema,
} from '../schemas/outOfOrderRoomsSchema';
import {
 type InitialData,
 type SaveOutOfOrder,
 outOfOrderRoomsBaseKey,
 updateOutOfOrderRoom,
 saveOutOfOrderRoom,
 removeOutOfOrder,
 expiredOutOfOrder,
} from '../services/outOfOrderApiActions';
import { EditOutOfOrderProps } from '../utils/editOutOfOrderProps';
import { Field, FieldLabel } from '@/components/ui/field';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog';
import { BiError } from 'react-icons/bi';

export default function NewOutOfOrderRoom({
 dic,
 initialData,
 initDataIsLoading,
 editRoom,
}: {
 dic: OutOfOrderRoomsDictionary;
 initialData?: InitialData;
 initDataIsLoading: boolean;
 editRoom: EditOutOfOrderProps;
}) {
 const { data: userInfo } = useUserInfoRouter();
 const queryClient = useQueryClient();
 const { locale } = useBaseConfig();
 const [showFromDatePicker, setShowFromDatePicker] = useState(false);
 const [showToDatePicker, setShowToDatePicker] = useState(false);
 const {
  control,
  watch,
  setValue,
  register,
  handleSubmit,
  formState: { errors },
 } = useForm<OutOfOrderRoomsSchema>({
  resolver: zodResolver(createOutOfOrderRoomsSchema()),
  defaultValues: {
   ...defaultValues,
  },
 });
 const [fromDateValue, toDateValue] = watch(['fromDate', 'toDate']);

 // save or update
 const { mutate, isPending } = useMutation({
  mutationFn(props: OutOfOrderRoomsSchema) {
   const newRoom: SaveOutOfOrder = {
    ...(editRoom.targetEditRoom || {}),
    id: editRoom.selectedOutOfOrderRoomID || 0,
    fromDateTimeOffset: props.fromDate!.toISOString(),
    untilDateTimeOffset: props.toDate!.toISOString(),
    reasonID: Number(props.reason!.key),
    roomID: Number(props.room!.key),
    comment: props.comment || null,
   };
   return editRoom.selectedOutOfOrderRoomID
    ? updateOutOfOrderRoom(newRoom)
    : saveOutOfOrderRoom(newRoom);
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
  onSuccess() {
   queryClient.invalidateQueries({
    queryKey: [outOfOrderRoomsBaseKey, 'rooms'],
   });
   editRoom.onCloseEdit();
  },
 });
 // remove
 const { mutate: confirmRemove, isPending: confirmRemoveIsPending } =
  useMutation({
   mutationFn() {
    return removeOutOfOrder(editRoom.targetEditRoom!.id);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
   onSuccess() {
    queryClient.invalidateQueries({
     queryKey: [outOfOrderRoomsBaseKey, 'rooms'],
    });
    editRoom.onCloseEdit();
   },
  });
 // expire
 const { mutate: confirmExpire, isPending: confirmExpireIsPending } =
  useMutation({
   mutationFn() {
    return expiredOutOfOrder(editRoom.targetEditRoom!.roomID);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
   onSuccess() {
    queryClient.invalidateQueries({
     queryKey: [outOfOrderRoomsBaseKey, 'rooms'],
    });
    editRoom.onCloseEdit();
   },
  });

 function setFormDefaults() {
  Object.entries(defaultValues).forEach(([key, value]) => {
   setValue(key as keyof OutOfOrderRoomsSchema, value);
  });
 }

 useEffect(() => {
  setValue(
   'fromDate',
   editRoom.targetEditRoom
    ? new Date(editRoom.targetEditRoom.fromDateTimeOffset)
    : new Date(),
  );
  setValue(
   'toDate',
   editRoom.targetEditRoom
    ? new Date(editRoom.targetEditRoom.untilDateTimeOffset)
    : null,
  );
  setValue(
   'reason',
   editRoom.targetEditRoom
    ? {
       key: editRoom.targetEditRoom.reasonID.toString(),
       value: editRoom.targetEditRoom.reasonName || '',
      }
    : null,
  );
  setValue(
   'room',
   editRoom.targetEditRoom
    ? {
       key: editRoom.targetEditRoom.roomID.toString(),
       value: editRoom.targetEditRoom.roomLabel || '',
      }
    : null,
  );

  setValue(
   'comment',
   editRoom.targetEditRoom ? editRoom.targetEditRoom.comment || '' : '',
  );
 }, [setValue, editRoom.targetEditRoom]);

 const pendActions =
  confirmRemoveIsPending || confirmExpireIsPending || isPending;

 return (
  <Drawer
   open={editRoom.showNew}
   onOpenChange={(newValue) => {
    if (newValue) return;
    editRoom.onCloseEdit();
    setFormDefaults();
   }}
  >
   <DrawerContent className='h-[min(70svh,40rem)] flex flex-col'>
    <DrawerHeader>
     <DrawerTitle className='text-xl'>
      {editRoom.selectedOutOfOrderRoomID
       ? `${dic.filters.edit} ${editRoom.targetEditRoom?.roomLabel}`
       : dic.filters.new}
     </DrawerTitle>
    </DrawerHeader>
    <div className='grow overflow-auto p-4'>
     <form className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
      {!!editRoom.selectedOutOfOrderRoomID && (
       <div className='flex gap-2 items-center justify-end col-span-full'>
        <Dialog>
         <DialogTrigger asChild>
          <Button
           type='button'
           variant='outline'
           className='text-destructive border-destructive'
           disabled={pendActions}
          >
           {pendActions && <Spinner />}
           {dic.newOrEdit.expire}
          </Button>
         </DialogTrigger>
         <DialogContent className='p-0 gap-0'>
          <DialogHeader className='p-4'>
           <DialogTitle className='hidden'>
            {dic.newOrEdit.expireConfirmMessage}
           </DialogTitle>
          </DialogHeader>
          <div className='p-4'>
           <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
            <BiError className='size-12' />
            <p>{dic.newOrEdit.expireConfirmMessage}</p>
           </div>
          </div>
          <DialogFooter className='p-4'>
           <DialogClose asChild>
            <Button
             className='sm:w-24'
             variant='outline'
             disabled={pendActions}
            >
             {pendActions && <Spinner />}
             {dic.newOrEdit.cancel}
            </Button>
           </DialogClose>
           <DialogClose asChild>
            <Button
             className='sm:w-24'
             variant='destructive'
             disabled={pendActions}
             onClick={() => confirmExpire()}
            >
             {pendActions && <Spinner />}
             {dic.newOrEdit.confirm}
            </Button>
           </DialogClose>
          </DialogFooter>
         </DialogContent>
        </Dialog>
        <Dialog>
         <DialogTrigger asChild>
          <Button
           type='button'
           variant='outline'
           disabled={pendActions}
           className='text-destructive border-destructive'
          >
           {pendActions && <Spinner />}
           {dic.newOrEdit.remove}
          </Button>
         </DialogTrigger>
         <DialogContent className='p-0 gap-0'>
          <DialogHeader className='p-4'>
           <DialogTitle className='hidden'>
            {dic.newOrEdit.removeConfirmMessage}
           </DialogTitle>
          </DialogHeader>
          <div className='p-4'>
           <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
            <BiError className='size-12' />
            <p>{dic.newOrEdit.removeConfirmMessage}</p>
           </div>
          </div>
          <DialogFooter className='p-4'>
           <DialogClose asChild>
            <Button
             className='sm:w-24'
             variant='outline'
             disabled={pendActions}
            >
             {pendActions && <Spinner />}
             {dic.newOrEdit.cancel}
            </Button>
           </DialogClose>
           <DialogClose asChild>
            <Button
             className='sm:w-24'
             variant='destructive'
             onClick={() => confirmRemove()}
             disabled={pendActions}
            >
             {pendActions && <Spinner />}
             {dic.newOrEdit.confirm}
            </Button>
           </DialogClose>
          </DialogFooter>
         </DialogContent>
        </Dialog>
       </div>
      )}
      <Controller
       control={control}
       name='fromDate'
       render={({ field }) => (
        <Field data-invalid={!!errors.fromDate}>
         <FieldLabel htmlFor='fromDate'>{dic.filters.fromDate} *</FieldLabel>
         <Popover
          open={showFromDatePicker}
          onOpenChange={setShowFromDatePicker}
         >
          <PopoverTrigger asChild>
           <Button
            data-invalid={!!errors.fromDate}
            variant='outline'
            id='fromDate'
            className='justify-between font-normal h-11'
            onBlur={field.onBlur}
            ref={field.ref}
           >
            <span>
             {field.value ? field.value.toLocaleDateString(locale) : ''}
            </span>
            <ChevronDownIcon />
           </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
           <Calendar
            mode='single'
            captionLayout='dropdown'
            className='[&]:[--cell-size:2.6rem]'
            defaultMonth={fromDateValue || undefined}
            disabled={(date) =>
             toDateValue ? date.getTime() >= toDateValue?.getTime() : false
            }
            endMonth={toDateValue || undefined}
            selected={field.value || undefined}
            onSelect={(newValue) => {
             if (newValue) {
              field.onChange(newValue);
              setShowFromDatePicker(false);
             }
            }}
           />
          </PopoverContent>
         </Popover>
        </Field>
       )}
      />
      <Controller
       control={control}
       name='toDate'
       render={({ field }) => (
        <Field data-invalid={!!errors.toDate}>
         <FieldLabel htmlFor='toDate'>{dic.filters.toDate} *</FieldLabel>
         <Popover open={showToDatePicker} onOpenChange={setShowToDatePicker}>
          <PopoverTrigger asChild>
           <Button
            data-invalid={!!errors.toDate}
            variant='outline'
            id='toDate'
            className='justify-between font-normal h-11'
            onBlur={field.onBlur}
            ref={field.ref}
           >
            <span>
             {field.value ? field.value.toLocaleDateString(locale) : ''}
            </span>
            <ChevronDownIcon />
           </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
           <Calendar
            mode='single'
            captionLayout='dropdown'
            className='[&]:[--cell-size:2.6rem]'
            selected={field.value || undefined}
            defaultMonth={toDateValue || undefined}
            disabled={(date) =>
             fromDateValue ? date.getTime() <= fromDateValue?.getTime() : false
            }
            startMonth={fromDateValue || undefined}
            onSelect={(newValue) => {
             if (newValue) {
              field.onChange(newValue);
              setShowToDatePicker(false);
             }
            }}
           />
          </PopoverContent>
         </Popover>
        </Field>
       )}
      />
      <Field data-invalid={!!errors.room}>
       <FieldLabel htmlFor='room'>{dic.filters.room} *</FieldLabel>
       <Controller
        control={control}
        name='room'
        render={({ field }) => (
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            data-invalid={!!errors.room}
            id='room'
            variant='outline'
            role='combobox'
            disabled={!!editRoom.selectedOutOfOrderRoomID}
            className='justify-between h-11'
            onBlur={field.onBlur}
            ref={field.ref}
           >
            <span className='text-start grow overflow-hidden text-ellipsis'>
             {field.value?.value || ''}
            </span>
            <div className='flex gap-1 items-center -me-2'>
             {initDataIsLoading && <Spinner />}
             <ChevronsUpDown className='opacity-50' />
            </div>
           </Button>
          </DrawerTrigger>
          <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
           <DrawerHeader>
            <DrawerTitle className='text-xl'>{dic.filters.room}</DrawerTitle>
           </DrawerHeader>
           <div className='grow overflow-hidden overflow-y-auto'>
            <ul>
             {initialData?.rooms.map((item) => (
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
      <Field data-invalid={!!errors.reason}>
       <FieldLabel htmlFor='reason'>{dic.info.reason} *</FieldLabel>
       <Controller
        data-invalid={!!errors.reason}
        control={control}
        name='reason'
        render={({ field }) => (
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            id='reason'
            variant='outline'
            role='combobox'
            className='justify-between h-11'
            onBlur={field.onBlur}
            ref={field.ref}
           >
            <span className='text-start grow overflow-hidden text-ellipsis'>
             {field.value?.value || ''}
            </span>
            <div className='flex gap-1 items-center -me-2'>
             {initDataIsLoading && <Spinner />}
             <ChevronsUpDown className='opacity-50' />
            </div>
           </Button>
          </DrawerTrigger>
          <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
           <DrawerHeader className='text-xl'>
            <DrawerTitle>{dic.info.reason}</DrawerTitle>
           </DrawerHeader>
           <div className='grow overflow-hidden overflow-y-auto'>
            <ul>
             {initialData?.reasons.map((item) => (
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
      <Field className='col-span-full'>
       <FieldLabel htmlFor='comment'>{dic.info.comment}</FieldLabel>
       <InputGroup>
        <InputGroupTextarea {...register('comment')} />
       </InputGroup>
      </Field>
      <div className='col-span-full flex flex-col md:flex-row gap-4 md:justify-between md:items-center'>
       <div>
        <span>{dic.info.addBy}: </span>
        <span className='font-medium text-primary'>
         {editRoom.selectedOutOfOrderRoomID
          ? editRoom.targetEditRoom?.userPersonName
          : userInfo.user.personFullName}
        </span>
       </div>
       <div className='flex gap-4 flex-col-reverse md:flex-row'>
        <Button
         type='button'
         size='lg'
         disabled={pendActions}
         variant='outline'
         className='md:w-34'
         onClick={() => editRoom.onCloseEdit()}
        >
         {pendActions && <Spinner />}
         {dic.newOrEdit.cancel}
        </Button>
        <Button
         disabled={pendActions}
         size='lg'
         className='md:w-34'
         type='submit'
         onClick={(e) => {
          e.preventDefault();
          handleSubmit(
           (props) => mutate(props),
           () => {
            toast.error(dic.newOrEdit.fillRequiredFields);
           },
          )();
         }}
        >
         {pendActions && <Spinner />}
         {dic.newOrEdit.confirm}
        </Button>
       </div>
      </div>
     </form>
    </div>
   </DrawerContent>
  </Drawer>
 );
}
