import { type ItemProgram } from '../services/newOrderApiActions';

export function filterItemPrograms({
 items,
 searchedItemName,
}: {
 items?: ItemProgram[];
 searchedItemName: string;
}): ItemProgram[] {
 if (!items) return [];
 return items.filter((item) => item.itemName?.includes(searchedItemName));
}
