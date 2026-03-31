import { type GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import React, { Activity } from 'react';
import GuestsListWrapper from '../resident-guests/components/GuestsListWrapper';
import { ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';

interface GuestsManagementSlot {
 dic: GuestsManagementDictionary;
 residentGuestsDic: ResidentGuestsDictionary;
 activeTab: string;
}
export default function GuestsManagementSlot({
 dic,
 residentGuestsDic,
 activeTab,
}: GuestsManagementSlot) {
 return (
  <main className='order-1 lg:order-2 grow'>
   <Activity mode={activeTab === 'guests-list' ? 'visible' : 'hidden'}>
    <div className='p-4 lg:pt-0'>
     <GuestsListWrapper dic={residentGuestsDic} />
    </div>
   </Activity>
  </main>
 );
}
