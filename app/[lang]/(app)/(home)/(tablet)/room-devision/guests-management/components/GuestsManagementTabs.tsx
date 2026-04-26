import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import { type LocaleInfo } from '@/internalization/app/localization';
import Link from 'next/link';
interface GuestsManagementTabs {
 dic: GuestsManagementDictionary;
 activeTab: string;
 localeInfo: LocaleInfo;
 redirectPath:
  | '/fa/room-devision/guests-management'
  | '/en/room-devision/guests-management';
}
export default function GuestsManagementTabs({
 dic,
 activeTab,
 localeInfo,
 redirectPath,
}: GuestsManagementTabs) {
 return (
  <header className='p-2 sticky bottom-0 pb-0 order-2 lg:order-1 lg:pb-2 lg:top-0 lg:bottom-auto bg-background z-3'>
   <div>
    <Tabs dir={localeInfo.contentDirection} value={activeTab}>
     <TabsList className='h-11 w-[min(100%,30rem)] mx-auto bg-neutral-200 dark:bg-neutral-800'>
      <TabsTrigger value='guests-list' asChild>
       <Link
        href={`${redirectPath}?tab=guests-list`}
        className='font-medium'
        key='guests-list'
       >
        {dic.tabs.guestsList}
       </Link>
      </TabsTrigger>
      <TabsTrigger value='arrival-reserves' asChild>
       <Link
        href={`${redirectPath}?tab=arrival-reserves`}
        className='font-medium'
        key='arrival-reserves'
       >
        {dic.tabs.arrivalReserves}
       </Link>
      </TabsTrigger>
      {/*<TabsTrigger value='guests-expenses' asChild>
       <Link
        href={`${redirectPath}?tab=guests-expenses`}
        className='font-medium'
        key='guests-expenses'
       >
        {dic.tabs.guestsExpenses}
       </Link>
      </TabsTrigger>*/}
     </TabsList>
    </Tabs>
   </div>
  </header>
 );
}
