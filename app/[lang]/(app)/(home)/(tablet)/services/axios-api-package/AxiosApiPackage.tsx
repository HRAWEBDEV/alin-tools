'use client';
import { useEffect } from 'react';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import { Departments } from '@/app/[lang]/(app)/login/services/userinfo-provider/utils/systems';

export default function AxiosApiPackage() {
 const { locale } = useBaseConfig();
 const { routeDepartment, routeOwner, routeProgram } = useUserInfoRouter();
 useEffect(() => {
  const reqID = axios.interceptors.request.use((config) => {
   config.headers.set('Ownerid', routeOwner.id);
   config.headers.set('Departmentid', routeDepartment.id);
   config.headers.set('Programid', routeProgram.id);
   config.headers.set('Systemid', routeProgram.systemID);
   return config;
  });
  return () => {
   axios.interceptors.request.eject(reqID);
  };
 }, [locale, routeDepartment, routeOwner, routeProgram]);
 return <></>;
}
