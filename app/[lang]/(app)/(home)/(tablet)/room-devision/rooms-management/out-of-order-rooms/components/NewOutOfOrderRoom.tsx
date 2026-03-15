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
import { type InitialData } from '../services/outOfOrderApiActions';
import { EditOutOfOrderProps } from '../utils/editOutOfOrderProps';
import { Field, FieldLabel } from '@/components/ui/field';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, ChevronDownIcon } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Calendar } from '@/components/ui/calendar';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';

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
 const { locale } = useBaseConfig();
 const [showFromDatePicker, setShowFromDatePicker] = useState(false);
 const [showToDatePicker, setShowToDatePicker] = useState(false);
 const { control, watch, setValue, register } = useForm<OutOfOrderRoomsSchema>({
  resolver: zodResolver(createOutOfOrderRoomsSchema()),
  defaultValues: {
   ...defaultValues,
   fromDate: null,
   toDate: null,
  },
 });
 const [fromDateValue, toDateValue] = watch(['fromDate', 'toDate']);

 useEffect(() => {
  setValue(
   'fromDate',
   editRoom.targetEditRoom
    ? new Date(editRoom.targetEditRoom.fromDateTimeOffset)
    : null,
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

 return (
  <Drawer
   open={editRoom.showNew}
   onOpenChange={(newValue) => {
    if (newValue) return;
    editRoom.onCloseEdit();
   }}
  >
   <DrawerContent className='h-[min(65svh,40rem)] flex flex-col'>
    <DrawerHeader>
     <DrawerTitle className='text-xl'>
      {editRoom.selectedOutOfOrderRoomID ? dic.filters.edit : dic.filters.new}
     </DrawerTitle>
    </DrawerHeader>
    <div className='grow overflow-auto p-4'>
     <form className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
      <Controller
       control={control}
       name='fromDate'
       render={({ field }) => (
        <Field>
         <FieldLabel htmlFor='fromDate'>{dic.filters.fromDate} *</FieldLabel>
         <Popover
          open={showFromDatePicker}
          onOpenChange={setShowFromDatePicker}
         >
          <PopoverTrigger asChild>
           <Button
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
        <Field>
         <FieldLabel htmlFor='toDate'>{dic.filters.toDate} *</FieldLabel>
         <Popover open={showToDatePicker} onOpenChange={setShowToDatePicker}>
          <PopoverTrigger asChild>
           <Button
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
              setShowFromDatePicker(false);
             }
            }}
           />
          </PopoverContent>
         </Popover>
        </Field>
       )}
      />
      <Field>
       <FieldLabel htmlFor='room'>{dic.filters.room} *</FieldLabel>
       <Controller
        control={control}
        name='room'
        render={({ field }) => (
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            id='room'
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
      <Field>
       <FieldLabel htmlFor='reason'>{dic.info.reason} *</FieldLabel>
       <Controller
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
      <div className='col-span-full flex flex-col-reverse md:flex-row gap-4 justify-end'>
       <Button
        type='button'
        size='lg'
        variant='outline'
        className='md:w-36'
        onClick={() => editRoom.onCloseEdit()}
       >
        {dic.newOrEdit.cancel}
       </Button>
       <Button size='lg' className='md:w-36' type='submit'>
        {dic.newOrEdit.confirm}
       </Button>
      </div>
     </form>
    </div>
   </DrawerContent>
  </Drawer>
 );
}
