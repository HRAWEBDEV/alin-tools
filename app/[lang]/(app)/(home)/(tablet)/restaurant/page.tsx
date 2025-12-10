'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function HomePage() {
 const { locale } = useBaseConfig();
 const router = useRouter();

 useEffect(() => {
  router.push(`/${locale}/restaurant/salons`);
 }, [router, locale]);
 return <div></div>;
}
