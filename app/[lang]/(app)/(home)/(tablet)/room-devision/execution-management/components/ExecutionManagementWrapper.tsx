import { type ExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';
import ExecutionManagementTabs from './ExecutionManagementTabs';
import ExecutionManagementSlot from './ExecutionManagementSlot';
import { type GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';

export default function ExecutionManagementWrapper({
 dic,
 guestChecklistDic,
 dailyTasksDic,
}: {
 dic: ExecutionManagementDictionary;
 guestChecklistDic: GuestCheckoutChecklistDictionary;
 dailyTasksDic: DailyTasksChecklistDictionary;
}) {
 return (
  <div className='flex flex-col [&]:[--top-offset:3.75rem] min-h-full'>
   <ExecutionManagementTabs dic={dic} />
   <ExecutionManagementSlot
    dic={dic}
    guestChecklistDic={guestChecklistDic}
    dailyTasksDic={dailyTasksDic}
   />
  </div>
 );
}
