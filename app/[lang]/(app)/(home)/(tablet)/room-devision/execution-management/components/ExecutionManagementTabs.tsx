'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';

export default function ExecutionManagementTabs({
 dic,
}: {
 dic: ExecutionManagementDictionary;
}) {
 const { localeInfo, locale } = useBaseConfig();
 const redirectPath = `/${locale}/room-devision/execution-management` as const;
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'guest-checkout-checklist';
 return (
  <header className='p-2 sticky bottom-0 pb-0 order-2 lg:order-1 lg:pb-2 lg:top-0 lg:bottom-auto bg-background z-3'>
   <div>
    <Tabs dir={localeInfo.contentDirection} defaultValue={activeTab}>
     <TabsList className='h-11 w-[min(100%,30rem)] mx-auto bg-neutral-200 dark:bg-neutral-800'>
      <TabsTrigger value='guest-checkout-checklist' asChild>
       <Link
        href={`${redirectPath}?tab=guest-checkout-checklist`}
        className='font-medium'
       >
        {dic.tabs.guestCheckoutCheckList}
       </Link>
      </TabsTrigger>
     </TabsList>
    </Tabs>
   </div>
  </header>
 );
}
