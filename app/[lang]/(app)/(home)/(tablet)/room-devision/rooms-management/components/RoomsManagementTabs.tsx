'use client';
import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RoomsManagementTabs({
 dic,
}: {
 dic: RoomsManagementDictionary;
}) {
 const { localeInfo, locale } = useBaseConfig();
 const redirectPath = `/${locale}/room-devision/rooms-management` as const;
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'rooms-statistics';
 return (
  <header className='p-2 sticky bottom-0 pb-0 order-2 lg:order-1 lg:pb-2 lg:top-0 lg:bottom-auto bg-background z-3'>
   <div>
    <Tabs dir={localeInfo.contentDirection} defaultValue={activeTab}>
     <TabsList className='h-11 w-[min(100%,30rem)] mx-auto bg-neutral-200 dark:bg-neutral-800'>
      <TabsTrigger value='rooms-statistics' asChild>
       <Link
        href={`${redirectPath}?tab=rooms-statistics`}
        className='font-medium'
       >
        {dic.tabs.roomStatistics}
       </Link>
      </TabsTrigger>
      <TabsTrigger value='entrance-and-exit-rooms' asChild>
       <Link
        href={`${redirectPath}?tab=entrance-and-exit-rooms`}
        className='font-medium'
       >
        {dic.tabs.entranceAndExitRooms}
       </Link>
      </TabsTrigger>
     </TabsList>
    </Tabs>
   </div>
  </header>
 );
}
