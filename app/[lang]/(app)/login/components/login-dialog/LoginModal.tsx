'use client';
import { useShareDictionary } from '../../../services/share-dictionary/shareDictionaryContext';
import Login from '../Login';
import LoginPageWrapper from '../LoginPageWrapper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { LuLogIn } from 'react-icons/lu';
import { useLoginContext } from '../../services/login/loginContext';

export default function LoginModal() {
 const { locale } = useBaseConfig();
 const { loginDictionary } = useShareDictionary();
 const { changeLoginModalIsOpen } = useLoginContext();
 return (
  <>
   <div>
    <Button
     variant='link'
     className='text-rose-700 dark:text-rose-400'
     onClick={() => changeLoginModalIsOpen(false)}
     asChild
    >
     <Link href={`/${locale}/login`}>
      <LuLogIn className='size-6' />
      {loginDictionary.login.loginOptions.goToLogin}
     </Link>
    </Button>
   </div>
   <LoginPageWrapper>
    <Login dic={loginDictionary} />
   </LoginPageWrapper>
  </>
 );
}
