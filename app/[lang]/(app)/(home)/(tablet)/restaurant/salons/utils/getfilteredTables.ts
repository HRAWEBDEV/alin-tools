import { type TablesFilters } from '../services/salon-base-config/salonBaseConfigContext';
import { type Table } from '../services/salonsApiActions';
import { TableStateTypes } from './tableStates';

export function getFilteredTables(tables: Table[], filters: TablesFilters) {
 return tables.filter((table) => {
  switch (table.tableStateTypeID) {
   case TableStateTypes.readyToService:
    return filters.showEmptyTables;
   case TableStateTypes.outOfService:
    return filters.showOutOfServiceTables;
   case TableStateTypes.reserved:
    return filters.showReservedTables;
   case TableStateTypes.roomGuest:
    return filters.showOccupiedTables;
   case TableStateTypes.regularCustomer:
    return filters.showOccupiedTables;
   case TableStateTypes.VIPCustomer:
    return filters.showOccupiedTables;
  }
  return true;
 });
}
