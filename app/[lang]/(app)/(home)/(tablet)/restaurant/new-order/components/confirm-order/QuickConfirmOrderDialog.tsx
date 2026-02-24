'use client';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 Field,
 FieldGroup,
 FieldLabel,
 FieldError,
 FieldContent,
} from '@/components/ui/field';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { NumericFormat } from 'react-number-format';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import { ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { SaleTypes } from '../../utils/SaleTypes';
import { useSettingsContext } from '../../../services/profile/settings/settingsContext';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuickOrderInfoDialog({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const { orderConfigSetup } = useSettingsContext();
 const {
  queries: { orderID },
  initialDataInfo: { data },
  person: {
   errorFindPerson,
   findPerson,
   isErrorFindPerson,
   personID,
   isPendingFindPerson,
  },
 } = useOrderBaseConfigContext();
 const [open, setIsOpen] = useState(
  !orderID && orderConfigSetup.orderConfig.getInitInfo === 'active',
 );
 const {
  register,
  control,
  setValue,
  clearErrors,
  trigger,
  watch,
  getValues,
  setFocus,
  formState: { errors },
 } = useFormContext<OrderInfo>();
 const [phoneNumberValue] = watch(['phoneNumber']);

 async function confirmQuickOrderInfo() {
  const isFirstNameValid = await trigger('firstName');
  if (!isFirstNameValid) {
   setFocus('firstName');
   return;
  }
  const isLastNameValid = await trigger('lastName');
  if (!isLastNameValid) {
   setFocus('lastName');
   return;
  }
  setIsOpen(false);
 }

 return (
  <Dialog
   open={open}
   onOpenChange={(newValue) => {
    setIsOpen(newValue);
   }}
  >
   <DialogContent
    className='flex flex-col w-[min(95%,35rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'
    showCloseButton={false}
   >
    <DialogHeader className='p-4 border-b border-input'>
     <DialogTitle>{dic.tools.orderInfo}</DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto p-4'>
     <FieldGroup className='gap-4'>
      <div>
       <label className='block mb-2 font-medium'>
        {dic.orderInfo.saleType}
       </label>
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
            className='justify-between h-11 w-full'
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
      </div>
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
      <div className='grid gap-4 grid-cols-2'>
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
      </div>
      <Field>
       <FieldLabel htmlFor='customer'>{dic.orderInfo.customerName}</FieldLabel>
       <Controller
        control={control}
        name='customerName'
        render={({ field: { value, ...other } }) => (
         <InputGroup className='h-11'>
          <InputGroupInput id='customer' value={value} {...other} />
         </InputGroup>
        )}
       />
      </Field>
      <Field className='col-span-full'>
       <FieldLabel htmlFor='description'>
        {dic.orderInfo.description}
       </FieldLabel>
       <InputGroup>
        <InputGroupTextarea id='description' {...register('comment')} />
       </InputGroup>
      </Field>
     </FieldGroup>
    </div>
    <DialogFooter className='p-4 py-2 border-t border-input'>
     <Button
      size='lg'
      className='sm:w-36'
      disabled={isPendingFindPerson}
      onClick={confirmQuickOrderInfo}
     >
      {isPendingFindPerson && <Spinner />}
      {dic.orderQuickInfo.confirm}
     </Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
