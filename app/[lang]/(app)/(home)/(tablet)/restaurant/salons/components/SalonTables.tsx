import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import SalonTable from './SalonTable';

export default function SalonTables({ dic }: { dic: SalonsDictionary }) {
 return (
  <div className='grid gap-8 gap-y-4 grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] sm:grid-cols-[repeat(auto-fill,minmax(10rem,11rem))] justify-center p-4 pt-0'>
   {Array.from({ length: 20 }, (_, i) => i).map((i) => (
    <SalonTable key={i} dic={dic} />
   ))}
  </div>
 );
}
