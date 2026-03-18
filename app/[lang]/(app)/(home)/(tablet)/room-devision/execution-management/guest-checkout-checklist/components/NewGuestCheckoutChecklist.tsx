import { useState, useEffect } from 'react';
import { type GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';
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
 type CheckoutChecklistSchema,
 defaultValues,
 createCheckoutChecklistSchema,
} from '../schemas/checkoutChecklistSchema';
import {
 type InitialData,
 type SaveCheckoutChecklist,
 getRegisterInfo,
 guestCheckoutChecklistBaseKey,
 saveCheckoutlist,
 updateCheckoutlist,
 removeCheckoutlist,
} from '../services/guestCheckoutChecklistApiActions';
import { EditGuestCheckoutProps } from '../utils/editGuestCheckoutProps';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
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

export default function NewGuestCheckoutChecklist({
 dic,
 initialData,
 initDataIsLoading,
 editChecklist,
}: {
 dic: GuestCheckoutChecklistDictionary;
 initialData?: InitialData;
 initDataIsLoading: boolean;
 editChecklist: EditGuestCheckoutProps;
}) {
 const [registerID, setRegisterID] = useState<null | number>(
  editChecklist.targetEditChecklist?.registerID || null,
 );
 const [folioNo, setFolioNo] = useState<number | null>(
  editChecklist.targetEditChecklist?.folioNo || null,
 );
 const queryClient = useQueryClient();
 const {
  control,
  setValue,
  register,
  handleSubmit,
  formState: { errors },
 } = useForm<CheckoutChecklistSchema>({
  resolver: zodResolver(createCheckoutChecklistSchema()),
  defaultValues: {
   ...defaultValues,
  },
 });

 const { mutate: mutateRegisterInfo, isPending: registerInfoIsPending } =
  useMutation({
   mutationFn(roomID: number) {
    return getRegisterInfo({ roomID, date: new Date().toISOString() });
   },
   onSuccess(res) {
    setRegisterID(res.data.registerID);
    setFolioNo(res.data.folioNo);
   },
   onError(err: AxiosError<string>) {
    setRegisterID(null);
    setFolioNo(null);
    setValue('room', null);
    toast.error(err.response?.data);
   },
  });

 const { mutate: mutateSaveChecklist, isPending: saveChecklistIsPending } =
  useMutation({
   mutationFn(data: CheckoutChecklistSchema) {
    const newChecklist: SaveCheckoutChecklist = {
     id: editChecklist.selectedCheckListID || 0,
     comment: data.comment || null,
     dateTimeDateTimeOffset: new Date().toISOString(),
     registerID,
     roomID: Number(data.room!.key),
     maidUserPersonID: Number(data.maid!.key),
    };
    return editChecklist.selectedCheckListID
     ? updateCheckoutlist(newChecklist)
     : saveCheckoutlist(newChecklist);
   },
   onSuccess() {
    queryClient.invalidateQueries({
     queryKey: [guestCheckoutChecklistBaseKey, 'list'],
    });
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
  });

 // remove
 const { mutate: confirmRemove, isPending: confirmRemoveIsPending } =
  useMutation({
   mutationFn() {
    return removeCheckoutlist(editChecklist.targetEditChecklist!.id);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
   onSuccess() {
    queryClient.invalidateQueries({
     queryKey: [guestCheckoutChecklistBaseKey, 'list'],
    });
    editChecklist.onCloseEdit();
   },
  });

 function setFormDefaults() {
  Object.entries(defaultValues).forEach(([key, value]) => {
   setValue(key as keyof CheckoutChecklistSchema, value);
  });
  setRegisterID(null);
  setFolioNo(null);
 }

 useEffect(() => {
  setValue(
   'fromDate',
   editChecklist.targetEditChecklist
    ? new Date(editChecklist.targetEditChecklist.dateTimeDateTimeOffset)
    : new Date(),
  );
  setValue(
   'maid',
   editChecklist.targetEditChecklist
    ? {
       key: editChecklist.targetEditChecklist.maidUserPersonID.toString(),
       value: editChecklist.targetEditChecklist.maidFullName || '',
      }
    : null,
  );
  setValue(
   'room',
   editChecklist.targetEditChecklist
    ? {
       key: editChecklist.targetEditChecklist.roomID.toString(),
       value: editChecklist.targetEditChecklist.roomLabel || '',
      }
    : null,
  );
  setValue(
   'comment',
   editChecklist.targetEditChecklist
    ? editChecklist.targetEditChecklist.comment || ''
    : '',
  );
 }, [setValue, editChecklist.targetEditChecklist]);

 const pendActions =
  saveChecklistIsPending || registerInfoIsPending || confirmRemoveIsPending;

 return (
  <Drawer
   open={editChecklist.showNew}
   onOpenChange={(newValue) => {
    if (newValue) return;
    setFormDefaults();
    editChecklist.onCloseEdit();
   }}
  >
   <DrawerContent className='h-[min(70svh,40rem)] flex flex-col'>
    <DrawerHeader>
     <DrawerTitle className='text-xl'>
      {editChecklist.selectedCheckListID
       ? `${dic.filters.edit} ${editChecklist.targetEditChecklist?.roomLabel}`
       : dic.filters.new}
     </DrawerTitle>
    </DrawerHeader>
    <div className='grow overflow-auto p-4'>
     <form className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
      {!!editChecklist.selectedCheckListID && (
       <div className='flex gap-2 items-center justify-end col-span-full'>
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
            disabled={!!editChecklist.selectedCheckListID}
            className='justify-between h-11'
            onBlur={field.onBlur}
            ref={field.ref}
           >
            <span className='text-start grow overflow-hidden text-ellipsis'>
             {field.value?.value || ''}
            </span>
            <div className='flex gap-1 items-center -me-2'>
             {folioNo && (
              <div className='text-xs'>
               <span className='text-neutral-600 dark:text-neutral-400'>
                {dic.info.registerNo}:{' '}
               </span>
               <span className='text-sm'>{folioNo}</span>
              </div>
             )}
             {(initDataIsLoading || registerInfoIsPending) && <Spinner />}
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
                 mutateRegisterInfo(Number(item.key));
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
      <Field data-invalid={!!errors.maid}>
       <FieldLabel htmlFor='maid'>{dic.info.maid} *</FieldLabel>
       <Controller
        data-invalid={!!errors.maid}
        control={control}
        name='maid'
        render={({ field }) => (
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            id='maid'
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
            <DrawerTitle>{dic.info.maid}</DrawerTitle>
           </DrawerHeader>
           <div className='grow overflow-hidden overflow-y-auto'>
            <ul>
             {initialData?.maids.map((item) => (
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
      <div className='col-span-full flex flex-col md:flex-row gap-4 md:justify-end md:items-center'>
       <div className='flex gap-4 flex-col-reverse md:flex-row'>
        <Button
         type='button'
         size='lg'
         variant='outline'
         className='md:w-34'
         disabled={pendActions}
        >
         {pendActions && <Spinner />}
         {dic.newOrEdit.cancel}
        </Button>
        <Button
         size='lg'
         className='md:w-34'
         type='submit'
         disabled={pendActions}
         onClick={(e) => {
          e.preventDefault();
          handleSubmit((data) => {
           mutateSaveChecklist(data);
          })();
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
