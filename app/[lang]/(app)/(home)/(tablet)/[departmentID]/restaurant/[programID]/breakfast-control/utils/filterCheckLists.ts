import { type BreakfastControlFiltersSchema } from '../schemas/breakfastControlFiltersSchema';
import { type BreackfastControlRes } from '../services/BreakfastControlApiActions';

export function filterCheckLists({
 checkLists,
 search,
 showNotServed,
 showServed,
}: BreakfastControlFiltersSchema & {
 checkLists: BreackfastControlRes['bfCheckListDatas'];
}) {
 return checkLists.filter((item) => {
  let showItem = false;
  if (showServed) {
   showItem = item.served;
  }
  if (!showItem && showNotServed) {
   showItem = !item.served;
  }
  if (!showItem || !search) return showItem;
  return (
   item.roomNo.toString().includes(search) ||
   item.customerName.includes(search) ||
   item.guestFullName.includes(search)
  );
 });
}
