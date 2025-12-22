'use client';
import { useLoginContext } from '../services/login/loginContext';
import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginOptions({ dic }: { dic: LoginDictionary }) {
 const { loginModalIsOpen } = useLoginContext();
 return (
  <div className='mt-1'>
   {loginModalIsOpen ? null : (
    <Button variant='link' asChild className='px-0 text-sm'>
     <Link href='#'>{dic.login.loginOptions.forgetPassword}</Link>
    </Button>
   )}
  </div>
 );
}
