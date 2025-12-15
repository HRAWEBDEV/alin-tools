'use client';

import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { ReactNode, useEffect, useState } from 'react';
import { LoginProvider } from './login/LoginProvider';

export default function LoginResponseInterceptor({
 children,
}: {
 children: ReactNode;
}) {
 const [isOpen, setIsOpen] = useState(false);
 function handleToggleModal(open?: boolean) {
  setIsOpen((pre) => (open === undefined ? !pre : open));
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
      console.error('Response error :: ', error.response);
      setIsOpen(true);
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

 return (
  <LoginProvider
   loginModalIsOpen={isOpen}
   setIsOpen={setIsOpen}
   handleToggleModal={handleToggleModal}
  >
   {children}
  </LoginProvider>
 );
}
