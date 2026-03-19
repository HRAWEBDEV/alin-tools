'use client';

import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useKeenSlider } from 'keen-slider/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';
import { X, SlidersHorizontal } from 'lucide-react';
import { type GuestsFilterForm } from './GuestsListWrapper';
import { useState } from 'react';
import { GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import {
 type InitialData,
 type SelectOption,
} from '../services/guestsListApiActions';

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
};

export default function GuestsFilters({
 dic,
 initData,
 initDataIsLoading,
 totalResults,
}: Props) {
 const { control, setValue, register } = useFormContext<GuestsFilterForm>();
 const values = useWatch({ control });
 const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
 const [selectDrawerOpen, setSelectDrawerOpen] = useState<string | null>(null);

 const activeFilters = FILTER_KEYS.filter((k) => values[k]);
 const [sliderRef] = useKeenSlider({ slides: { perView: 'auto', spacing: 8 } });

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
  <div className='flex flex-col gap-2 px-2 pt-2'>
   <div className='flex items-center gap-2'>
    <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
     <DrawerTrigger asChild>
      <Button variant='outline' size='sm'>
       <SlidersHorizontal className='w-4 h-4 me-2' />
       {dic.filters.title || 'Filters'}
      </Button>
     </DrawerTrigger>

     <DrawerContent>
      <div className='p-4 flex flex-col gap-4'>
       <h3 className='font-semibold text-lg'>
        {dic.filters.title || 'Filters'}
       </h3>

       <div className='flex flex-col gap-3'>
        <input
         {...register('folio')}
         placeholder={dic.filters.folio}
         className='border rounded px-3 py-2 text-sm'
        />
        <input
         {...register('reserveNo')}
         placeholder={dic.filters.reserveNo}
         className='border rounded px-3 py-2 text-sm'
        />

        {(['nationality', 'specialGuest', 'group', 'room'] as const).map(
         (key) => (
          <Controller
           key={key}
           control={control}
           name={key}
           render={({ field }) => (
            <>
             <Button
              variant='outline'
              onClick={() => setSelectDrawerOpen(key)}
              className='justify-start'
             >
              {initDataIsLoading ? (
               <Spinner className='w-4 h-4' />
              ) : (
               filterLabel(key) ||
               (dic.filters as Record<string, string>)[key] ||
               key
              )}
             </Button>

             <Drawer
              open={selectDrawerOpen === key}
              onOpenChange={(open) => !open && setSelectDrawerOpen(null)}
             >
              <DrawerContent>
               <div className='p-4 flex flex-col gap-2'>
                {getOptions(key, initData)?.map((opt) => (
                 <label
                  key={opt.key}
                  className='flex items-center gap-2 py-2 px-3 rounded hover:bg-muted cursor-pointer'
                 >
                  <input
                   type='checkbox'
                   checked={field.value === opt.value}
                   onChange={() => {
                    field.onChange(
                     field.value === opt.value ? null : opt.value,
                    );
                    setSelectDrawerOpen(null);
                   }}
                  />
                  {opt.value}
                 </label>
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

    {activeFilters.length > 0 && (
     <Badge variant='secondary'>{activeFilters.length}</Badge>
    )}

    {totalResults !== undefined && (
     <span className='text-sm text-muted-foreground'>
      {totalResults} {dic.info?.results || 'results'}
     </span>
    )}
   </div>

   {activeFilters.length > 0 && (
    <div ref={sliderRef} className='keen-slider'>
     {activeFilters.map((key) => (
      <div key={key} className='keen-slider__slide w-auto!'>
       <Badge
        variant='outline'
        className='flex items-center gap-1 text-primary border-primary'
       >
        {filterLabel(key)}
        <button
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
