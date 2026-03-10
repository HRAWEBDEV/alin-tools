import { type RoomsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-management/dictionary';
import RoomsManagementTabs from './RoomsManagementTabs';
import RoomsManagementSlot from './RoomsManagementSlot';

export default function RoomsManagementWrapper({
 dic,
}: {
 dic: RoomsManagementDictionary;
}) {
 return (
  <div className='h-full flex flex-col'>
   <RoomsManagementTabs dic={dic} />
   <RoomsManagementSlot dic={dic} />
  </div>
 );
}
