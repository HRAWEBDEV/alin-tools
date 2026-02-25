import { useState } from 'react';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type InitiData, type Table } from '../services/salonsApiActions';
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
} from '@/components/ui/drawer';
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
import { IoIosInformationCircle } from 'react-icons/io';
import { type SalonBaseConfig } from '../services/salon-base-config/salonBaseConfigContext';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getHallKey, getTableOrders } from '../services/salonsApiActions';

export default function SalonTable({
 table,
 isMinimal,
 isBold,
 ...tableUtils
}: {
 table: Table;
 isMinimal?: boolean;
 isBold?: boolean;
} & (
 | {
    tableType: 'normal';
    dic: SalonsDictionary;
    tableTypes: InitiData['tableTypes'];
    selectedHall: SalonBaseConfig['hallsInfo']['selectedHall'];
    selectedTable: SalonBaseConfig['tablesInfo']['selectedTable'];
    showTransferTable: SalonBaseConfig['tablesInfo']['showTransferTable'];
    showMergeTable: SalonBaseConfig['tablesInfo']['showMergeTable'];
    changeSelectedTable: SalonBaseConfig['tablesInfo']['changeSelectedTable'];
    onShowChangeTableState: SalonBaseConfig['tablesInfo']['onShowChangeTableState'];
    changeShowTransferTable: SalonBaseConfig['tablesInfo']['changeShowTransferTable'];
    changeShowMergeTable: SalonBaseConfig['tablesInfo']['changeShowMergeTable'];
    mergeTableTo: SalonBaseConfig['tablesInfo']['mergeTableTo'];
    transferTableTo: SalonBaseConfig['tablesInfo']['transferTableTo'];
   }
 | { tableType: 'mock' }
)) {
 const router = useRouter();
 const [isOpen, setIsOpen] = useState(false);
 const [showTableOrdersList, setShowTableOrdersList] = useState(false);

 const handleOpenChange = (newOpen: boolean) => {
  if (tableUtils.tableType === 'mock') return;
  setIsOpen(newOpen);
  if (newOpen) tableUtils.changeSelectedTable(table);
 };
 const tableStyles = getTableStateStyles(table.tableStateTypeID);
 const { locale, localeInfo } = useBaseConfig();
 const tableRows = getTableRows(table.tableCapacity, table.occupiedPerson || 0);

 const { data: ordersList, isLoading: isLoadingOrdersList } = useQuery({
  enabled: showTableOrdersList && tableUtils.tableType === 'normal',
  queryKey: [getHallKey, 'ordersList', table.orderID.toString()],
  async queryFn({ signal }) {
   const res = await getTableOrders({ tableID: table.orderID, signal });
   return res.data;
  },
 });

 const tableTypeName =
  tableUtils.tableType === 'mock'
   ? '---'
   : tableUtils.tableTypes.find(
      (item: { key: string; value: string }) =>
       item.key === table.tableTypeID.toString(),
     )?.value || '';

 function getTableExtensionTitle() {
  if (tableUtils.tableType === 'mock') return;
  switch (table.tableStateTypeID) {
   case TableStateTypes.VIPCustomer:
    return ` (${tableUtils.dic.tables.vip})`;
   case TableStateTypes.roomGuest:
    return ` (${tableUtils.dic.tables.room})`;
  }
  return '';
 }

 const showOrderRedirectLink =
  tableUtils.tableType === 'mock'
   ? '#'
   : (`/${locale}/restaurant/new-order?salonID=${tableUtils.selectedHall?.key}&salonName=${tableUtils.selectedHall?.value}&tableID=${table.tableID}&tableNo=${table.tableNo}&orderID=${table.orderID}&fromSalons=true` as const);

 const newOrderRedirectLink =
  tableUtils.tableType === 'mock'
   ? '#'
   : (`/${locale}/restaurant/new-order?salonID=${tableUtils.selectedHall?.key}&salonName=${tableUtils.selectedHall?.value}&tableID=${table.tableID}&tableNo=${table.tableNo}&orderID=0&fromSalons=true` as const);

 const menuContent =
  tableUtils.tableType === 'mock' ? null : (
   <DropdownMenuContent align='start' className='w-56'>
    <DropdownMenuGroup>
     {table.tableStateTypeID !== TableStateTypes.outOfService &&
      !!table.orderID && (
       <DropdownMenuItem
        className='text-purple-700 dark:text-purple-400'
        onClick={() => {
         if (table.orderCount <= 1) {
          router.push(showOrderRedirectLink);
          return;
         }
         setShowTableOrdersList(true);
        }}
       >
        <IoIosInformationCircle className='size-8 text-inherit' />
        <DropdownMenuLabel className='text-base'>
         {tableUtils.dic.tables.showOrder}
        </DropdownMenuLabel>
       </DropdownMenuItem>
      )}
     {table.tableStateTypeID !== TableStateTypes.outOfService && (
      <DropdownMenuItem className='text-sky-700 dark:text-sky-400' asChild>
       <Link href={newOrderRedirectLink}>
        <IoMdAddCircle className='size-8 text-inherit' />
        <DropdownMenuLabel className='text-base'>
         {tableUtils.dic.tables.order}
        </DropdownMenuLabel>
       </Link>
      </DropdownMenuItem>
     )}
     {(table.tableStateTypeID === TableStateTypes.outOfService ||
      table.tableStateTypeID === TableStateTypes.readyToService) &&
      table.orderCount <= 1 && (
       <DropdownMenuItem
        className='text-yellow-600 dark:text-yellow-400'
        onClick={() => {
         tableUtils.onShowChangeTableState(true);
         setIsOpen(false);
        }}
       >
        <GrStatusUnknown className='size-8 text-inherit' />
        <DropdownMenuLabel className='text-base'>
         {tableUtils.dic.tables.changeTableState}
        </DropdownMenuLabel>
       </DropdownMenuItem>
      )}
     {table.tableStateTypeID !== TableStateTypes.outOfService &&
      table.tableStateTypeID !== TableStateTypes.readyToService &&
      table.orderCount <= 1 && (
       <>
        <DropdownMenuItem
         className='text-teal-700 dark:text-teal-400'
         onClick={() => {
          tableUtils.changeShowTransferTable(true);
          setIsOpen(false);
         }}
        >
         <TbTransfer className='size-8 text-inherit' />
         <DropdownMenuLabel className='text-base'>
          {tableUtils.dic.tables.transferTable}
         </DropdownMenuLabel>
        </DropdownMenuItem>
        <DropdownMenuItem
         className='text-orange-700 dark:text-orange-400'
         onClick={() => {
          tableUtils.changeShowMergeTable(true);
         }}
        >
         <AiOutlineMergeCells className='size-8 text-inherit' />
         <DropdownMenuLabel className='text-base'>
          {tableUtils.dic.tables.mergeTables}
         </DropdownMenuLabel>
        </DropdownMenuItem>
        {/* <DropdownMenuItem */}
        {/*  className='text-rose-700 dark:text-rose-400' */}
        {/*  onClick={onCloseOrder} */}
        {/* > */}
        {/*  <IoMdCloseCircleOutline className='size-8 text-inherit' /> */}
        {/*  <DropdownMenuLabel className='text-base'> */}
        {/*   {dic.tables.closeOrder} */}
        {/*  </DropdownMenuLabel> */}
        {/* </DropdownMenuItem> */}
       </>
      )}
    </DropdownMenuGroup>
   </DropdownMenuContent>
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
          ? ''
          : tableUtils.dic.tables[tableStyles.type]}
         {getTableExtensionTitle()}
        </span>
       </div>
      )}
      <div className='text-start ps-2 grow'>
       <div className='flex items-center gap-2'>
        <h3
         className={`text-2xl lg:text-3xl ${tableStyles.text} font-en-roboto group-data-[bold=true]:font-black`}
        >
         {table.tableNo.toString().padStart(2, '0')}
        </h3>
       </div>
       {!isMinimal && (
        <div>
         <p className='text-sm text-primary text-wrap group-data-[bold=true]:font-medium'>
          {table.saleTypeName || ''}
         </p>
         <p className='text-md text-neutral-500 dark:text-neutral-400 text-wrap group-data-[bold=true]:font-medium'>
          {table.customerName || ''}
         </p>
        </div>
       )}
      </div>
      <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium group-data-[bold=true]:font-bold'>
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
        className={`font-medium text-base ${tableStyles.text} group-data-[bold=true]:font-bold`}
       >
        {table.occupiedPerson || '-'}/{table.tableCapacity}
       </div>
      </div>
     </Link>
    </Button>
   </div>
   <div className='mx-3 -mt-4 group-data-[layout-minimal="true"]:m-0 group-data-[layout-minimal="true"]:h-0 group-data-[layout-minimal="true"]:overflow-hidden'>
    <DropdownMenu
     open={isOpen}
     dir={localeInfo.contentDirection}
     onOpenChange={handleOpenChange}
    >
     {tableUtils.tableType === 'normal' &&
      !tableUtils.showTransferTable &&
      !tableUtils.showMergeTable && (
       <DropdownMenuTrigger asChild>
        <Button
         variant='outline'
         onPointerDown={(e) => e.preventDefault()}
         onClick={() => handleOpenChange(true)}
         className='w-full h-auto pt-5 pb-1 bg-neutral-50 dark:bg-neutral-900 text-primary rounded-xl rounded-ss-none rounded-se-none group-data-[layout-minimal="true"]:opacity-0 group-data-[layout-minimal="true"]:m-0 group-data-[layout-minimal="true"]:h-0 group-data-[layout-minimal="true"]:p-0'
        >
         <SlOptions className='size-6' />
        </Button>
       </DropdownMenuTrigger>
      )}
     {menuContent}
    </DropdownMenu>
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
       {table.orderCount}
      </div>
     </DrawerContent>
    </Drawer>
   )}
  </motion.div>
 );
}
