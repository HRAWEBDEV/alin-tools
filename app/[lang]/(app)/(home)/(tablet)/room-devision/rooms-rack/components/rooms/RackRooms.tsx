import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';

export default function RackRooms({}: { dic: RoomsRackDictionary }) {
 const {
  rack: { isLoading },
 } = useRackConfigContext();
 return <div className='grow'>{isLoading && <LinearLoading />}</div>;
}
