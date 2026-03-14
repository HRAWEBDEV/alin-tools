import { useState } from 'react';
import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import { FaFilter } from 'react-icons/fa';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { useFormContext, Controller } from 'react-hook-form';
import { type EntranceAndExitSchema } from '../schemas/entranceAndExitSchema';
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

export default function EntranceAndExitFilters({
 dic,
}: {
 dic: EntranceAndExitRoomsDictionary;
}) {
 const [showDatePicker, setShowDatePicker] = useState(false);
 const { locale } = useBaseConfig();
 const { control } = useFormContext<EntranceAndExitSchema>();
 return (
  <div className='[&]:[--default-top-offset:var(--top-offset,0)] sticky top-(--default-top-offset) mb-2 bg-background'>
   <div className='flex gap-2 items-center'>
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
          {3}
         </Badge>
        )}
       </Button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[70dvh] min-h-[70dvh] flex flex-col'>
       <DrawerHeader>
        <DrawerTitle className='text-xl'>{dic.filters.filters}</DrawerTitle>
       </DrawerHeader>
       <div className='grow overflow-auto'>
        <div className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
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
        </div>
       </div>
      </DrawerContent>
     </Drawer>
    </div>
   </div>
  </div>
 );
}
