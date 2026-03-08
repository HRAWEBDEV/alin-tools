import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';

export default function RackRooms({}: { dic: RoomsRackDictionary }) {
 const { rack } = useRackConfigContext();

 if (rack.isSuccess && !rack.data.length)
  return (
   <div className='grow'>
    <NoItemFound />
   </div>
  );

 if (rack.isError && !rack.isSuccess)
  return (
   <div className='grow'>
    <UnExpectedError />
   </div>
  );

 return <div className='grow'>{rack.isLoading && <LinearLoading />}</div>;
}
