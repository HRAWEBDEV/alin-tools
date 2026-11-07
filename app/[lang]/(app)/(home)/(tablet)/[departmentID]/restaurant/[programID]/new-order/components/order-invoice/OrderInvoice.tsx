'use client';
import { useRef } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { Spinner } from '@/components/ui/spinner';
import { ArrowDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import { type OrderInfo } from '../../schemas/orderInfoSchema';
import OrderPayment from './OrderPayment';
import { PaymentType } from '../../utils/PaymentTypes';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-border font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 const { watch: watchOrderInfo } = useFormContext<OrderInfo>();
 const [orderInfoWalletOtpCode, orderInfoPhoneNumber] = watchOrderInfo([
  'walletOtpCode',
  'phoneNumber',
 ]);

 const invoicePaymentRef = useRef<HTMLDivElement>(null);
 const {
  shopLoading,
  confirmOrderActiveType,
  order: { orderItems, onSaveOrder, onCloseOrder },
  invoice: {
   isFixedDiscount,
   isPayable,
   orderTotals: {
    totalTax,
    other,
    payment,
    remained,
    totalDiscount,
    totalService,
    totalSValue,
   },
   onPayment,
   onPaymentPcPos,
  },
  access,
 } = useOrderBaseConfigContext();
 const { format } = useCurrencyFormatter();

 function scrollToPaymentSection() {
  invoicePaymentRef.current?.scrollIntoView();
 }

 const scrollToPaymentSectionDB = useDebouncedCallback(scrollToPaymentSection, {
  wait: 500,
 });

 return orderItems.length ? (
  <div>
   <div className='w-[min(100%,35rem)] mx-auto pt-2'>
    <div className='p-4 border border-border rounded-md bg-neutral-50 dark:bg-neutral-950 mb-2'>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.service}
      </span>
      <span>{format(totalService)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.tax}
      </span>
      <span>{format(totalTax)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.other}
      </span>
      <span>{format(other)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'- '}
       {isFixedDiscount ? dic.invoice.fixedDiscount : dic.invoice.discount}
      </span>
      <span>{format(totalDiscount)} ریال</span>
     </div>
     <div className={invoiceRowClass}>
      <span className={invoiceLabelClass}>
       {'+ '}
       {dic.invoice.itemsTotalPrice}
      </span>
      <span>{format(totalSValue)} ریال</span>
     </div>
     <div
      className={
       invoiceRowClass +
       ' p-2 sm:px-8 bg-rose-50 dark:bg-rose-950 border-none text-rose-700 dark:text-rose-400 rounded-md text-xl'
      }
     >
      <span className={invoiceLabelClass}>{dic.invoice.total}</span>
      <span>{format(remained + payment)} ریال</span>
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
      <span>{format(payment)} ریال</span>
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
      <span>{format(remained)} ریال</span>
     </div>
    </div>
    <div className='grid grid-cols-2 gap-3 mb-6 border-b border-border pb-6'>
     <Button
      disabled={shopLoading || !access['order']['edit']}
      size='lg'
      className='font-medium'
      onClick={() => {
       onSaveOrder();
      }}
     >
      {shopLoading && <Spinner />}
      {dic.invoice.confirmOrder}
     </Button>
     <Button
      disabled={shopLoading || !isPayable || !access['order']['payment']}
      variant='secondary'
      size='lg'
      className='font-medium'
      onClick={() => scrollToPaymentSectionDB()}
     >
      {shopLoading && <Spinner />}
      {dic.invoice.paymentInfo}
      <ArrowDown />
     </Button>
    </div>
    {/* payment setup */}
    {isPayable && access['order']['payment'] && (
     <div
      className='rounded-md border border-border p-4'
      ref={invoicePaymentRef}
     >
      {confirmOrderActiveType === 'invoice' && (
       <OrderPayment
        dic={dic['invoice']}
        canPay={access['order']['payment']}
        isLoading={shopLoading}
        otpCode={orderInfoWalletOtpCode}
        phoneNumber={orderInfoPhoneNumber}
        paymentValue={remained}
        onCloseOrder={onCloseOrder}
        onConfirmPayment={(data, walletInfo) => {
         const { otpCode, ...restData } = data;
         if (data.paymentType?.key === PaymentType.creditCard) {
          onPaymentPcPos(restData);
          return;
         }
         if (data.paymentType?.key === PaymentType.wallet) {
          onPaymentPcPos({
           ...restData,
           walletKey: walletInfo?.id.toString(),
           otpCode,
          });
          return;
         }
         onPayment(restData);
        }}
       />
      )}
     </div>
    )}
   </div>
  </div>
 ) : (
  <NoItemFound />
 );
}
