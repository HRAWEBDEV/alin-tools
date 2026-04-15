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
import { ChevronsUpDown, ChevronDownIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { FaFilter, FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Field, FieldLabel } from '@/components/ui/field';
import { useDateFns } from '@/hooks/useDateFns';

import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
import type { GuestsExpensesSchema } from '../schemas/guestsExpensesSchema';
import type { RegisterInfo } from '../services/guestsExpensesApiActions';

type SelectOption = { key: string | number; value: string };
type InitialData = {
 rooms: SelectOption[];
 items: SelectOption[];
};

const FILTER_KEYS: (keyof GuestsExpensesSchema)[] = ['date', 'room', 'item'];

const largeBadgeKeys: (keyof GuestsExpensesSchema)[] = ['room', 'item'];
const smallBadgeKeys: (keyof GuestsExpensesSchema)[] = [];
type DrawerMode = 'create' | 'edit' | 'view' | null;
type Props = {
 dic: GuestsExpensesDictionary;
 initData?: InitialData;
 initDataIsLoading?: boolean;
 totalResults?: number;
 onSetMode: (mode: DrawerMode) => void;
 registerInfo: RegisterInfo | null;
};

const SHARED_DRAWER_CLASSES =
 'sm:h-[min(85svh,30rem)] h-[min(95svh,66rem)] flex flex-col';

export default function GuestsExpensesFilters({
 dic,
 initData,
 initDataIsLoading = false,
 totalResults,
 onSetMode,
 registerInfo,
}: Props) {
 const dateFns = useDateFns();
 const { control, setValue, reset, watch } =
  useFormContext<GuestsExpensesSchema>();
 const values = useWatch({ control });
 const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
 const [selectDrawerOpen, setSelectDrawerOpen] = useState<string | null>(null);
 const [showDatePicker, setShowDatePicker] = useState(false);
 const { locale } = useBaseConfig();
 const [dateValue] = watch(['date']);

 const activeFilters = FILTER_KEYS.filter((k) => {
  const val = values[k];
  return val !== null && val !== undefined && val !== '';
 });

 const [sliderRef] = useKeenSlider({
  slides: { perView: 'auto', spacing: 5 },
  rtl: true,
 });

 const filterKeyLabel = (key: keyof GuestsExpensesSchema): string => {
  const fieldsDic = dic.fields;
  switch (key) {
   case 'date':
    return fieldsDic?.date;
   case 'room':
    return fieldsDic?.room;
   case 'item':
    return fieldsDic?.item;
   default:
    return key;
  }
 };

 const filterLabel = (key: keyof GuestsExpensesSchema): string | null => {
  const val = values[key];
  if (val === null || val === undefined || val === '') return null;

  switch (key) {
   case 'room':
    return (
     initData?.rooms.find((r) => String(r.key) === String(val))?.value ??
     String(val)
    );
   case 'item':
    return (
     initData?.items.find((i) => String(i.key) === String(val))?.value ??
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

 const getOptions = (key: 'room' | 'item'): SelectOption[] => {
  if (!initData) return [];
  switch (key) {
   case 'room':
    return initData.rooms;
   case 'item':
    return initData.items;
   default:
    return [];
  }
 };

 function goToNextDay() {
  if (!dateValue) return;
  setValue('date', dateFns.addDays(dateValue, 1));
 }

 function goToPrevDay() {
  if (!dateValue) return;
  setValue('date', dateFns.addDays(dateValue, -1));
 }

 return (
  <div className='flex flex-col gap-2 pt-2 bg-background'>
   <div className='flex gap-2 items-center mb-1'>
    <div className='flex items-center gap-2'>
     <Button
      size='lg'
      className='px-3!'
      disabled={initDataIsLoading || !registerInfo}
      onClick={() => {
       onSetMode('create');
      }}
     >
      {initDataIsLoading ? <Spinner /> : <FaPlus />}
      <span className='hidden lg:inline'>{dic.filters.new}</span>
     </Button>
     <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
      <DrawerTrigger asChild>
       <Button
        size='lg'
        className='text-neutral-600 dark:text-neutral-400 shrink-0'
        variant='outline'
       >
        <FaFilter className='size-4' />
        <span className='hidden md:inline'>{dic.filters?.title}</span>
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
         {dic.filters?.title}{' '}
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
          <Button
           type='button'
           variant='outline'
           onClick={() =>
            reset({
             room: null,
             item: null,
            })
           }
           className='text-destructive border-destructive'
          >
           {dic.filters?.clearAll}
          </Button>
         )}
        </div>
        <div className='flex gap-2 justify-center items-end'>
         <Button variant='outline' className='h-11 px-3' onClick={goToPrevDay}>
          {dic.filters.prev}
         </Button>
         <Button variant='outline' className='h-11 px-3' onClick={goToNextDay}>
          {dic.filters.next}
         </Button>
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
                className={'justify-between h-11 font-normal'}
                onBlur={field.onBlur}
                ref={field.ref}
               >
                <span className='text-start grow overflow-hidden text-ellipsis'>
                 {field.value
                  ? new Date(field.value).toLocaleDateString(locale)
                  : ''}
                </span>
                <div className='flex gap-1 items-center -me-2'>
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
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-6 pb-6'>
         {(['room', 'item'] as const).map((key) => (
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
               className={'justify-between h-11 font-normal'}
              >
               <span className='text-start grow overflow-hidden text-ellipsis'>
                {initDataIsLoading ? (
                 <Spinner className='w-4 h-4' />
                ) : (
                 filterLabel(key)
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
       </div>
      </DrawerContent>
     </Drawer>
     <div className='flex gap-2 items-end'>
      <Button variant='outline' className='h-11 px-3' onClick={goToPrevDay}>
       {dic.filters.prev}
      </Button>
      <Button variant='outline' className='h-11 px-3' onClick={goToNextDay}>
       {dic.filters.next}
      </Button>
     </div>
    </div>

    {activeFilters.length > 0 && (
     <div
      key={activeFilters.join('-')}
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
          <span className='text-neutral-500'>{filterKeyLabel(key)}: </span>
          {filterLabel(key)}
         </p>
         <Button
          variant='ghost'
          size='icon'
          className='text-destructive shrink-0 h-8 w-8'
          disabled={key === 'date'}
          onClick={() => {
           if (key === 'date') return;
           setValue(key, null);
          }}
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
    <div className='flex gap-4 items-center'>
     <div className='text-sm text-muted-foreground'>
      <span className=''>{dic.info?.results}: </span>
      <span className=''>{totalResults}</span>
     </div>
    </div>
   )}
  </div>
 );
}
