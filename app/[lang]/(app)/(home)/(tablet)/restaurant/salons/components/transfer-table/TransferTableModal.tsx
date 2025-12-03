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

export default function TransferTableModal({ dic }: { dic: SalonsDictionary }) {
 const {
  tablesInfo: { selectedTable, showTransferTable, changeShowTransferTable },
 } = useSalonBaseConfigContext();
 return (
  <Dialog
   open={showTransferTable}
   onOpenChange={(newValue) => changeShowTransferTable(newValue)}
  >
   <DialogContent className='gap-0 p-0 sm:max-w-3xl'>
    <DialogHeader className='p-4 py-6'>
     <DialogTitle>{dic.transferTableModal.title}</DialogTitle>
    </DialogHeader>
    <div className='p-4 flex gap-4 items-center justify-center'>
     <div className='size-48 rounded-lg border border-input p-4 grid place-content-center bg-rose-100 dark:bg-rose-900'>
      <p className='text-4xl font-medium font-en-roboto'>
       {selectedTable?.tableNo.toString().padStart(2, '0')}
      </p>
     </div>
     <div className='flex flex-col items-center text-neutral-600 dark:text-neutral-400'>
      <span>{dic.transferTableModal.transferTo}</span>
      <FaArrowLeftLong className='size-20 ltr:rotate-180' />
     </div>
     <Button variant='outline' className='relative h-auto w-auto size-48'>
      <div className='absolute top-1/2 start-1/2 translate-x-1/2 -translate-y-1/2 z-0'>
       <MdTouchApp className='size-32 text-neutral-200 dark:text-neutral-800' />
      </div>
      <div className='flex flex-col items-center z-1'>
       <p className='text-xl font-medium'>
        {dic.transferTableModal.selectTargetTable}
       </p>
       {/* <p>{dic.transferTableModal.selectTargetTable}</p> */}
      </div>
     </Button>
    </div>
   </DialogContent>
  </Dialog>
 );
}
