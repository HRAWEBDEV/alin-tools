import { useState, useEffect, useCallback } from 'react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter,
 DialogTrigger,
 DialogClose,
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
import { ChevronsUpDown } from 'lucide-react';
import {
 Drawer,
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
import {
 type SaveInvoicePackage,
 type ItemProgram,
 saveGuestInvoices,
} from '../../../../services/guest-expenses/guestExpensesApiActions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import FindItemPrograms from './FindItemPrograms';
import { BiError } from 'react-icons/bi';

export default function NewInvoice({
 dic,
 editInvoice,
}: {
 dic: RoomsRackDictionary;
 editInvoice: EditInvoiceDetailProps;
}) {
 const { format } = useCurrencyFormatter();
 const [selectedItemProgram, setSelectedItemProgram] =
  useState<ItemProgram | null>(null);
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
 const [itemServiceRate, setItemServiceRate] = useState(
  editInvoice.selectedInvoice ? editInvoice.selectedInvoice.serviceRate : 0,
 );
 const [itemTaxRate, setItemTaxRate] = useState(
  editInvoice.selectedInvoice ? editInvoice.selectedInvoice.taxRate : 0,
 );

 const [amountValue, priceValue, discountValue] = watch([
  'amount',
  'price',
  'discount',
 ]);
 const sValue = priceValue && amountValue ? priceValue * amountValue : '';
 const itemService =
  (((sValue || 0) - (discountValue || 0)) * itemServiceRate) / 100;
 const itemTax =
  (((sValue || 0) - (discountValue || 0) + itemService) * itemTaxRate) / 100;

 function handleChangeItem(item: ItemProgram) {
  setSelectedItemProgram(item);
  setValue('itemName', item.itemName || '');
  setItemTaxRate(item.taxRate);
  setItemServiceRate(item.serviceRate);
  setValue('price', item.price || 0);
 }

 const setFormDefaults = useCallback(() => {
  setItemServiceRate(0);
  setItemTaxRate(0);
  setValue('amount', defaultValues['amount']);
  setValue('comment', defaultValues['comment']);
  setValue('discount', defaultValues['discount']);
  setValue('discountPercentage', defaultValues['discountPercentage']);
  setSelectedItemProgram(null);
  setValue('price', 0);
  setValue('itemName', defaultValues['itemName']);
 }, [setValue]);

 const { mutate: confirmSave, isPending: saveIsPending } = useMutation({
  mutationFn(data: NewInvoiceSchema) {
   let invoices: SaveInvoicePackage[] = editInvoice.invoices;
   if (editInvoice.selectedInvoiceID) {
    invoices = invoices.map((invoice) => {
     if (invoice.id === editInvoice.selectedInvoiceID) {
      return {
       ...invoice,
       taxRate: itemTaxRate,
       serviceRate: itemServiceRate,
       tax: itemTax,
       service: itemService,
       sValue: sValue || 0,
       discount: data.discount || 0,
       amount: data.amount,
       comment: data.comment,
      };
     }
     return invoice;
    });
   } else if (selectedItemProgram) {
    invoices = [
     ...invoices,
     {
      id: 0,
      discount: 0,
      itemCode: selectedItemProgram.itemCode,
      itemID: selectedItemProgram.itemID,
      amount: data.amount,
      sValue: sValue || 0,
      arzID: selectedItemProgram.arzID,
      service: itemService,
      serviceRate: itemServiceRate,
      taxRate: itemTaxRate,
      tax: itemTax,
      programID: selectedItemProgram.programID,
      refProgramID: selectedItemProgram.programID,
      dateTimeDateTimeOffset: editInvoice.date,
      roomingDateTimeOffset: null,
      registerID: editInvoice.registerID,
      roomID: editInvoice.roomID,
      comment: null,
     },
    ];
   }
   return saveGuestInvoices({
    registerID: editInvoice.registerID,
    invoices,
    orderID: editInvoice.orderID,
   });
  },
  onSuccess() {
   editInvoice.invalidateInvoices();
   editInvoice.onCloseEditInvoice();
   clearErrors();
   if (!editInvoice.invoices.length) {
    editInvoice.onCloseDetailedInvoice();
   }
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });
 const { mutate: confirmRemove, isPending: RemoveIsPending } = useMutation({
  mutationFn(selectedInvoiceID: number) {
   const invoices: SaveInvoicePackage[] = editInvoice.invoices.filter(
    (item) => item.id !== selectedInvoiceID,
   );
   return saveGuestInvoices({
    registerID: editInvoice.registerID,
    invoices,
    orderID: editInvoice.orderID,
   });
  },
  onSuccess() {
   editInvoice.invalidateInvoices();
   editInvoice.onCloseEditInvoice();
   clearErrors();
   editInvoice.onCloseDetailedInvoice();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 useEffect(() => {
  if (editInvoice.selectedInvoice) {
   setItemServiceRate(editInvoice.selectedInvoice.serviceRate);
   setItemTaxRate(editInvoice.selectedInvoice.taxRate);
   setValue('amount', editInvoice.selectedInvoice.amount);
   setValue('comment', editInvoice.selectedInvoice.comment || '');
   setValue('discount', editInvoice.selectedInvoice.discount);
   setValue('itemName', editInvoice.selectedInvoice.itemName);
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

 const pendAction = saveIsPending || RemoveIsPending;

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
     <DialogHeader className='p-4 border-b border-border'>
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
       {editInvoice.selectedInvoice ? (
        <Field>
         <FieldLabel htmlFor='item'>{dic.invoiceDetails.item}</FieldLabel>
         <InputGroup className='h-11'>
          <InputGroupInput
           id='item'
           readOnly
           value={editInvoice?.selectedInvoice.itemName || ''}
          />
         </InputGroup>
        </Field>
       ) : (
        <Field data-invalid={!!errors.itemName}>
         <FieldLabel htmlFor='item'>{dic.invoiceDetails.item} *</FieldLabel>
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            data-invalid={!!errors.itemName}
            id='item'
            variant='outline'
            role='combobox'
            className='justify-between h-11'
            disabled={!editInvoice.costCenterID}
           >
            <span className='grow text-ellipsis overflow-hidden text-start'>
             {selectedItemProgram?.itemName || ''}
            </span>
            <div className='flex gap-2 items-center'>
             <ChevronsUpDown />
            </div>
           </Button>
          </DrawerTrigger>
          <FindItemPrograms
           dic={dic}
           programID={editInvoice.costCenterID!}
           onChangeItem={handleChangeItem}
          />
         </Drawer>
        </Field>
       )}

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
         {dic.invoiceDetails.description}
        </FieldLabel>
        <InputGroup>
         <InputGroupTextarea id='comment' {...register('comment')} />
        </InputGroup>
       </Field>
      </FieldGroup>
     </div>
     <DialogFooter className='p-4 py-2 border-t border-border'>
      <div className='flex gap-2 justify-between grow'>
       {!!editInvoice.selectedInvoiceID ? (
        <div className='flex gap-2 items-center justify-end col-span-full'>
         <Dialog>
          <DialogTrigger asChild>
           <Button
            type='button'
            variant='outline'
            className='text-destructive border-destructive w-full sm:w-24'
            disabled={pendAction}
           >
            {pendAction && <Spinner />}
            {dic.invoiceDetails.remove}
           </Button>
          </DialogTrigger>
          <DialogContent className='p-0 gap-0'>
           <DialogHeader className='p-4'>
            <DialogTitle className='hidden'>
             {dic.invoiceDetails.remove}
            </DialogTitle>
           </DialogHeader>
           <div className='p-4'>
            <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
             <BiError className='size-12' />
             <p>{dic.invoiceDetails.removeInvoiceConfirmMessage}</p>
            </div>
           </div>
           <DialogFooter className='p-4'>
            <DialogClose asChild>
             <Button
              className='sm:w-24'
              variant='outline'
              disabled={pendAction}
             >
              {pendAction && <Spinner />}
              {dic.invoiceDetails.cancel}
             </Button>
            </DialogClose>
            <DialogClose asChild>
             <Button
              className='sm:w-24'
              variant='destructive'
              disabled={pendAction}
              onClick={() => {
               confirmRemove(editInvoice.selectedInvoiceID!);
              }}
             >
              {pendAction && <Spinner />}
              {dic.invoiceDetails.confirm}
             </Button>
            </DialogClose>
           </DialogFooter>
          </DialogContent>
         </Dialog>
        </div>
       ) : (
        <div></div>
       )}
       <div className='flex gap-2'>
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
           (data) => {
            confirmSave(data);
           },
           (err) => {
            if ('itemName' in err) {
             toast.error(dic.invoiceDetails.noItemIsSelected);
            }
           },
          )();
         }}
        >
         {pendAction && <Spinner />}
         {dic.invoiceDetails.confirm}
        </Button>
       </div>
      </div>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 );
}
