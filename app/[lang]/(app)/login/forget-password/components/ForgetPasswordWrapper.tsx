'use client';
import { useState } from 'react';
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
import {
 type CofirmPasswordSchema,
 type OTPSchema,
 getOTPSchema,
 getConfirmPasswordSchema,
} from '../schemas/forgetPasswordSchema';

export default function ForgetPasswordWrapper({
 dic,
}: {
 dic: LoginDictionary;
}) {
 const [stage, setStage] = useState<'OTP' | 'editPassword'>('editPassword');
 const [showPassword, setShowPassword] = useState(false);

 const {
  control: OTPControl,
  formState: { errors: OTPErrors },
  handleSubmit: OTPHandleSubmit,
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
  },
 });

 return (
  <>
   {stage === 'editPassword' ? (
    <form>
     <FieldGroup className='mb-3'>
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
          <NumericFormat
           data-invalid={!!confirmPasswordErrors.password}
           {...other}
           value={value}
           onValueChange={({ value }) => onChange(value || '')}
           allowNegative={false}
           id='password'
           customInput={InputGroupInput}
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
        name='password'
        render={({ field: { value, onChange, ...other } }) => (
         <InputGroup className='h-11'>
          <InputGroupAddon align={'inline-start'}>
           <RiLockPasswordFill className='size-6 text-primary' />
          </InputGroupAddon>
          <NumericFormat
           data-invalid={!!confirmPasswordErrors.confirmPassword}
           value={value}
           onValueChange={({ value }) => onChange(value || '')}
           {...other}
           allowNegative={false}
           id='confirmPassword'
           type={showPassword ? 'text' : 'password'}
           customInput={InputGroupInput}
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
       <Button
        className='w-full mt-4 text-base h-11'
        type='submit'
        onClick={(e) => {
         e.preventDefault();
         confirmPasswordHandleSubmit(() => {})();
        }}
       >
        {dic.login.forgetPassword.confirm}
       </Button>
      </div>
     </FieldGroup>
     <div>
      <Button
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
   ) : (
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
           {...other}
           value={value}
           onValueChange={({ value }) => onChange(value || '')}
           allowNegative={false}
           id='phoneNo'
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
       <Button
        className='w-full mt-4 text-base h-11'
        type='submit'
        onClick={(e) => {
         e.preventDefault();
         OTPHandleSubmit(() => {})();
        }}
       >
        {dic.login.forgetPassword.sendOTPCode}
       </Button>
      </div>
     </FieldGroup>
    </form>
   )}
  </>
 );
}
