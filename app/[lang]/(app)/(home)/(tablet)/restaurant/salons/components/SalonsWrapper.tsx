import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import SalonsFilters from './SalonsFilters';

export default function SalonsWrapper({ dic }: { dic: SalonsDictionary }) {
 return (
  <div>
   <SalonsFilters dic={dic} />
  </div>
 );
}
