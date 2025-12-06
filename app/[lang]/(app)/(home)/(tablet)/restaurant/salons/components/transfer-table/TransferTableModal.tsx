import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { useSalonBaseConfigContext } from '../../services/salon-base-config/salonBaseConfigContext';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { MdTouchApp } from 'react-icons/md';

export default function TransferTableModal({
 dic,
 open,
 selectedOrder,
 selectedTableNo,
 transferToTableNo,
 transferToTableID,
 changeOpen,
}: {
 dic: SalonsDictionary;
 open: boolean;
 selectedOrder: number;
 selectedTableNo: number;
 transferToTableNo: number;
 transferToTableID: number;
 changeOpen: (open?: boolean) => unknown;
}) {
 const {
  tablesInfo: { selectedTable },
 } = useSalonBaseConfigContext();
 return (
  <Dialog open={open} onOpenChange={changeOpen}>
   <DialogContent className='gap-0 p-0 sm:max-w-3xl'>
    <DialogHeader className='p-4 py-6'>
     <DialogTitle>{dic.transferTableModal.title}</DialogTitle>
    </DialogHeader>
    <div className='p-4 flex gap-4 items-center justify-center flex-col sm:flex-row'>
     <div className='size-48 rounded-lg border border-input p-4 grid place-content-center bg-rose-100 dark:bg-rose-900'>
      <p className='text-4xl font-medium font-en-roboto'>
       {selectedTableNo.toString().padStart(2, '0')}
      </p>
     </div>
     <div className='flex flex-col items-center text-neutral-600 dark:text-neutral-400 -rotate-90 sm:rotate-0'>
      <span>{dic.transferTableModal.transferTo}</span>
      <FaArrowLeftLong className='size-20 ltr:rotate-180' />
     </div>
     <div className='size-48 rounded-lg border border-input p-4 grid place-content-center bg-teal-100 dark:bg-teal-900'>
      <p className='text-4xl font-medium font-en-roboto'>
       {transferToTableNo.toString().padStart(2, '0')}
      </p>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
