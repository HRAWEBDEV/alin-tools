import { useState } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
} from '@/components/ui/input-group';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
 Command,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
 CommandList,
} from '@/components/ui/command';

export default function OrderInfo({ dic }: { dic: NewOrderDictionary }) {
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const [showSaleTimeCombo, setShowSaleTimeCombo] = useState(false);
 const [showSaleTypeCombo, setShowSaleTypeCombo] = useState(false);

 return (
  <form onSubmit={(e) => e.preventDefault()} className='py-5 px-1'>
   <FieldGroup>
    <div className='grid grid-cols-2 gap-5'>
     <Field>
      <FieldLabel htmlFor='orderDate'>{dic.orderInfo.orderDate}</FieldLabel>
      <Popover open={showDateTimePicker} onOpenChange={setShowDateTimePicker}>
       <PopoverTrigger asChild>
        <Button
         variant='outline'
         id='orderDate'
         className='justify-between font-normal'
        >
         <span></span>
         <ChevronDownIcon />
        </Button>
       </PopoverTrigger>
       <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
        <Calendar
         mode='single'
         captionLayout='dropdown'
         className='[&]:[--cell-size:2.6rem]'
        />
       </PopoverContent>
      </Popover>
     </Field>
     <Field>
      <FieldLabel htmlFor='orderTime'>{dic.orderInfo.orderTime}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='orderTime' type='time' />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='saleTime'>{dic.orderInfo.saleTime}</FieldLabel>
      <Button
       id='saleTime'
       variant='outline'
       role='combobox'
       aria-expanded={showSaleTimeCombo}
       className='justify-between'
      >
       <span></span>
       <ChevronsUpDown />
      </Button>
     </Field>
     <Field>
      <FieldLabel htmlFor='saleType'>{dic.orderInfo.saleType}</FieldLabel>
      <Button
       id='saleTime'
       variant='outline'
       role='combobox'
       aria-expanded={showSaleTypeCombo}
       className='justify-between'
      >
       <span></span>
       <ChevronsUpDown />
      </Button>
     </Field>
     <Field className='col-span-full'>
      <FieldLabel htmlFor='customer'>{dic.orderInfo.customerName}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='customer' />
      </InputGroup>
     </Field>
     <Field className='col-span-full'>
      <FieldLabel htmlFor='description'>{dic.orderInfo.description}</FieldLabel>
      <InputGroup>
       <InputGroupTextarea id='description' />
      </InputGroup>
     </Field>
    </div>
   </FieldGroup>
  </form>
 );
}
