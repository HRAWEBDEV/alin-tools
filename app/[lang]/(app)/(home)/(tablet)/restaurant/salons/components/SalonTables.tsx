'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import SalonTable from './SalonTable';
import { useSalonBaseConfigContext } from '../services/salon-base-config/salonBaseConfigContext';
import { AnimatePresence } from 'motion/react';
import ChangeTableState from './table-state/ChangeTableStateModal';
import TransferTableModal from './transfer-table/TransferTableModal';
import MergeTableModal from './merge-table/MergeTableModal';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';

import { useTablePreferences } from '@/app/[lang]/(app)/(home)/(tablet)/restaurant/hooks/useTablePreferences';

// const TABLE_VIEW_MODE_KEY = 'tablesDisplayMode';

export default function SalonTables({ dic }: { dic: SalonsDictionary }) {
 const { isMinimal, isBold } = useTablePreferences();

 const tablesGridClass = isMinimal
  ? 'grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]'
  : 'grid gap-6 grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] sm:grid-cols-[repeat(auto-fill,minmax(10rem,11rem))] justify-center';
 const {
  initData: { defaultSaleTimeID, salons },
  hallsInfo: {
   isLoading: isLoadingHalls,
   isError: hallsInfoError,
   isSuccess: hallsInfoSuccess,
  },
  tablesInfo: {
   filteredData,
   isSuccess,
   isLoading,
   isError,
   showTransferTable,
   showChangeTableState,
   selectedTable,
   selectedTransferToTable,
   showTransferTableConfirm,
   showMergeTable,
   selectedMergeToTable,
   showMergeTableConfirm,
   onShowChangeTableState,
   changeShowTransferTable,
   changeShowTransferTableConfirm,
   changeShowMergeTable,
   changeShowMergeTableConfirm,
  },
 } = useSalonBaseConfigContext();

 if ((hallsInfoError && !hallsInfoSuccess) || isError) {
  return (
   <>
    <UnExpectedError />
   </>
  );
 }

 if (isSuccess && !salons.length) {
  return <NoItemFound />;
 }

 return (
  <>
   <div className='mb-4 opacity-50'>
    {isLoading || isLoadingHalls ? (
     <LinearLoading />
    ) : (
     <div className='h-[6px]'></div>
    )}
   </div>
   {showMergeTable && selectedTable && (
    <div className={tablesGridClass + ' pb-4 mb-2 border-b border-input'}>
     <SalonTable dic={dic} table={selectedTable} />
     <div className='col-span-2 flex flex-col'>
      <p className='text-lg font-medium text-rose-700 dark:text-rose-400 mb-6'>
       {dic.toMergeTableSelectSelectAvailableTables}
      </p>
      <div className='flex justify-end'>
       <Button
        variant='destructive'
        onClick={() => {
         changeShowMergeTable(false);
        }}
       >
        <span className='font-medium text-base'>{dic.cancelMerge}</span>
       </Button>
      </div>
     </div>
    </div>
   )}
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
   {(showTransferTable || showMergeTable) && (
    <div className='px-4 mb-2'>
     <p className='font-medium text-lg'>
      {showTransferTable ? dic.transferTo : dic.mergeTo}
     </p>
    </div>
   )}
   <div className='p-4 pt-0'>
    {isSuccess && !filteredData.length ? (
     <div>
      <NoItemFound />
     </div>
    ) : (
     <AnimatePresence>
      <div className={tablesGridClass}>
       {filteredData.map((table) => (
        <SalonTable
         key={table.tableID}
         dic={dic}
         table={table}
         isMinimal={isMinimal}
         isBold={isBold}
        />
       ))}
      </div>
     </AnimatePresence>
    )}
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
    {selectedMergeToTable && selectedTable && (
     <MergeTableModal
      dic={dic}
      open={showMergeTableConfirm}
      changeOpen={changeShowMergeTableConfirm}
      selectedOrderID={selectedTable.orderID}
      selectedTableNo={selectedTable.tableNo}
      mergeToOrderID={selectedMergeToTable.orderID}
      mergeToTableNo={selectedMergeToTable.tableNo}
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
