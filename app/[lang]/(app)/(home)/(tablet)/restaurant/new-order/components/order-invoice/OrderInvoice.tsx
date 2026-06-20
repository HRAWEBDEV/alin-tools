'use client';
import { useRef, useEffect, MouseEvent, useState } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { Spinner } from '@/components/ui/spinner';
import { ChevronsUpDown, ArrowDown } from 'lucide-react';
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
import {
 InputGroup,
 InputGroupAddon,
 InputGroupInput,
} from '@/components/ui/input-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import {
 type OrderInvoicePayment,
 defaultValues,
 createOrderInvoicePaymentSchema,
} from '../../schemas/orderInvoicePaymentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
 newOrderPaymentKey,
 getOrderInvoicePaymentInitData,
 getPcPoses,
} from '../../services/orderInvoicePaymentApiActions';
import { toast } from 'sonner';
import { NumericFormat } from 'react-number-format';
import { AxiosError } from 'axios';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import {
 type InvoiceWalletSchema,
 defaultValues as invoiceWalletDefaultValues,
 createInvoiceWalletSchema,
} from '../../schemas/wallet/invoiceWalletSchema';
import { PaymentType } from '../../utils/PaymentTypes';
import { useTimer } from '@/hooks/useTimer';
import {
 getWalletInfo,
 sendWalletOtpCode,
} from '../../services/wallet/orderWalletApiActions';
import { type OrderInfo } from '../../schemas/orderInfoSchema';

const invoiceRowClass =
 'flex justify-between gap-2 items-center text-base pb-3 mb-3 border-b border-input font-medium';
const invoiceLabelClass = 'shrink-0 w-32';

export default function OrderInvoice({ dic }: { dic: NewOrderDictionary }) {
 const { minutes, seconds, start, reset, stop, isRunning } = useTimer(120);
 const [canEditMobileNo, setCanEditMobileNo] = useState(true);
 const { watch: watchOrderInfo } = useFormContext<OrderInfo>();
 const [orderInfoWalletOtpCode, orderInfoPhoneNumber] = watchOrderInfo([
  'walletOtpCode',
  'phoneNumber',
 ]);
 const {
  control,
  formState: { errors },
  setValue,
  getValues,
  watch,
  handleSubmit,
  clearErrors,
  trigger,
  setFocus,
 } = useForm<OrderInvoicePayment>({
  resolver: zodResolver(createOrderInvoicePaymentSchema({ dic })),
  defaultValues: {
   ...defaultValues,
  },
 });
 const invoiceWalletUseForm = useForm<InvoiceWalletSchema>({
  resolver: zodResolver(createInvoiceWalletSchema({ dic })),
  defaultValues: invoiceWalletDefaultValues,
 });

 const [paymentTypeValue, bankValue] = watch(['paymentType', 'bank']);

 const invoicePaymentRef = useRef<HTMLDivElement>(null);
 const {
  shopLoading,
  confirmOrderActiveType,
  order: { orderItems, onCloseOrder, onSaveOrder },
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

 const { data, isSuccess, isFetching } = useQuery({
  enabled: confirmOrderActiveType === 'invoice',
  queryKey: [newOrderPaymentKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getOrderInvoicePaymentInitData({ signal });
   return res.data;
  },
 });

 const { data: pcPoseData, isLoading: pcPosesLoading } = useQuery({
  enabled: confirmOrderActiveType === 'invoice' && !!bankValue,
  queryKey: [newOrderPaymentKey, 'pc-poses', bankValue?.key || ''],
  async queryFn({ signal }) {
   const res = await getPcPoses({ signal, bankID: bankValue!.key });
   return res.data;
  },
 });

 const {
  mutate: confirmGetWalletInfo,
  isPending: confirmGetWalletInfoIsPending,
  data: walletInfo,
  reset: resetWalletInfo,
 } = useMutation({
  mutationFn({ mobileNo, otpCode }: { otpCode: string; mobileNo: string }) {
   return getWalletInfo({
    mobileNo,
    otpCode,
    sValue: remained.toString(),
   });
  },
  onSuccess() {
   reset();
   stop();
   setCanEditMobileNo(false);
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 const { mutate: confirmSendOtp, isPending: sendOtpIsPending } = useMutation({
  mutationFn(data: InvoiceWalletSchema) {
   return sendWalletOtpCode({ mobileNo: data.phoneNumber });
  },
  onSuccess() {
   reset();
   start();
   setCanEditMobileNo(false);
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 function handleCanEditMobileNo() {
  setCanEditMobileNo(true);
  stop();
  reset();
 }

 function handleConfirmPayment(e: MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  handleSubmit(
   (data) => {
    const { otpCode, ...restData } = data;
    if (data.paymentType?.key === PaymentType.creditCard) {
     onPaymentPcPos(restData);
     return;
    }
    if (data.paymentType?.key === PaymentType.wallet) {
     onPaymentPcPos({
      ...restData,
      walletKey: walletInfo?.data.id.toString(),
      otpCode,
     });
     return;
    }
    onPayment(restData);
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

 useEffect(() => {
  if (!pcPoseData?.pcPoses.length || !pcPoseData.defualtPosID) return;
  const activePos =
   pcPoseData.pcPoses.find(
    (item) => item.key === pcPoseData.defualtPosID.toString(),
   ) || pcPoseData.pcPoses[0];
  setValue('cardReader', activePos);
 }, [pcPoseData, setValue]);

 useEffect(() => {
  const otpCode = getValues('otpCode');
  if (!orderInfoWalletOtpCode || otpCode) return;
  setValue('otpCode', orderInfoWalletOtpCode);
 }, [orderInfoWalletOtpCode, getValues, setValue]);

 useEffect(() => {
  const phoneNumber = invoiceWalletUseForm.getValues('phoneNumber');
  if (!orderInfoPhoneNumber || phoneNumber) return;
  invoiceWalletUseForm.setValue('phoneNumber', orderInfoPhoneNumber);
 }, [orderInfoPhoneNumber, invoiceWalletUseForm]);

 function renderSubmitPaymentFormButton() {
  if (paymentTypeValue?.key === PaymentType.wallet) {
   if (!walletInfo) {
    return (
     <Button
      disabled={
       isFetching ||
       shopLoading ||
       !access['order']['payment'] ||
       confirmGetWalletInfoIsPending
      }
      type='submit'
      className='h-11 sm:w-32'
      onClick={(e) => {
       e.preventDefault();
       invoiceWalletUseForm.handleSubmit(async (data) => {
        if (await trigger('otpCode')) {
         const otpCode = getValues('otpCode');
         confirmGetWalletInfo({
          mobileNo: data.phoneNumber,
          otpCode: otpCode!,
         });
        } else {
         setFocus('otpCode');
        }
       })();
      }}
     >
      {(isFetching || shopLoading || confirmGetWalletInfoIsPending) && (
       <Spinner />
      )}
      {dic.invoice.confirm}
     </Button>
    );
   }
   return (
    <Button
     disabled={isFetching || shopLoading || !access['order']['payment']}
     type='submit'
     className='h-11 sm:w-32'
     onClick={(e) => {
      e.preventDefault();
      handleConfirmPayment(e);
     }}
    >
     {(isFetching || shopLoading) && <Spinner />}
     {dic.invoice.confirmInvoicePayment}
    </Button>
   );
  }
  if (paymentTypeValue?.key === PaymentType.creditCard) {
   return (
    <Button
     disabled={isFetching || shopLoading || !access['order']['payment']}
     type='submit'
     className='h-11'
     onClick={handleConfirmPayment}
    >
     {(isFetching || shopLoading) && <Spinner />}
     {dic.invoice.sendToCardReader}
    </Button>
   );
  }
  if (paymentTypeValue?.key === 'nonCash') {
   return (
    <Button
     disabled={shopLoading || !access['order']['close']}
     variant='destructive'
     className='font-medium disabled:bg-neutral-400 disabled:dark:bg-neutral-600 h-11 sm:w-32'
     type='submit'
     onClick={(e) => {
      e.preventDefault();
      onCloseOrder();
     }}
    >
     {shopLoading && <Spinner />}
     {dic.invoice.closeOrder}
    </Button>
   );
  }
  return (
   <Button
    type='submit'
    disabled={isFetching || shopLoading || !access['order']['payment']}
    className='h-11 sm:w-32'
    onClick={handleConfirmPayment}
   >
    {(isFetching || shopLoading) && <Spinner />}
    {dic.invoice.confirmInvoicePayment}
   </Button>
  );
 }

 return orderItems.length ? (
  <div>
   <div className='w-[min(100%,35rem)] mx-auto pt-2'>
    <div className='p-4 border border-input rounded-md bg-neutral-50 dark:bg-neutral-950 mb-2'>
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
    <div className='grid grid-cols-2 gap-3 mb-6 border-b border-input pb-6'>
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
      className='rounded-md border border-input p-4'
      ref={invoicePaymentRef}
     >
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
                {field.value
                 ? field.value.value === 'nonCash'
                   ? dic.invoice[field.value.value]
                   : field.value.value
                 : ''}
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
                 {[
                  ...data.payTypes,
                  {
                   key: 'nonCash',
                   value: 'nonCash',
                  },
                 ].map((item) => (
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
                     <span>
                      {item.key === 'nonCash'
                       ? dic.invoice[item.key]
                       : item.value}
                     </span>
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
         {paymentTypeValue?.key !== PaymentType.cash &&
          paymentTypeValue?.key !== PaymentType.wallet &&
          paymentTypeValue?.key !== PaymentType.check &&
          paymentTypeValue?.key !== 'nonCash' && (
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
                       setValue('cardReader', null);
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
        {paymentTypeValue?.key === PaymentType.creditCard && (
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
                {pcPosesLoading && <Spinner />}
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
               {pcPoseData?.pcPoses?.length ? (
                <ul>
                 {pcPoseData.pcPoses?.map((item) => (
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
        {paymentTypeValue?.key !== PaymentType.cash &&
         paymentTypeValue?.key !== PaymentType.wallet &&
         paymentTypeValue?.key !== 'nonCash' && (
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
        {paymentTypeValue?.key === PaymentType.wallet && (
         <>
          <Controller
           control={invoiceWalletUseForm.control}
           name='phoneNumber'
           render={({ field: { onChange, ref, ...other } }) => (
            <Field
             data-disabled={!canEditMobileNo}
             data-invalid={!!invoiceWalletUseForm.formState.errors.phoneNumber}
            >
             <FieldLabel
              htmlFor='phone-number'
              data-disabled={!canEditMobileNo}
             >
              {dic.invoice.mobileNo} *
             </FieldLabel>
             <InputGroup
              className='h-11'
              data-invalid={!!invoiceWalletUseForm.formState.errors.phoneNumber}
             >
              <NumericFormat
               id='phone-number'
               disabled={!canEditMobileNo}
               {...other}
               onValueChange={({ value }) => {
                onChange(value);
               }}
               getInputRef={ref}
               allowLeadingZeros={true}
               allowNegative={false}
               decimalScale={0}
               customInput={InputGroupInput}
              />
              <InputGroupAddon align='inline-end' className='-me-3'>
               {!canEditMobileNo && (
                <Button
                 type='button'
                 className='h-11 w-32 text-destructive border-destructive rounded-ss-none rounded-es-none'
                 variant='outline'
                 onClick={() => {
                  resetWalletInfo();
                  handleCanEditMobileNo();
                 }}
                >
                 {dic.invoice.edit}
                </Button>
               )}
              </InputGroupAddon>
             </InputGroup>

             {!!invoiceWalletUseForm.formState.errors.phoneNumber && (
              <FieldContent>
               <FieldError>
                {invoiceWalletUseForm.formState.errors.phoneNumber.message}
               </FieldError>
              </FieldContent>
             )}
            </Field>
           )}
          />
          <div className='bg-neutral-200 dark:bg-neutral-800 rounded-md p-2'>
           <Controller
            control={control}
            name='otpCode'
            render={({ field: { onChange, ref, ...other } }) => (
             <Field data-invalid={!!errors.otpCode}>
              <FieldLabel htmlFor='opt-code'>
               {dic.invoice.otpCode} *
              </FieldLabel>
              <InputGroup
               className='h-11 bg-background'
               data-invalid={!!errors.otpCode}
              >
               <NumericFormat
                id='opt-code'
                {...other}
                onChange={() => {
                 resetWalletInfo();
                }}
                onValueChange={({ value }) => {
                 onChange(value);
                }}
                getInputRef={ref}
                allowLeadingZeros={true}
                allowNegative={false}
                decimalScale={0}
                customInput={InputGroupInput}
               />
              </InputGroup>
              <FieldContent>
               {!!errors.otpCode && (
                <FieldError>{errors.otpCode.message}</FieldError>
               )}
              </FieldContent>
             </Field>
            )}
           />
          </div>
          {!!walletInfo && (
           <>
            <Field>
             <FieldLabel htmlFor='wallet-credit'>
              {dic.invoice.walletCredit}
             </FieldLabel>
             <InputGroup className='h-11'>
              <InputGroupInput
               id='wallet-credit'
               readOnly
               value={
                walletInfo
                 ? walletInfo.data.remainWallet > 0
                   ? format(walletInfo.data.remainWallet)
                   : `( ${format(walletInfo.data.remainWallet)} )`
                 : ''
               }
              />
             </InputGroup>
            </Field>
            <Field>
             <FieldLabel htmlFor='payment-value'>
              {dic.invoice.paymentValue}
             </FieldLabel>
             <InputGroup className='h-11'>
              <InputGroupInput
               id='payment-value'
               readOnly
               value={format(remained)}
              />
             </InputGroup>
            </Field>
            <Field>
             <FieldLabel htmlFor='wallet-credit-remained'>
              {dic.invoice.remainedWalletCreditAfterPayment}
             </FieldLabel>
             <InputGroup className='h-11'>
              <InputGroupInput
               id='wallet-credit-remained'
               readOnly
               value={
                walletInfo
                 ? walletInfo.data.remainWallet - remained
                   ? format(walletInfo.data.remainWallet - remained)
                   : `( ${format(walletInfo.data.remainWallet - remained)} )`
                 : ''
               }
              />
             </InputGroup>
            </Field>
           </>
          )}
         </>
        )}
        <div className='flex flex-col-reverse sm:flex-row justify-between gap-4 flex-wrap'>
         <div className='flex gap-4'>
          {paymentTypeValue?.key === PaymentType.wallet && (
           <>
            <Button
             type='button'
             className='h-11'
             variant='outline'
             disabled={isRunning || sendOtpIsPending}
             onClick={() => {
              invoiceWalletUseForm.handleSubmit(
               (data) => {
                resetWalletInfo();
                confirmSendOtp(data);
               },
               (err) => {
                Object.values(err).forEach((item) => {
                 toast.error(item.message);
                });
               },
              )();
             }}
            >
             {sendOtpIsPending && <Spinner />}
             {dic.invoice.resendCode}
             {isRunning && (
              <span>
               ({minutes.toString().padStart(2, '0')}:
               {seconds.toString().padStart(2, '0')})
              </span>
             )}
            </Button>
           </>
          )}
         </div>
         {renderSubmitPaymentFormButton()}
        </div>
       </FieldGroup>
      </form>
     </div>
    )}
   </div>
  </div>
 ) : (
  <NoItemFound />
 );
}
