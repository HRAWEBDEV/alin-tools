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
import { BsTrash } from 'react-icons/bs';
import { NumericFormat } from 'react-number-format';
import {
 InputGroup,
 InputGroupInput,
 InputGroupTextarea,
} from '@/components/ui/input-group';

export default function NewStayExpense({
 dic,
 editRevenue,
}: {
 dic: RoomsRackDictionary;
 editRevenue: EditStayRevenueProps;
}) {
 const dateFns = useDateFns();
 const { locale } = useBaseConfig();
 const {
  control,
  setValue,
  register,
  formState: { errors },
 } = useForm<NewStayExpenseSchema>({
  resolver: zodResolver(createNewStayExpenseSchema()),
  defaultValues,
 });
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const [showTimePicker, setShowTimePicker] = useState(false);

 const setFormDefaults = useCallback(() => {
  setValue('dateTime', new Date());
 }, [setValue]);

 useEffect(() => {
  if (editRevenue.selectedRevenue) {
  } else {
   setFormDefaults();
  }
 }, [editRevenue, setFormDefaults]);

 return (
  <Dialog
   open={editRevenue.showEdit}
   onOpenChange={() => {
    editRevenue.onCloseEditRevenue();
   }}
  >
   <DialogContent className='max-sm:rounded-none max-w-[unset]! sm:w-[min(95%,30rem)] gap-0 p-0 sm:max-h-[95svh] overflow-hidden flex flex-col'>
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
              {field.value && (
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
              )}
              <ChevronsUpDown />
             </div>
            </Button>
           </DrawerTrigger>
           <DrawerContent className='h-[min(80svh,35rem)]'>
            <DrawerHeader className='hidden'>
             <DrawerTitle>{dic.guestExpensesStay.item}</DrawerTitle>
            </DrawerHeader>
            <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
             <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
              {dic.guestExpensesStay.item}
             </h1>
            </div>
            <div className='overflow-hidden overflow-y-auto'>
             {/*{data?.saleTypes.length ? (
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
             )}*/}
            </div>
           </DrawerContent>
          </Drawer>
         )}
        />
       </Field>
       <div className='grid sm:grid-cols-2 gap-4'>
        <Controller
         control={control}
         name='amount'
         render={({ field: { value, onChange, ...other } }) => (
          <Field>
           <FieldLabel htmlFor='amount'>
            {dic.guestExpensesStay.amount} *
           </FieldLabel>
           <InputGroup className='h-11'>
            <NumericFormat
             id='amount'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             customInput={InputGroupInput}
             decimalScale={0}
             allowLeadingZeros={false}
            />
           </InputGroup>
          </Field>
         )}
        />
        <Controller
         control={control}
         name='price'
         render={({ field: { value, onChange, ...other } }) => (
          <Field>
           <FieldLabel htmlFor='price'>
            {dic.guestExpensesStay.itemPrice} *
           </FieldLabel>
           <InputGroup className='h-11'>
            <NumericFormat
             id='price'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             customInput={InputGroupInput}
             thousandSeparator
             decimalScale={0}
             allowLeadingZeros={false}
            />
           </InputGroup>
          </Field>
         )}
        />
        <Field className='col-span-full'>
         <FieldLabel htmlFor='sValue'>
          {dic.guestExpensesStay.sValue} *
         </FieldLabel>
         <InputGroup className='h-11'>
          <NumericFormat
           id='sValue'
           readOnly
           customInput={InputGroupInput}
           thousandSeparator
           allowLeadingZeros={false}
          />
         </InputGroup>
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
         render={({ field: { value, onChange, ...other } }) => (
          <Field>
           <FieldLabel htmlFor='discoundiscountPercentage'>
            {dic.guestExpensesStay.discountPercentage}
           </FieldLabel>
           <InputGroup className='h-11'>
            <NumericFormat
             id='discoundiscountPercentage'
             {...other}
             value={value}
             onValueChange={({ floatValue }) => onChange(floatValue || '')}
             customInput={InputGroupInput}
             decimalScale={0}
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
       onClick={() => editRevenue.onCloseEditRevenue()}
      >
       {dic.guestExpensesStay.cancel}
      </Button>
      <Button type='submit' className='sm:w-24' size='lg'>
       {dic.guestExpensesStay.confirm}
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 );
}
