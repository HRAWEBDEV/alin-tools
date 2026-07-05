'use client';
import { useState, useEffect } from 'react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaRegClock } from 'react-icons/fa';
import { ImConnection } from 'react-icons/im';
import { MdSignalWifiConnectedNoInternet0 } from 'react-icons/md';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import {
 Tooltip,
 TooltipTrigger,
 TooltipContent,
} from '@/components/ui/tooltip';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';

export default function HeaderDate() {
 const {
  restaurantShareDictionary: {
   components: { profile: profileDic },
  },
 } = useRestaurantShareDictionary();
 const { isOnline } = useConnectionStatus();
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
  <div className='flex gap-2 flex-wrap items-center justify-between pe-2'>
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
   <div>
    <Tooltip>
     <TooltipTrigger asChild>
      {isOnline ? (
       <ImConnection className='size-5 text-secondary' />
      ) : (
       <MdSignalWifiConnectedNoInternet0 className='size-5 text-destructive' />
      )}
     </TooltipTrigger>
     <TooltipContent>
      <p>{isOnline ? profileDic.connected : profileDic.connectionLost}</p>
     </TooltipContent>
    </Tooltip>
   </div>
  </div>
 );
}
