'use client';
import { Activity } from 'react';
import { useSearchParams } from 'next/navigation';
import { type ExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';

export default function ExecutionManagementSlot({}: {
 dic: ExecutionManagementDictionary;
}) {
 const searchParams = useSearchParams();
 const activeTab = searchParams.get('tab') || 'rooms-statistics';
 return (
  <main className='order-1 lg:order-2 grow'>
   <Activity mode={activeTab === 'rooms-statistics' ? 'visible' : 'hidden'}>
    <div className='p-4 lg:pt-0 w-[min(100%,55rem)] mx-auto'></div>
   </Activity>
  </main>
 );
}
