'use client';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import RackTools from './RackTools';
import RackRooms from './rooms/RackRooms';
import RackSidebar from './side-bar/RackSidebar';
import { useRackConfigContext } from '../services/rooms-rack-config/roomsRackConfigContext';

export default function RoomsRackWrapper({
 dic,
}: {
 dic: RoomsRackDictionary;
}) {
 const {
  sidebar: { isPin, isOpen },
 } = useRackConfigContext();
 return (
  <div
   data-sidebar-isOpen={isOpen}
   data-sidebar-isPin={isPin}
   className={`grid grid-cols-1 ${isOpen && isPin ? 'md:grid-cols-[18rem_1fr]' : ''}  h-full overflow-hidden relative`}
  >
   <RackSidebar dic={dic} />
   <div className='flex flex-col overflow-hidden p-4'>
    <RackTools dic={dic} />
    <RackRooms dic={dic} />
   </div>
  </div>
 );
}
