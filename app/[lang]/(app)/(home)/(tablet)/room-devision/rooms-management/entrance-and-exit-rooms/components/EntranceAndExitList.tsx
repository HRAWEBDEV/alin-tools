import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import EntranceAndExitItem from './EntranceAndExitItem';

export default function EntranceAndExitList({
 dic,
}: {
 dic: EntranceAndExitRoomsDictionary;
}) {
 return (
  <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
   {Array.from({ length: 1 }, (_, i) => i).map((i) => (
    <EntranceAndExitItem key={i} dic={dic} />
   ))}
  </div>
 );
}
