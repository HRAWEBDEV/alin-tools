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

export default function BreakfastControlItem({
 checklist,
 onInvalidQueries,
 searchText,
}: {
 dic: BreakfastControlDictionary;
 checklist: BreackfastControlRes['bfCheckListDatas'][number];
 onInvalidQueries: () => unknown;
 searchText: string;
}) {
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
  <>
   <button
    data-is-served={checklist.served}
    className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 data-[is-served="true"]:bg-secondary/10 relative isolate whitespace-normal'
    onClick={() => {
     if (isPending) return;
     mutate();
    }}
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
  </>
 );
}
