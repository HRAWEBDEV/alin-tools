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
import { useLogout } from '../../hooks/useLogout';
import { useShareDictionary } from '../../../services/share-dictionary/shareDictionaryContext';

export default function UserInfoRouterProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const {
  shareDictionary: {
   components: { userInfoRouter: userInfoRouterDic },
  },
 } = useShareDictionary();
 const logout = useLogout();
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
  toast.error(userInfoRouterDic.errorOccuredTryAgainLater);
 }, [isError, logout, userInfoRouterDic]);

 if (isLoading || !isSuccess)
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
