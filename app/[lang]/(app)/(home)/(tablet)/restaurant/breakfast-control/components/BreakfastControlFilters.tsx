'use client';
import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { Field, FieldLabel } from '@/components/ui/field';
import {
 InputGroupInput,
 InputGroup,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { type BreakfastControlProps } from '../utils/BreakfastControlProps';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useFormContext, Controller } from 'react-hook-form';
import { type BreakfastControlFiltersSchema } from '../schemas/breakfastControlFiltersSchema';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function BreakfastControlFilters({
 dic,
 breakfastControlProps,
}: {
 dic: BreakfastControlDictionary;
 breakfastControlProps: BreakfastControlProps;
}) {
 const { control, register, setValue } =
  useFormContext<BreakfastControlFiltersSchema>();
 const { locale } = useBaseConfig();
 return (
  <>
   <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl p-4 lg:p-6 pb-0!'>
    {dic.title}
   </h1>
   <div className='bg-background sticky top-0 z-2 p-4 lg:p-6 pt-4! pb-2! flex gap-2 justify-between md:items-center flex-col md:flex-row'>
    <div className='grid gap-2 grid-cols-2 md:grid-cols-[minmax(9rem,9.5rem)_minmax(10rem,15rem)]'>
     <Field className='gap-1'>
      <Button
       variant='outline'
       id='date'
       className='font-normal h-11 justify-stretch'
      >
       <FieldLabel htmlFor='date' className='text-neutral-500'>
        {dic.filters.date}:
       </FieldLabel>
       <span className='font-medium'>
        {breakfastControlProps.isSuccess
         ? new Date().toLocaleDateString(locale)
         : '---'}
       </span>
      </Button>
     </Field>
     <Field>
      <InputGroup className='h-11'>
       <InputGroupInput
        placeholder={dic.filters.search}
        id='search'
        type='search'
        {...register('search')}
       />
       <InputGroupAddon align='inline-end'>
        <Search className='size-5 text-primary' />
       </InputGroupAddon>
      </InputGroup>
     </Field>
    </div>
    {breakfastControlProps.isSuccess && (
     <div className='flex flex-wrap gap-4 justify-center md:justify-end'>
      <div className='flex gap-1 items-center text-primary'>
       <span>{dic.filters.total}:</span>
       <span className='font-medium text-lg'>
        {breakfastControlProps.isSuccess
         ? breakfastControlProps.data?.total
         : 0}
       </span>
      </div>
      <Controller
       name='showServed'
       control={control}
       render={({ field: { onChange, value, ...other } }) => (
        <div className='flex gap-2 items-center text-secondary'>
         <Switch
          {...other}
          style={{
           direction: 'ltr',
          }}
          checked={value}
          onCheckedChange={(newValue) => {
           if (!newValue) {
            setValue('showNotServed', true);
           }
           onChange(newValue);
          }}
          id='served'
          className='scale-125'
         />
         <Label htmlFor='served'>
          {dic.filters.served} ({breakfastControlProps.data?.served})
         </Label>
        </div>
       )}
      />
      <Controller
       name='showNotServed'
       control={control}
       render={({ field: { onChange, value, ...other } }) => (
        <div className='flex gap-2 items-center text-destructive'>
         <Switch
          {...other}
          style={{
           direction: 'ltr',
          }}
          checked={value}
          onCheckedChange={(newValue) => {
           if (!newValue) {
            setValue('showServed', true);
           }
           onChange(newValue);
          }}
          id='notServed'
          className='scale-125'
         />
         <Label htmlFor='notServed'>
          {dic.filters.notServed} ({breakfastControlProps.data?.notServed})
         </Label>
        </div>
       )}
      />
     </div>
    )}
   </div>
  </>
 );
}
