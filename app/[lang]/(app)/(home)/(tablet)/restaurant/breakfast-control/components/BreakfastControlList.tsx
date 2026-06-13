import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { type BreakfastControlProps } from '../utils/BreakfastControlProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import BreakfastControlItem from './BreakfastControlItem';

export default function BreakfastControlList({
 dic,
 breakfastControlProps,
}: {
 dic: BreakfastControlDictionary;
 breakfastControlProps: BreakfastControlProps;
}) {
 if (
  breakfastControlProps.isSuccess &&
  !breakfastControlProps.data?.bfCheckListDatas.length
 ) {
  return <NoItemFound />;
 }
 if (!breakfastControlProps.isFetching && breakfastControlProps.isError) {
  return <UnExpectedError />;
 }
 return (
  <div className='p-4 lg:p-6 pt-2!'>
   {breakfastControlProps.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
    {breakfastControlProps.data?.bfCheckListDatas.length ? (
     breakfastControlProps.data?.bfCheckListDatas.map((checklist) => (
      <BreakfastControlItem
       key={checklist.id}
       dic={dic}
       checklist={checklist}
       onInvalidQueries={breakfastControlProps.onInvalidateQueries}
      />
     ))
    ) : (
     <div className='col-span-full'>
      <NoItemFound />
     </div>
    )}
   </div>
  </div>
 );
}
