'use client';
import { useState } from 'react';
import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
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

export default function LoginWithPassword({ dic }: { dic: LoginDictionary }) {
 const [showPassword, setShowPassword] = useState(false);
 const { localeInfo } = useBaseConfig();
 const router = useRouter();
 const {
  login: {
   withPassword: { form: formDic },
  },
 } = dic;
 return (
  <form>
   <FieldGroup>
    <Field>
     <FieldLabel htmlFor='userName'>{formDic.userName}: </FieldLabel>
     <InputGroup>
      <InputGroupAddon align='inline-start'>
       <FaUser className='text-primary size-4' />
      </InputGroupAddon>
      <InputGroupInput id='userName' />
     </InputGroup>
    </Field>
    <Field>
     <FieldLabel htmlFor='password'>{formDic.password}: </FieldLabel>
     <InputGroup>
      <InputGroupAddon align='inline-start'>
       <TbLockPassword className='text-primary size-5' />
      </InputGroupAddon>
      <InputGroupInput
       id='password'
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
         <IoEye className='text-primary size-5' />
        ) : (
         <IoEyeOff className='text-primary size-5' />
        )}
       </Button>
      </InputGroupAddon>
     </InputGroup>
    </Field>
    <Button
     size='lg'
     className='mt-4'
     type='submit'
     onClick={(e) => {
      e.preventDefault();
     }}
    >
     {formDic.login}
    </Button>
   </FieldGroup>
  </form>
 );
}
