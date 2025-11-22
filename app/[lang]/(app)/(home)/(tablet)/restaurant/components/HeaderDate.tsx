'use client';
import { useState, useEffect } from 'react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaRegClock } from 'react-icons/fa';

export default function HeaderDate() {
 const [date, setDate] = useState<null | Date>(() => {
  return new Date();
 });
 const { locale } = useBaseConfig();

 useEffect(() => {
  const intervalID = setInterval(() => {
   setDate(new Date());
  }, 60 * 1000);
  return () => {
   clearInterval(intervalID);
  };
 }, []);
 return (
  <div className='flex items-center text-sm text-orange-800 dark:text-orange-400 font-medium gap-2'>
   <FaRegClock className='size-5' />
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
