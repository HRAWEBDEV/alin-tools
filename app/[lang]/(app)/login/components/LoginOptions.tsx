'use client';
import { useLoginContext } from '../services/login/loginContext';
import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function LoginOptions({ dic }: { dic: LoginDictionary }) {
 const { loginModalIsOpen } = useLoginContext();
 const { locale } = useBaseConfig();
 return (
  <div className='mt-3'>
   {loginModalIsOpen ? null : (
    <Button variant='link' asChild className='px-0 text-md'>
     <Link href={`/${locale}/login/forget-password`}>
      {dic.login.loginOptions.forgetPassword}
     </Link>
    </Button>
   )}
  </div>
 );
}
