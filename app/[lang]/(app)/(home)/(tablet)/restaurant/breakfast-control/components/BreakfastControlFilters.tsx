'use client';
import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { BsTrash } from 'react-icons/bs';
import { ChevronsUpDown } from 'lucide-react';
import { type BreakfastControlProps } from '../utils/BreakfastControlProps';

export default function BreakfastControlFilters({
 dic,
 breakfastControlProps,
}: {
 dic: BreakfastControlDictionary;
 breakfastControlProps: BreakfastControlProps;
}) {
 return (
  <>
   <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl p-4 lg:p-6 pb-0!'>
    {dic.title}
   </h1>
   <div className='bg-background sticky top-0 z-2 p-4 lg:p-6 pt-4! pb-2! flex gap-2 justify-between md:items-center flex-col md:flex-row'>
    <div className='grid gap-2 grid-cols-2 md:grid-cols-[repeat(2,minmax(10rem,12rem))]'>
     <Field className='gap-1'>
      <Button
       variant='outline'
       id='date'
       className='font-normal h-11 justify-stretch'
      >
       <FieldLabel htmlFor='date' className='text-neutral-500'>
        {dic.filters.date}:
       </FieldLabel>
       <span className='font-medium'>1996/12/12</span>
      </Button>
     </Field>
     <Field>
      <Drawer>
       <DrawerTrigger asChild>
        <Button id='room' variant='outline' role='combobox' className='h-11'>
         <div className='grow flex gap-1 overflow-hidden'>
          <FieldLabel htmlFor='room' className='text-neutral-500'>
           {dic.filters.roomNo}:
          </FieldLabel>
          <span className='font-medium grow text-ellipsis overflow-hidden text-start'>
           12312
          </span>
         </div>
         <div className='flex gap-2 items-center'>
          {true && (
           <Button
            variant={'ghost'}
            size={'icon-lg'}
            onClick={(e) => {
             e.stopPropagation();
            }}
           >
            <BsTrash className='size-5 text-red-700 dark:text-red-400' />
           </Button>
          )}
          <ChevronsUpDown />
         </div>
        </Button>
       </DrawerTrigger>
      </Drawer>
     </Field>
    </div>
    <div className='flex flex-wrap gap-4 justify-center md:justify-end'>
     <div className='flex gap-1 items-center text-primary'>
      <span>{dic.filters.total}:</span>
      <span className='font-medium text-lg'>
       {breakfastControlProps.isSuccess ? breakfastControlProps.data?.total : 0}
      </span>
     </div>
     <div className='flex gap-1 items-center text-secondary'>
      <span>{dic.filters.served}:</span>
      <span className='font-medium text-lg'>
       {breakfastControlProps.isSuccess
        ? breakfastControlProps.data?.served
        : 0}
      </span>
     </div>
     <div className='flex gap-1 items-center text-destructive'>
      <span>{dic.filters.notServed}:</span>
      <span className='font-medium text-lg'>
       {breakfastControlProps.isSuccess
        ? breakfastControlProps.data?.notServed
        : 0}
      </span>
     </div>
    </div>
   </div>
  </>
 );
}
