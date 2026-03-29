'use client';

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
import { FaPerson } from 'react-icons/fa6';

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
 numGuests: number | undefined;
};

export default function GuestsFilters({
 dic,
 initData,
 initDataIsLoading,
 totalResults,
 numGuests,
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

 return (
  <div className='flex flex-col gap-2 pt-2'>
   <div className='flex items-center gap-2 justify-between'>
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

     <DrawerContent className='sm:min-h-auto min-h-[calc(100dvh-120px)]'>
      <DrawerHeader className='pb-1'>
       <DrawerTitle>{dic.filters.title}</DrawerTitle>
      </DrawerHeader>
      <div className='p-5 pt-0 flex flex-col gap-5 overflow-y-auto max-w-[95%] mx-auto w-full'>
       <div className='flex items-center justify-between'>
        {activeFilters.length > 0 && (
         <button
          onClick={() => reset()}
          className='text-xs text-destructive hover:underline cursor-pointer'
         >
          {dic.filters.removeFilters}
         </button>
        )}
       </div>

       <div className='grid sm:grid-cols-2 grid-cols-1 gap-6'>
        <div className='flex flex-col gap-1'>
         <label className='text-xs text-muted-foreground'>
          {dic.filters.folio}
         </label>
         <Input
          type='number'
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
          type='number'
          {...register('reserveNo')}
          placeholder={dic.filters.reserveNo}
          className='h-10'
         />
        </div>
       </div>

       <div className='grid sm:grid-cols-2 grid-cols-1 gap-6'>
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
                 (filterLabel(key) ??
                 `${dic.filters.select} ${filterKeyLabel(key)}`)
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
      </div>
     </DrawerContent>
    </Drawer>

    {totalResults !== undefined && (
     <span className='text-sm text-muted-foreground'>
      {totalResults} {dic.info.results}
     </span>
    )}
    {numGuests ? (
     <Button
      size='lg'
      variant='outline'
      className='rounded-md text-neutral-600 dark:text-neutral-400 px-2! cursor-auto'
     >
      <div className='flex items-center gap-1'>
       {numGuests}
       <span className='sm:block hidden'>{dic.filters.guest}</span>
      </div>
      <FaPerson className='size-5!' />
     </Button>
    ) : (
     <></>
    )}
   </div>
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
