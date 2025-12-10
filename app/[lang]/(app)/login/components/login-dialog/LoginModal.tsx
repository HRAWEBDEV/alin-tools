'use client';
import { useShareDictionary } from '../../../services/share-dictionary/shareDictionaryContext';
import Login from '../Login';
import LoginPageWrapper from '../LoginPageWrapper';

export default function LoginModal() {
 const { loginDictionary } = useShareDictionary();
 return (
  <>
   <LoginPageWrapper>
    <Login dic={loginDictionary} />
   </LoginPageWrapper>
  </>
 );
}
