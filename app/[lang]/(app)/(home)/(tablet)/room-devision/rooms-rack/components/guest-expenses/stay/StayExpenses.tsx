import { useQuery } from '@tanstack/react-query';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { roomsRackBaseKey } from '../../../services/roomsRackApiActions';
import { getInitialData } from '../../../services/guest-expenses/guestExpensesApiActions';

export default function StayExpenses({
 dic,
 registerID,
}: {
 dic: RoomsRackDictionary;
 registerID: number;
}) {
 const {} = useQuery({
  queryKey: [roomsRackBaseKey, 'guest-expenses', 'initial-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({
    registerID,
    signal,
   });
   return res.data;
  },
 });

 return <></>;
}
