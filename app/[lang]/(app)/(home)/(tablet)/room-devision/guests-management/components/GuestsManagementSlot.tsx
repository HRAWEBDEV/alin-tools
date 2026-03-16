import { type GuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import React, { Activity } from 'react';
import GuestsListWrapper from './GuestsListWrapper';

interface GuestsManagementSlot {
 dic: GuestsManagementDictionary;
 activeTab: string;
}
export default function GuestsManagementSlot({
 dic,
 activeTab,
}: GuestsManagementSlot) {
 return (
  <main className='order-1 lg:order-2 grow'>
   <Activity mode={activeTab === 'guests-list' ? 'visible' : 'hidden'}>
    <div className='p-4 lg:pt-0'>
     <GuestsListWrapper dic={dic} />
    </div>
   </Activity>
  </main>
 );
}
