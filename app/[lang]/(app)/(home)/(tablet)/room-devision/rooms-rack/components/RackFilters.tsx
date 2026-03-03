import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useRackConfigContext } from '../services/rooms-rack-config/roomsRackConfigContext';
import { Button } from '@/components/ui/button';
import {
 FaQuestionCircle,
 FaInfoCircle,
 FaFilter,
 FaThumbtack,
} from 'react-icons/fa';

export default function RackFilters({ dic }: { dic: RoomsRackDictionary }) {
 const {
  sidebar: { toggle },
 } = useRackConfigContext();
 return (
  <div className='border border-input rounded-md p-2 shadow'>
   <div className='flex gap-2'>
    <Button
     className='text-primary border-primary'
     variant='outline'
     size='lg'
     onClick={() => toggle()}
    >
     <FaFilter className='size-4' />
     <span className='hidden md:inline'>{dic.sidebar.tabs.filters}</span>
    </Button>
   </div>
  </div>
 );
}
