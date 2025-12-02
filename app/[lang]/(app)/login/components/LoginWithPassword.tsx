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
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import {
 InputGroup,
 InputGroupAddon,
 InputGroupInput,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
 type WithPasswordCredentials,
 loginWithPassword,
} from '../services/loginApiActions';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { GoInfo } from 'react-icons/go';

const iconSize = ' size-6';
const formDefaults: WithPasswordCredentials = {
 userName: '',
 password: '',
};

export default function LoginWithPassword({ dic }: { dic: LoginDictionary }) {
 const router = useRouter();
 const [showPassword, setShowPassword] = useState(false);
 const {
  login: {
   withPassword: { form: formDic, formValidation },
  },
 } = dic;

 const { mutate, isPending } = useMutation({
  async mutationFn(props: WithPasswordCredentials) {
   return loginWithPassword(props);
  },
 });

 const form = useForm({
  defaultValues: formDefaults,
  validators: {
   onChange: z.object({
    userName: z.string().min(1, formValidation.fillRequiredFields),
    password: z.string().min(1, formValidation.fillRequiredFields),
   }),
  },
  onSubmit({ value }) {
   mutate(value);
  },
 });

 return (
  <FieldGroup>
   <form.Field name='userName'>
    {(field) => (
     <Field data-invalid={!field.state.meta.isValid}>
      <FieldLabel htmlFor='userName' className='text-base'>
       {formDic.userName}
      </FieldLabel>
      <InputGroup className='size-11'>
       <InputGroupAddon align='inline-start'>
        <FaUser className={'text-primary' + iconSize} />
       </InputGroupAddon>
       <InputGroupInput
        data-invalid={!field.state.meta.isValid}
        name='userName'
        id='userName'
        autoComplete='true'
        className='text-base!'
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
       />
      </InputGroup>
      <FieldContent>
       {field.state.meta.errorMap.onChange?.map((item) => {
        return (
         <FieldError key={item.message}>
          <div className='flex gap-1 items-center'>
           <GoInfo />
           <span>{item.message}</span>
          </div>
         </FieldError>
        );
       })}
      </FieldContent>
     </Field>
    )}
   </form.Field>
   <form.Field name='password'>
    {(field) => (
     <Field>
      <FieldLabel htmlFor='password' className='text-base'>
       {formDic.password}
      </FieldLabel>
      <InputGroup className='size-11'>
       <InputGroupAddon align='inline-start'>
        <RiLockPasswordFill className={'text-primary' + iconSize} />
       </InputGroupAddon>
       <InputGroupInput
        type={showPassword ? 'text' : 'password'}
        name='password'
        id='password'
        autoComplete='true'
        className='text-base!'
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
       />
       <InputGroupAddon align='inline-end' className='-me-2'>
        <Button
         variant='ghost'
         size='icon-lg'
         onClick={() => setShowPassword((pre) => !pre)}
         type='button'
        >
         {showPassword ? (
          <FaEye className={'text-primary' + iconSize} />
         ) : (
          <FaEyeSlash className={'text-primary' + iconSize} />
         )}
        </Button>
       </InputGroupAddon>
      </InputGroup>
     </Field>
    )}
   </form.Field>
   <form.Subscribe selector={(state) => [state.isSubmitting]}>
    {([isSubmitting]) => (
     <Button
      type='submit'
      size='lg'
      className='mt-6 h-11 text-base'
      disabled={isSubmitting || isPending}
      onClick={(e) => {
       e.preventDefault();
       form.handleSubmit();
      }}
     >
      {isPending || isSubmitting ? <Spinner /> : formDic.login}
     </Button>
    )}
   </form.Subscribe>
   <div>
    <Button variant='link' className='justify-start' asChild>
     <Link href='#'>{formDic.forgetPassword}</Link>
    </Button>
   </div>
  </FieldGroup>
 );
}
