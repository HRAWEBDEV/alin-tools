'use client';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import RackFilters from './RackFilters';

export default function RoomsRackWrapper({
 dic,
}: {
 dic: RoomsRackDictionary;
}) {
 return (
  <div>
   <RackFilters dic={dic} />
  </div>
 );
}
