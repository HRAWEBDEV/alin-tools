import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import OutOfOrderRoom from './OutOfOrderRoom';

export default function OutOfOrderRooms({
 dic,
}: {
 dic: OutOfOrderRoomsDictionary;
}) {
 return (
  <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
   {Array.from({ length: 1 }, (_, i) => i).map((i) => (
    <OutOfOrderRoom key={i} dic={dic} />
   ))}
  </div>
 );
}
