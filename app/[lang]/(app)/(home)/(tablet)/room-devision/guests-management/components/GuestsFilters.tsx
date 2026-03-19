'use client';

import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useKeenSlider } from 'keen-slider/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';
import { X, Check } from 'lucide-react';
import { type GuestsFilterForm } from './GuestsListWrapper';
import { useState } from 'react';
import { GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import {
 type InitialData,
 type SelectOption,
} from '../services/guestsListApiActions';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FaFilter } from 'react-icons/fa';

const FILTER_KEYS: (keyof GuestsFilterForm)[] = [
 'folio',
 'reserveNo',
 'nationality',
 'specialGuest',
 'group',
 'room',
];

type Props = {
 dic: GuestsManagementDictionary;
 initData: InitialData | undefined;
 initDataIsLoading: boolean;
 totalResults?: number;
 onSubmit?: () => void;
};

export default function GuestsFilters({
 dic,
 initData,
 initDataIsLoading,
 totalResults,
 onSubmit,
}: Props) {
 const { control, setValue, register, reset } =
  useFormContext<GuestsFilterForm>();
 const values = useWatch({ control });
 const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
 const [selectDrawerOpen, setSelectDrawerOpen] = useState<string | null>(null);

 const activeFilters = FILTER_KEYS.filter((k) => values[k]);
 const [sliderRef] = useKeenSlider({ slides: { perView: 'auto', spacing: 8 } });

 const filterKeyLabel = (key: keyof GuestsFilterForm): string => {
  switch (key) {
   case 'folio':
    return dic.filters.folio;
   case 'reserveNo':
    return dic.filters.reserveNo;
   case 'nationality':
    return dic.filters.nationality;
   case 'specialGuest':
    return dic.fields.specialGuest;
   case 'group':
    return dic.fields.customerName;
   case 'room':
    return dic.fields.room;
   default:
    return key;
  }
 };

 const filterLabel = (key: keyof GuestsFilterForm): string | null => {
  const val = values[key];
  if (!val) return null;
  switch (key) {
   case 'nationality':
    return (
     initData?.nationalities.find((n) => n.value === val)?.value ?? String(val)
    );
   case 'room':
    return initData?.rooms.find((r) => r.value === val)?.value ?? String(val);
   case 'specialGuest':
    return (
     initData?.vipGuestTypes.find((v) => v.value === val)?.value ?? String(val)
    );
   case 'group':
    return (
     initData?.customers.find((c) => c.value === val)?.value ?? String(val)
    );
   default:
    return String(val);
  }
 };

 const handleCancel = () => {
  reset();
  setFilterDrawerOpen(false);
 };

 const handleApply = () => {
  onSubmit?.();
  setFilterDrawerOpen(false);
 };

 return (
  <div className='flex flex-col gap-2 px-2 pt-2'>
   <div className='flex items-center gap-2'>
    <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
     <DrawerTrigger asChild>
      <Button
       size='lg'
       className='text-neutral-600 dark:text-neutral-400'
       variant='outline'
      >
       {dic.filters.title}
       <FaFilter className='size-4' />
       {activeFilters.length > 0 && (
        <Badge variant='destructive' className='size-6'>
         {activeFilters.length}
        </Badge>
       )}
      </Button>
     </DrawerTrigger>

     <DrawerContent className='max-h-[85vh]'>
      <div className='p-5 flex flex-col gap-5 overflow-y-auto'>
       {/* Header */}
       <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-lg'>{dic.filters.title}</h3>
        {activeFilters.length > 0 && (
         <button
          onClick={() => reset()}
          className='text-xs text-destructive hover:underline'
         >
          پاک کردن همه
         </button>
        )}
       </div>

       {/* Text inputs */}
       <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1'>
         <label className='text-xs text-muted-foreground'>
          {dic.filters.folio}
         </label>
         <Input
          {...register('folio')}
          placeholder={dic.filters.folio}
          className='h-10'
         />
        </div>
        <div className='flex flex-col gap-1'>
         <label className='text-xs text-muted-foreground'>
          {dic.filters.reserveNo}
         </label>
         <Input
          {...register('reserveNo')}
          placeholder={dic.filters.reserveNo}
          className='h-10'
         />
        </div>
       </div>

       {/* Select buttons */}
       <div className='grid grid-cols-2 gap-3'>
        {(['nationality', 'specialGuest', 'group', 'room'] as const).map(
         (key) => (
          <Controller
           key={key}
           control={control}
           name={key}
           render={({ field }) => (
            <>
             <div className='flex flex-col gap-1'>
              <label className='text-xs text-muted-foreground'>
               {filterKeyLabel(key)}
              </label>
              <Button
               variant='outline'
               onClick={() => setSelectDrawerOpen(key)}
               className={cn(
                'justify-between h-10 font-normal',
                field.value && 'border-primary text-primary',
               )}
              >
               <span className='truncate'>
                {initDataIsLoading ? (
                 <Spinner className='w-4 h-4' />
                ) : (
                 (filterLabel(key) ?? `انتخاب ${filterKeyLabel(key)}`)
                )}
               </span>
               {field.value && <Check className='size-4 shrink-0' />}
              </Button>
             </div>

             <Drawer
              open={selectDrawerOpen === key}
              onOpenChange={(open) => !open && setSelectDrawerOpen(null)}
             >
              <DrawerContent className='max-h-[85vh]'>
               <div className='p-4 flex flex-col gap-1 max-h-[85vh] overflow-y-auto'>
                <h4 className='font-medium text-sm mb-2 text-muted-foreground'>
                 {filterKeyLabel(key)}
                </h4>
                {getOptions(key, initData)?.map((opt) => (
                 <button
                  key={opt.key}
                  onClick={() => {
                   field.onChange(field.value === opt.value ? null : opt.value);
                   setSelectDrawerOpen(null);
                  }}
                  className={cn(
                   'flex items-center justify-between py-3 px-4 rounded-lg text-sm transition-colors',
                   field.value === opt.value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted',
                  )}
                 >
                  {opt.value}
                  {field.value === opt.value && <Check className='size-4' />}
                 </button>
                ))}
               </div>
              </DrawerContent>
             </Drawer>
            </>
           )}
          />
         ),
        )}
       </div>

       {/* Actions */}
       <div className='grid grid-cols-2 gap-3 pt-2 border-t'>
        <Button variant='outline' onClick={handleCancel}>
         انصراف
        </Button>
        <Button onClick={handleApply}>اعمال فیلتر</Button>
       </div>
      </div>
     </DrawerContent>
    </Drawer>

    {totalResults !== undefined && (
     <span className='text-sm text-muted-foreground'>
      {totalResults} {dic.info.results}
     </span>
    )}
   </div>

   {/* Active filter badges */}
   {activeFilters.length > 0 && (
    <div ref={sliderRef} className='keen-slider! mt-1' dir='rtl'>
     {activeFilters.map((key) => (
      <div key={key} className='keen-slider__slide w-auto!'>
       <Badge
        variant='outline'
        className='flex items-center gap-1 py-1 px-2 text-primary border-primary rounded-lg!'
       >
        <span className='text-xs text-muted-foreground'>
         {filterKeyLabel(key)}:
        </span>
        {filterLabel(key)}
        <button
         className='cursor-pointer ml-1 hover:text-destructive transition-colors'
         onClick={() =>
          setValue(key, key === 'folio' || key === 'reserveNo' ? '' : null)
         }
        >
         <X className='w-3 h-3' />
        </button>
       </Badge>
      </div>
     ))}
    </div>
   )}
  </div>
 );
}

function getOptions(
 key: 'nationality' | 'specialGuest' | 'group' | 'room',
 data: InitialData | undefined,
): SelectOption[] {
 if (!data) return [];
 switch (key) {
  case 'nationality':
   return data.nationalities;
  case 'room':
   return data.rooms;
  case 'specialGuest':
   return data.vipGuestTypes;
  case 'group':
   return data.customers;
  default:
   return [];
 }
}
