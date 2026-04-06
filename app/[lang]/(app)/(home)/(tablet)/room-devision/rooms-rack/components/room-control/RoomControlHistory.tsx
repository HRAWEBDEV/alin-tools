import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type RoomControl } from '../../services/room-control/roomControlApiActions';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import RoomControlHistoryItem from './RoomControlHistoryItem';

export default function RoomControlHistory({
 dic,
 data,
 isError,
 isFetching,
 isSuccess,
}: {
 dic: RoomsRackDictionary;
 data?: RoomControl[];
 isFetching: boolean;
 isLoading: boolean;
 isSuccess: boolean;
 isError: boolean;
}) {
 if (!isFetching && isError) {
  return <UnExpectedError />;
 }
 if (isSuccess && !data?.length) {
  return <NoItemFound />;
 }
 return (
  <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4'>
   {data?.map((history) => (
    <RoomControlHistoryItem key={history.id} dic={dic} history={history} />
   ))}
  </div>
 );
}
