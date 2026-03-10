'use client';
import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import Link from 'next/link';

export default function RoomsManagementTabs({
 dic,
}: {
 dic: RoomsManagementDictionary;
}) {
 const { localeInfo } = useBaseConfig();
 return (
  <header className='p-2 sticky bottom-0 pb-0 order-2 lg:order-1 lg:pb-2 lg:top-0 lg:bottom-auto bg-background'>
   <div>
    <Tabs dir={localeInfo.contentDirection} defaultValue='rooms-statistics'>
     <TabsList className='h-11 w-[min(100%,30rem)] mx-auto bg-neutral-200 dark:bg-neutral-800'>
      <TabsTrigger value='rooms-statistics'>
       <Link href={'#'} className='font-medium'>
        {dic.tabs.roomStatistics}
       </Link>
      </TabsTrigger>
      <TabsTrigger value='entrance-and-exit-rooms'>
       <Link href={'#'} className='font-medium'>
        {dic.tabs.entranceAndExitRooms}
       </Link>
      </TabsTrigger>
      <TabsTrigger value='reserved-rooms'>
       <Link href={'#'} className='font-medium'>
        {dic.tabs.reservedRooms}
       </Link>
      </TabsTrigger>
     </TabsList>
    </Tabs>
   </div>
  </header>
 );
}
