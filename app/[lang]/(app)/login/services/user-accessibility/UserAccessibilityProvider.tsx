'use client';
import {
 type UserAccessibilityContext,
 devAccess,
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
 const { routeDepartment, routeOwner, routeProgram } = useUserInfoRouter();

 const { data, isError, isSuccess } = useQuery({
  queryKey: [
   getUserAccessibilityApi,
   routeOwner.id.toString(),
   routeDepartment.id.toString(),
   routeProgram.id.toString(),
  ],
  async queryFn({ signal }) {
   const res = await getUserAccessbility({ signal });
   return res.data;
  },
 });

 function godMode(offCourse: boolean) {
  if (offCourse && process.env.NEXT_PUBLIC_MODE === 'DEVELOPMENT') {
   return devAccess;
  }
  return data!;
 }

 const ctx: UserAccessibilityContext = {
  userAccessibility: godMode(true),
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
