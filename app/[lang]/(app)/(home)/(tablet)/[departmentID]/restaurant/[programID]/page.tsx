'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function HomePage() {
 const { locale } = useBaseConfig();
 const { routeDepartment, routeProgram } = useUserInfoRouter();
 const router = useRouter();

 useEffect(() => {
  console.log('here');
  router.push(
   `/${locale}/${routeDepartment.id}/restaurant/${routeProgram.id}/salons`,
  );
 }, [router, locale, routeDepartment, routeProgram]);
 return <div></div>;
}
