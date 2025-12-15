'use client';
import { type Login, loginContext } from './loginContext';
import LoginModal from '../../components/login-dialog/LoginModal';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { ReactNode, use, useEffect, useState } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

function LoginProvider({ children }: { children: ReactNode }) {
 const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

 function handleChangeLoginModalIsOpen(open?: boolean) {
  setLoginModalIsOpen((pre) => (open === undefined ? !pre : open));
 }

 useEffect(() => {
  const checkTokenAvailability = () => {
   const interceptor = axios.interceptors.response.use(
    (response) => {
     return response;
    },
    async (error) => {
     if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
     ) {
      setLoginModalIsOpen(true);
      console.error('Response error:', error.response);
     }
     return Promise.reject(error);
    }
   );

   return () => {
    axios.interceptors.response.eject(interceptor);
   };
  };
  const eject = checkTokenAvailability();
  return eject;
 }, []);

 const ctx: Login = {
  loginModalIsOpen,
  changeLoginModalIsOpen: handleChangeLoginModalIsOpen,
 };

 return (
  <loginContext.Provider value={ctx}>
   {children}

   <Dialog
    open={loginModalIsOpen}
    onOpenChange={(newValue) => setLoginModalIsOpen(newValue)}
   >
    <DialogContent className='gap-0 p-0 max-h-[90svh] overflow-hidden flex flex-col'>
     <DialogHeader className='p-4'></DialogHeader>
     <div className='p-4 overflow-auto'>
      <LoginModal />
     </div>
    </DialogContent>
   </Dialog>
  </loginContext.Provider>
 );
}

function useLogin() {
 const context = use(loginContext);
 if (!context) throw new OutOfContext('LoginContext');
 return context;
}

export { LoginProvider, useLogin };
