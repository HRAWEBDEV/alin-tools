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
import { ChevronsUpDown } from 'lucide-react';
import { type GuestsFilterForm } from './GuestsListWrapper';
import { useState } from 'react';
import {
 type InitialData,
 type SelectOption,
} from '../services/guestsListApiActions';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FaFilter, FaRegTrashAlt } from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import { Checkbox } from '@/components/ui/checkbox';
import { ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';

const FILTER_KEYS: (keyof GuestsFilterForm)[] = [
 'folio',
 'reserveNo',
 'nationality',
 'specialGuest',
 'group',
 'room',
];

const smallBadgeKeys: (keyof GuestsFilterForm)[] = [
 'folio',
 'reserveNo',
 'room',
];
const largeBadgeKeys: (keyof GuestsFilterForm)[] = [
 'nationality',
 'specialGuest',
 'group',
];

type Props = {
 dic: ResidentGuestsDictionary;
 initData: InitialData | undefined;
 initDataIsLoading: boolean;
 totalResults?: number;
 onSubmit?: () => void;
 numGuests: number | undefined;
};

const SHARED_DRAWER_CLASSES =
 'sm:h-[min(85svh,26rem)] h-[min(95svh,66rem)] flex flex-col';

export default function GuestsFilters({
 dic,
 initData,
 initDataIsLoading,
 totalResults,
 numGuests,
}: Props) {
 const { control, setValue, reset } = useFormContext<GuestsFilterForm>();
 const values = useWatch({ control });
 const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
 const [selectDrawerOpen, setSelectDrawerOpen] = useState<string | null>(null);

 const activeFilters = FILTER_KEYS.filter((k) => values[k]);
 const [sliderRef] = useKeenSlider({
  slides: { perView: 'auto', spacing: 5 },
  rtl: true,
 });

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
     <DrawerContent className={SHARED_DRAWER_CLASSES}>
      <DrawerHeader className='pb-1 shrink-0'>
       <DrawerTitle>{dic.filters.title}</DrawerTitle>
      </DrawerHeader>
      <div className='p-5 pt-0 flex flex-col gap-5 overflow-y-auto max-w-[min(100%,40rem)] mx-auto w-full'>
       <div className='flex items-center justify-end mb-4 mt-2 shrink-0'>
        {activeFilters.length > 0 && (
         <button
          onClick={() => reset()}
          className='text-xs text-destructive hover:underline cursor-pointer'
         >
          {dic.filters.removeFilters}
         </button>
        )}
       </div>

       <div className='grid sm:grid-cols-2 grid-cols-1 gap-6 shrink-0'>
        <Controller
         control={control}
         name='folio'
         render={({ field }) => (
          <div className='flex flex-col gap-1 relative'>
           <label className='text-xs text-muted-foreground'>
            {dic.filters.folio}
           </label>
           <div className='relative flex items-center'>
            <Input
             type='number'
             {...field}
             value={field.value ?? ''}
             placeholder={dic.filters.folio}
             className='h-11 pe-10'
            />
            {field.value && (
             <Button
              type='button'
              variant={'ghost'}
              size={'icon'}
              onClick={() => field.onChange('')}
              className='absolute end-1 text-rose-700 dark:text-rose-400 h-8 w-8 bg-transparent!'
             >
              <FaRegTrashAlt className='size-4 ' />
             </Button>
            )}
           </div>
          </div>
         )}
        />

        <Controller
         control={control}
         name='reserveNo'
         render={({ field }) => (
          <div className='flex flex-col gap-1 relative'>
           <label className='text-xs text-muted-foreground'>
            {dic.filters.reserveNo}
           </label>
           <div className='relative flex items-center'>
            <Input
             type='number'
             {...field}
             value={field.value ?? ''}
             placeholder={dic.filters.reserveNo}
             className='h-11 pe-10'
            />
            {field.value && (
             <Button
              type='button'
              variant={'ghost'}
              size={'icon'}
              onClick={() => field.onChange('')}
              className='absolute end-1 text-rose-700 dark:text-rose-400 h-8 w-8 bg-transparent!'
             >
              <FaRegTrashAlt className='size-4' />
             </Button>
            )}
           </div>
          </div>
         )}
        />
       </div>

       <div className='grid sm:grid-cols-2 grid-cols-1 gap-6 pb-6'>
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
                'justify-between h-11 font-normal',
                field.value && 'border-primary text-primary',
               )}
              >
               <span className='text-start grow overflow-hidden text-ellipsis'>
                {initDataIsLoading ? (
                 <Spinner className='w-4 h-4' />
                ) : (
                 (filterLabel(key) ??
                 `${dic.filters.select} ${filterKeyLabel(key)}`)
                )}
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
                  className='text-rose-700 dark:text-rose-400 h-8 w-8 bg-transparent!'
                 >
                  <FaRegTrashAlt className='size-4' />
                 </Button>
                )}
                <ChevronsUpDown className='opacity-50 size-4 shrink-0' />
               </div>
              </Button>
             </div>

             <Drawer
              open={selectDrawerOpen === key}
              onOpenChange={(open) => !open && setSelectDrawerOpen(null)}
             >
              <DrawerContent className={SHARED_DRAWER_CLASSES}>
               <DrawerHeader className='shrink-0'>
                <DrawerTitle className='text-xl'>
                 {filterKeyLabel(key)}
                </DrawerTitle>
               </DrawerHeader>
               <div className='grow overflow-hidden overflow-y-auto mb-6'>
                <ul>
                 {getOptions(key, initData)?.map((opt) => (
                  <li
                   key={opt.key}
                   className='flex gap-1 items-center ps-6 py-2 cursor-pointer hover:bg-muted/50 transition-colors'
                   onClick={() => {
                    field.onChange(
                     field.value === opt.value ? null : opt.value,
                    );
                    setSelectDrawerOpen(null);
                   }}
                  >
                   <Checkbox
                    className='size-6 pointer-events-none'
                    checked={field.value === opt.value}
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
                 {getOptions(key, initData).length === 0 && (
                  <li className='text-center my-6 font-normal text-destructive'>
                   {dic.filters.noItemFound}
                  </li>
                 )}
                </ul>
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
    <div
     key={`expand-${activeFilters.length}`}
     ref={sliderRef}
     className='keen-slider grow relative mt-1'
     dir='rtl'
    >
     {activeFilters.map((key) => {
      let badgeSizeType: 'normal' | 'small' | 'large' = 'normal';
      if (smallBadgeKeys.includes(key)) {
       badgeSizeType = 'small';
      } else if (largeBadgeKeys.includes(key)) {
       badgeSizeType = 'large';
      }

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
         size='icon-sm'
         className='text-destructive shrink-0'
         onClick={() =>
          setValue(key, key === 'folio' || key === 'reserveNo' ? '' : null)
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
