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
import { type EditInvoiceDetailProps } from '../../../../utils/guest-expenses/EditInvoiceDetailProps';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
 type NewInvoiceSchema,
 defaultValues,
 createNewInvoiceSchema,
} from '../../../../schemas/guest-expenses/newInvoiceSchema';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon, ChevronsUpDown } from 'lucide-react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
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
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewInvoice({
 dic,
 editInvoice,
}: {
 dic: RoomsRackDictionary;
 editInvoice: EditInvoiceDetailProps;
}) {
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
 } = useForm<NewInvoiceSchema>({
  resolver: zodResolver(createNewInvoiceSchema()),
  defaultValues,
 });
 const [itemService, setItemService] = useState(0);
 const [itemTax, setItemTax] = useState(0);
 const [amountValue, priceValue, discountValue] = watch([
  'amount',
  'price',
  'discount',
 ]);
 const [showDateTimePicker, setShowDateTimePicker] = useState(false);
 const [showTimePicker, setShowTimePicker] = useState(false);
 const sValue = priceValue && amountValue ? priceValue * amountValue : '';

 const setFormDefaults = useCallback(() => {
  setItemService(0);
  setItemTax(0);
  setValue('amount', defaultValues['amount']);
  setValue('comment', defaultValues['comment']);
  setValue('discount', defaultValues['discount']);
  setValue('discountPercentage', defaultValues['discountPercentage']);
  setValue('item', defaultValues['item']);
  setValue('price', 0);
 }, [setValue]);

 // const { mutate: confirmSave, isPending: saveIsPending } = useMutation({
 //  mutationFn(data: NewInvoiceSchema) {
 //   const revenue: SaveRevenuePackage['revenue'] = {
 //    ...(editRevenue.selectedRevenue || {}),
 //    id: editRevenue.selectedRevenueID ? editRevenue.selectedRevenueID : 0,
 //    roomID: editRevenue.roomID,
 //    dateTimeDateTimeOffset: data.dateTime!.toISOString(),
 //    itemID: Number(data.item!.key),
 //    amount: data.amount,
 //    sValue: sValue || 0,
 //    discount: data.discount ? data.discount : 0,
 //    discountRate: data.discountPercentage || 0,
 //    service: itemService,
 //    tax: itemTax,
 //    arzID: Number(data.arz!.key),
 //    comment: data.comment ? data.comment : null,
 //   };
 //   return editRevenue.selectedRevenue
 //    ? updateRevenue({
 //       roomID: editRevenue.roomID,
 //       registerID: editRevenue.registerID,
 //       revenue,
 //      })
 //    : saveRevenue({
 //       roomID: editRevenue.roomID,
 //       registerID: editRevenue.registerID,
 //       revenue,
 //      });
 //  },
 //  onSuccess() {
 //   editRevenue.onCloseEditRevenue();
 //   editRevenue.invalidateRevenues();
 //   clearErrors();
 //  },
 //  onError(err: AxiosError<string>) {
 //   toast.error(err.response?.data);
 //  },
 // });

 useEffect(() => {
  if (editInvoice.selectedInvoice) {
   setItemService(editInvoice.selectedInvoice.service);
   setItemTax(editInvoice.selectedInvoice.tax);
   setValue('amount', editInvoice.selectedInvoice.amount);
   setValue('comment', editInvoice.selectedInvoice.comment || '');
   setValue('discount', editInvoice.selectedInvoice.discount);
   setValue('discountPercentage', editInvoice.selectedInvoice.discountRate);
   setValue('item', {
    key: editInvoice.selectedInvoice.itemID.toString(),
    value: editInvoice.selectedInvoice.itemName || '',
   });
   if (editInvoice.selectedInvoice.amount) {
    setValue(
     'price',
     editInvoice.selectedInvoice.sValue / editInvoice.selectedInvoice.amount,
    );
   }
  } else {
   setFormDefaults();
  }
  clearErrors();
 }, [editInvoice, setFormDefaults, setValue, clearErrors]);

 const pendAction = false;

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
   open={editInvoice.showEdit}
   onOpenChange={() => {
    if (pendAction) return;
    editInvoice.onCloseEditInvoice();
   }}
  >
   <DialogContent className='w-full h-full max-sm:rounded-none max-w-[unset]! sm:w-[min(95%,30rem)] gap-0 p-0 sm:h-auto sm:max-h-[95svh] overflow-hidden flex flex-col'>
    <form className='grow flex flex-col overflow-hidden'>
     <DialogHeader className='p-4 border-b border-input'>
      <DialogHeader>
       <DialogTitle className='text-lg'>
        {editInvoice.selectedInvoiceID
         ? dic.invoiceDetails.edit
         : dic.invoiceDetails.new}
       </DialogTitle>
      </DialogHeader>
     </DialogHeader>
     <div className='p-4 grow overflow-auto'>
      <FieldGroup className='gap-4'>
       <Field data-invalid={!!errors.item}>
        <FieldLabel htmlFor='item'>{dic.invoiceDetails.item} *</FieldLabel>
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
              <ChevronsUpDown />
             </div>
            </Button>
           </DrawerTrigger>
           <DrawerContent className='h-[min(80svh,35rem)]'>
            <DrawerHeader className='hidden'>
             <DrawerTitle>{dic.invoiceDetails.item}</DrawerTitle>
            </DrawerHeader>
            <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
             <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
              {dic.invoiceDetails.item}
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
         render={({ field: { value, onChange, ref, ...other } }) => (
          <Field data-invalid={!!errors.amount}>
           <FieldLabel htmlFor='amount'>
            {dic.invoiceDetails.amount} *
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
            {dic.invoiceDetails.itemPrice} *
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
        <Field className='col-span-full'>
         <FieldLabel htmlFor='sValue'>{dic.invoiceDetails.sValue}</FieldLabel>
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
        <Controller
         control={control}
         name='discount'
         render={({ field: { value, onChange, ...other } }) => (
          <Field>
           <FieldLabel htmlFor='discount'>
            {dic.invoiceDetails.discount}
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
            {dic.invoiceDetails.discountPercentage}
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
       </div>
       <Field>
        <FieldLabel htmlFor='comment'>
         {dic.invoiceDetails.description}
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
        editInvoice.onCloseEditInvoice();
       }}
       disabled={pendAction}
      >
       {pendAction && <Spinner />}
       {dic.invoiceDetails.cancel}
      </Button>
      <Button
       type='submit'
       className='sm:w-24'
       size='lg'
       disabled={pendAction}
       onClick={(e) => {
        e.preventDefault();
        handleSubmit(
         (data) => {},
         (err) => {},
        )();
       }}
      >
       {pendAction && <Spinner />}
       {dic.invoiceDetails.confirm}
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 );
}
