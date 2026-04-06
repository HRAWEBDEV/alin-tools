import React, { Activity } from 'react';
import GuestsListWrapper from '../resident-guests/components/GuestsListWrapper';
import { ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';
import { type ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';
import ArrivalReservesWrapper from '../arrival-reserves/components/ArrivalReservesWrapper';

interface GuestsManagementSlot {
 residentGuestsDic: ResidentGuestsDictionary;
 arrivalReservesDic: ArrivalReservesDictionary;
 activeTab: string;
}
export default function GuestsManagementSlot({
 residentGuestsDic,
 arrivalReservesDic: arrivalReservesDic,
 activeTab,
}: GuestsManagementSlot) {
 return (
  <main className='order-1 lg:order-2 grow'>
   <Activity mode={activeTab === 'guests-list' ? 'visible' : 'hidden'}>
    <div className='p-4 lg:pt-0'>
     <GuestsListWrapper dic={residentGuestsDic} />
    </div>
   </Activity>
   <Activity mode={activeTab === 'arrival-reserves' ? 'visible' : 'hidden'}>
    <div className='p-4 lg:pt-0'>
     <ArrivalReservesWrapper dic={arrivalReservesDic} />
    </div>
   </Activity>
  </main>
 );
}
