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
import { useRouter } from 'next/navigation';

export default function LoginWithPassword({ dic }: { dic: LoginDictionary }) {
 const router = useRouter();
 const [showPassword, setShowPassword] = useState(false);
 const {
  login: {
   withPassword: { form: formDic },
  },
 } = dic;

 const iconSize = ' size-6';

 return (
  <FieldGroup>
   <Field>
    <FieldLabel htmlFor='userName' className='text-base'>
     {formDic.userName}
    </FieldLabel>
    <InputGroup className='size-11'>
     <InputGroupAddon align='inline-start'>
      <FaUser className={'text-primary' + iconSize} />
     </InputGroupAddon>
     <InputGroupInput
      name='userName'
      id='userName'
      autoComplete='true'
      className='text-base!'
     />
    </InputGroup>
   </Field>
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
   <Button
    type='submit'
    size='lg'
    className='mt-6 h-11 text-base'
    onClick={(e) => {
     e.preventDefault();
     router.push('/fa/restaurant');
    }}
   >
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
