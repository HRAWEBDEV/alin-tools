'use client';
import { useEffect } from 'react';
import {
 type UserInfoStoreContext,
 userInfoRouterContext,
} from './UserInfoRouterContext';
import { userInfoBaseKey, getApiUserInfo } from './userInfoApiActions';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading';
import { convertToUserInfoStore } from './userInfoApiActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useLogout } from '../../hooks/useLogout';

export default function UserInfoRouterProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const logout = useLogout();
 const router = useRouter();
 const { locale } = useBaseConfig();
 // user query
 const { data, isFetching, isLoading, isError, isSuccess, error } = useQuery({
  queryKey: [userInfoBaseKey],
  staleTime: 'static',
  gcTime: 0,
  async queryFn({ signal }) {
   const res = await getApiUserInfo({ signal });
   return convertToUserInfoStore(res.data);
  },
 });
 console.log(data);

 const ctx: UserInfoStoreContext = {
  data: data!,
  isError,
  isLoading,
  isFetching,
 };

 useEffect(() => {
  if (!isError) return;
  logout();
 }, [isError, logout]);

 if (isLoading)
  return (
   <div>
    <Loading />
   </div>
  );

 return (
  <userInfoRouterContext.Provider value={ctx}>
   {isSuccess && children}
  </userInfoRouterContext.Provider>
 );
}
