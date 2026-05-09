import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Table } from '../services/salonsApiActions';
import { SlOptions } from 'react-icons/sl';
import { TableStateTypes, getTableStateStyles } from '../utils/tableStates';
import { getTableRows } from '../utils/getTableRows';
import { motion } from 'motion/react';
import { AiOutlineMergeCells } from 'react-icons/ai';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { TbTransfer } from 'react-icons/tb';
import { IoIosInformationCircle, IoMdAddCircle } from 'react-icons/io';
import { GrStatusUnknown } from 'react-icons/gr';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getHallKey, getTableOrders } from '../services/salonsApiActions';
import TableOrders from './table-orders/TableOrders';
import { useOrderRedirectLink } from '../hooks/useOrderRedirectLink';
import { TableUtils } from '../utils/tableUtils';
import { IoAlbums, IoPrint } from 'react-icons/io5';

export default function SalonTable({
 table,
 isMinimal,
 isBold,
 ...tableUtils
}: {
 table: Table;
 isMinimal?: boolean;
 isBold?: boolean;
} & TableUtils) {
 const orderRedirectLink = useOrderRedirectLink({
  table,
  tableUtils,
 });
 const router = useRouter();
 const [isOpen, setIsOpen] = useState(false);
 const [showTableOrdersList, setShowTableOrdersList] = useState(false);

 const handleOpenChange = (newOpen: boolean) => {
  if (tableUtils.tableType === 'mock') return;
  setIsOpen(newOpen);
  if (newOpen) tableUtils.changeSelectedTable(table);
 };
 const tableStyles = getTableStateStyles(table.tableStateTypeID);
 const { locale } = useBaseConfig();
 const tableRows = getTableRows(table.tableCapacity, table.occupiedPerson || 0);

 const { data: ordersList, isLoading: isLoadingOrdersList } = useQuery({
  enabled: showTableOrdersList && tableUtils.tableType === 'normal',
  queryKey: [getHallKey, 'ordersList', table.tableID.toString()],
  async queryFn({ signal }) {
   const res = await getTableOrders({
    tableID: table.tableID,
    signal,
   });
   return res.data;
  },
 });

 const tableTypeName =
  tableUtils.tableType === 'mock'
   ? tableUtils.tableTypeName || '---'
   : tableUtils.tableTypes.find(
      (item: { key: string; value: string }) =>
       item.key === table.tableTypeID.toString(),
     )?.value || '';

 function getTableExtensionTitle() {
  if (tableUtils.tableType === 'mock')
   return tableUtils.tableStateTypeName || '';
  switch (table.tableStateTypeID) {
   case TableStateTypes.VIPCustomer:
    return ` (${tableUtils.dic.tables.vip})`;
   case TableStateTypes.roomGuest:
    return ` (${tableUtils.dic.tables.room})`;
  }
  return '';
 }

 const showOrderRedirectLink = orderRedirectLink
  ? (`${orderRedirectLink}&orderID=${table.orderID}` as const)
  : '#';

 const newOrderRedirectLink = orderRedirectLink
  ? (`${orderRedirectLink}&orderID=0` as const)
  : '#';

 const menuContent =
  tableUtils.tableType === 'mock' ? null : (
   <DrawerContent className='h-[min(55svh,45rem)]'>
    <DrawerHeader className='border-b border-input'>
     <DrawerTitle className='text-2xl'>
      {tableUtils.dic.tables.tableActions}
     </DrawerTitle>
    </DrawerHeader>
    <div className='p-4 pb-6 grid sm:grid-cols-[max-content_1fr] gap-6 w-[min(100%,50rem)] mx-auto overflow-auto'>
     <div className='sm:w-48'>
      <SalonTable
       table={table}
       isBold={isBold}
       tableType='mock'
       isMinimal={false}
       tableTypeName={tableTypeName}
       tableStateName={tableUtils.dic.tables[tableStyles.type]}
       tableStateTypeName={getTableExtensionTitle()}
      />
      <div className='p-3'>
       {table.printed && (
        <div className='flex gap-2 items-center'>
         <IoPrint className='size-8 text-secondary' />
         <p>
          {tableUtils.dic.tables.printed}{' '}
          {!!table.printCount && table.printCount > 1 && (
           <span>(table.printCount)</span>
          )}{' '}
         </p>
        </div>
       )}
       {table.OccupiedDateTimeOffset ? (
        <div className='flex gap-2 items-center'>
         <span className='text-sm'>
          {tableUtils.dic.tables.occupiedDateTime}:{' '}
         </span>
         <p>
          {new Date(table.OccupiedDateTimeOffset).toLocaleTimeString(locale, {
           hour: '2-digit',
           minute: '2-digit',
          })}
         </p>
        </div>
       ) : (
        ''
       )}
      </div>
     </div>
     <div className='grid grid-cols-1 gap-2 content-start'>
      {table.tableStateTypeID !== TableStateTypes.outOfService &&
       !!table.orderID && (
        <Button
         variant='outline'
         className='justify-start text-start h-12 text-purple-700 dark:text-purple-400'
         size='lg'
         onClick={() => {
          if (table.orderCount <= 1) {
           router.push(showOrderRedirectLink);
           return;
          }
          setShowTableOrdersList(true);
         }}
        >
         <IoIosInformationCircle className='size-8 text-inherit' />
         {tableUtils.dic.tables.showOrder}
         {table.orderCount > 1 && <span>({table.orderCount})</span>}
        </Button>
       )}
      {table.tableStateTypeID !== TableStateTypes.outOfService &&
       (tableUtils.multiOrder || !table.orderID) && (
        <Button
         variant='outline'
         className='justify-start text-start h-12 text-sky-700 dark:text-sky-400'
         size='lg'
         asChild
        >
         <Link href={newOrderRedirectLink}>
          <IoMdAddCircle className='size-8 text-inherit' />
          {tableUtils.dic.tables.newOrder}
         </Link>
        </Button>
       )}
      {(table.tableStateTypeID === TableStateTypes.outOfService ||
       table.tableStateTypeID === TableStateTypes.readyToService) &&
       table.orderCount <= 1 && (
        <Button
         variant='outline'
         className='justify-start text-start h-12 text-yellow-600 dark:text-yellow-400'
         size='lg'
         onClick={() => {
          tableUtils.onShowChangeTableState(true);
          setIsOpen(false);
         }}
        >
         <GrStatusUnknown className='size-8 text-inherit' />
         {tableUtils.dic.tables.changeTableState}
        </Button>
       )}
      {table.tableStateTypeID !== TableStateTypes.outOfService &&
       table.tableStateTypeID !== TableStateTypes.readyToService &&
       table.orderCount <= 1 && (
        <>
         <Button
          variant='outline'
          className='justify-start text-start h-12 text-teal-700 dark:text-teal-400'
          size='lg'
          onClick={() => {
           tableUtils.changeShowTransferTable(true);
           setIsOpen(false);
          }}
          disabled={!tableUtils.access.table.change}
         >
          <TbTransfer className='size-8 text-inherit' />
          {tableUtils.dic.tables.transferTable}
         </Button>
         <Button
          variant='outline'
          className='justify-start text-start h-12 text-orange-700 dark:text-orange-400'
          size='lg'
          onClick={() => {
           tableUtils.changeShowMergeTable(true);
          }}
          disabled={!tableUtils.access.table.merge}
         >
          <AiOutlineMergeCells className='size-8 text-inherit' />
          {tableUtils.dic.tables.mergeTables}
         </Button>
        </>
       )}
     </div>
    </div>
   </DrawerContent>
  );

 const salonsInAction =
  tableUtils.tableType === 'mock'
   ? false
   : tableUtils.showMergeTable || tableUtils.showTransferTable;

 return (
  <motion.div
   layout
   className='grid group'
   data-bold={isBold}
   data-layout-minimal={isMinimal}
  >
   <div className='relative min-h-40 group-data-[layout-minimal="true"]:min-h-auto'>
    {!isMinimal && !!tableRows.length && (
     <div
      style={{
       direction: 'ltr',
      }}
      className='absolute inset-0 z-[-1] py-2 grid gap-1 content-center'
     >
      {tableRows.map((row) => (
       <div key={row.id} className='h-6 rounded-2xl flex justify-between'>
        {Array.from({ length: row.seats }, (_, i) => i).map((seat) => (
         <div
          data-occupied={row.occupiedSeats >= seat + 1}
          key={seat}
          className='size-6 rounded-full bg-neutral-200 dark:bg-neutral-800 data-[occupied="true"]:bg-rose-300 data-[occupied="true"]:dark:bg-rose-800'
         ></div>
        ))}
       </div>
      ))}
     </div>
    )}
    <Button
     variant={'outline'}
     className='z-1 rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden shadow-lg mx-3 group-data-[layout-minimal="true"]:mx-0 group-data-[layout-minimal="true"]:w-full'
     asChild={!isMinimal}
     onClick={() => {
      if (tableUtils.tableType === 'mock') return;
      if (salonsInAction && tableUtils.selectedTable?.tableNo === table.tableNo)
       return;
      if (tableUtils.showTransferTable) {
       tableUtils.transferTableTo(table);
       return;
      }
      if (tableUtils.showMergeTable) {
       tableUtils.mergeTableTo(table);
       return;
      }
      if (isMinimal) {
       handleOpenChange(true);
       return;
      }
      if (table.orderCount > 1) {
       setShowTableOrdersList(true);
      }
     }}
     style={{
      borderColor:
       tableStyles.border.replace('border-', '') === 'rose-300'
        ? '#fda4af'
        : undefined, // Quick fix for border color mapping if needed, or rely on class names
      //    backgroundColor: tableStyles.backgoundColor, // This should be a class name, not style
     }}
    >
     <Link
      href={
       tableUtils.tableType === 'mock'
        ? '#'
        : tableUtils.showTransferTable ||
            tableUtils.showMergeTable ||
            table.tableStateTypeID === TableStateTypes.outOfService ||
            isMinimal ||
            table.orderCount > 1
          ? '#'
          : showOrderRedirectLink
      }
      className={`relative flex! flex-col grow items-stretch ${isBold ? tableStyles.backgoundColor : 'bg-background!'} p-2 group-data-[layout-minimal="true"]:w-full`}
     >
      {table.vip && (
       <div className='absolute top-11 group-data-[layout-minimal="true"]:top-0 group-data-[layout-minimal="true"]:bottom-11 start-0 end-0 text-end text-4xl text-amber-400/40 dark:text-amber-500/40 font-en-roboto group-data-[bold=true]:font-bold group-data-[layout-minimal="true"]:text-3xl'>
        VIP
       </div>
      )}
      {!isMinimal && (
       <div
        className={`p-1 rounded-2xl border border-dashed text-center ${tableStyles.backgoundColor} ${tableStyles.border} ${tableStyles.text} `}
       >
        <span className='text-base font-medium group-data-[bold=true]:font-bold'>
         <span>{tableTypeName} </span>
         {tableUtils.tableType === 'mock'
          ? tableUtils.tableStateName || ''
          : tableUtils.dic.tables[tableStyles.type]}
         {getTableExtensionTitle()}
        </span>
       </div>
      )}
      <div className='text-start ps-2 grow'>
       <div className='flex items-center'>
        <h3
         className={`text-wrap text-2xl ${tableStyles.text} font-en-roboto group-data-[bold=true]:font-black ${isMinimal ? '' : 'lg:text-3xl'}`}
        >
         {table.tableNo.toString().padStart(2, '0')}
        </h3>
        {table.orderCount > 1 && (
         <IoAlbums className={`size-6 ${tableStyles.text} opacity-20`} />
        )}
       </div>
       {!isMinimal && (
        <div className='whitespace-nowrap grid'>
         <p className='text-sm text-primary group-data-[bold=true]:font-medium truncate'>
          {table.saleTypeName || ''}
         </p>
         <p className='text-md text-neutral-500 dark:text-neutral-400 group-data-[bold=true]:font-medium truncate'>
          {table.customerName || ''}
         </p>
        </div>
       )}
      </div>
      <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium group-data-[bold=true]:font-bold'>
        <div className='flex gap-1 items-center'>
         {table.printed && (
          <IoPrint
           className={`${isMinimal ? 'size-5' : 'size-7'} text-secondary`}
          />
         )}
        </div>
       </div>
       <div
        style={{
         direction: 'ltr',
        }}
        className={`font-medium text-base ${tableStyles.text} group-data-[bold=true]:font-bold`}
       >
        {table.occupiedPerson || '-'}/{table.tableCapacity}
       </div>
      </div>
     </Link>
    </Button>
   </div>
   <div className='mx-3 -mt-4 group-data-[layout-minimal="true"]:m-0 group-data-[layout-minimal="true"]:h-0 group-data-[layout-minimal="true"]:overflow-hidden'>
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
     {tableUtils.tableType === 'normal' &&
      !tableUtils.showTransferTable &&
      !tableUtils.showMergeTable && (
       <DrawerTrigger asChild>
        <Button
         variant='outline'
         onPointerDown={(e) => e.preventDefault()}
         onClick={() => handleOpenChange(true)}
         className='w-full h-auto pt-5 pb-1 bg-neutral-50 dark:bg-neutral-900 text-primary rounded-xl rounded-ss-none rounded-se-none group-data-[layout-minimal="true"]:opacity-0 group-data-[layout-minimal="true"]:m-0 group-data-[layout-minimal="true"]:h-0 group-data-[layout-minimal="true"]:p-0'
        >
         <SlOptions className='size-6' />
        </Button>
       </DrawerTrigger>
      )}
     {menuContent}
    </Drawer>
   </div>
   {tableUtils.tableType === 'normal' && (
    <Drawer
     open={showTableOrdersList}
     onOpenChange={(newValue) => setShowTableOrdersList(newValue)}
    >
     <DrawerContent className='h-[min(80svh,35rem)]'>
      <DrawerHeader className='text-xl border-b border-input'>
       <DrawerTitle>
        {tableUtils.dic.multiOrder.title} {tableTypeName} {table.tableNo}
       </DrawerTitle>
      </DrawerHeader>
      <div className='overflow-hidden overflow-y-auto p-4'>
       <TableOrders
        dic={tableUtils.dic['multiOrder']}
        data={ordersList}
        isLoading={isLoadingOrdersList}
        orderRedirectLink={orderRedirectLink}
        orderCount={table.orderCount}
        tableCapacity={table.tableCapacity}
        tableStateType={table.tableStateTypeID}
        canAddNewOrder={tableUtils.access.order.add}
       />
      </div>
     </DrawerContent>
    </Drawer>
   )}
  </motion.div>
 );
}
