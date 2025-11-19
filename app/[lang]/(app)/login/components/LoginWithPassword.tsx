'use client';
import { useState } from 'react';
import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
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

export default function LoginWithPassword({ dic }: { dic: LoginDictionary }) {
 const [showPassword, setShowPassword] = useState(false);
 const {
  login: {
   withPassword: { form: formDic },
  },
 } = dic;

 const iconSize = ' size-5';

 return (
  <FieldGroup>
   <Field>
    <FieldLabel htmlFor='userName'>{formDic.userName}</FieldLabel>
    <InputGroup>
     <InputGroupAddon align='inline-start'>
      <FaUser className={'text-primary' + iconSize} />
     </InputGroupAddon>
     <InputGroupInput name='userName' id='userName' autoComplete='true' />
    </InputGroup>
   </Field>
   <Field>
    <FieldLabel htmlFor='password'>{formDic.password}</FieldLabel>
    <InputGroup>
     <InputGroupAddon align='inline-start'>
      <RiLockPasswordFill className={'text-primary' + iconSize} />
     </InputGroupAddon>
     <InputGroupInput
      type={showPassword ? 'text' : 'password'}
      name='password'
      id='password'
      autoComplete='true'
     />
     <InputGroupAddon align='inline-end' className='-me-2'>
      <Button
       variant='ghost'
       size='icon-lg'
       onClick={() => setShowPassword((pre) => !pre)}
       type='button'
      >
       {showPassword ? (
        <FaEye className='text-primary size-5' />
       ) : (
        <FaEyeSlash className='text-primary size-5' />
       )}
      </Button>
     </InputGroupAddon>
    </InputGroup>
   </Field>
   <Button type='submit' size='lg' className='mt-6'>
    {formDic.login}
   </Button>
   <div>
    <Button variant='link' className='justify-start' asChild>
     <Link href='#'>{formDic.forgetPassword}</Link>
    </Button>
   </div>
  </FieldGroup>
 );
}
