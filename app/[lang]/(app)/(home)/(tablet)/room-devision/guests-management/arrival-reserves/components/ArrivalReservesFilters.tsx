'use client';

import { useState } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useKeenSlider } from 'keen-slider/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';
import { ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FaFilter, FaRegTrashAlt } from 'react-icons/fa';
import type { ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon } from 'lucide-react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Field, FieldLabel } from '@/components/ui/field';

type SelectOption = { key: string | number; value: string };
type InitialData = {
 customers: SelectOption[];
 roomTypes: SelectOption[];
};

type ArrivalReservesFilterForm = {
 date: string | Date | null;
 roomTypeID: string | null;
 customerID: string | null;
 withRoomNo: boolean;
 withoutRoomNo: boolean;
 charged: boolean;
 notCharged: boolean;
 noShow: boolean;
 canceled: boolean;
};

const FILTER_KEYS: (keyof ArrivalReservesFilterForm)[] = [
 'date',
 'roomTypeID',
 'customerID',
 'withRoomNo',
 'withoutRoomNo',
 'charged',
 'notCharged',
 'noShow',
 'canceled',
];

const smallBadgeKeys: (keyof ArrivalReservesFilterForm)[] = [
 'withRoomNo',
 'withoutRoomNo',
 'charged',
 'notCharged',
 'noShow',
 'canceled',
];
const largeBadgeKeys: (keyof ArrivalReservesFilterForm)[] = [
 'customerID',
 'roomTypeID',
];

type Props = {
 dic: ArrivalReservesDictionary;
 initData?: InitialData;
 initDataIsLoading?: boolean;
 totalResults?: number;
};

const SHARED_DRAWER_CLASSES =
 'sm:h-[min(85svh,30rem)] h-[min(95svh,66rem)] flex flex-col';

export default function ArrivalReservesFilters({
 dic,
 initData,
 initDataIsLoading = false,
 totalResults,
}: Props) {
 const { control, setValue, reset } =
  useFormContext<ArrivalReservesFilterForm>();
 const values = useWatch({ control });
 const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
 const [selectDrawerOpen, setSelectDrawerOpen] = useState<string | null>(null);
 const [showDatePicker, setShowDatePicker] = useState(false);
 const { locale } = useBaseConfig();

 const activeFilters = FILTER_KEYS.filter((k) => {
  const val = values[k];
  return val !== null && val !== false && val !== '';
 });

 const [sliderRef] = useKeenSlider({
  slides: { perView: 'auto', spacing: 5 },
  rtl: true,
 });

 const filterKeyLabel = (key: keyof ArrivalReservesFilterForm): string => {
  switch (key) {
   case 'date':
    return dic.fields.arrivalDate;
   case 'roomTypeID':
    return dic.fields.roomType;
   case 'customerID':
    return dic.filters.customer;
   case 'withRoomNo':
    return dic.filters.withRoomNo;
   case 'withoutRoomNo':
    return dic.filters.withRoomNo;
   case 'charged':
    return dic.filters.charged;
   case 'notCharged':
    return dic.filters.notCharged;
   case 'noShow':
    return dic.filters.noShow;
   case 'canceled':
    return dic.filters.canceled;
   default:
    return key;
  }
 };

 const filterLabel = (key: keyof ArrivalReservesFilterForm): string | null => {
  const val = values[key];
  if (val === null || val === false || val === '') return null;

  switch (key) {
   case 'roomTypeID':
    return (
     initData?.roomTypes.find((r) => String(r.key) === String(val))?.value ??
     String(val)
    );
   case 'customerID':
    return (
     initData?.customers.find((c) => String(c.key) === String(val))?.value ??
     String(val)
    );
   case 'date':
    return val instanceof Date
     ? val.toLocaleDateString(locale)
     : new Date(String(val)).toLocaleDateString(locale);
   default:
    return filterKeyLabel(key);
  }
 };

 const getOptions = (key: 'roomTypeID' | 'customerID'): SelectOption[] => {
  if (!initData) return [];
  switch (key) {
   case 'roomTypeID':
    return initData.roomTypes;
   case 'customerID':
    return initData.customers;
   default:
    return [];
  }
 };

 return (
  <div className='flex flex-col gap-2 pt-2 bg-background'>
   <div className='flex gap-2 items-center mb-1'>
    <div className='flex items-center gap-2'>
     <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
      <DrawerTrigger asChild>
       <Button
        size='lg'
        className='text-neutral-600 dark:text-neutral-400 shrink-0'
        variant='outline'
       >
        <FaFilter className='size-4' />
        <span className='hidden md:inline'>{dic.filters.title}</span>
        {activeFilters.length > 0 && (
         <Badge variant='destructive' className='size-6'>
          {activeFilters.length}
         </Badge>
        )}
       </Button>
      </DrawerTrigger>
      <DrawerContent className={SHARED_DRAWER_CLASSES} dir='rtl'>
       <DrawerHeader className='pb-1 shrink-0'>
        <DrawerTitle>
         {dic.filters.title}{' '}
         {totalResults !== undefined && (
          <span className='text-sm text-neutral-700 dark:text-neutral-400 font-normal ml-2'>
           ({totalResults} {dic.info?.results})
          </span>
         )}
        </DrawerTitle>
       </DrawerHeader>

       <div className='p-5 pt-0 flex flex-col gap-5 overflow-y-auto max-w-[min(100%,40rem)] mx-auto w-full'>
        <div className='flex items-center justify-end mb-4 mt-2 shrink-0'>
         {activeFilters.length > 0 && (
          <button
           onClick={() =>
            reset({
             date: null,
             roomTypeID: null,
             customerID: null,
             withRoomNo: false,
             withoutRoomNo: false,
             charged: false,
             notCharged: false,
             noShow: false,
             canceled: false,
            })
           }
           className='text-xs text-destructive hover:underline cursor-pointer'
          >
           {dic.filters.clearAll}
          </button>
         )}
        </div>

        <div className='grid grid-cols-1 gap-6 shrink-0'>
         <Controller
          control={control}
          name='date'
          render={({ field }) => {
           const dateValue = field.value ? new Date(field.value) : undefined;
           return (
            <Field>
             <FieldLabel htmlFor='date'>{filterKeyLabel('date')}</FieldLabel>
             <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
               <Button
                variant='outline'
                id='date'
                className={cn(
                 'justify-between h-11 font-normal text-muted-foreground',
                 field.value && 'border-primary text-primary',
                )}
                onBlur={field.onBlur}
                ref={field.ref}
               >
                <span className='text-start grow overflow-hidden text-ellipsis'>
                 {field.value
                  ? new Date(field.value).toLocaleDateString(locale)
                  : dic.info?.selectDate}
                </span>
                <div className='flex gap-1 items-center -me-2'>
                 {field.value && (
                  <Button
                   type='button'
                   variant='ghost'
                   size='icon'
                   onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(null);
                   }}
                   className='text-rose-700 dark:text-rose-400 h-8 w-8 bg-transparent!'
                  >
                   <FaRegTrashAlt className='size-4' />
                  </Button>
                 )}
                 <ChevronDownIcon className='opacity-50 size-4 shrink-0' />
                </div>
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
                selected={dateValue}
                defaultMonth={dateValue}
                onSelect={(newValue) => {
                 if (newValue) {
                  field.onChange(newValue);
                  setShowDatePicker(false);
                 }
                }}
               />
              </PopoverContent>
             </Popover>
            </Field>
           );
          }}
         />
        </div>

        <div className='grid sm:grid-cols-2 grid-cols-1 gap-6 pb-2'>
         {(['roomTypeID', 'customerID'] as const).map((key) => (
          <Controller
           key={key}
           control={control}
           name={key}
           render={({ field }) => (
            <>
             <Field>
              <FieldLabel htmlFor={key}>{filterKeyLabel(key)}</FieldLabel>
              <Button
               id={key}
               variant='outline'
               onClick={() => setSelectDrawerOpen(key)}
               className={cn(
                'justify-between h-11 font-normal',
                field.value && 'border-primary text-primary',
               )}
              >
               <span className='text-start grow overflow-hidden text-ellipsis'>
                {initDataIsLoading ? (
                 <Spinner className='w-4 h-4' />
                ) : (
                 (filterLabel(key) ??
                 `${dic.info?.select} ${filterKeyLabel(key)}`)
                )}
               </span>
               <div className='flex gap-1 items-center -me-2'>
                {field.value && (
                 <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                   e.stopPropagation();
                   field.onChange(null);
                  }}
                  className='text-rose-700 dark:text-rose-400 h-8 w-8 bg-transparent!'
                 >
                  <FaRegTrashAlt className='size-4' />
                 </Button>
                )}
                <ChevronsUpDown className='opacity-50 size-4 shrink-0' />
               </div>
              </Button>
             </Field>

             <Drawer
              open={selectDrawerOpen === key}
              onOpenChange={(open) => !open && setSelectDrawerOpen(null)}
             >
              <DrawerContent className={SHARED_DRAWER_CLASSES} dir='rtl'>
               <DrawerHeader className='shrink-0'>
                <DrawerTitle className='text-xl'>
                 {filterKeyLabel(key)}
                </DrawerTitle>
               </DrawerHeader>
               <div className='grow overflow-hidden overflow-y-auto mb-6'>
                <ul>
                 {getOptions(key)?.map((opt) => (
                  <li
                   key={opt.key}
                   className='flex gap-1 items-center ps-6 py-2 cursor-pointer hover:bg-muted/50 transition-colors'
                   onClick={() => {
                    field.onChange(
                     field.value === String(opt.key) ? null : String(opt.key),
                    );
                    setSelectDrawerOpen(null);
                   }}
                  >
                   <Checkbox
                    className='size-6 pointer-events-none'
                    checked={field.value === String(opt.key)}
                   />
                   <Button
                    tabIndex={-1}
                    variant='ghost'
                    className='w-full justify-start h-auto text-lg pointer-events-none'
                   >
                    <span>{opt.value}</span>
                   </Button>
                  </li>
                 ))}
                 {getOptions(key).length === 0 && (
                  <li className='text-center my-6 font-normal text-destructive'>
                   {dic.info?.noItemFound}
                  </li>
                 )}
                </ul>
               </div>
              </DrawerContent>
             </Drawer>
            </>
           )}
          />
         ))}
        </div>

        <div className='grid grid-cols-2 gap-4 pb-6 mt-2'>
         {(
          [
           'withRoomNo',
           'withoutRoomNo',
           'charged',
           'notCharged',
           'noShow',
           'canceled',
          ] as const
         ).map((boolKey) => (
          <div key={boolKey} className='flex items-center gap-2'>
           <Controller
            name={boolKey}
            control={control}
            render={({ field }) => (
             <Checkbox
              id={boolKey}
              className='size-5 rounded-sm'
              checked={field.value}
              onCheckedChange={field.onChange}
             />
            )}
           />
           <label
            htmlFor={boolKey}
            className='text-sm font-medium leading-none cursor-pointer'
           >
            {filterKeyLabel(boolKey)}
           </label>
          </div>
         ))}
        </div>
       </div>
      </DrawerContent>
     </Drawer>
    </div>

    {activeFilters.length > 0 && (
     <div
      key={`expand-${activeFilters.length}`}
      ref={sliderRef}
      className='keen-slider grow relative'
      dir='rtl'
     >
      {activeFilters.map((key) => {
       let badgeSizeType: 'normal' | 'small' | 'large' = 'normal';
       if (smallBadgeKeys.includes(key)) badgeSizeType = 'small';
       else if (largeBadgeKeys.includes(key)) badgeSizeType = 'large';

       return (
        <Badge
         key={key}
         variant='outline'
         data-badge-size={badgeSizeType}
         className='keen-slider__slide inline-flex justify-between items-center rounded-md py-0.5 font-medium bg-neutral-100 dark:bg-neutral-900 text-[0.85rem] data-[badge-size="small"]:basis-32 data-[badge-size="small"]:w-32 data-[badge-size="normal"]:basis-46 data-[badge-size="normal"]:w-46 data-[badge-size="large"]:basis-72 data-[badge-size="large"]:w-72 h-10'
        >
         <p className='text-start grow truncate'>
          {typeof values[key] === 'boolean' ? (
           <span>{filterKeyLabel(key)}</span>
          ) : (
           <>
            <span className='text-neutral-500'>{filterKeyLabel(key)}: </span>
            {filterLabel(key)}
           </>
          )}
         </p>
         <Button
          variant='ghost'
          size='icon'
          className='text-destructive shrink-0 h-8 w-8'
          onClick={() =>
           setValue(key, typeof values[key] === 'boolean' ? false : null)
          }
         >
          <FaRegTrashAlt />
         </Button>
        </Badge>
       );
      })}
     </div>
    )}
   </div>

   {totalResults !== undefined && (
    <div className='text-sm flex gap-4 items-center mt-1'>
     <div>
      <span className='text-neutral-700 dark:text-neutral-400'>
       {dic.info?.results}:{' '}
      </span>
      <span className='font-medium'>{totalResults}</span>
     </div>
    </div>
   )}
  </div>
 );
}
