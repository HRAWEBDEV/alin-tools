'use client';

import { type GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import { type ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useSearchParams } from 'next/navigation';
import GuestsManagementTabs from './GuestsManagementTabs';
import GuestsManagementSlot from './GuestsManagementSlot';
export default function GuestsMangementWrapper({
 dic,
 residentGuestsDic,
}: {
 dic: GuestsManagementDictionary;
 residentGuestsDic: ResidentGuestsDictionary;
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
   <GuestsManagementSlot
    dic={dic}
    residentGuestsDic={residentGuestsDic}
    activeTab={activeTab}
   />
  </div>
 );
}
