'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import * as icons from 'react-icons/bs';

export default function HomePage() {
 const { locale } = useBaseConfig();
 const router = useRouter();

 // firt page to show
 // useEffect(() => {
 //  router.push(`/${locale}/restaurant/salons`);
 // }, [router, locale]);
 return (
  <div>
   <div className='flex flex-wrap gap-4'>
    {Object.entries(icons).map(([key, Item], i) => (
     <div className='flex flex-col items-center gap-1' key={i}>
      <Item className='size-10' />
      {key}
     </div>
    ))}
   </div>
  </div>
 );
}
