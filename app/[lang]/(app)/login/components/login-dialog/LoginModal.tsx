'use client';
import { useShareDictionary } from '../../../services/share-dictionary/shareDictionaryContext';
import Login from '../Login';
import LoginPageWrapper from '../LoginPageWrapper';
import { Button } from '@/components/ui/button';
import { LuLogIn } from 'react-icons/lu';
import { useLoginContext } from '../../services/login/loginContext';
import { useLogout } from '../../hooks/useLogout';

export default function LoginModal() {
 const logout = useLogout();
 const { loginDictionary } = useShareDictionary();
 const { changeLoginModalIsOpen } = useLoginContext();
 return (
  <>
   <div>
    <Button
     variant='link'
     className='text-rose-700 dark:text-rose-400'
     onClick={() => {
      changeLoginModalIsOpen(false);
      logout();
     }}
    >
     <LuLogIn className='size-6' />
     {loginDictionary.login.loginOptions.goToLogin}
    </Button>
   </div>
   <LoginPageWrapper>
    <Login dic={loginDictionary} />
   </LoginPageWrapper>
  </>
 );
}
