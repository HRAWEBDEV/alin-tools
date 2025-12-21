'use client';

import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { useEffect } from 'react';
import { useLoginContext } from './login/loginContext';

export default function LoginInterceptor() {
 const { changeLoginModalIsOpen } = useLoginContext();
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
      changeLoginModalIsOpen(true);
      console.error('Response error:', error.response);
     }
     return Promise.reject(error);
    },
   );

   return () => {
    axios.interceptors.response.eject(interceptor);
   };
  };
  const eject = checkTokenAvailability();
  return eject;
 }, [changeLoginModalIsOpen]);

 return <></>;
}
