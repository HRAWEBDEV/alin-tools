'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function HomePage() {
 const { locale } = useBaseConfig();
 const router = useRouter();
 const { routeDepartment, routeProgram } = useUserInfoRouter();

 useEffect(() => {
  router.push(
   `/${locale}/${routeDepartment.id}/room-devision/${routeProgram.id}/rooms-rack`,
  );
 }, [router, locale, routeDepartment, routeProgram]);
 return <div></div>;
}
