import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import EntranceAndExitFilters from './components/EntranceAndExitFilters';
import EntranceAndExitList from './components/EntranceAndExitList';

export default function EntranceAndExitRoomsWrapper({
 dic,
}: {
 dic: EntranceAndExitRoomsDictionary;
}) {
 return (
  <div>
   <EntranceAndExitFilters dic={dic} />
   <EntranceAndExitList dic={dic} />
  </div>
 );
}
