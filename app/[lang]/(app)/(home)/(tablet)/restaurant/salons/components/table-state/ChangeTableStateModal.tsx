import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlineBlock } from 'react-icons/md';
import { type Table, type InitiData } from '../../services/salonsApiActions';
import { TableStateTypes } from '../../utils/tableStates';
import { MdTouchApp } from 'react-icons/md';
import { changeTableStateType } from '../../services/salonsApiActions';
import { useMutation } from '@tanstack/react-query';

export default function ChangeTableState({
 dic,
 open,
 tableID,
 tableNo,
 tableStateTypeID,
 saleTimeID,
 tableStateDataID,
 changeOpen,
}: {
 dic: SalonsDictionary;
 open: boolean;
 tableID: Table['tableID'];
 tableNo: Table['tableNo'];
 tableStateTypeID: Table['tableStateTypeID'];
 saleTimeID: InitiData['defaultSaleTimeID'];
 tableStateDataID: Table['tableStateDataID'];
 changeOpen: (newState?: boolean) => unknown;
}) {
 const { mutate, isPending } = useMutation({
  mutationFn(newStateType: number) {
   return changeTableStateType({
    tableID,
    date: new Date().toISOString(),
    tableStateTypeID: newStateType.toString(),
    saleTimeID,
    tableStateDataID,
   });
  },
  onSuccess() {
   changeOpen(false);
  },
 });

 return (
  <Dialog open={open} onOpenChange={changeOpen}>
   <DialogContent className='gap-0 p-0'>
    <DialogHeader className='p-4 py-6'>
     <DialogTitle>{dic.tableStateModal.title}</DialogTitle>
    </DialogHeader>
    <div className='p-4'>
     <p className='mb-4 text-base font-medium text-center'>
      <span>
       {dic.tableStateModal.currentTableState} {tableNo} :
      </span>
      <span className='text-teal-800 dark:text-teal-200'>
       {tableStateTypeID === TableStateTypes.readyToService &&
        dic.tableStateModal.readyToService}
       {tableStateTypeID === TableStateTypes.outOfService &&
        dic.tableStateModal.outOfOrder}
      </span>
     </p>
     <div className='flex gap-4 justify-center flex-wrap'>
      <Button
       variant='outline'
       className='relative h-auto w-auto flex-col size-48 max-h-none bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200'
       disabled={isPending}
       onClick={() => {
        const newStateType = TableStateTypes.readyToService;
        if (newStateType === tableStateTypeID) {
         changeOpen(false);
         return;
        }
        mutate(newStateType);
       }}
      >
       <div className='absolute bottom-0 end-0 z-0'>
        <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-900' />
       </div>
       <div className='flex flex-col items-center z-1'>
        <FaCheckCircle className='size-14' />
        <span className='text-base font-medium'>
         {dic.tableStateModal.readyToService}
        </span>
       </div>
      </Button>
      <Button
       variant='outline'
       className='relative h-auto w-auto flex-col size-48 max-h-none bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
       disabled={isPending}
       onClick={() => {
        const newStateType = TableStateTypes.outOfService;
        if (newStateType === tableStateTypeID) {
         changeOpen(false);
         return;
        }
        mutate(newStateType);
       }}
      >
       <div className='absolute bottom-0 end-0 z-0'>
        <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
       </div>
       <div className='flex flex-col items-center z-1'>
        <MdOutlineBlock className='size-14' />
        <span className='text-base font-medium'>
         {dic.tableStateModal.outOfOrder}
        </span>
       </div>
      </Button>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
