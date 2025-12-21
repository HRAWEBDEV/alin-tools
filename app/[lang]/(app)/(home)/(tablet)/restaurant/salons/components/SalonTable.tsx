import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Table } from '../services/salonsApiActions';
import { SlOptions } from 'react-icons/sl';
import { TableStateTypes, getTableStateStyles } from '../utils/tableStates';
import { getTableRows } from '../utils/getTableRows';
import { motion } from 'motion/react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { AiOutlineMergeCells } from 'react-icons/ai';
import {
 DropdownMenu,
 DropdownMenuTrigger,
 DropdownMenuContent,
 DropdownMenuGroup,
 DropdownMenuItem,
 DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { TbTransfer } from 'react-icons/tb';
import { IoMdAddCircle } from 'react-icons/io';
import { GrStatusUnknown } from 'react-icons/gr';
import { useSalonBaseConfigContext } from '../services/salon-base-config/salonBaseConfigContext';

export default function SalonTable({
 table,
 dic,
}: {
 dic: SalonsDictionary;
 table: Table;
}) {
 const {
  initData,
  hallsInfo: { selectedHall },
  tablesInfo: {
   selectedTable,
   showTransferTable,
   showMergeTable,
   changeSelectedTable,
   onShowChangeTableState,
   changeShowTransferTable,
   changeShowMergeTable,
   mergeTableTo,
   transferTableTo,
   onCloseOrder,
  },
 } = useSalonBaseConfigContext();
 const tableStyles = getTableStateStyles(table.tableStateTypeID);
 const { locale, localeInfo } = useBaseConfig();
 const tableRows = getTableRows(table.tableCapacity, table.occupiedPerson || 0);

 function getTableExtensionTitle() {
  switch (table.tableStateTypeID) {
   case TableStateTypes.VIPCustomer:
    return ` (${dic.tables.vip})`;
   case TableStateTypes.roomGuest:
    return ` (${dic.tables.room})`;
  }
  return '';
 }

 const newOrderRedirectLink =
  `/${locale}/restaurant/new-order?salonID=${selectedHall?.key}&salonName=${selectedHall?.value}&tableID=${table.tableID}&tableNo=${table.tableNo}&orderID=${table.orderID}&fromSalons=true` as const;

 return (
  <motion.div layout className='grid'>
   <div className='relative min-h-40'>
    {!!tableRows.length && (
     <div
      style={{
       direction: 'ltr',
      }}
      className='absolute inset-0 z-[-1] py-2 grid gap-1 content-center'
     >
      {tableRows.map((row) => (
       <div key={row.id} className='h-5 rounded-2xl flex justify-between'>
        {Array.from({ length: row.seats }, (_, i) => i).map((seat) => (
         <div
          data-occupied={row.occupiedSeats >= seat + 1}
          key={seat}
          className='size-5 rounded-full bg-neutral-200 dark:bg-neutral-800 data-[occupied="true"]:bg-rose-300 data-[occupied="true"]:dark:bg-rose-800'
         ></div>
        ))}
       </div>
      ))}
     </div>
    )}
    <Button
     variant={'outline'}
     className='z-1 rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden mx-2 shadow-lg'
     asChild
     onClick={() => {
      if (selectedTable?.tableNo === table.tableNo) return;
      if (showTransferTable) transferTableTo(table);
      if (showMergeTable) mergeTableTo(table);
     }}
    >
     <Link
      href={
       showTransferTable ||
       showMergeTable ||
       table.tableStateTypeID === TableStateTypes.outOfService
        ? '#'
        : newOrderRedirectLink
      }
      className='relative flex! flex-col grow items-stretch bg-background! p-2'
     >
      {table.vip && (
       <div className='absolute top-11 start-0 end-0 text-end text-4xl text-amber-400/40 dark:text-amber-500/40 font-en-roboto'>
        VIP
       </div>
      )}
      <div
       className={`p-1 rounded-2xl border border-dashed text-center ${tableStyles.backgoundColor} ${tableStyles.border} ${tableStyles.text}`}
      >
       <span className='text-base font-medium'>
        <span>
         {initData.tableTypes.find(
          (item) => item.key === table.tableTypeID.toString(),
         )?.value || ''}{' '}
        </span>
        {dic.tables[tableStyles.type]}
        {getTableExtensionTitle()}
       </span>
      </div>
      <div className='text-start ps-2 grow'>
       <div className='flex items-center gap-2'>
        <h3
         className={`text-2xl lg:text-3xl ${tableStyles.text} font-en-roboto`}
        >
         {table.tableNo.toString().padStart(2, '0')}
        </h3>
       </div>
       <div>
        <p className='text-sm text-primary text-wrap mb-1'>
         {table.saleTypeName || ''}
        </p>
        <p className='text-md text-neutral-500 dark:text-neutral-400 text-wrap'>
         {table.customerName || ''}
        </p>
       </div>
      </div>
      <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium'>
        <span>
         {table.OccupiedDateTimeOffset
          ? new Date(table.OccupiedDateTimeOffset).toLocaleTimeString(locale, {
             hour: '2-digit',
             minute: '2-digit',
            })
          : ''}
        </span>
       </div>
       <div
        style={{
         direction: 'ltr',
        }}
        className={`font-medium text-base ${tableStyles.text}`}
       >
        {table.occupiedPerson || '-'}/{table.tableCapacity}
       </div>
      </div>
     </Link>
    </Button>
   </div>
   <div className='mx-2 -mt-4'>
    <DropdownMenu
     dir={localeInfo.contentDirection}
     onOpenChange={(newValue) => {
      if (newValue) {
       changeSelectedTable(table);
      }
     }}
    >
     {!showTransferTable && !showMergeTable && (
      <DropdownMenuTrigger asChild>
       <Button
        variant='outline'
        className='w-full h-auto pt-5 pb-1 bg-neutral-50 dark:bg-neutral-900 text-primary rounded-xl rounded-ss-none rounded-se-none'
       >
        <SlOptions className='size-6' />
       </Button>
      </DropdownMenuTrigger>
     )}
     <DropdownMenuContent align='start' className='w-56'>
      <DropdownMenuGroup>
       {table.tableStateTypeID !== TableStateTypes.outOfService && (
        <DropdownMenuItem className='text-sky-700 dark:text-sky-400' asChild>
         <Link href={newOrderRedirectLink}>
          <IoMdAddCircle className='size-8 text-inherit' />
          <DropdownMenuLabel className='text-base'>
           {dic.tables.order}
          </DropdownMenuLabel>
         </Link>
        </DropdownMenuItem>
       )}
       {(table.tableStateTypeID === TableStateTypes.outOfService ||
        table.tableStateTypeID === TableStateTypes.readyToService) && (
        <DropdownMenuItem
         className='text-yellow-600 dark:text-yellow-400'
         onClick={() => {
          onShowChangeTableState(true);
         }}
        >
         <GrStatusUnknown className='size-8 text-inherit' />
         <DropdownMenuLabel className='text-base'>
          {dic.tables.changeTableState}
         </DropdownMenuLabel>
        </DropdownMenuItem>
       )}
       {table.tableStateTypeID !== TableStateTypes.outOfService &&
        table.tableStateTypeID !== TableStateTypes.readyToService && (
         <>
          <DropdownMenuItem
           className='text-teal-700 dark:text-teal-400'
           onClick={() => {
            changeShowTransferTable(true);
           }}
          >
           <TbTransfer className='size-8 text-inherit' />
           <DropdownMenuLabel className='text-base'>
            {dic.tables.transferTable}
           </DropdownMenuLabel>
          </DropdownMenuItem>
          <DropdownMenuItem
           className='text-orange-700 dark:text-orange-400'
           onClick={() => {
            changeShowMergeTable(true);
           }}
          >
           <AiOutlineMergeCells className='size-8 text-inherit' />
           <DropdownMenuLabel className='text-base'>
            {dic.tables.mergeTables}
           </DropdownMenuLabel>
          </DropdownMenuItem>
          <DropdownMenuItem
           className='text-rose-700 dark:text-rose-400'
           onClick={onCloseOrder}
          >
           <IoMdCloseCircleOutline className='size-8 text-inherit' />
           <DropdownMenuLabel className='text-base'>
            {dic.tables.closeOrder}
           </DropdownMenuLabel>
          </DropdownMenuItem>
         </>
        )}
      </DropdownMenuGroup>
     </DropdownMenuContent>
    </DropdownMenu>
   </div>
  </motion.div>
 );
}
