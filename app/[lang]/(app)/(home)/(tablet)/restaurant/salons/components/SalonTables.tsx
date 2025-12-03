'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import SalonTable from './SalonTable';
import { useSalonBaseConfigContext } from '../services/salon-base-config/salonBaseConfigContext';

export default function SalonTables({ dic }: { dic: SalonsDictionary }) {
 const {
  tablesInfo: { filteredData },
 } = useSalonBaseConfigContext();
 return (
  <div className='p-4 pt-0'>
   {filteredData.length ? (
    <div className='grid gap-8 gap-y-4 grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] sm:grid-cols-[repeat(auto-fill,minmax(10rem,11rem))] justify-center'>
     {filteredData.map((table) => (
      <SalonTable key={table.tableID} dic={dic} table={table} />
     ))}
    </div>
   ) : (
    <div>
     {/* <p className='text-center font-medium'>{dic.noItemsFound}</p> */}
    </div>
   )}
  </div>
 );
}
