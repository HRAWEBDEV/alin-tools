'use client';
import { useEffect } from 'react';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function AxiosApiPackage() {
 const { locale } = useBaseConfig();
 const { userInfoRouterStorage } = useUserInfoRouter();
 useEffect(() => {
  const reqID = axios.interceptors.request.use((config) => {
   config.headers.set('Ownerid', userInfoRouterStorage.ownerID);
   config.headers.set('Departmentid', userInfoRouterStorage.departmentID);
   config.headers.set('Programid', userInfoRouterStorage.programID);
   config.headers.set('Systemid', userInfoRouterStorage.systemID);
   return config;
  });
  return () => {
   axios.interceptors.request.eject(reqID);
  };
 }, [locale, userInfoRouterStorage]);
 return <></>;
}
