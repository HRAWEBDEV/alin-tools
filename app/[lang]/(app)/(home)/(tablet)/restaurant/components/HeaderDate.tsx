'use client';
import { useState, useEffect } from 'react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function HeaderDate() {
 const [date, setDate] = useState<null | Date>(null);
 const { locale } = useBaseConfig();

 useEffect(() => {
  const intervalID = setInterval(() => {
   setDate(new Date());
  }, 1000);
  return () => {
   clearInterval(intervalID);
  };
 }, []);
 return (
  <div className='flex items-center gap-1 text-xs text-orange-800 dark:text-orange-200 mb-1 font-medium'>
   <span>
    {date
     ? date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
       })
     : ''}
   </span>
  </div>
 );
}
