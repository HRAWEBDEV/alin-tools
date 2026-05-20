'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type GuestExpenseTabs } from '../../utils/guest-expenses/GuestExpenseTabs';

export default function GuestExpensesTabs({
 dic,
 activeExpenses,
 changeActiveExpenseTab,
}: {
 dic: RoomsRackDictionary;
 activeExpenses: GuestExpenseTabs;
 changeActiveExpenseTab: (tab: GuestExpenseTabs) => unknown;
}) {
 const { localeInfo } = useBaseConfig();
 return (
  <header className='p-2 sticky bottom-0 order-2 lg:order-1 lg:top-0 lg:bottom-auto bg-background z-3'>
   <div>
    <Tabs
     dir={localeInfo.contentDirection}
     value={activeExpenses}
     onValueChange={(newValue) =>
      changeActiveExpenseTab(newValue as GuestExpenseTabs)
     }
    >
     <TabsList className='h-11 w-[min(100%,30rem)] mx-auto bg-neutral-200 dark:bg-neutral-800'>
      <TabsTrigger value='stay'>{dic.guestExpenses.stay}</TabsTrigger>
      <TabsTrigger value='reserve-ceneter'>
       {dic.guestExpenses.revenueCenter}
      </TabsTrigger>
     </TabsList>
    </Tabs>
   </div>
  </header>
 );
}
