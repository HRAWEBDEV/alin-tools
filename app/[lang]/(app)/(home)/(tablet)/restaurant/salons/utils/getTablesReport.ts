import { type Table } from '../services/salonsApiActions';
import { TableStateTypes } from './tableStates';

interface TablesReport {
 emptyTables: number;
 occupiedTables: number;
 reservedTables: number;
 outOfServiceTables: number;
}

function getTablesReport(tables: Table[]): TablesReport {
 return tables.reduce(
  (acc, cur) => {
   switch (cur.tableStateTypeID) {
    case TableStateTypes.readyToService:
     return {
      ...acc,
      emptyTables: acc.emptyTables + 1,
     };

    case TableStateTypes.outOfService:
     return {
      ...acc,
      outOfServiceTables: acc.outOfServiceTables + 1,
     };

    case TableStateTypes.reserved:
     return {
      ...acc,
      reservedTables: acc.reservedTables + 1,
     };
   }

   return {
    ...acc,
    occupiedTables: acc.occupiedTables + 1,
   };
  },
  {
   emptyTables: 0,
   occupiedTables: 0,
   reservedTables: 0,
   outOfServiceTables: 0,
  },
 );
}

export type { TablesReport };
export { getTablesReport };
