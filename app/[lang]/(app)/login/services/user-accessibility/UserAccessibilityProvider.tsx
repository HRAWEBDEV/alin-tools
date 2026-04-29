'use client';
import {
 type UserAccessibilityContext,
 userAccessibilityContext,
} from './userAccessibilityContext';
import { useQuery } from '@tanstack/react-query';
import {
 getUserAccessibilityApi,
 getUserAccessbility,
} from './services/userAccessibilityApiActions';
import { useUserInfoRouter } from '../userinfo-provider/UserInfoRouterContext';
import { useLogout } from '../../hooks/useLogout';
import { useEffect } from 'react';

export default function UserAccessibilityProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const logout = useLogout();
 const { userInfoRouterStorage } = useUserInfoRouter();

 const { data, isError, isSuccess } = useQuery({
  queryKey: [
   getUserAccessibilityApi,
   userInfoRouterStorage.ownerID.toString(),
   userInfoRouterStorage.departmentID.toString(),
   userInfoRouterStorage.programID.toString(),
  ],
  async queryFn({ signal }) {
   const res = await getUserAccessbility({ signal });
   return res.data;
  },
 });

 const ctx: UserAccessibilityContext = {
  userAccessibility: data!,
 };

 useEffect(() => {
  if (!isError) return;
  logout();
 }, [isError, logout]);

 return (
  <userAccessibilityContext.Provider value={ctx}>
   {isSuccess && children}
  </userAccessibilityContext.Provider>
 );
}
