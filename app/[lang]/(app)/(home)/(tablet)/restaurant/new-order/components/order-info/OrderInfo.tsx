import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
 InputGroupAddon,
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
} from '@/components/ui/input-group';
import { Check, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaSearch } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import { ChevronsUpDown } from 'lucide-react';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { NumericFormat } from 'react-number-format';
import { Spinner } from '@/components/ui/spinner';

export default function OrderInfo({ dic }: { dic: NewOrderDictionary }) {
 const { control, register, getValues } = useFormContext<OrderInfo>();
 const {
  initialDataInfo: { data, freeTablesLoading, freeTables },
 } = useOrderBaseConfigContext();
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
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
      <Controller
       control={control}
       name='saleTime'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='saleTime'
           variant='outline'
           role='combobox'
           className='justify-between'
          >
           <span>{field.value?.value || ''}</span>
           <ChevronsUpDown />
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[80svh]'>
          <DrawerHeader className='hidden'>
           <DrawerTitle>{dic.orderInfo.saleTime}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.orderInfo.saleTime}
           </h1>
          </div>
          <div>
           {data?.saleTimes.length ? (
            <ul>
             {data.saleTimes.map((item) => (
              <DrawerClose asChild key={item.key}>
               <li
                className='flex gap-1 items-center ps-6 py-2'
                onClick={() => {
                 field.onChange(item);
                }}
               >
                <Checkbox
                 className='size-6'
                 checked={field.value?.value === item.value}
                />
                <Button
                 tabIndex={-1}
                 variant='ghost'
                 className='w-full justify-start h-auto text-lg'
                >
                 <span>{item.value}</span>
                </Button>
               </li>
              </DrawerClose>
             ))}
            </ul>
           ) : (
            <div className='text-center font-medium'></div>
           )}
          </div>
         </DrawerContent>
        </Drawer>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='saleType'>{dic.orderInfo.saleType}</FieldLabel>
      <Controller
       control={control}
       name='saleType'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='saleType'
           variant='outline'
           role='combobox'
           className='justify-between'
          >
           <span>{field.value?.value || ''}</span>
           <ChevronsUpDown />
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[80svh]'>
          <DrawerHeader className='hidden'>
           <DrawerTitle>{dic.orderInfo.saleType}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.orderInfo.saleType}
           </h1>
          </div>
          <div>
           {data?.saleTypes.length ? (
            <ul>
             {data.saleTypes.map((item) => (
              <DrawerClose asChild key={item.key}>
               <li
                className='flex gap-1 items-center ps-6 py-2'
                onClick={() => {
                 field.onChange(item);
                }}
               >
                <Checkbox
                 className='size-6'
                 checked={field.value?.value === item.value}
                />
                <Button
                 tabIndex={-1}
                 variant='ghost'
                 className='w-full justify-start h-auto text-lg'
                >
                 <span>{item.value}</span>
                </Button>
               </li>
              </DrawerClose>
             ))}
            </ul>
           ) : (
            <div className='text-center font-medium'></div>
           )}
          </div>
         </DrawerContent>
        </Drawer>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='subscriber'>{dic.orderInfo.subscriber}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='subscriber' />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='customer'>{dic.orderInfo.customer}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='customer' />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='room'>{dic.orderInfo.room}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='room' />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='tableNo'>{dic.orderInfo.tableNo}</FieldLabel>
      <Controller
       control={control}
       name='table'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='saleType'
           variant='outline'
           role='combobox'
           className='justify-between'
           disabled={freeTablesLoading}
          >
           <span>{field.value?.value || ''}</span>
           <div className='flex gap-2'>
            {freeTablesLoading && <Spinner />}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[80svh]'>
          <DrawerHeader className='hidden'>
           <DrawerTitle>{dic.orderInfo.tableNo}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.orderInfo.tableNo}
           </h1>
          </div>
          <div>
           {freeTables?.length ? (
            <ul>
             {freeTables.map((item) => (
              <DrawerClose asChild key={item.key}>
               <li
                className='flex gap-1 items-center ps-6 py-2'
                onClick={() => {
                 field.onChange(item);
                }}
               >
                <Checkbox
                 className='size-6'
                 checked={field.value?.value === item.value}
                />
                <Button
                 tabIndex={-1}
                 variant='ghost'
                 className='w-full justify-start h-auto text-lg'
                >
                 <span>{item.value}</span>
                </Button>
               </li>
              </DrawerClose>
             ))}
            </ul>
           ) : (
            <div className='text-center font-medium'></div>
           )}
          </div>
         </DrawerContent>
        </Drawer>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='persons'>{dic.orderInfo.guestCount}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='persons' {...register('persons')} />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='invoiceType'>{dic.orderInfo.invoiceType}</FieldLabel>
      <InputGroup>
       <InputGroupInput
        id='invoiceType'
        readOnly
        value={
         getValues('orderDate') <= new Date()
          ? dic.orderInfo.invoice
          : dic.orderInfo.bill
        }
       />
      </InputGroup>
     </Field>
     <Field className='col-span-full'>
      <FieldLabel htmlFor='customer'>{dic.orderInfo.customerName}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='customer' />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='discount-rate'>
       {dic.orderInfo.discountRate}
      </FieldLabel>
      <InputGroup>
       <InputGroupInput
        type='number'
        id='discount-rate'
        {...register('discountRate')}
       />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='bonNo'>{dic.orderInfo.bonNo}</FieldLabel>
      <InputGroup>
       <InputGroupInput type='number' id='bonNo' {...register('bonNo')} />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='waiter'>{dic.orderInfo.waiter}</FieldLabel>
      <InputGroup>
       <InputGroupInput id='waiter' {...register('employeeTip')} />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='rounding'>{dic.orderInfo.roundingValue}</FieldLabel>
      <Controller
       control={control}
       name='rounding'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup>
         <NumericFormat
          id='rounding'
          {...other}
          value={value}
          onValueChange={({ value }) => onChange(value)}
          customInput={InputGroupInput}
          thousandSeparator
         />
        </InputGroup>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='delivery'>{dic.orderInfo.deliveryValue}</FieldLabel>
      <Controller
       control={control}
       name='deliveryValue'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup>
         <NumericFormat
          id='delivery'
          {...other}
          value={value}
          onValueChange={({ value }) => onChange(value)}
          customInput={InputGroupInput}
          thousandSeparator
         />
        </InputGroup>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='employeeTip'>{dic.orderInfo.employeeTip}</FieldLabel>
      <Controller
       control={control}
       name='employeeTip'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup>
         <NumericFormat
          id='employeeTip'
          {...other}
          value={value}
          onValueChange={({ value }) => onChange(value)}
          customInput={InputGroupInput}
          thousandSeparator
         />
        </InputGroup>
       )}
      />
     </Field>
     <Field className='col-span-full'>
      <FieldLabel htmlFor='description'>{dic.orderInfo.description}</FieldLabel>
      <InputGroup>
       <InputGroupTextarea id='description' {...register('comment')} />
      </InputGroup>
     </Field>
     <div className='col-span-full flex flex-wrap gap-8 mt-4 ps-4'>
      <Controller
       control={control}
       name='hasTableNo'
       render={({ field }) => (
        <div className='flex gap-4 items-center'>
         <Checkbox
          id='hasTable'
          className='scale-200'
          checked={field.value}
          defaultChecked={field.value}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e)}
         />
         <Label htmlFor='hasTable' className='text-base'>
          {dic.orderInfo.hasTableNo}
         </Label>
        </div>
       )}
      />
      <Controller
       control={control}
       name='hasService'
       render={({ field }) => (
        <div className='flex gap-4 items-center'>
         <Checkbox
          id='hasService'
          className='scale-200'
          checked={field.value}
          defaultChecked={field.value}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e)}
         />
         <Label htmlFor='hasService' className='text-base'>
          {dic.orderInfo.hasService}
         </Label>
        </div>
       )}
      />
      <Controller
       control={control}
       name='deliveryAgent'
       render={({ field }) => (
        <div className='flex gap-4 items-center'>
         <Checkbox
          id='deliveryAgent'
          className='scale-200'
          checked={field.value}
          defaultChecked={field.value}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e)}
         />
         <Label htmlFor='deliveryAgent' className='text-base'>
          {dic.orderInfo.deliveryAgent}
         </Label>
        </div>
       )}
      />
      <Controller
       control={control}
       name='sendToKitchen'
       render={({ field }) => (
        <div className='flex gap-4 items-center'>
         <Checkbox
          id='sendToKitchen'
          className='scale-200'
          checked={field.value}
          defaultChecked={field.value}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e)}
         />
         <Label htmlFor='sendToKitchen' className='text-base'>
          {dic.orderInfo.sendToKitchen}
         </Label>
        </div>
       )}
      />
      <Controller
       control={control}
       name='printCash'
       render={({ field }) => (
        <div className='flex gap-4 items-center'>
         <Checkbox
          id='printCash'
          className='scale-200'
          checked={field.value}
          defaultChecked={field.value}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e)}
         />
         <Label htmlFor='printCash' className='text-base'>
          {dic.orderInfo.printCash}
         </Label>
        </div>
       )}
      />
     </div>
    </div>
   </FieldGroup>
  </form>
 );
}
