import { useState } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
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
 type GuestExpensesSchema,
 defaultValues,
} from '../../../schemas/guest-expenses/guestExpensesSchema';
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
import { Spinner } from '@/components/ui/spinner';
import { useDateFns } from '@/hooks/useDateFns';
import { type InitialData } from '../../../services/guest-expenses/guestExpensesApiActions';
import { type EditStayRevenueProps } from '../../../utils/guest-expenses/EditStayRevenueProps';

const smallBadgeKeys: (keyof GuestExpensesSchema)[] = [];
const largeBadgeKeys: (keyof GuestExpensesSchema)[] = [];

export default function StayExpensesFilters({
 dic,
 initialData,
 initialDataIsLoading,
 editRevenueProps,
 results,
}: {
 dic: RoomsRackDictionary;
 initialData?: InitialData;
 initialDataIsLoading: boolean;
 editRevenueProps: EditStayRevenueProps;
 results: number;
}) {
 const dateFns = useDateFns();
 const [showDatePicker, setShowDatePicker] = useState(false);
 const { locale, localeInfo } = useBaseConfig();
 const { control, watch, setValue, getValues } =
  useFormContext<GuestExpensesSchema>();
 const dateValue = watch('date');

 const [sliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  slides: { perView: 'auto', spacing: 5 },
 });

 const filterKeys = Object.keys(defaultValues) as (keyof GuestExpensesSchema)[];
 const filterValues = watch(filterKeys);

 const filtersKeyValue = filterValues.map((value, i) => {
  return {
   key: filterKeys[i],
   value: value instanceof Date ? value.toISOString() : value?.value,
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
  <div className='[&]:[--default-top-offset:var(--top-offset,0)] sticky top-0 lg:top-(--default-top-offset) bg-background z-3 py-2'>
   <div className='flex gap-2 items-center mb-1'>
    {/*
       <Button
        size='lg'
        className='px-3!'
        disabled={initialDataIsLoading}
        onClick={() => {
         editRevenueProps.onShowEditRevenue(null);
        }}
       >
        {initialDataIsLoading ? <Spinner /> : <FaPlus />}
        <span className='hidden lg:inline'>{dic.guestExpensesStay.new}</span>
       </Button>
    */}
    <div>
     <Drawer>
      <DrawerTrigger>
       <Button
        variant='outline'
        size='lg'
        className='text-neutral-600 dark:text-neutral-400'
       >
        <FaFilter className='size-4' />
        <span className='hidden md:inline'>
         {dic.guestExpensesStay.filters}
        </span>
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
         {dic.guestExpensesStay.filters}{' '}
         <span className='text-sm text-neutral-700 dark:text-neutral-400'>
          ({dic.guestExpensesStay.results}: {results})
         </span>
        </DrawerTitle>
       </DrawerHeader>
       <div className='grow overflow-auto p-4'>
        <div className='mx-auto w-[min(100%,40rem)] grid grid-cols-1 sm:grid-cols-2 gap-4'>
         <div className='col-span-full flex justify-center items-center gap-4'>
          <Button size='lg' variant='outline' onClick={goToPrevDay}>
           {dic.guestExpensesStay.prevDay}
          </Button>
          <Button size='lg' variant='outline' onClick={goToNextDay}>
           {dic.guestExpensesStay.nextDay}
          </Button>
         </div>
         <Controller
          control={control}
          name='date'
          render={({ field }) => (
           <Field>
            <FieldLabel htmlFor='date'>{dic.filters.date}</FieldLabel>
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
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
               <div className='flex gap-1 items-center -me-2'>
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
                <ChevronDownIcon />
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
               defaultMonth={dateValue || undefined}
               selected={field.value || undefined}
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
          )}
         />
         <Field>
          <FieldLabel htmlFor='revenue-type'>
           {dic.guestExpensesStay.revenueType}
          </FieldLabel>
          <Controller
           control={control}
           name='revenueType'
           render={({ field }) => (
            <Drawer>
             <DrawerTrigger asChild>
              <Button
               id='revenue-type'
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
                {initialDataIsLoading && <Spinner />}
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
               <DrawerTitle>{dic.guestExpensesStay.revenueType}</DrawerTitle>
              </DrawerHeader>
              <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
               <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
                {dic.guestExpensesStay.revenueType}
               </h1>
              </div>
              <div>
               <ul>
                {initialData?.items.map((item) => (
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
    <Button
     size='lg'
     className='px-3 hidden lg:flex'
     variant='outline'
     onClick={goToPrevDay}
    >
     {dic.guestExpensesStay.prevDay}
    </Button>
    <Button
     size='lg'
     className='px-3 hidden lg:flex'
     variant='outline'
     onClick={goToNextDay}
    >
     {dic.guestExpensesStay.nextDay}
    </Button>
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
       badgeValue = new Date(badgeValue).toLocaleDateString(locale, {
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
         <span className='text-neutral-500'>
          {dic.guestExpensesStay[item.key]}:{' '}
         </span>
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
           ] as GuestExpensesSchema[keyof GuestExpensesSchema],
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
  </div>
 );
}
