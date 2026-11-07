'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
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
import { NumericFormat } from 'react-number-format';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, MouseEvent, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { Controller, useForm } from 'react-hook-form';
import {
 type OrderInvoicePayment,
 createOrderInvoicePaymentSchema,
 defaultValues,
} from '../../schemas/orderInvoicePaymentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
 type InvoiceWalletSchema,
 defaultValues as invoiceWalletDefaultValues,
 createInvoiceWalletSchema,
} from '../../schemas/wallet/invoiceWalletSchema';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
 getOrderInvoicePaymentInitData,
 getPcPoses,
 newOrderPaymentKey,
} from '../../services/orderInvoicePaymentApiActions';
import {
 type WalletInfo,
 getWalletInfo,
 sendWalletOtpCode,
} from '../../services/wallet/orderWalletApiActions';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { PaymentType } from '../../utils/PaymentTypes';
import { Spinner } from '@/components/ui/spinner';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';

export default function OrderPayment({
 dic,
 paymentValue,
 canPay,
 isLoading,
 phoneNumber,
 otpCode,
 onConfirmPayment,
 onCloseOrder,
}: {
 dic: NewOrderDictionary['invoice'];
 paymentValue: number;
 canPay: boolean;
 isLoading: boolean;
 phoneNumber?: string;
 otpCode?: string;
 onConfirmPayment: (
  data: OrderInvoicePayment,
  walletInfo?: WalletInfo,
 ) => unknown;
 onCloseOrder: () => unknown;
}) {
 const { format } = useCurrencyFormatter();
 const { minutes, seconds, start, reset, stop, isRunning } = useTimer(120);
 const [canEditMobileNo, setCanEditMobileNo] = useState(true);
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

 const { data, isSuccess, isFetching } = useQuery({
  queryKey: [newOrderPaymentKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getOrderInvoicePaymentInitData({ signal });
   return res.data;
  },
 });

 const { data: pcPoseData, isLoading: pcPosesLoading } = useQuery({
  enabled: !!bankValue,
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
    sValue: paymentValue.toString(),
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
    onConfirmPayment(data, walletInfo?.data);
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
  if (!otpCode || otpCode) return;
  setValue('otpCode', otpCode);
 }, [otpCode, getValues, setValue]);

 useEffect(() => {
  const phoneNumber = invoiceWalletUseForm.getValues('phoneNumber');
  if (!phoneNumber || phoneNumber) return;
  invoiceWalletUseForm.setValue('phoneNumber', phoneNumber);
 }, [phoneNumber, invoiceWalletUseForm]);

 function renderSubmitPaymentFormButton() {
  if (paymentTypeValue?.key === PaymentType.wallet) {
   if (!walletInfo) {
    return (
     <Button
      disabled={
       isFetching || isLoading || !canPay || confirmGetWalletInfoIsPending
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
      {(isFetching || isLoading || confirmGetWalletInfoIsPending) && (
       <Spinner />
      )}
      {dic.confirm}
     </Button>
    );
   }
   return (
    <Button
     disabled={isFetching || isLoading || !canPay}
     type='submit'
     className='h-11 sm:w-32'
     onClick={(e) => {
      e.preventDefault();
      handleConfirmPayment(e);
     }}
    >
     {(isFetching || isLoading) && <Spinner />}
     {dic.confirmInvoicePayment}
    </Button>
   );
  }
  if (paymentTypeValue?.key === PaymentType.creditCard) {
   return (
    <Button
     disabled={isFetching || isLoading || !canPay}
     type='submit'
     className='h-11'
     onClick={handleConfirmPayment}
    >
     {(isFetching || isLoading) && <Spinner />}
     {dic.sendToCardReader}
    </Button>
   );
  }
  if (paymentTypeValue?.key === 'nonCash') {
   return (
    <Button
     disabled={isLoading || !canPay}
     variant='destructive'
     className='font-medium disabled:bg-neutral-400 disabled:dark:bg-neutral-600 h-11 sm:w-32'
     type='submit'
     onClick={(e) => {
      e.preventDefault();
      onCloseOrder();
     }}
    >
     {isLoading && <Spinner />}
     {dic.closeOrder}
    </Button>
   );
  }
  return (
   <Button
    type='submit'
    disabled={isFetching || isLoading || !canPay}
    className='h-11 sm:w-32'
    onClick={handleConfirmPayment}
   >
    {(isFetching || isLoading) && <Spinner />}
    {dic.confirmInvoicePayment}
   </Button>
  );
 }

 return (
  <form>
   <FieldGroup className='gap-5'>
    <div className='grid grid-cols-1 gap-5'>
     <Field data-invalid={!!errors.paymentType}>
      <FieldLabel htmlFor='paymentType'>{dic.paymentType} *</FieldLabel>
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
               ? dic[field.value.value]
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
           <DrawerTitle>{dic.paymentType}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-border flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.paymentType}
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
                  {item.key === 'nonCash' ? dic[item.key] : item.value}
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
        <FieldLabel htmlFor='bank'>{dic.bank} *</FieldLabel>
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
             <DrawerTitle>{dic.bank}</DrawerTitle>
            </DrawerHeader>
            <div className='p-4 pb-6 mb-6 border-b border-border flex flex-wrap justify-between gap-4'>
             <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
              {dic.bank}
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
      <FieldLabel htmlFor='cardReader'>{dic.cardReader} *</FieldLabel>
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
           <DrawerTitle>{dic.cardReader}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-6 mb-6 border-b border-border flex flex-wrap justify-between gap-4'>
           <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
            {dic.cardReader}
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
       <FieldLabel htmlFor='paymentRefNo'>{dic.paymentRefNo}</FieldLabel>
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
         <FieldLabel htmlFor='phone-number' data-disabled={!canEditMobileNo}>
          {dic.mobileNo} *
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
             {dic.edit}
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
          <FieldLabel htmlFor='opt-code'>{dic.otpCode} *</FieldLabel>
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
         <FieldLabel htmlFor='wallet-credit'>{dic.walletCredit}</FieldLabel>
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
         <FieldLabel htmlFor='payment-value'>{dic.paymentValue}</FieldLabel>
         <InputGroup className='h-11'>
          <InputGroupInput
           id='payment-value'
           readOnly
           value={format(paymentValue)}
          />
         </InputGroup>
        </Field>
        <Field>
         <FieldLabel htmlFor='wallet-credit-remained'>
          {dic.remainedWalletCreditAfterPayment}
         </FieldLabel>
         <InputGroup className='h-11'>
          <InputGroupInput
           id='wallet-credit-remained'
           readOnly
           value={
            walletInfo
             ? walletInfo.data.remainWallet - paymentValue
               ? format(walletInfo.data.remainWallet - paymentValue)
               : `( ${format(walletInfo.data.remainWallet - paymentValue)} )`
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
         {dic.resendCode}
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
 );
}
