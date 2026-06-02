import { useState, useEffect, useCallback } from 'react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type EditStayRevenueProps } from '../../../utils/guest-expenses/EditStayRevenueProps';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
 type NewStayExpenseSchema,
 defaultValues,
 createNewStayExpenseSchema,
} from '../../../schemas/guest-expenses/newStayExpenseSchema';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, ChevronsUpDown } from 'lucide-react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 TimePickerButton,
 TimePickerRoot,
 TimePickerSeparator,
 TimePickerTitle,
 TimePickerWheel,
 TimePickerWheels,
} from '@poursha98/react-ios-time-picker';
import { useDateFns } from '@/hooks/useDateFns';
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { NumericFormat } from 'react-number-format';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
} from '@/components/ui/input-group';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import {
 type SaveRevenuePackage,
 type StayExpenseItem,
 saveRevenue,
 updateRevenue,
} from '../../../services/guest-expenses/guestExpensesApiActions';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import FindItems from './FindItems';

export default function NewStayExpense({
 dic,
 editRevenue,
}: {
 dic: RoomsRackDictionary;
 editRevenue: EditStayRevenueProps;
}) {
 const { format } = useCurrencyFormatter();
 const isRevenueEditable =
  !!editRevenue.selectedRevenue && !!editRevenue.selectedRevenueID
   ? !!editRevenue.selectedRevenue?.userPersonID &&
     editRevenue.selectedRevenue?.itemID != 3 &&
     editRevenue.selectedRevenue?.itemID != 4 &&
     editRevenue.selectedRevenueID > 0
   : true;

 const dateFns = useDateFns();
 const { locale } = useBaseConfig();
 const {
  control,
  setValue,
  register,
  formState: { errors },
  watch,
  handleSubmit,
  clearErrors,
 } = useForm<NewStayExpenseSchema>({
  resolver: zodResolver(createNewStayExpenseSchema()),
  defaultValues,
 });
 const [itemServiceRate, setItemServiceRate] = useState(
  editRevenue.selectedRevenue ? editRevenue.selectedRevenue.serviceRate : 0,
 );
 const [itemTaxRate, setItemTaxRate] = useState(
  editRevenue.selectedRevenue ? editRevenue.selectedRevenue.taxRate : 0,
 );
 const [amountValue, priceValue, discountValue] = watch([
  'amount',
  'price',
  'discount',
 ]);
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const [showTimePicker, setShowTimePicker] = useState(false);
 const sValue = priceValue && amountValue ? priceValue * amountValue : '';

 const itemService =
  (((sValue || 0) - (discountValue || 0)) * itemServiceRate) / 100;
 const itemTax =
  (((sValue || 0) - (discountValue || 0) + itemService) * itemTaxRate) / 100;

 function handleChangeItem(item: StayExpenseItem) {
  setItemServiceRate(item.serviceRate || 0);
  setItemTaxRate(item.taxRate || 0);
  setValue('item', {
   key: item.itemID.toString(),
   value: item.itemName || '',
  });
  setValue('price', item.price);
 }

 const setFormDefaults = useCallback(() => {
  setValue('dateTime', new Date());
  setItemServiceRate(0);
  setItemTaxRate(0);
  setValue('dateTime', new Date());
  setValue('amount', defaultValues['amount']);
  setValue('comment', defaultValues['comment']);
  setValue('discount', defaultValues['discount']);
  setValue('discountPercentage', defaultValues['discountPercentage']);
  setValue('item', defaultValues['item']);
  if (editRevenue.arzs) {
   setValue('arz', editRevenue.arzs[0]);
  }
  setValue('price', 0);
 }, [setValue, editRevenue]);

 const { mutate: confirmSave, isPending: saveIsPending } = useMutation({
  mutationFn(data: NewStayExpenseSchema) {
   const revenue: SaveRevenuePackage['revenue'] = {
    ...(editRevenue.selectedRevenue || {}),
    id: editRevenue.selectedRevenueID ? editRevenue.selectedRevenueID : 0,
    roomID: editRevenue.roomID,
    dateTimeDateTimeOffset: data.dateTime!.toISOString(),
    itemID: Number(data.item!.key),
    amount: data.amount,
    sValue: sValue || 0,
    discount: data.discount ? data.discount : 0,
    discountRate: data.discountPercentage || 0,
    service: itemService,
    tax: itemTax,
    arzID: Number(data.arz!.key),
    comment: data.comment ? data.comment : null,
   };
   return editRevenue.selectedRevenue
    ? updateRevenue({
       roomID: editRevenue.roomID,
       registerID: editRevenue.registerID,
       revenue,
      })
    : saveRevenue({
       roomID: editRevenue.roomID,
       registerID: editRevenue.registerID,
       revenue,
      });
  },
  onSuccess() {
   editRevenue.onCloseEditRevenue();
   editRevenue.invalidateRevenues();
   clearErrors();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 useEffect(() => {
  if (editRevenue.selectedRevenue) {
   setItemServiceRate(editRevenue.selectedRevenue.serviceRate);
   setItemTaxRate(editRevenue.selectedRevenue.taxRate);
   setValue(
    'dateTime',
    new Date(editRevenue.selectedRevenue.dateTimeDateTimeOffset),
   );
   setValue('amount', editRevenue.selectedRevenue.amount);
   setValue('comment', editRevenue.selectedRevenue.comment || '');
   setValue('discount', editRevenue.selectedRevenue.discount);
   setValue('discountPercentage', editRevenue.selectedRevenue.discountRate);
   setValue('item', {
    key: editRevenue.selectedRevenue.itemID.toString(),
    value: editRevenue.selectedRevenue.itemName || '',
   });
   setValue('arz', {
    key: editRevenue.selectedRevenue.arzID.toString(),
    value: editRevenue.selectedRevenue.arzName || '',
   });
   if (editRevenue.selectedRevenue.amount) {
    setValue(
     'price',
     editRevenue.selectedRevenue.sValue / editRevenue.selectedRevenue.amount,
    );
   }
  } else {
   setFormDefaults();
  }
  clearErrors();
 }, [editRevenue, setFormDefaults, setValue, clearErrors]);

 const pendAction = saveIsPending;

 useEffect(() => {
  if (sValue && discountValue) {
   const discountPercentage = (discountValue / sValue) * 100;
   setValue('discountPercentage', discountPercentage);
  } else {
   setValue('discountPercentage', 0);
  }
 }, [sValue, setValue, discountValue, clearErrors]);

 return (
  <Dialog
   open={editRevenue.showEdit}
   onOpenChange={() => {
    if (pendAction) return;
    editRevenue.onCloseEditRevenue();
   }}
  >
   <DialogContent className='w-full h-full max-sm:rounded-none max-w-[unset]! sm:w-[min(95%,30rem)] gap-0 p-0 sm:h-auto sm:max-h-[95svh] overflow-hidden flex flex-col'>
    <form className='grow flex flex-col overflow-hidden'>
     <DialogHeader className='p-4 border-b border-input'>
      <DialogHeader>
       <DialogTitle className='text-lg'>
        {editRevenue.selectedRevenueID
         ? dic.guestExpensesStay.edit
         : dic.guestExpensesStay.new}
       </DialogTitle>
      </DialogHeader>
     </DialogHeader>
     <div className='p-4 grow overflow-auto'>
      <FieldGroup className='gap-4'>
       <div className='grid sm:grid-cols-2 gap-4'>
        <Controller
         control={control}
         name='dateTime'
         render={({ field }) => (
          <Field>
           <FieldLabel htmlFor='date'>{dic.guestExpensesStay.date}</FieldLabel>
           <Popover
            open={showDateTimePicker}
            onOpenChange={(newValue) => {
             setShowDateTimePicker(newValue);
            }}
           >
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
              defaultMonth={field.value || undefined}
              endMonth={dateFns.addMonths(new Date(), 1)}
              disabled={(date) => date.getTime() > Date.now()}
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
         name='dateTime'
         render={({ field }) => (
          <Field>
           <FieldLabel htmlFor='time'>{dic.guestExpensesStay.time}</FieldLabel>
           <Popover
            open={showTimePicker}
            onOpenChange={(newValue) => {
             setShowTimePicker(newValue);
            }}
           >
            <PopoverTrigger asChild>
             <Button
              variant='outline'
              id='time'
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
              value={
               field.value?.toLocaleTimeString('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
               }) || ''
              }
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
               {dic.guestExpensesStay.time}
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
               {dic.guestExpensesStay.confirm}
              </TimePickerButton>
             </TimePickerRoot>
            </PopoverContent>
           </Popover>
          </Field>
         )}
        />
       </div>
       <Field data-invalid={!!errors.item}>
        <FieldLabel htmlFor='item'>{dic.guestExpensesStay.item} *</FieldLabel>
        <Controller
         control={control}
         name='item'
         render={({ field }) => (
          <Drawer>
           <DrawerTrigger asChild>
            <Button
             data-invalid={!!errors.item}
             id='item'
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
              {/*{field.value && (
               <Button
                variant={'ghost'}
                size={'icon-lg'}
                onClick={(e) => {
                 e.stopPropagation();
                 field.onChange(null);
                }}
               >
                <BsTrash className='size-5 text-red-700 dark:text-red-400' />
               </Button>
              )}*/}
              <ChevronsUpDown />
             </div>
            </Button>
           </DrawerTrigger>
           <FindItems dic={dic} onChangeItem={handleChangeItem} />
          </Drawer>
         )}
        />
       </Field>
       <div className='grid sm:grid-cols-2 gap-4'>
        <Controller
         control={control}
         name='amount'
         render={({ field: { value, onChange, ref, ...other } }) => (
          <Field data-invalid={!!errors.amount}>
           <FieldLabel htmlFor='amount'>
            {dic.guestExpensesStay.amount} *
           </FieldLabel>
           <InputGroup className='h-11' data-invalid={!!errors.amount}>
            <NumericFormat
             id='amount'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             customInput={InputGroupInput}
             decimalScale={0}
             allowLeadingZeros={false}
             getInputRef={ref}
            />
           </InputGroup>
          </Field>
         )}
        />
        <Controller
         control={control}
         name='price'
         render={({ field: { value, onChange, ref, ...other } }) => (
          <Field data-invalid={!!errors.price}>
           <FieldLabel htmlFor='price'>
            {dic.guestExpensesStay.itemPrice} *
           </FieldLabel>
           <InputGroup className='h-11' data-invalid={!!errors.price}>
            <NumericFormat
             id='price'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             customInput={InputGroupInput}
             thousandSeparator
             decimalScale={0}
             allowLeadingZeros={false}
             getInputRef={ref}
            />
           </InputGroup>
          </Field>
         )}
        />
        <Field>
         <FieldLabel htmlFor='sValue'>
          {dic.guestExpensesStay.sValue}
         </FieldLabel>
         <InputGroup className='h-11'>
          <NumericFormat
           id='sValue'
           readOnly
           customInput={InputGroupInput}
           thousandSeparator
           allowLeadingZeros={false}
           value={sValue}
          />
         </InputGroup>
        </Field>
        <Field data-invalid={!!errors.arz}>
         <FieldLabel htmlFor='arz'>{dic.guestExpensesStay.arz} *</FieldLabel>
         <Controller
          control={control}
          name='arz'
          render={({ field }) => (
           <Drawer>
            <DrawerTrigger asChild>
             <Button
              data-invalid={!!errors.arz}
              id='arz'
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
               {/*{field.value && (
                       <Button
                        variant={'ghost'}
                        size={'icon-lg'}
                        onClick={(e) => {
                         e.stopPropagation();
                         field.onChange(null);
                        }}
                       >
                        <BsTrash className='size-5 text-red-700 dark:text-red-400' />
                       </Button>
                      )}*/}
               <ChevronsUpDown />
              </div>
             </Button>
            </DrawerTrigger>
            <DrawerContent className='h-[min(80svh,35rem)]'>
             <DrawerHeader className='hidden'>
              <DrawerTitle>{dic.guestExpensesStay.arz} *</DrawerTitle>
             </DrawerHeader>
             <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
              <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
               {dic.guestExpensesStay.arz}
              </h1>
             </div>
             <div className='overflow-hidden overflow-y-auto'>
              {editRevenue.arzs?.length ? (
               <ul>
                {editRevenue.arzs.map((item) => (
                 <DrawerClose asChild key={item.key}>
                  <li
                   className='flex gap-1 items-center ps-6 py-2'
                   onClick={() => {
                    field.onChange(item);
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
        <Controller
         control={control}
         name='discount'
         render={({ field: { value, onChange, ...other } }) => (
          <Field>
           <FieldLabel htmlFor='discount'>
            {dic.guestExpensesStay.discount}
           </FieldLabel>
           <InputGroup className='h-11'>
            <NumericFormat
             id='discount'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             customInput={InputGroupInput}
             decimalScale={0}
             thousandSeparator
             allowLeadingZeros={false}
            />
           </InputGroup>
          </Field>
         )}
        />
        <Controller
         control={control}
         name='discountPercentage'
         render={({ field: { value, onChange, ref, ...other } }) => (
          <Field data-invalid={!!errors.discountPercentage}>
           <FieldLabel htmlFor='discoundiscountPercentage'>
            {dic.guestExpensesStay.discountPercentage}
           </FieldLabel>
           <InputGroup
            className='h-11'
            data-invalid={!!errors.discountPercentage}
           >
            <NumericFormat
             id='discoundiscountPercentage'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             onChange={(e) => {
              const newValue = e.target.value;

              if (newValue) {
               if (sValue) {
                const discount = (sValue * Number(newValue)) / 100;
                setValue('discount', discount);
               }
              } else {
               setValue('discount', 0);
              }
             }}
             getInputRef={ref}
             customInput={InputGroupInput}
             decimalScale={2}
             isAllowed={({ floatValue }) => {
              if (!floatValue) return true;
              return floatValue <= 100;
             }}
             max={100}
             allowNegative={false}
             allowLeadingZeros={false}
            />
           </InputGroup>
          </Field>
         )}
        />
        <Field>
         <FieldLabel htmlFor='service'>{dic.invoiceDetails.service}</FieldLabel>
         <InputGroup className='h-11'>
          <InputGroupInput id='service' readOnly value={format(itemService)} />
         </InputGroup>
        </Field>
        <Field>
         <FieldLabel htmlFor='tax'>{dic.invoiceDetails.tax}</FieldLabel>
         <InputGroup className='h-11'>
          <InputGroupInput id='tax' readOnly value={format(itemTax)} />
         </InputGroup>
        </Field>
       </div>
       <Field>
        <FieldLabel htmlFor='comment'>
         {dic.guestExpensesStay.description}
        </FieldLabel>
        <InputGroup>
         <InputGroupTextarea id='comment' {...register('comment')} />
        </InputGroup>
       </Field>
      </FieldGroup>
     </div>
     <DialogFooter className='p-4 py-2 border-t border-input'>
      <Button
       type='button'
       className='sm:w-24'
       size='lg'
       variant='outline'
       onClick={() => {
        editRevenue.onCloseEditRevenue();
       }}
       disabled={pendAction}
      >
       {pendAction && <Spinner />}
       {dic.guestExpensesStay.cancel}
      </Button>
      <Button
       type='submit'
       className='sm:w-24'
       size='lg'
       disabled={!isRevenueEditable}
       onClick={(e) => {
        if (!isRevenueEditable) return;
        e.preventDefault();
        handleSubmit(
         (data) => confirmSave(data),
         (err) => {
          if ('item' in err) {
           toast.error(dic.guestExpensesStay.noItemIsSelected);
          }
         },
        )();
       }}
      >
       {pendAction && <Spinner />}
       {dic.guestExpensesStay.confirm}
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 );
}
