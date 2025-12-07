import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
 DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { mergeTable } from '../../services/salonsApiActions';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function MergeTableModal({
 dic,
 open,
 selectedTableNo,
 mergeToOrderID,
 mergeToTableNo,
 selectedOrderID,
 changeOpen,
 onSuccess,
}: {
 dic: SalonsDictionary;
 open: boolean;
 selectedOrderID: number;
 selectedTableNo: number;
 mergeToTableNo: number;
 mergeToOrderID: number;
 changeOpen: (open?: boolean) => unknown;
 onSuccess?: () => unknown;
}) {
 const { mutate, isPending, isError, error } = useMutation({
  mutationFn() {
   return mergeTable({
    masterOrderID: selectedOrderID,
    mergeOrderID: mergeToOrderID,
   });
  },
  onSuccess() {
   changeOpen(false);
   onSuccess?.();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 return (
  <Dialog open={open} onOpenChange={changeOpen}>
   <DialogContent className='gap-0 p-0 sm:max-w-3xl'>
    <DialogHeader className='p-4 py-6'>
     <DialogTitle>{dic.mergeTableModal.title}</DialogTitle>
    </DialogHeader>
    {isError && (
     <div className='p-4'>
      <Alert variant='destructive'>
       <AlertCircleIcon />
       <AlertTitle>{error.response?.data}</AlertTitle>
      </Alert>
     </div>
    )}
    <div className='p-4 flex gap-4 items-center justify-center flex-col sm:flex-row'>
     <div className='size-48 rounded-lg border border-input p-4 grid place-content-center bg-rose-100 dark:bg-rose-900'>
      <p className='text-4xl font-medium font-en-roboto'>
       {selectedTableNo.toString().padStart(2, '0')}
      </p>
     </div>
     <div className='flex flex-col items-center text-neutral-600 dark:text-neutral-400 -rotate-90 sm:rotate-0'>
      <span>{dic.mergeTableModal.mergeWith}</span>
      <FaArrowLeftLong className='size-20 ltr:rotate-180' />
     </div>
     <div className='size-48 rounded-lg border border-input p-4 grid place-content-center bg-teal-100 dark:bg-teal-900'>
      <p className='text-4xl font-medium font-en-roboto'>
       {mergeToTableNo.toString().padStart(2, '0')}
      </p>
     </div>
    </div>
    <DialogFooter className='p-4'>
     <Button
      variant='destructive'
      className='sm:w-32 text-base'
      size='lg'
      disabled={isPending}
      onClick={() => changeOpen(false)}
     >
      {isPending && <Spinner />}
      {dic.mergeTableModal.cancel}
     </Button>
     <Button
      disabled={isPending}
      className='sm:w-32 text-base'
      size='lg'
      onClick={() => {
       mutate();
      }}
     >
      {isPending && <Spinner />}
      {dic.mergeTableModal.confirm}
     </Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
