import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
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
import { BsTrash } from 'react-icons/bs';
import FindRooms from '../find-room/FindRooms';
import FindSubscribers from '../find-subscriber/FindSubscribers';
import FindCustomer from '../find-customer/FindCustomer';
import FindWaiters from '../find-waiters/FindWaiters';
import { SaleTypes } from '../../utils/SaleTypes';
import { IoReloadOutline } from 'react-icons/io5';

export default function OrderInfo({ dic }: { dic: NewOrderDictionary }) {
 const { control, register, setValue, watch } = useFormContext<OrderInfo>();
 const {
  initialDataInfo: {
   data,
   freeTablesLoading,
   freeTables,
   freeTablesRefetch,
   freeTablesFetching,
  },
 } = useOrderBaseConfigContext();
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const { locale } = useBaseConfig();

 const [
  saleTypeValue,
  subscriberValue,
  customerValue,
  roomValue,
  orderDateValue,
  waiterValue,
 ] = watch([
  'saleType',
  'subscriber',
  'customer',
  'room',
  'orderDate',
  'waiter',
 ]);

 return (
  <form onSubmit={(e) => e.preventDefault()} className='py-5 px-1'>
   <FieldGroup>
    <div className='grid sm:grid-cols-2 gap-5'>
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
           className='justify-between font-normal h-11'
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
        <InputGroup className='h-11'>
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
           className='justify-between h-11'
          >
           <span>{field.value?.value || ''}</span>
           <ChevronsUpDown />
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[min(80svh,35rem)]'>
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
           className='justify-between h-11'
          >
           <span>{field.value?.value || ''}</span>
           <ChevronsUpDown />
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[min(80svh,35rem)]'>
          <DrawerHeader className='hidden'>
           <DrawerTitle>{dic.orderInfo.saleType}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.orderInfo.saleType}
           </h1>
          </div>
          <div className='overflow-hidden overflow-y-auto'>
           {data?.saleTypes.length ? (
            <ul>
             {data.saleTypes.map((item) => (
              <DrawerClose asChild key={item.key}>
               <li
                className='flex gap-1 items-center ps-6 py-2'
                onClick={() => {
                 field.onChange(item);
                 setValue('room', null);
                 setValue('subscriber', null);
                 setValue('contract', null);
                 setValue('customer', null);
                 setValue('deliveryAgent', item?.key === SaleTypes.delivery);
                }}
               >
                <Checkbox
                 className='size-6'
                 checked={field.value?.key === item.key}
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
     <Field
      data-disabled={
       saleTypeValue?.key !== SaleTypes.delivery &&
       saleTypeValue?.key !== SaleTypes.contract
      }
     >
      <FieldLabel htmlFor='subscriber'>
       {dic.orderInfo.subscriber}{' '}
       {saleTypeValue?.key === SaleTypes.delivery && '*'}
      </FieldLabel>
      <Controller
       control={control}
       name='subscriber'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='subscriber'
           variant='outline'
           role='combobox'
           className='justify-between h-11'
           disabled={
            saleTypeValue?.key !== SaleTypes.delivery &&
            saleTypeValue?.key !== SaleTypes.contract
           }
          >
           <span className='grow text-ellipsis overflow-hidden text-start'>
            {field.value?.value || ''}
           </span>
           <div className='flex gap-2 items-center'>
            {subscriberValue && (
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
               setValue('subscriber', null);
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
            )}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         <FindSubscribers dic={dic} />
        </Drawer>
       )}
      />
     </Field>
     <Field data-disabled={saleTypeValue?.key === SaleTypes.room}>
      <FieldLabel htmlFor='customer'>{dic.orderInfo.customer}</FieldLabel>
      <Controller
       control={control}
       name='customer'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='customer'
           variant='outline'
           role='combobox'
           className='justify-between h-11'
           disabled={saleTypeValue?.key === SaleTypes.room}
          >
           <span className='grow text-ellipsis overflow-hidden text-start'>
            {field.value?.key || ''}
           </span>
           <div className='flex gap-2 items-center'>
            {customerValue && (
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
               setValue('customer', null);
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
            )}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         <FindCustomer dic={dic} />
        </Drawer>
       )}
      />
     </Field>
     <Field data-disabled={saleTypeValue?.key !== SaleTypes.room}>
      <FieldLabel htmlFor='room'>{dic.orderInfo.room} *</FieldLabel>
      <Controller
       control={control}
       name='room'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='room'
           variant='outline'
           role='combobox'
           className='justify-between h-11'
           disabled={saleTypeValue?.key !== SaleTypes.room}
          >
           <span className='grow text-ellipsis overflow-hidden text-start'>
            {field.value?.value || ''}
           </span>
           <div className='flex gap-2 items-center'>
            {!!roomValue && (
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
               setValue('room', null);
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
            )}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         <FindRooms dic={dic} />
        </Drawer>
       )}
      />
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
           className='justify-between h-11'
           disabled={freeTablesLoading}
          >
           <span>{field.value?.value || ''}</span>
           <div className='flex gap-2'>
            {freeTablesLoading && <Spinner />}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         <DrawerContent className='h-[min(80svh,35rem)]'>
          <DrawerHeader className='hidden'>
           <DrawerTitle>{dic.orderInfo.tableNo}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-4 mb-4 border-b border-input flex flex-wrap justify-between gap-4 items-center'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.orderInfo.tableNo}
           </h1>
           <Button
            disabled={freeTablesFetching}
            variant='outline'
            size='icon'
            className='text-primary'
            onClick={() => freeTablesRefetch()}
           >
            <IoReloadOutline className='size-5' />
           </Button>
          </div>
          <div className='grow overflow-hidden overflow-y-auto'>
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
      <Controller
       control={control}
       name='persons'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup className='h-11'>
         <NumericFormat
          id='persons'
          {...other}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue || '')}
          customInput={InputGroupInput}
          allowNegative={false}
          decimalScale={0}
          allowLeadingZeros={false}
         />
        </InputGroup>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='invoiceType'>{dic.orderInfo.invoiceType}</FieldLabel>
      <InputGroup className='h-11'>
       <InputGroupInput
        id='invoiceType'
        readOnly
        value={
         orderDateValue.getTime() <= new Date().getTime()
          ? dic.orderInfo.invoice
          : dic.orderInfo.bill
        }
       />
      </InputGroup>
     </Field>
     <Field className='col-span-full'>
      <FieldLabel htmlFor='customer'>{dic.orderInfo.customerName}</FieldLabel>
      <InputGroup className='h-11'>
       <InputGroupInput id='customer' />
      </InputGroup>
     </Field>
     <Field>
      <FieldLabel htmlFor='discount-rate'>
       {dic.orderInfo.discountRate}
      </FieldLabel>
      <Controller
       control={control}
       name='discountRate'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup className='h-11'>
         <NumericFormat
          {...other}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue || '')}
          id='discount-rate'
          customInput={InputGroupInput}
          allowNegative={false}
          decimalScale={0}
          allowLeadingZeros={false}
          isAllowed={({ floatValue }) => {
           if (!floatValue) return true;
           return floatValue <= 100;
          }}
         />
        </InputGroup>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='bonNo'>{dic.orderInfo.bonNo}</FieldLabel>
      <Controller
       control={control}
       name='bonNo'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup className='h-11'>
         <NumericFormat
          {...other}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue || '')}
          id='bonNo'
          customInput={InputGroupInput}
          allowNegative={false}
          decimalScale={0}
          allowLeadingZeros={false}
         />
        </InputGroup>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='waiter'>{dic.orderInfo.waiter}</FieldLabel>
      <Controller
       control={control}
       name='waiter'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='waiter'
           variant='outline'
           role='combobox'
           className='justify-between h-11 overflow-hidden'
          >
           <span className='grow text-ellipsis overflow-hidden text-start'>
            {field.value?.value || ''}
           </span>
           <div className='flex gap-2 items-center'>
            {waiterValue && (
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
               setValue('waiter', null);
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
            )}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         <FindWaiters dic={dic} />
        </Drawer>
       )}
      />
     </Field>
     <Field>
      <FieldLabel htmlFor='rounding'>{dic.orderInfo.roundingValue}</FieldLabel>
      <Controller
       control={control}
       name='rounding'
       render={({ field: { value, onChange, ...other } }) => (
        <InputGroup className='h-11'>
         <NumericFormat
          id='rounding'
          {...other}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue || '')}
          customInput={InputGroupInput}
          thousandSeparator
          allowLeadingZeros={false}
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
        <InputGroup className='h-11'>
         <NumericFormat
          id='delivery'
          {...other}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue || '')}
          customInput={InputGroupInput}
          thousandSeparator
          allowLeadingZeros={false}
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
        <InputGroup className='h-11'>
         <NumericFormat
          id='employeeTip'
          {...other}
          value={value}
          onValueChange={({ value }) => onChange(Number(value) || '')}
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
          onCheckedChange={(e) => {
           field.onChange(e);
          }}
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
          onCheckedChange={(e) => {
           field.onChange(e);
          }}
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
          onCheckedChange={(e) => {
           field.onChange(e);
          }}
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
          onCheckedChange={(e) => {
           field.onChange(e);
          }}
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
          onCheckedChange={(e) => {
           field.onChange(e);
          }}
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
