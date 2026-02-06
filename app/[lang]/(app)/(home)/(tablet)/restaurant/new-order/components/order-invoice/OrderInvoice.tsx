'use client';
import { useRef, useEffect, MouseEvent } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { Spinner } from '@/components/ui/spinner';
import { ChevronsUpDown } from 'lucide-react';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerClose,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import {
 FieldGroup,
 FieldError,
 FieldContent,
 Field,
 FieldLabel,
} from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import {
 type OrderInvoicePayment,
 defaultValues,
 createOrderInvoicePaymentSchema,
} from '../../schemas/orderInvoicePaymentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
 newOrderPaymentKey,
 getOrderInvoicePaymentInitData,
} from '../../services/orderInvoicePaymentApiActions';
import { toast } from 'sonner';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 const {
  control,
  formState: { errors },
  setValue,
  getValues,
  watch,
  handleSubmit,
  clearErrors,
 } = useForm<OrderInvoicePayment>({
  resolver: zodResolver(createOrderInvoicePaymentSchema({ dic })),
  defaultValues: {
   ...defaultValues,
  },
 });

 const [paymentTypeValue, bankValue] = watch(['paymentType', 'bank']);

 const invoicePaymentRef = useRef<HTMLDivElement>(null);
 const {
  shopLoading,
  confirmOrderActiveType,
  order: { orderItems, onCloseOrder, onSaveOrder },
  invoice: {
   orderTotals: {
    totalTax,
    other,
    payment,
    remained,
    totalDiscount,
    totalService,
    totalSValue,
    totalPrice,
   },
   onPayment,
   onPaymentPcPos,
  },
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();

 const { data, isSuccess, isFetching } = useQuery({
  enabled: confirmOrderActiveType === 'invoice',
  queryKey: [newOrderPaymentKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getOrderInvoicePaymentInitData({ signal });
   return res.data;
  },
 });

 function handleConfirmPayment(e: MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  handleSubmit(
   (data) => {
    if (data.paymentType?.key === '2') {
     onPaymentPcPos(data);
     return;
    }
    onPayment(data);
   },
   (err) => {
    Object.keys(err).forEach((errKey) => {
     toast.error(err[errKey as keyof typeof err]?.message);
    });
   },
  )();
 }

 useEffect(() => {
  if (!data || !isSuccess) return;
  if (!getValues('paymentType') && !!data.payTypes.length) {
   const activePayType =
    data.payTypes.find(
     (item) => item.key === data.defaultPayTypeID.toString(),
    ) || data.payTypes[0];
   setValue('paymentType', activePayType);
  }
  if (!getValues('bank')) {
   const activeBank =
    data.banks.find((item) => item.key === data.defaultBankID.toString()) ||
    data.banks[0];
   setValue('bank', activeBank);
  }
 }, [isSuccess, data, getValues, setValue]);

 return orderItems.length ? (
  <div>
   <div className='w-[min(100%,35rem)] mx-auto pt-2'>
    <div className='p-4 border border-input rounded-md bg-neutral-50 dark:bg-neutral-950 mb-2'>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.service}
      </span>
      <span>{format(totalService)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.tax}
      </span>
      <span>{format(totalTax)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.other}
      </span>
      <span>{format(other)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.invoice.discount}
      </span>
      <span>{format(totalDiscount)}</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.itemsTotalPrice}
      </span>
      <span>{format(totalSValue)}</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-rose-50 dark:bg-rose-950 border-none text-rose-700 dark:text-rose-400 rounded-md text-xl'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.total}</span>
      <span>{format(remained + payment)}</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-teal-50 dark:bg-teal-950 border-secondary text-secondary rounded-md text-xl mb-0!'
      }
     >
      <span className={invoiceLabelClass}>
       {'- '}
       {dic.invoice.payment}
      </span>
      <span>{format(payment)}</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-orange-50 dark:bg-orange-950 border-none text-orange-700 dark:text-orange-400 rounded-md text-xl mb-0!'
      }
     >
      <span className={invoiceLabelClass}>
       {'= '}
       {dic.invoice.remained}
      </span>
      <span>{format(remained)}</span>
     </div>
    </div>
    <div className='grid sm:grid-cols-3 gap-3 mb-6 border-b border-input pb-6'>
     <Button
      disabled={shopLoading}
      variant='destructive'
      size='lg'
      className='font-medium disabled:bg-neutral-400 disabled:dark:bg-neutral-600'
      onClick={onCloseOrder}
     >
      {shopLoading && <Spinner />}
      {dic.invoice.closeOrder}
     </Button>
     <Button
      disabled={shopLoading}
      size='lg'
      className='font-medium'
      onClick={onSaveOrder}
     >
      {shopLoading && <Spinner />}
      {dic.invoice.confirmOrder}
     </Button>
     <Button
      disabled={shopLoading}
      variant='secondary'
      size='lg'
      className='font-medium'
      onClick={() => invoicePaymentRef.current?.scrollIntoView()}
     >
      {shopLoading && <Spinner />}
      {dic.invoice.confirmPayment}
     </Button>
    </div>
    {/* payment setup */}
    <div className='rounded-md border border-input p-4' ref={invoicePaymentRef}>
     <form>
      <FieldGroup className='gap-5'>
       <div className='grid grid-cols-1 gap-5'>
        <Field data-invalid={!!errors.paymentType}>
         <FieldLabel htmlFor='paymentType'>
          {dic.invoice.paymentType} *
         </FieldLabel>
         <Controller
          control={control}
          name='paymentType'
          render={({ field }) => (
           <Drawer>
            <DrawerTrigger asChild>
             <Button
              id='paymentType'
              variant='outline'
              role='combobox'
              className='justify-between h-11 overflow-hidden'
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
            {!!errors.paymentType && (
             <FieldContent>
              <FieldError>{errors.paymentType.message}</FieldError>
             </FieldContent>
            )}
            <DrawerContent className='h-[min(80svh,35rem)]'>
             <DrawerHeader className='hidden'>
              <DrawerTitle>{dic.invoice.paymentType}</DrawerTitle>
             </DrawerHeader>
             <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
              <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
               {dic.invoice.paymentType}
              </h1>
             </div>
             <div className='overflow-hidden overflow-y-auto'>
              {data?.payTypes.length ? (
               <ul>
                {data.payTypes.map((item) => (
                 <DrawerClose asChild key={item.key}>
                  <li
                   className='flex gap-1 items-center ps-6 py-2'
                   onClick={() => {
                    field.onChange(item);
                    clearErrors();
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
               <NoItemFound />
              )}
             </div>
            </DrawerContent>
           </Drawer>
          )}
         />
        </Field>
        {paymentTypeValue?.key !== '1' && (
         <Field data-invalid={!!errors.bank}>
          <FieldLabel htmlFor='bank'>{dic.invoice.bank} *</FieldLabel>
          <Controller
           control={control}
           name='bank'
           render={({ field }) => (
            <Drawer>
             <DrawerTrigger asChild>
              <Button
               id='bank'
               variant='outline'
               role='combobox'
               className='justify-between h-11 overflow-hidden'
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
             {!!errors.bank && (
              <FieldContent>
               <FieldError>{errors.bank.message}</FieldError>
              </FieldContent>
             )}
             <DrawerContent className='h-[min(80svh,35rem)]'>
              <DrawerHeader className='hidden'>
               <DrawerTitle>{dic.invoice.bank}</DrawerTitle>
              </DrawerHeader>
              <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
               <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
                {dic.invoice.bank}
               </h1>
              </div>
              <div className='overflow-hidden overflow-y-auto'>
               {data?.banks.length ? (
                <ul>
                 {data.banks.map((item) => (
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
                <NoItemFound />
               )}
              </div>
             </DrawerContent>
            </Drawer>
           )}
          />
         </Field>
        )}
       </div>
       {paymentTypeValue?.key === '2' && (
        <Field data-invalid={!!errors.cardReader} data-disabled={!bankValue}>
         <FieldLabel htmlFor='cardReader'>
          {dic.invoice.cardReader} *
         </FieldLabel>
         <Controller
          control={control}
          name='cardReader'
          render={({ field }) => (
           <Drawer>
            <DrawerTrigger asChild>
             <Button
              disabled={!bankValue}
              id='cardReader'
              variant='outline'
              role='combobox'
              className='justify-between h-11 overflow-hidden'
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
            {!!errors.cardReader && (
             <FieldContent>
              <FieldError>{errors.cardReader.message}</FieldError>
             </FieldContent>
            )}
            <DrawerContent className='h-[min(80svh,35rem)]'>
             <DrawerHeader className='hidden'>
              <DrawerTitle>{dic.invoice.cardReader}</DrawerTitle>
             </DrawerHeader>
             <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
              <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
               {dic.invoice.cardReader}
              </h1>
             </div>
             <div className='overflow-hidden overflow-y-auto'>
              {data?.payTypes.length ? (
               <ul>
                {data.payTypes.map((item) => (
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
               <NoItemFound />
              )}
             </div>
            </DrawerContent>
           </Drawer>
          )}
         />
        </Field>
       )}
       {paymentTypeValue?.key !== '1' && (
        <Field data-invalid={!!errors.paymentRefNo}>
         <FieldLabel htmlFor='paymentRefNo'>
          {dic.invoice.paymentRefNo}
         </FieldLabel>
         <InputGroup className='h-11'>
          <InputGroupInput />
         </InputGroup>
         {!!errors.paymentRefNo && (
          <FieldContent>
           <FieldError>{errors.paymentRefNo.message}</FieldError>
          </FieldContent>
         )}
        </Field>
       )}
       <div className='grid sm:grid-cols-3 gap-3 sm:justify-end'>
        <div></div>
        <div></div>
        {paymentTypeValue?.key === '2' ? (
         <Button
          disabled={isFetching || shopLoading}
          type='submit'
          onClick={handleConfirmPayment}
         >
          {(isFetching || shopLoading) && <Spinner />}
          {dic.invoice.sendToCardReader}
         </Button>
        ) : (
         <Button
          type='submit'
          disabled={isFetching || shopLoading}
          className='h-11'
          onClick={handleConfirmPayment}
         >
          {(isFetching || shopLoading) && <Spinner />}
          {dic.invoice.confirmInvoicePayment}
         </Button>
        )}
       </div>
      </FieldGroup>
     </form>
    </div>
   </div>
  </div>
 ) : (
  <NoItemFound />
 );
}
