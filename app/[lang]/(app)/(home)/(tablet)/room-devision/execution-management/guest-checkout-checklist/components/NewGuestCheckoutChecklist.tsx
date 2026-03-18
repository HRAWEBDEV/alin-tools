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
import { type InitialData } from '../services/guestCheckoutChecklistApiActions';
import { EditGuestCheckoutProps } from '../utils/editGuestCheckoutProps';
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
 } = useForm<CheckoutChecklistSchema>({
  resolver: zodResolver(createCheckoutChecklistSchema()),
  defaultValues: {
   ...defaultValues,
  },
 });
 const [fromDateValue, toDateValue] = watch(['fromDate', 'toDate']);

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

 return (
  <Drawer
   open={editChecklist.showNew}
   onOpenChange={(newValue) => {
    if (newValue) return;
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
            disabled={!!editChecklist.selectedCheckListID}
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
        <Button type='button' size='lg' variant='outline' className='md:w-34'>
         {dic.newOrEdit.cancel}
        </Button>
        <Button size='lg' className='md:w-34' type='submit'>
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
