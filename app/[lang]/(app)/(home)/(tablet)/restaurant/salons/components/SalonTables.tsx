'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import SalonTable from './SalonTable';
import { useSalonBaseConfigContext } from '../services/salon-base-config/salonBaseConfigContext';
import { AnimatePresence } from 'motion/react';
import ChangeTableState from './table-state/ChangeTableStateModal';
import TransferTableModal from './transfer-table/TransferTableModal';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';
import { changeTableStateType } from '../services/salonsApiActions';

const tablesGridClass =
 'grid gap-6 grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] sm:grid-cols-[repeat(auto-fill,minmax(10rem,11rem))] justify-center';

export default function SalonTables({ dic }: { dic: SalonsDictionary }) {
 const {
  initData: { defaultSaleTimeID },
  tablesInfo: {
   filteredData,
   isSuccess,
   isLoading,
   showTransferTable,
   showChangeTableState,
   selectedTable,
   selectedTransferToTable,
   showTransferTableConfirm,
   onShowChangeTableState,
   changeShowTransferTable,
   changeShowTransferTableConfirm,
  },
 } = useSalonBaseConfigContext();
 if (isSuccess && !filteredData.length)
  return (
   <div>
    <NoItemFound />
   </div>
  );
 return (
  <>
   <div className='mb-4 opacity-50'>
    {isLoading ? <LinearLoading /> : <div className='h-[6px]'></div>}
   </div>
   {showTransferTable && selectedTable && (
    <div className={tablesGridClass + ' pb-4 mb-2 border-b border-input'}>
     <SalonTable dic={dic} table={selectedTable} />
     <div className='col-span-2 flex flex-col'>
      <p className='text-lg font-medium text-rose-700 dark:text-rose-400 mb-6'>
       {dic.toTransferTableSelectSelectAvailableTables}
      </p>
      <div className='flex justify-end'>
       <Button
        variant='destructive'
        onClick={() => {
         changeShowTransferTable(false);
        }}
       >
        <span className='font-medium text-base'>{dic.cancelTransfer}</span>
       </Button>
      </div>
     </div>
    </div>
   )}
   {showTransferTable && (
    <div className='px-4 mb-2'>
     <p className='font-medium text-lg'>{dic.transferTo}</p>
    </div>
   )}
   <div className='p-4 pt-0'>
    <AnimatePresence>
     <div className={tablesGridClass}>
      {filteredData.map((table) => (
       <SalonTable key={table.tableID} dic={dic} table={table} />
      ))}
     </div>
    </AnimatePresence>
    {selectedTable && (
     <ChangeTableState
      dic={dic}
      open={showChangeTableState}
      changeOpen={onShowChangeTableState}
      tableNo={selectedTable.tableNo}
      tableID={selectedTable.tableID}
      tableStateTypeID={selectedTable.tableStateTypeID}
      tableStateDataID={selectedTable.tableStateDataID}
      saleTimeID={defaultSaleTimeID}
     />
    )}
    {selectedTransferToTable && selectedTable && (
     <TransferTableModal
      dic={dic}
      selectedOrderID={selectedTable.orderID}
      selectedTableNo={selectedTable.tableNo}
      transferToTableID={selectedTransferToTable.tableID}
      transferToTableNo={selectedTransferToTable.tableNo}
      open={showTransferTableConfirm}
      changeOpen={changeShowTransferTableConfirm}
     />
    )}
   </div>
  </>
 );
}
