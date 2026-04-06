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
import { type InitialData } from '../services/guestsListApiActions';
import { Field, FieldLabel } from '@/components/ui/field';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { FaFilter, FaRegTrashAlt } from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import { Checkbox } from '@/components/ui/checkbox';
import { ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';
import { type Combo } from '../../../utils/apiTypes';

const FILTER_KEYS: (keyof GuestsFilterForm)[] = [
 'folio',
 'reserveNo',
 'nationality',
 'specialGuest',
 'group',
 'room',
];

const smallBadgeKeys: (keyof GuestsFilterForm)[] = ['room'];
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

const SHARED_DRAWER_CLASSES = 'sm:h-[min(85svh,30rem)] flex flex-col';

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
       <span className='hidden md:inline'>{dic.filters.title}</span>
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
          <Field>
           <FieldLabel htmlFor='folio'>{dic.filters.folio}</FieldLabel>
           <InputGroup className='h-11'>
            <InputGroupInput
             type='number'
             id='folio'
             {...field}
             value={field.value ?? ''}
            />
            <InputGroupAddon align='inline-end'>
             {field.value && (
              <Button
               type='button'
               variant='ghost'
               size='icon'
               className='text-destructive'
               onClick={() => field.onChange('')}
              >
               <FaRegTrashAlt className='size-4' />
              </Button>
             )}
            </InputGroupAddon>
           </InputGroup>
          </Field>
         )}
        />
        <Controller
         control={control}
         name='reserveNo'
         render={({ field }) => (
          <Field>
           <FieldLabel htmlFor='reserve-no'>{dic.filters.reserveNo}</FieldLabel>
           <InputGroup className='h-11'>
            <InputGroupInput
             type='number'
             id='reserve-no'
             {...field}
             value={field.value ?? ''}
            />
            <InputGroupAddon align='inline-end'>
             {field.value && (
              <Button
               type='button'
               variant='ghost'
               size='icon-lg'
               className='text-destructive'
               onClick={() => field.onChange('')}
              >
               <FaRegTrashAlt className='size-4' />
              </Button>
             )}
            </InputGroupAddon>
           </InputGroup>
          </Field>
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
             <Field>
              <FieldLabel htmlFor='field'>{filterKeyLabel(key)}</FieldLabel>
              <Button
               id={field.name}
               variant='outline'
               onClick={() => setSelectDrawerOpen(key)}
               className={cn('justify-between h-11 font-normal')}
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
                  size='icon-lg'
                  className='text-destructive'
                  onClick={(e) => {
                   e.stopPropagation();
                   field.onChange(null);
                  }}
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
   <div className='flex gap-4 items-center'>
    <span className='text-sm text-muted-foreground'>
     {dic.info.results}: {totalResults}
    </span>
    <span className='text-sm text-muted-foreground'>
     {dic.filters.guest}: {numGuests}
    </span>
   </div>
  </div>
 );
}

function getOptions(
 key: 'nationality' | 'specialGuest' | 'group' | 'room',
 data: InitialData | undefined,
): Combo[] {
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
