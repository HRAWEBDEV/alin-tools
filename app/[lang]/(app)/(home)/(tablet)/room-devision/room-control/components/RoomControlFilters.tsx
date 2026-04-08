import { useState } from 'react';
import { type RoomControlPageDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-control/dictionary';
import { FaFilter } from 'react-icons/fa';
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
 type RoomControlSchema,
 defaultValues,
} from '../schemas/roomControlSchema';
import { ChevronsUpDown } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Checkbox } from '@/components/ui/checkbox';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type InitialData } from '../services/roomControlApiActions';
import { Spinner } from '@/components/ui/spinner';
import { type RoomControlProps } from '../utils/roomControlProps';
import { roomControlSteps } from '../../rooms-rack/services/room-control/roomControlApiActions';
import { getRoomControlStyles } from '../../rooms-rack/utils/room-control/roomControl';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';

const smallBadgeKeys: (keyof RoomControlSchema)[] = ['floor'];
const largeBadgeKeys: (keyof RoomControlSchema)[] = ['roomType'];

export default function RoomControlFilters({
 dic,
 initDataIsLoading,
 initData,
 roomControlDic,
 roomControl,
}: {
 dic: RoomControlPageDictionary;
 initData?: InitialData;
 initDataIsLoading: boolean;
 roomControl: RoomControlProps;
 roomControlDic: RoomControlDictionary;
}) {
 const { localeInfo } = useBaseConfig();
 const { control, watch, setValue } = useFormContext<RoomControlSchema>();

 const [sliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  slides: { perView: 'auto', spacing: 5 },
 });

 const filterKeys = Object.keys(defaultValues) as (keyof RoomControlSchema)[];
 const filterValues = watch(filterKeys);

 const filtersKeyValue = filterValues.map((value, i) => {
  return {
   key: filterKeys[i],
   value: value instanceof Date ? value.toISOString() : value?.value,
  };
 });

 const activeFilters = filtersKeyValue.filter((item) => !!item.value);

 return (
  <div className='[&]:[--default-top-offset:var(--top-offset,0)] top-0 py-4 bg-background z-3 sticky'>
   <div className='flex gap-2 items-center mb-1'>
    <div>
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
        <span>
         ({dic.filters.result}: {roomControl.data?.length})
        </span>
       </Button>
      </DrawerTrigger>
      <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
       <DrawerHeader>
        <DrawerTitle className='text-xl'>
         {dic.filters.filters}{' '}
         <span className='text-sm text-neutral-700 dark:text-neutral-400'>
          ({dic.filters.result}: {roomControl.data?.length})
         </span>
        </DrawerTitle>
       </DrawerHeader>
       <div className='grow overflow-auto p-4'>
        <div className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
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
                {field.value ? field.value.value : ''}
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
             <DrawerContent className='h-[min(60svh,35rem)]'>
              <DrawerHeader className='hidden'>
               <DrawerTitle>{dic.filters.floor}</DrawerTitle>
              </DrawerHeader>
              <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
               <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
                {dic.filters.floor}
               </h1>
              </div>
              <div>
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
          <FieldLabel htmlFor='roomType'>{dic.filters.roomType}</FieldLabel>
          <Controller
           control={control}
           name='roomType'
           render={({ field }) => (
            <Drawer>
             <DrawerTrigger asChild>
              <Button
               id='roomType'
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
             <DrawerContent className='h-[min(60svh,35rem)]'>
              <DrawerHeader className='hidden'>
               <DrawerTitle>{dic.filters.roomType}</DrawerTitle>
              </DrawerHeader>
              <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
               <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
                {dic.filters.roomType}
               </h1>
              </div>
              <div>
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

      const badgeValue = item.value;

      return (
       <Badge
        key={item.key}
        variant='outline'
        data-badge-size={badgeSizeType}
        className='keen-slider__slide inline-flex justify-between items-center rounded-md py-0.5 font-medium bg-neutral-100 dark:bg-neutral-900 text-[0.85rem] data-[badge-size="small"]:basis-32 data-[badge-size="small"]:w-32 data-[badge-size="normal"]:basis-46 data-[badge-size="normal"]:w-46 data-[badge-size="large"]:basis-72 data-[badge-size="large"]:w-72 h-10'
       >
        <p className='text-start grow overflow-hidden text-ellipsis'>
         <span className='text-neutral-500'>{dic.filters[item.key]}: </span>
         {badgeValue}
        </p>
        <Button
         variant='ghost'
         size='icon-sm'
         className='text-destructive'
         onClick={() => {
          setValue(
           item.key,
           defaultValues[
            item.key
           ] as RoomControlSchema[keyof RoomControlSchema],
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
   <div className='mt-2'>
    <div className='flex flex-wrap gap-3'>
     {roomControlSteps.map((item) => {
      const stepStyle = getRoomControlStyles(item);
      return (
       <div key={item} className='flex gap-1 items-center'>
        <div
         className={`w-7 aspect-square ${stepStyle.indicator}  rounded-lg`}
        ></div>
        <span className='text-neutral-700 dark:text-neutral-400 font-medium text-sm'>
         {roomControlDic.houseControl[item]}
        </span>
       </div>
      );
     })}
    </div>
   </div>
  </div>
 );
}

// <div className='text-sm'>
//  <span className='text-neutral-700 dark:text-neutral-400'>
//   {dic.filters.result}:{' '}
//  </span>
//  <span>{roomControl.data?.length}</span>
// </div>
