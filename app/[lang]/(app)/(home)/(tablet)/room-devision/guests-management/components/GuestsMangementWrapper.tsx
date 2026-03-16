'use client';

import { type GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useSearchParams } from 'next/navigation';
import GuestsManagementTabs from './GuestsManagementTabs';
import GuestsManagementSlot from './GuestsManagementSlot';
export default function GuestsMangementWrapper({
 dic,
}: {
 dic: GuestsManagementDictionary;
}) {
 const { localeInfo, locale } = useBaseConfig();
 const redirectPath = `/${locale}/room-devision/guests-management` as const;
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'guests-list';
 return (
  <div className='flex flex-col [&]:[--top-offset:3.75rem] min-h-full'>
   <GuestsManagementTabs
    dic={dic}
    activeTab={activeTab}
    localeInfo={localeInfo}
    redirectPath={redirectPath}
   />
   <GuestsManagementSlot dic={dic} activeTab={activeTab} />
  </div>
 );
}
