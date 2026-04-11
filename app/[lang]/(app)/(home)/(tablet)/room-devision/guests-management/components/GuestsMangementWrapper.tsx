'use client';

import { type GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import { type ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useSearchParams } from 'next/navigation';
import GuestsManagementTabs from './GuestsManagementTabs';
import GuestsManagementSlot from './GuestsManagementSlot';
import { type ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';
import { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
export default function GuestsMangementWrapper({
 dic,
 residentGuestsDic,
 arrivalReservesDic,
 guestsExpensesDic,
}: {
 dic: GuestsManagementDictionary;
 residentGuestsDic: ResidentGuestsDictionary;
 arrivalReservesDic: ArrivalReservesDictionary;
 guestsExpensesDic: GuestsExpensesDictionary;
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
    residentGuestsDic={residentGuestsDic}
    arrivalReservesDic={arrivalReservesDic}
    guestsExpensesDic={guestsExpensesDic}
    activeTab={activeTab}
   />
  </div>
 );
}
