'use client';
import { useEffect } from 'react';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { getUserLoginToken } from '@/app/[lang]/(app)/login/utils/loginTokenManager';

export default function AxiosCredentials() {
 const { locale } = useBaseConfig();
 useEffect(() => {
  const reqID = axios.interceptors.request.use((config) => {
   config.headers.set('Authorization', `Bearer ${getUserLoginToken()}`);
   config.headers.set('Ownerid', '1');
   config.headers.set('Departmentid', '4');
   config.headers.set('Programid', '15');
   config.headers.set('Systemid', '111');
   return config;
  });
  return () => {
   axios.interceptors.request.eject(reqID);
  };
 }, [locale]);
 return <></>;
}
