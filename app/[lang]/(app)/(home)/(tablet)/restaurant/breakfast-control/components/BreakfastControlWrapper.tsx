import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import BreakfastControlFilters from './BreakfastControlFilters';
import BreakfastControlList from './BreakfastControlList';

export default function BreakfastControlWrapper({
 dic,
}: {
 dic: BreakfastControlDictionary;
}) {
 return (
  <div>
   <BreakfastControlFilters dic={dic} />
   <BreakfastControlList dic={dic} />
  </div>
 );
}
