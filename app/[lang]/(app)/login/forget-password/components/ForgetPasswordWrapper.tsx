'use client';
import { useState, Activity } from 'react';
import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import {
 Field,
 FieldGroup,
 FieldError,
 FieldLabel,
} from '@/components/ui/field';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { LiaSmsSolid } from 'react-icons/lia';
import { RiLockPasswordFill } from 'react-icons/ri';
import { RiLockPasswordLine } from 'react-icons/ri';
import { NumericFormat } from 'react-number-format';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
 type CofirmPasswordSchema,
 type OTPSchema,
 getOTPSchema,
 getConfirmPasswordSchema,
} from '../schemas/forgetPasswordSchema';
import {
 getForgotPasswordOTP,
 confirmLoginRecoveryWithPassword,
} from '../../services/loginApiActions';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgetPasswordWrapper({
 dic,
}: {
 dic: LoginDictionary;
}) {
 const { locale } = useBaseConfig();
 const router = useRouter();
 const [stage, setStage] = useState<'OTP' | 'editPassword'>('OTP');
 const [showPassword, setShowPassword] = useState(false);

 const {
  control: OTPControl,
  formState: { errors: OTPErrors },
  handleSubmit: OTPHandleSubmit,
  getValues,
 } = useForm<OTPSchema>({
  resolver: zodResolver(getOTPSchema({ dic })),
  defaultValues: {
   phoneNo: '',
  },
 });

 const {
  control: confirmPasswordControl,
  formState: { errors: confirmPasswordErrors },
  handleSubmit: confirmPasswordHandleSubmit,
 } = useForm<CofirmPasswordSchema>({
  resolver: zodResolver(getConfirmPasswordSchema({ dic })),
  defaultValues: {
   confirmPassword: '',
   password: '',
   confirmOTP: '',
  },
 });

 const {
  mutate: confirmSendOTPCode,
  isPending: OTPIsPending,
  isError: OTPIsError,
  error: OTPError,
 } = useMutation({
  async mutationFn(data: OTPSchema) {
   return getForgotPasswordOTP(data.phoneNo);
  },
  onSuccess(res) {
   if (res.data) {
    setStage('editPassword');
   }
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 const {
  mutate: confirmPassword,
  isPending: confirmPasswordPending,
  isError: confirmPasswordIsError,
  error: confirmPasswordError,
 } = useMutation({
  async mutationFn(data: CofirmPasswordSchema) {
   const phoneNo = getValues('phoneNo');
   return confirmLoginRecoveryWithPassword({
    phoneNumber: phoneNo,
    otpCode: data.confirmOTP,
    confirmNewPassword: data.confirmPassword,
    newPassword: data.password,
   });
  },
  onSuccess() {
   router.push(`/${locale}/login`);
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 return (
  <>
   <Activity mode={stage === 'editPassword' ? 'visible' : 'hidden'}>
    <form>
     <FieldGroup className='mb-3 gap-4'>
      <Field data-invalid={!!confirmPasswordErrors.confirmOTP}>
       <FieldLabel htmlFor='confirmOTP' className='text-md'>
        {dic.login.forgetPassword.OTPCode}
       </FieldLabel>
       <Controller
        control={confirmPasswordControl}
        name='confirmOTP'
        render={({ field: { value, onChange, ...other } }) => (
         <InputGroup className='h-11'>
          <InputGroupAddon align={'inline-start'}>
           <RiLockPasswordLine className='size-6 text-primary' />
          </InputGroupAddon>
          <NumericFormat
           id='confirmOTP'
           data-invalid={!!confirmPasswordErrors.confirmOTP}
           {...other}
           value={value}
           onValueChange={({ value }) => onChange(value || '')}
           allowNegative={false}
           customInput={InputGroupInput}
          />
         </InputGroup>
        )}
       />
       {!!confirmPasswordErrors.confirmOTP && (
        <FieldError>{confirmPasswordErrors.confirmOTP.message}</FieldError>
       )}
      </Field>
      <Field data-invalid={!!confirmPasswordErrors.password}>
       <FieldLabel htmlFor='password' className='text-md'>
        {dic.login.forgetPassword.password}
       </FieldLabel>
       <Controller
        control={confirmPasswordControl}
        name='password'
        render={({ field: { value, onChange, ...other } }) => (
         <InputGroup className='h-11'>
          <InputGroupAddon align={'inline-start'}>
           <RiLockPasswordLine className='size-6 text-primary' />
          </InputGroupAddon>
          <InputGroupInput
           data-invalid={!!confirmPasswordErrors.password}
           {...other}
           value={value}
           onChange={(e) => onChange(e.target.value || '')}
           id='password'
          />
         </InputGroup>
        )}
       />
       {!!confirmPasswordErrors.password && (
        <FieldError>{confirmPasswordErrors.password.message}</FieldError>
       )}
      </Field>
      <Field data-invalid={!!confirmPasswordErrors.confirmPassword}>
       <FieldLabel htmlFor='confirmPassword' className='text-md'>
        {dic.login.forgetPassword.confirmPassword}
       </FieldLabel>
       <Controller
        control={confirmPasswordControl}
        name='confirmPassword'
        render={({ field: { value, onChange, ...other } }) => (
         <InputGroup className='h-11'>
          <InputGroupAddon align={'inline-start'}>
           <RiLockPasswordFill className='size-6 text-primary' />
          </InputGroupAddon>
          <InputGroupInput
           data-invalid={!!confirmPasswordErrors.confirmPassword}
           value={value}
           onChange={(e) => onChange(e.target.value || '')}
           {...other}
           id='confirmPassword'
           type={showPassword ? 'text' : 'password'}
          />
          <InputGroupAddon align='inline-end' className='-me-2'>
           <Button
            type='button'
            size='icon'
            variant='ghost'
            onClick={() => setShowPassword((pre) => !pre)}
           >
            {showPassword ? (
             <IoEye className='text-primary size-6' />
            ) : (
             <IoEyeOff className='text-primary size-6' />
            )}
           </Button>
          </InputGroupAddon>
         </InputGroup>
        )}
       />
       {!!confirmPasswordErrors.confirmPassword && (
        <FieldError>{confirmPasswordErrors.confirmPassword.message}</FieldError>
       )}
      </Field>
      <div>
       {confirmPasswordIsError && (
        <Alert variant='destructive'>
         <AlertDescription className='text-base'>
          {confirmPasswordError.response?.data}
         </AlertDescription>
        </Alert>
       )}
       <Button
        className='w-full mt-4 text-base h-11'
        disabled={confirmPasswordPending}
        type='submit'
        onClick={(e) => {
         e.preventDefault();
         confirmPasswordHandleSubmit((data) => {
          confirmPassword(data);
         })();
        }}
       >
        {confirmPasswordPending && <Spinner />}
        {dic.login.forgetPassword.confirm}
       </Button>
      </div>
     </FieldGroup>
     <div>
      <Button
       type='button'
       variant='ghost'
       className='text-rose-700 dark:text-rose-700'
       onClick={() => {
        setStage('OTP');
       }}
      >
       {dic.login.forgetPassword.editPhoneNo}
      </Button>
     </div>
    </form>
   </Activity>
   <Activity mode={stage === 'OTP' ? 'visible' : 'hidden'}>
    <form>
     <FieldGroup>
      <Field data-invalid={!!OTPErrors.phoneNo}>
       <FieldLabel htmlFor='phoneNo' className='text-md'>
        {dic.login.forgetPassword.phoneNo}
       </FieldLabel>
       <Controller
        control={OTPControl}
        name='phoneNo'
        render={({ field: { value, onChange, ...other } }) => (
         <InputGroup className='h-11'>
          <InputGroupAddon align={'inline-start'}>
           <LiaSmsSolid className='size-6 text-primary' />
          </InputGroupAddon>
          <NumericFormat
           data-invalid={!!OTPErrors.phoneNo}
           id='phoneNo'
           valueIsNumericString
           allowLeadingZeros
           {...other}
           value={value}
           onValueChange={({ value }) => {
            onChange(value || '');
           }}
           allowNegative={false}
           customInput={InputGroupInput}
          />
         </InputGroup>
        )}
       />
       {!!OTPErrors.phoneNo && (
        <FieldError>{OTPErrors.phoneNo.message}</FieldError>
       )}
      </Field>
      <div>
       {OTPIsError && (
        <Alert variant='destructive'>
         <AlertDescription className='text-base'>
          {OTPError.response?.data}
         </AlertDescription>
        </Alert>
       )}
       <Button
        className='w-full mt-4 text-base h-11'
        type='submit'
        disabled={OTPIsPending}
        onClick={(e) => {
         e.preventDefault();
         OTPHandleSubmit((data) => {
          confirmSendOTPCode(data);
         })();
        }}
       >
        {dic.login.forgetPassword.sendOTPCode}
       </Button>
      </div>
     </FieldGroup>
    </form>
   </Activity>
  </>
 );
}
