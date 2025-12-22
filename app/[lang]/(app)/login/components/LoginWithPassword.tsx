'use client';
import { useState } from 'react';
import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import {
 FieldGroup,
 Field,
 FieldLabel,
 FieldContent,
 FieldError,
} from '@/components/ui/field';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaUser } from 'react-icons/fa';
import { TbLockPassword } from 'react-icons/tb';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useForm } from '@tanstack/react-form';
import {
 type LoginWithPasswordCredentials,
 loginWithPassword,
} from '../services/loginApiActions';
import { z } from 'zod';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { setUserLoginToken } from '../utils/loginTokenManager';
import { useLoginContext } from '../services/login/loginContext';

const formDefaults: LoginWithPasswordCredentials = {
 userName: '',
 password: '',
};

export default function LoginWithPassword({ dic }: { dic: LoginDictionary }) {
 const { loginModalIsOpen, changeLoginModalIsOpen } = useLoginContext();
 const [showPassword, setShowPassword] = useState(false);

 const { localeInfo } = useBaseConfig();
 const router = useRouter();

 const {
  login: {
   withPassword: { form: formDic, formValidation: formValidationDic },
  },
 } = dic;
 // mutation setup
 const { mutate, isPending } = useMutation({
  mutationFn(credentials: LoginWithPasswordCredentials) {
   return loginWithPassword(credentials);
  },
  onSuccess({ data }) {
   setUserLoginToken(data.item1);
   //  setJustLoggedIn(true);
   if (loginModalIsOpen) {
    changeLoginModalIsOpen(false);
   } else {
    router.push(`/${localeInfo.locale}/restaurant`);
   }
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
   //  setJustLoggedIn(false);
  },
 });
 // form setup
 const formSchema = z.object({
  userName: z.string().nonempty(formValidationDic.fillRequiredFields),
  password: z.string().nonempty(formValidationDic.fillRequiredFields),
 });

 const form = useForm({
  defaultValues: formDefaults,
  validators: {
   onSubmit: formSchema,
  },
  onSubmit({ value }) {
   return mutate(value);
  },
 });
 //
 return (
  <form>
   <FieldGroup>
    <form.Field name='userName'>
     {(field) => (
      <Field data-invalid={!field.state.meta.isValid}>
       <FieldLabel htmlFor='userName'>{formDic.userName}</FieldLabel>
       <InputGroup className='h-11'>
        <InputGroupAddon align='inline-start'>
         <FaUser className='text-primary size-5' />
        </InputGroupAddon>
        <InputGroupInput
         data-invalid={!field.state.meta.isValid}
         autoComplete='true'
         id='userName'
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
         className='text-base!'
        />
       </InputGroup>
       <FieldContent>
        {field.state.meta.errorMap.onSubmit?.map((err) => (
         <FieldError key={err.message}>
          <div className='flex items-center gap-1'>
           <IoMdInformationCircleOutline />
           <span>{err.message}</span>
          </div>
         </FieldError>
        ))}
       </FieldContent>
      </Field>
     )}
    </form.Field>
    <form.Field name='password'>
     {(field) => (
      <Field data-invalid={!field.state.meta.isValid}>
       <FieldLabel htmlFor='password'>{formDic.password}</FieldLabel>
       <InputGroup className='h-11'>
        <InputGroupAddon align='inline-start'>
         <TbLockPassword className='text-primary size-6' />
        </InputGroupAddon>
        <InputGroupInput
         data-invalid={!field.state.meta.isValid}
         id='password'
         autoComplete='true'
         type={showPassword ? 'text' : 'password'}
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
         className='text-base!'
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
       <FieldContent>
        {field.state.meta.errorMap.onSubmit?.map((err) => (
         <FieldError key={err.message}>
          <div className='flex items-center gap-1'>
           <IoMdInformationCircleOutline />
           <span>{err.message}</span>
          </div>
         </FieldError>
        ))}
       </FieldContent>
      </Field>
     )}
    </form.Field>
    <form.Subscribe selector={(state) => [state.isSubmitting]}>
     {([isSubmitting]) => (
      <Button
       className='mt-4 text-base h-11'
       type='submit'
       disabled={isSubmitting || isPending}
       onClick={(e) => {
        e.preventDefault();
        form.handleSubmit();
       }}
      >
       {(isSubmitting || isPending) && <Spinner />}
       {formDic.login}
      </Button>
     )}
    </form.Subscribe>
   </FieldGroup>
  </form>
 );
}
