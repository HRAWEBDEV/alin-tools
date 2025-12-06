'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import SalonTable from './SalonTable';
import { useSalonBaseConfigContext } from '../services/salon-base-config/salonBaseConfigContext';
import { AnimatePresence } from 'motion/react';
import ChangeTableState from './table-state/ChangeTableStateModal';
import TransferTableModal from './transfer-table/TransferTableModal';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';

export default function SalonTables({ dic }: { dic: SalonsDictionary }) {
 const {
  tablesInfo: { filteredData, isSuccess, isLoading },
 } = useSalonBaseConfigContext();
 if (isSuccess && !filteredData.length)
  return (
   <div>
    <NoItemFound />
   </div>
  );
 return (
  <>
   {isLoading && (
    <div className='mb-4 opacity-20'>
     <LinearLoading />
    </div>
   )}
   <div className='p-4 pt-0'>
    <AnimatePresence>
     <div className='grid gap-6 grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] sm:grid-cols-[repeat(auto-fill,minmax(10rem,11rem))] justify-center'>
      {filteredData.map((table) => (
       <SalonTable key={table.tableID} dic={dic} table={table} />
      ))}
     </div>
    </AnimatePresence>
    <ChangeTableState dic={dic} />
    <TransferTableModal dic={dic} />
   </div>
  </>
 );
}
