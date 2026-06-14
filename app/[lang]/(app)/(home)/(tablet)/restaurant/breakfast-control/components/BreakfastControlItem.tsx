import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { MdTouchApp } from 'react-icons/md';
import { type BreackfastControlRes } from '../services/BreakfastControlApiActions';
import { useMutation } from '@tanstack/react-query';
import { updateBreakfastState } from '../services/BreakfastControlApiActions';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { FaCheck } from 'react-icons/fa';
import { Spinner } from '@/components/ui/spinner';
import Highlighter from 'react-highlight-words';
import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BiError } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';

export default function BreakfastControlItem({
 dic,
 checklist,
 onInvalidQueries,
 searchText,
}: {
 dic: BreakfastControlDictionary;
 checklist: BreackfastControlRes['bfCheckListDatas'][number];
 onInvalidQueries: () => unknown;
 searchText: string;
}) {
 const activeState = checklist.served ? 'served' : 'notServed';
 const updateState = activeState === 'served' ? 'notServed' : 'served';
 const { mutate, isPending } = useMutation({
  mutationFn() {
   return updateBreakfastState({ id: checklist.id });
  },
  onSuccess() {
   onInvalidQueries();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });
 return (
  <Dialog>
   <DialogTrigger asChild>
    <button
     data-is-served={checklist.served}
     className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 data-[is-served="true"]:bg-secondary/10 relative isolate whitespace-normal'
    >
     <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
      <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
     </div>
     <div className='flex flex-wrap justify-between gap-1 mb-2 items-center'>
      <div className='font-medium text-2xl'>
       <Highlighter
        searchWords={[searchText]}
        autoEscape={true}
        textToHighlight={checklist.roomNo.toString()}
       />
      </div>
      <div>
       {isPending ? (
        <Spinner className='size-9 text-primary' />
       ) : checklist.served ? (
        <FaCheck className='text-secondary size-9' />
       ) : (
        <div className='size-9 border border-neutral-400 dark:border-neutral-600 rounded-lg'></div>
       )}
      </div>
     </div>
     <div className='mb-1 flex items-center justify-between gap-2'>
      <p className='text-base mb-1 font-medium text-primary text-start grow'>
       <Highlighter
        searchWords={[searchText]}
        autoEscape={true}
        textToHighlight={checklist.customerName}
       />
      </p>
     </div>
     <div className='mb-1 flex items-center justify-between gap-2'>
      <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-300 text-start grow'>
       <Highlighter
        searchWords={[searchText]}
        autoEscape={true}
        textToHighlight={checklist.guestFullName}
       />
      </p>
     </div>
    </button>
   </DialogTrigger>
   <DialogContent className='p-0 gap-0'>
    <DialogHeader className='p-4 py-2 border-b border-input'>
     <DialogTitle className='flex gap-2 items-center'>
      <BiError className='size-12 text-red-700 dark:text-red-400 font-medium' />
      <span>{dic.info.changeState}</span>
     </DialogTitle>
    </DialogHeader>
    <div className='p-4 py-2'>
     <p className='text-md'>
      <span className='me-2 text-neutral-700 dark:text-neutral-400 inline-block w-20'>
       {dic.info.roomNo}
      </span>
      <span className='font-medium text-xl'>{checklist.roomNo}</span>
     </p>
     <p className='text-md'>
      <span className='me-2 text-neutral-700 dark:text-neutral-400 inline-block w-20'>
       {dic.info.guestName}
      </span>
      <span className='font-medium text-xl'>{checklist.guestFullName}</span>
     </p>
     <div className='flex justify-center text-lg font-medium mt-4 flex-wrap items-center gap-4'>
      <div
       className={
        activeState === 'served' ? 'text-secondary' : 'text-destructive'
       }
      >
       {dic.info[activeState]}
      </div>
      <div>{'------->'}</div>
      <div
       className={
        updateState === 'served' ? 'text-secondary' : 'text-destructive'
       }
      >
       {dic.info[updateState]}
      </div>
     </div>
    </div>
    <DialogFooter className='p-4 border-t border-input py-2'>
     <DialogClose asChild>
      <Button
       size='lg'
       className='sm:w-24'
       variant='outline'
       disabled={isPending}
      >
       {isPending && <Spinner />}
       {dic.info.cancel}
      </Button>
     </DialogClose>
     <DialogClose asChild>
      <Button
       size='lg'
       className='sm:w-24'
       variant='destructive'
       disabled={isPending}
       onClick={() => {
        if (isPending) return;
        mutate();
       }}
      >
       {isPending && <Spinner />}
       {dic.info.confirm}
      </Button>
     </DialogClose>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
