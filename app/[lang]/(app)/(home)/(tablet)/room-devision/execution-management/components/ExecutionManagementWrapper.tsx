import { type ExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';
import ExecutionManagementTabs from './ExecutionManagementTabs';
import ExecutionManagementSlot from './ExecutionManagementSlot';

export default function ExecutionManagementWrapper({
 dic,
}: {
 dic: ExecutionManagementDictionary;
}) {
 return (
  <div className='flex flex-col [&]:[--top-offset:3.75rem] min-h-full'>
   <ExecutionManagementTabs dic={dic} />
   <ExecutionManagementSlot dic={dic} />
  </div>
 );
}
