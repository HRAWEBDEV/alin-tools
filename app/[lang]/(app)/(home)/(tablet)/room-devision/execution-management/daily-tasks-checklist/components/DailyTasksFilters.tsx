import { useState } from 'react';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
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
 type DailyTasksSchema,
 defaultValues,
} from '../schemas/dailyTasksSchema';
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
import { type InitialData } from '../services/dailyTasksApiActions';
import { Spinner } from '@/components/ui/spinner';
import { DailyTasksChecklistProps } from '../utils/dailyTasksChecklistProps';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { timeNoOptions } from '../utils/timeNo';
import { useDateFns } from '@/hooks/useDateFns';

const smallBadgeKeys: (keyof DailyTasksSchema)[] = [];
const largeBadgeKeys: (keyof DailyTasksSchema)[] = ['maid', 'roomType'];

export default function DailyTasksFilters({
 dic,
 initDataIsLoading,
 initData,
 checklist,
}: {
 dic: DailyTasksChecklistDictionary;
 initData?: InitialData;
 initDataIsLoading: boolean;
 checklist: DailyTasksChecklistProps;
}) {
 const dateFns = useDateFns();
 const [showFromDatePicker, setShowFromDatePicker] = useState(false);
 const { locale, localeInfo } = useBaseConfig();
 const { control, watch, setValue, getValues } =
  useFormContext<DailyTasksSchema>();
 const [dateValue, timeNoValue] = watch(['date', 'timeNo']);

 const [sliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  slides: { perView: 'auto', spacing: 5 },
 });

 const filterKeys = Object.keys(defaultValues) as (keyof DailyTasksSchema)[];
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

 function goToNextDay() {
  const dateValue = getValues('date') || dateFns.startOfToday();
  setValue('date', dateFns.addDays(dateValue, 1));
 }

 function goToPrevDay() {
  const dateValue = getValues('date') || dateFns.startOfToday();
  setValue('date', dateFns.addDays(dateValue, -1));
 }

 return (
  <div className='[&]:[--default-top-offset:var(--top-offset,0)] sticky top-4 lg:top-(--default-top-offset) py-4 bg-background z-3'>
   <div className='flex gap-2 items-center mb-1'>
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
          ({dic.info.results}: {checklist.data?.length})
         </span>
        </DrawerTitle>
       </DrawerHeader>
       <div className='grow overflow-auto p-4'>
        <div className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
         <div className='col-span-full flex justify-center items-center gap-4'>
          <Button size='lg' variant='outline' onClick={goToPrevDay}>
           {dic.filters.prevDay}
          </Button>
          <Button size='lg' variant='outline' onClick={goToNextDay}>
           {dic.filters.nextDay}
          </Button>
         </div>
         <div className='col-span-full'>
          <Tabs dir={localeInfo.contentDirection} defaultValue={timeNoValue}>
           <TabsList className='h-11 mx-auto'>
            {timeNoOptions.map((item) => (
             <TabsTrigger
              key={item}
              value={item}
              className='w-24 sm:w-32'
              onClick={() => setValue('timeNo', item)}
             >
              {dic.filters[item]}
             </TabsTrigger>
            ))}
           </TabsList>
          </Tabs>
         </div>
         <Field className='col-span-full'>
          <FieldLabel htmlFor='maid'>{dic.filters.maid}</FieldLabel>
          <Controller
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
               <DrawerTitle>{dic.filters.maid}</DrawerTitle>
              </DrawerHeader>
              <div className='grow overflow-hidden overflow-y-auto'>
               <ul>
                {initData?.maids.map((item) => (
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
         <Controller
          control={control}
          name='date'
          render={({ field }) => (
           <Field>
            <FieldLabel htmlFor='date'>{dic.filters.date}</FieldLabel>
            <Popover
             open={showFromDatePicker}
             onOpenChange={setShowFromDatePicker}
            >
             <PopoverTrigger asChild>
              <Button
               variant='outline'
               id='date'
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
               defaultMonth={dateValue || undefined}
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
        </div>
       </div>
      </DrawerContent>
     </Drawer>
     <Button
      size='lg'
      className='px-3 hidden lg:flex'
      variant='outline'
      onClick={goToPrevDay}
     >
      {dic.filters.prevDay}
     </Button>
     <Button
      size='lg'
      className='px-3 hidden lg:flex'
      variant='outline'
      onClick={goToNextDay}
     >
      {dic.filters.nextDay}
     </Button>
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

      if (item.key === 'date' && badgeValue) {
       badgeValue = new Date(badgeValue as string).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
       });
      } else if (item.key === 'timeNo' && badgeValue) {
       badgeValue = dic.filters[item.value as DailyTasksSchema['timeNo']];
      }

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
         disabled={item.key === 'date' || item.key === 'maid'}
         className='text-destructive'
         onClick={() => {
          setValue(
           item.key,
           defaultValues[item.key] as DailyTasksSchema[keyof DailyTasksSchema],
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
      {dic.info.results}:{' '}
     </span>
     <span>{checklist.data?.length}</span>
    </div>
   </div>
  </div>
 );
}
