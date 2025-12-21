'use client';
import { useRef } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { Spinner } from '@/components/ui/spinner';
import { ChevronsUpDown } from 'lucide-react';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import {
 FieldGroup,
 FieldError,
 FieldContent,
 Field,
 FieldLabel,
} from '@/components/ui/field';
import { BsTrash } from 'react-icons/bs';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { useForm, Controller } from 'react-hook-form';
import {
 type OrderInvoicePayment,
 defaultValues,
 createOrderInvoicePaymentSchema,
} from '../../schemas/orderInvoicePaymentSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 const {
  control,
  formState: { errors },
 } = useForm<OrderInvoicePayment>({
  resolver: zodResolver(createOrderInvoicePaymentSchema({ dic })),
  defaultValues: {
   ...defaultValues,
  },
 });
 const invoicePaymentRef = useRef<HTMLDivElement>(null);
 const {
  shopLoading,
  queries: { orderID },
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
   },
  },
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();

 return orderItems.length ? (
  <div>
   <div className='w-[min(100%,35rem)] mx-auto pt-2'>
    <div className='grid sm:grid-cols-3 gap-3 mb-2'>
     <Button
      disabled={!orderID || shopLoading}
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
    <div className='p-4 border border-input rounded-md bg-neutral-50 dark:bg-neutral-950 mb-4'>
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
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-rose-50 dark:bg-rose-950 border-none text-rose-700 dark:text-rose-400 rounded-md text-xl'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.total}</span>
      <span>{format(totalSValue)}</span>
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
    {/* payment setup */}
    <div className='rounded-md border border-input p-4' ref={invoicePaymentRef}>
     <form>
      <FieldGroup className='gap-5'>
       <div className='grid grid-cols-1 gap-5'>
        <Field>
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
           </Drawer>
          )}
         />
        </Field>
        <Field>
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
           </Drawer>
          )}
         />
        </Field>
       </div>
       <Field>
        <FieldLabel htmlFor='cardReader'>{dic.invoice.cardReader} *</FieldLabel>
        <Controller
         control={control}
         name='cardReader'
         render={({ field }) => (
          <Drawer>
           <DrawerTrigger asChild>
            <Button
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
          </Drawer>
         )}
        />
       </Field>
       <Field>
        <FieldLabel htmlFor='paymentRefNo'>
         {dic.invoice.paymentRefNo}
        </FieldLabel>
        <InputGroup className='h-11'>
         <InputGroupInput />
        </InputGroup>
       </Field>
       <div className='flex lg:justify-end gap-3 flex-col lg:flex-row'>
        <Button className='h-11'>{dic.invoice.sendToCardReader}</Button>
        <Button className='h-11'>{dic.invoice.confirmInvoicePayment}</Button>
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
