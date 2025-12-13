import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
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
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
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
 const { control } = useFormContext<OrderInfo>();
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const [showSaleTimeCombo, setShowSaleTimeCombo] = useState(false);
 const [showSaleTypeCombo, setShowSaleTypeCombo] = useState(false);
 const { locale } = useBaseConfig();

 return (
  <form onSubmit={(e) => e.preventDefault()} className='py-5 px-1'>
   <FieldGroup>
    <div className='grid grid-cols-2 gap-5'>
     <Controller
      control={control}
      name='orderDate'
      render={({ field }) => (
       <Field>
        <FieldLabel htmlFor='orderDate'>{dic.orderInfo.orderDate}</FieldLabel>
        <Popover open={showDateTimePicker} onOpenChange={setShowDateTimePicker}>
         <PopoverTrigger asChild>
          <Button
           variant='outline'
           id='orderDate'
           className='justify-between font-normal'
           onBlur={field.onBlur}
          >
           <span>
            {field.value ? field.value.toLocaleDateString(locale) : ''}
           </span>
           <ChevronDownIcon />
          </Button>
         </PopoverTrigger>
         <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
           mode='single'
           captionLayout='dropdown'
           className='[&]:[--cell-size:2.6rem]'
           selected={field.value}
           onSelect={(newValue) => {
            field.onChange(newValue);
           }}
          />
         </PopoverContent>
        </Popover>
       </Field>
      )}
     />
     <Controller
      control={control}
      name='orderDate'
      render={({ field }) => (
       <Field>
        <FieldLabel htmlFor='orderTime'>{dic.orderInfo.orderTime}</FieldLabel>
        <InputGroup>
         <InputGroupInput
          id='orderTime'
          type='time'
          value={field.value.toLocaleTimeString('en', {
           hour: '2-digit',
           minute: '2-digit',
           hour12: false,
          })}
          onChange={(e) => {
           const newValue = e.target.value;
           const parts = newValue.split(':').map((item) => Number(item));
           const hours = parts[0];
           const minutes = parts[1];
           const date = field.value;
           date.setHours(hours);
           date.setMinutes(minutes);
           field.onChange(date);
          }}
          onBlur={field.onBlur}
         />
        </InputGroup>
       </Field>
      )}
     />
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
