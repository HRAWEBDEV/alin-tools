import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 Field,
 FieldGroup,
 FieldLabel,
 FieldError,
 FieldContent,
} from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import FindContract from '../find-contract/FindContract';
import {
 TimePickerRoot,
 TimePickerTitle,
 TimePickerWheels,
 TimePickerWheel,
 TimePickerSeparator,
 TimePickerButton,
} from '@poursha98/react-ios-time-picker';

export default function OrderInfo({ dic }: { dic: NewOrderDictionary }) {
 const {
  control,
  register,
  setValue,
  watch,
  getValues,
  formState: { errors },
  clearErrors,
 } = useFormContext<OrderInfo>();
 const {
  initialDataInfo: {
   data,
   freeTablesLoading,
   freeTables,
   freeTablesRefetch,
   freeTablesFetching,
  },
  order: { orderInfoName },
  person: {
   errorFindPerson,
   findPerson,
   isErrorFindPerson,
   isPendingFindPerson,
   personID,
  },
 } = useOrderBaseConfigContext();
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const [showTimePicker, setShowTimePicker] = useState(false);
 const { locale } = useBaseConfig();

 const [
  saleTypeValue,
  subscriberValue,
  customerValue,
  roomValue,
  orderDateValue,
  waiterValue,
  tableValue,
  contractValue,
  phoneNumberValue,
 ] = watch([
  'saleType',
  'subscriber',
  'customer',
  'room',
  'orderDate',
  'waiter',
  'table',
  'contract',
  'phoneNumber',
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
           ref={field.ref}
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
            if (newValue) {
             const now = new Date();
             const newDate = newValue;
             newDate.setHours(now.getHours());
             newDate.setMinutes(now.getMinutes());
             newDate.setSeconds(now.getSeconds());
             field.onChange(newDate);
             setShowDateTimePicker(false);
            }
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
        <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
         <PopoverTrigger asChild>
          <Button
           variant='outline'
           id='orderDate'
           className='justify-between font-normal h-11'
           onBlur={field.onBlur}
           ref={field.ref}
          >
           <span>
            {field.value
             ? field.value.toLocaleTimeString('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
               })
             : ''}
           </span>
           <ChevronDownIcon />
          </Button>
         </PopoverTrigger>
         <PopoverContent
          className='overflow-hidden p-0'
          style={{ width: '320px' }}
          align='start'
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
         >
          <TimePickerRoot
           value={field.value.toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
           })}
           onChange={(timeString) => {
            if (typeof timeString === 'string') {
             const [hour, minute] = timeString
              .split(':')
              .map((item) => Number(item));
             const newDate = new Date(field.value || new Date());
             newDate.setHours(hour);
             newDate.setMinutes(minute);
             field.onChange(newDate);
            }
           }}
           numerals='fa'
           className='w-full rounded-3xl!'
           loop
          >
           <TimePickerTitle className='text-primary text-xl font-bold mb-4'>
            {dic.orderInfo.orderTime}
           </TimePickerTitle>
           <TimePickerWheels className='flex justify-center items-center gap-2'>
            <TimePickerWheel
             type='hour'
             classNames={{
              item: 'text-gray-400',
              selectedItem: 'text-primary',
             }}
            />

            <TimePickerSeparator className='text-primary! text-2xl font-bold'>
             :
            </TimePickerSeparator>

            <TimePickerWheel
             type='minute'
             classNames={{
              item: 'text-gray-400',
              selectedItem: 'text-primary',
             }}
            />
           </TimePickerWheels>

           <TimePickerButton
            className='mt-6 w-full bg-primary text-white py-3 rounded-2xl'
            onClick={() => setShowTimePicker(!showTimePicker)}
           >
            تائید
           </TimePickerButton>
          </TimePickerRoot>
         </PopoverContent>
        </Popover>
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
           onBlur={field.onBlur}
           ref={field.ref}
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
           onBlur={field.onBlur}
           ref={field.ref}
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
                 clearErrors(['room', 'subscriber']);
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
     <div>
      <Field data-invalid={!!errors.phoneNumber}>
       <FieldLabel htmlFor='phoneNumber'>
        {dic.orderInfo.phoneNumber}
       </FieldLabel>
       <Controller
        control={control}
        name='phoneNumber'
        render={({ field: { value, onChange, ...other } }) => (
         <InputGroup data-invalid={!!errors.phoneNumber}>
          <NumericFormat
           {...other}
           onBlur={() => {
            other.onBlur();
            if (value && !isErrorFindPerson) {
             findPerson(value);
            }
           }}
           value={value}
           onValueChange={({ value }) => onChange(value)}
           allowLeadingZeros={true}
           decimalScale={0}
           customInput={InputGroupInput}
          />
          <InputGroupAddon align='inline-end' className='-me-3'>
           <Button
            variant='outline'
            className='rounded-ss-none rounded-es-none border-secondary text-secondary'
            disabled={isPendingFindPerson || !phoneNumberValue}
            onClick={() => {
             const phoneNumber = getValues('phoneNumber');
             if (!phoneNumber) return;
             findPerson(phoneNumber);
            }}
           >
            {isPendingFindPerson && <Spinner />}
            {dic.orderQuickInfo.checkPhoneNumber}
           </Button>
          </InputGroupAddon>
         </InputGroup>
        )}
       />
       <FieldContent>
        {!!errors.phoneNumber && (
         <FieldError>{errors.phoneNumber?.message}</FieldError>
        )}
       </FieldContent>
      </Field>
      {errorFindPerson?.status === 404 && (
       <Alert className='border-yellow-600 dark:border-yellow-400 bg-yellow-600/10 dark:bg-yellow-400/10 py-2'>
        <AlertDescription className='text-yellow-600 dark:text-yellow-400 font-medium'>
         {dic.orderQuickInfo.noPersonFoundFillPersonInfo}
        </AlertDescription>
       </Alert>
      )}
     </div>
     {(personID || isErrorFindPerson) && (
      <div className='grid gap-4 grid-cols-2'>
       <Field data-invalid={!!errors?.firstName}>
        <FieldLabel htmlFor='firstName'>
         {dic.orderInfo.firstName} {isErrorFindPerson && '*'}
        </FieldLabel>
        <InputGroup data-invalid={!!errors?.firstName}>
         <InputGroupInput
          readOnly={!!personID}
          id='firstName'
          {...register('firstName')}
         />
        </InputGroup>
        {!!errors?.firstName && (
         <FieldContent>
          <FieldError>{errors?.firstName?.message}</FieldError>
         </FieldContent>
        )}
       </Field>
       <Field data-invalid={!!errors?.lastName}>
        <FieldLabel htmlFor='lastName'>
         {dic.orderInfo.lastName} {isErrorFindPerson && '*'}
        </FieldLabel>
        <InputGroup data-invalid={!!errors?.lastName}>
         <InputGroupInput
          readOnly={!!personID}
          id='lastName'
          {...register('lastName')}
         />
        </InputGroup>
        {!!errors?.lastName && (
         <FieldContent>
          <FieldError>{errors?.lastName?.message}</FieldError>
         </FieldContent>
        )}
       </Field>
      </div>
     )}
     <Field
      data-invalid={!!errors.subscriber}
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
           onBlur={field.onBlur}
           ref={field.ref}
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
         {!!errors.subscriber && (
          <FieldContent>
           <FieldLabel>{errors.subscriber.message}</FieldLabel>
          </FieldContent>
         )}
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
           onBlur={field.onBlur}
           ref={field.ref}
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
     <Field
      data-invalid={!!errors.room}
      data-disabled={saleTypeValue?.key !== SaleTypes.room}
     >
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
           onBlur={field.onBlur}
           ref={field.ref}
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
         {!!errors.room && (
          <FieldContent>
           <FieldError>{errors.room.message}</FieldError>
          </FieldContent>
         )}
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
           onBlur={field.onBlur}
           ref={field.ref}
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
     <Field data-invalid={!!errors.contract} className='col-span-full'>
      <FieldLabel htmlFor='contract'>{dic.orderInfo.contractNo}</FieldLabel>
      <Controller
       control={control}
       name='contract'
       render={({ field }) => (
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           id='contract'
           variant='outline'
           role='combobox'
           className='justify-between h-11'
           onBlur={field.onBlur}
           ref={field.ref}
          >
           <span className='grow text-ellipsis overflow-hidden text-start'>
            {field.value?.value || ''}
           </span>
           <div className='flex gap-2 items-center'>
            {!!contractValue && (
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
               setValue('contract', null);
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
            )}
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
         {!!errors.contract && (
          <FieldContent>
           <FieldError>{errors.contract.message}</FieldError>
          </FieldContent>
         )}
         {/* todo */}
         <FindContract dic={dic} />
        </Drawer>
       )}
      />
     </Field>
     <Field className='col-span-full'>
      <FieldLabel htmlFor='customer'>{dic.orderInfo.customerName}</FieldLabel>
      <Controller
       control={control}
       name='customerName'
       render={({ field: { value, ...other } }) => (
        <InputGroup className='h-11'>
         <InputGroupInput
          id='customer'
          placeholder={orderInfoName}
          value={value}
          {...other}
         />
        </InputGroup>
       )}
      />
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
          checked={!tableValue ? false : field.value}
          defaultChecked={field.value}
          onBlur={field.onBlur}
          disabled={!tableValue}
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
          disabled={saleTypeValue?.key !== SaleTypes.delivery}
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
