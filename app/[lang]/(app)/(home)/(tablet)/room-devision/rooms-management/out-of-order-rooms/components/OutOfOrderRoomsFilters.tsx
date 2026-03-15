import { useState } from 'react';
import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKeenSlider } from 'keen-slider/react';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import { useFormContext, Controller } from 'react-hook-form';
import {
 type OutOfOrderRoomsSchema,
 defaultValues,
} from '../schemas/outOfOrderRoomsSchema';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronsUpDown, ChevronDownIcon } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Checkbox } from '@/components/ui/checkbox';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type InitialData } from '../services/outOfOrderApiActions';
import { Spinner } from '@/components/ui/spinner';
import { type OutOfOrderRoomsProps } from '../utils/outOfOrderRoomsProps';
import { type EditOutOfOrderProps } from '../utils/editOutOfOrderProps';

const smallBadgeKeys: (keyof OutOfOrderRoomsSchema)[] = ['floor', 'room'];
const largeBadgeKeys: (keyof OutOfOrderRoomsSchema)[] = ['roomType'];

export default function OutOfOrderRoomsFilters({
 dic,
 initDataIsLoading,
 initData,
 rooms,
 editRoom,
}: {
 dic: OutOfOrderRoomsDictionary;
 initData?: InitialData;
 initDataIsLoading: boolean;
 rooms: OutOfOrderRoomsProps;
 editRoom: EditOutOfOrderProps;
}) {
 const [showFromDatePicker, setShowFromDatePicker] = useState(false);
 const [showToDatePicker, setShowToDatePicker] = useState(false);
 const { locale, localeInfo } = useBaseConfig();
 const { control, watch, setValue } = useFormContext<OutOfOrderRoomsSchema>();
 const [fromDateValue, toDateValue] = watch(['fromDate', 'toDate']);

 const [sliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  slides: { perView: 'auto', spacing: 5 },
 });

 const filterKeys = Object.keys(
  defaultValues,
 ) as (keyof OutOfOrderRoomsSchema)[];
 const filterValues = watch(filterKeys);

 const filtersKeyValue = filterValues.map((value, i) => {
  const convertValue = (() => {
   if (value instanceof Date) {
    return value.toISOString();
   }
   if (typeof value === 'string') {
    return value;
   }
   if (!value) {
    return '';
   }
   return value.value;
  })();

  return {
   key: filterKeys[i],
   value: convertValue,
  };
 });

 const activeFilters = filtersKeyValue.filter((item) => !!item.value);

 return (
  <div className='[&]:[--default-top-offset:var(--top-offset,0)] sticky top-4 lg:top-(--default-top-offset) py-4 bg-background z-3'>
   <div className='flex gap-2 items-center mb-1'>
    <Button
     size='lg'
     className='px-3!'
     disabled={initDataIsLoading}
     onClick={() => {
      editRoom.onShowEdit(null);
     }}
    >
     {initDataIsLoading ? <Spinner /> : <FaPlus />}
     <span className='hidden lg:inline'>{dic.filters.new}</span>
    </Button>
    <div className='flex items-center gap-2'>
     <Drawer>
      <DrawerTrigger>
       <Button
        variant='outline'
        size='lg'
        className='text-neutral-600 dark:text-neutral-400'
       >
        <FaFilter className='size-4' />
        <span className='hidden md:inline'>{dic.filters.filters}</span>
        {true && (
         <Badge variant='destructive' className='size-6'>
          {activeFilters.length}
         </Badge>
        )}
       </Button>
      </DrawerTrigger>
      <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
       <DrawerHeader>
        <DrawerTitle className='text-xl'>
         {dic.filters.filters}{' '}
         <span className='text-sm text-neutral-700 dark:text-neutral-400'>
          ({dic.info.results}: {rooms.data?.pages[0]?.outOfOrders.rowsCount})
         </span>
        </DrawerTitle>
       </DrawerHeader>
       <div className='grow overflow-auto p-4'>
        <div className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
         <Controller
          control={control}
          name='fromDate'
          render={({ field }) => (
           <Field>
            <FieldLabel htmlFor='fromDate'>{dic.filters.fromDate}</FieldLabel>
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
             <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='start'
             >
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
            <FieldLabel htmlFor='toDate'>{dic.filters.toDate}</FieldLabel>
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
             <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='start'
             >
              <Calendar
               mode='single'
               captionLayout='dropdown'
               className='[&]:[--cell-size:2.6rem]'
               selected={field.value || undefined}
               defaultMonth={toDateValue || undefined}
               disabled={(date) =>
                fromDateValue
                 ? date.getTime() <= fromDateValue?.getTime()
                 : false
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
         <Field className='col-span-2'>
          <FieldLabel htmlFor='room-type'>{dic.filters.roomType}</FieldLabel>
          <Controller
           control={control}
           name='roomType'
           render={({ field }) => (
            <Drawer>
             <DrawerTrigger asChild>
              <Button
               id='room-type'
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
                {field.value && (
                 <Button
                  type='button'
                  variant={'ghost'}
                  size={'icon'}
                  onClick={(e) => {
                   e.stopPropagation();
                   field.onChange(null);
                  }}
                  className='text-rose-700 dark:text-rose-400'
                 >
                  <FaRegTrashAlt />
                 </Button>
                )}
                <ChevronsUpDown className='opacity-50' />
               </div>
              </Button>
             </DrawerTrigger>
             <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
              <DrawerHeader>
               <DrawerTitle className='text-xl'>
                {dic.filters.roomType}
               </DrawerTitle>
              </DrawerHeader>
              <div className='grow overflow-hidden overflow-y-auto'>
               <ul>
                {initData?.roomTypes.map((item) => (
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
          <FieldLabel htmlFor='floor'>{dic.filters.floor}</FieldLabel>
          <Controller
           control={control}
           name='floor'
           render={({ field }) => (
            <Drawer>
             <DrawerTrigger asChild>
              <Button
               id='floor'
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
                {field.value && (
                 <Button
                  type='button'
                  variant={'ghost'}
                  size={'icon'}
                  onClick={(e) => {
                   e.stopPropagation();
                   field.onChange(null);
                  }}
                  className='text-rose-700 dark:text-rose-400'
                 >
                  <FaRegTrashAlt />
                 </Button>
                )}
                <ChevronsUpDown className='opacity-50' />
               </div>
              </Button>
             </DrawerTrigger>
             <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
              <DrawerHeader className='text-xl'>
               <DrawerTitle>{dic.filters.floor}</DrawerTitle>
              </DrawerHeader>
              <div className='grow overflow-hidden overflow-y-auto'>
               <ul>
                {initData?.floors.map((item) => (
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
          <FieldLabel htmlFor='room'>{dic.filters.room}</FieldLabel>
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
                {field.value && (
                 <Button
                  type='button'
                  variant={'ghost'}
                  size={'icon'}
                  onClick={(e) => {
                   e.stopPropagation();
                   field.onChange(null);
                  }}
                  className='text-rose-700 dark:text-rose-400'
                 >
                  <FaRegTrashAlt />
                 </Button>
                )}
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
                {initData?.rooms.map((item) => (
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
        </div>
       </div>
      </DrawerContent>
     </Drawer>
    </div>
    <div
     key={`expand-${activeFilters.length}`}
     ref={sliderRef}
     className='keen-slider grow relative'
    >
     {activeFilters.map((item) => {
      let badgeSizeType: 'normal' | 'small' | 'large' = 'normal';
      if (smallBadgeKeys.includes(item.key)) {
       badgeSizeType = 'small';
      } else if (largeBadgeKeys.includes(item.key)) {
       badgeSizeType = 'large';
      }

      let badgeValue = item.value;

      if ((item.key === 'fromDate' || item.key === 'toDate') && badgeValue) {
       badgeValue = new Date(badgeValue as string).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
       });
      }

      return (
       <Badge
        key={item.key}
        variant='outline'
        data-badge-size={badgeSizeType}
        className='keen-slider__slide inline-flex justify-between items-center rounded-md py-0.5 font-medium bg-neutral-100 dark:bg-neutral-900 text-[0.85rem] data-[badge-size="small"]:basis-32 data-[badge-size="small"]:w-32 data-[badge-size="normal"]:basis-46 data-[badge-size="normal"]:w-46 data-[badge-size="large"]:basis-72 data-[badge-size="large"]:w-72 h-10'
       >
        <p className='text-start grow overflow-hidden text-ellipsis'>
         <span className='text-neutral-500'>{dic.info[item.key]}: </span>
         {badgeValue}
        </p>
        <Button
         variant='ghost'
         size='icon-sm'
         disabled={item.key === 'fromDate' || item.key === 'toDate'}
         className='text-destructive'
         onClick={() => {
          setValue(
           item.key,
           defaultValues[
            item.key
           ] as OutOfOrderRoomsSchema[keyof OutOfOrderRoomsSchema],
          );
         }}
        >
         <FaRegTrashAlt />
        </Button>
       </Badge>
      );
     })}
    </div>
   </div>
   <div className='text-sm flex gap-4 items-center'>
    <div>
     <span className='text-neutral-700 dark:text-neutral-400'>
      {dic.info.nightPerRoom}:{' '}
     </span>
     <span className='text-primary font-medium'>
      {rooms.data?.pages[0]?.rooms}
     </span>
    </div>
    <div>
     <span className='text-neutral-700 dark:text-neutral-400'>
      {dic.info.results}:{' '}
     </span>
     <span>{rooms.data?.pages[0]?.outOfOrders.rowsCount}</span>
    </div>
   </div>
  </div>
 );
}
