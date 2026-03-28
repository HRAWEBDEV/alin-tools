'use client';
import { Activity } from 'react';
import { useSearchParams } from 'next/navigation';
import { type ExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';
import GuestCheckoutChecklistWrapper from '../guest-checkout-checklist/GuestCheckoutChecklistWrapper';
import { type GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';

export default function ExecutionManagementSlot({
 guestChecklistDic,
 dailyTasksDic,
}: {
 dic: ExecutionManagementDictionary;
 guestChecklistDic: GuestCheckoutChecklistDictionary;
 dailyTasksDic: DailyTasksChecklistDictionary;
}) {
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'daily-tasks-checklist';
 return (
  <main className='order-1 lg:order-2 grow'>
   <Activity
    mode={activeTab === 'daily-tasks-checklist' ? 'visible' : 'hidden'}
   >
    <div className='p-4 lg:pt-0'></div>
   </Activity>
   <Activity
    mode={activeTab === 'guest-checkout-checklist' ? 'visible' : 'hidden'}
   >
    <div className='p-4 lg:pt-0'>
     <GuestCheckoutChecklistWrapper dic={guestChecklistDic} />
    </div>
   </Activity>
  </main>
 );
}
