import { type ExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';
import ExecutionManagementTabs from './ExecutionManagementTabs';
import ExecutionManagementSlot from './ExecutionManagementSlot';
import { type GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';

export default function ExecutionManagementWrapper({
 dic,
 guestChecklistDic,
}: {
 dic: ExecutionManagementDictionary;
 guestChecklistDic: GuestCheckoutChecklistDictionary;
}) {
 return (
  <div className='flex flex-col [&]:[--top-offset:3.75rem] min-h-full'>
   <ExecutionManagementTabs dic={dic} />
   <ExecutionManagementSlot dic={dic} guestChecklistDic={guestChecklistDic} />
  </div>
 );
}
