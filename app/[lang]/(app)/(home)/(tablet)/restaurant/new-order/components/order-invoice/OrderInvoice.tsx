'use client';
import { useRef } from 'react';
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
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import {
 FieldGroup,
 FieldError,
 Field,
 FieldLabel,
} from '@/components/ui/field';
import { BsTrash } from 'react-icons/bs';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { NumericFormat } from 'react-number-format';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
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
       <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Field>
         <FieldLabel htmlFor='paymentType'>
          {dic.invoice.paymentType}
         </FieldLabel>
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            variant='outline'
            role='combobox'
            className='justify-between h-11 overflow-hidden'
           >
            <span className='grow text-ellipsis overflow-hidden text-start'>
             حمیدر حمیدر حمیدر شسیابمس مشسیبت
            </span>
            <div className='flex gap-2 items-center'>
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
             <ChevronsUpDown />
            </div>
           </Button>
          </DrawerTrigger>
         </Drawer>
        </Field>
        <Field>
         <FieldLabel htmlFor='bank'>{dic.invoice.bank}</FieldLabel>
         <Drawer>
          <DrawerTrigger asChild>
           <Button
            variant='outline'
            role='combobox'
            className='justify-between h-11 overflow-hidden'
           >
            <span className='grow text-ellipsis overflow-hidden text-start'></span>
            <div className='flex gap-2 items-center'>
             <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={(e) => {
               e.stopPropagation();
              }}
             >
              <BsTrash className='size-5 text-red-700 dark:text-red-400' />
             </Button>
             <ChevronsUpDown />
            </div>
           </Button>
          </DrawerTrigger>
         </Drawer>
        </Field>
       </div>
       <Field>
        <FieldLabel htmlFor='cardReader'>{dic.invoice.cardReader}</FieldLabel>
        <Drawer>
         <DrawerTrigger asChild>
          <Button
           variant='outline'
           role='combobox'
           className='justify-between h-11 overflow-hidden'
          >
           <span className='grow text-ellipsis overflow-hidden text-start'>
            حمیدر حمیدر حمیدر شسیابمس مشسیبت
           </span>
           <div className='flex gap-2 items-center'>
            <Button
             variant={'ghost'}
             size={'icon-lg'}
             onClick={(e) => {
              e.stopPropagation();
             }}
            >
             <BsTrash className='size-5 text-red-700 dark:text-red-400' />
            </Button>
            <ChevronsUpDown />
           </div>
          </Button>
         </DrawerTrigger>
        </Drawer>
       </Field>
       <Field>
        <FieldLabel htmlFor='paymentRefNo'>
         {dic.invoice.paymentRefNo}
        </FieldLabel>
        <InputGroup>
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
