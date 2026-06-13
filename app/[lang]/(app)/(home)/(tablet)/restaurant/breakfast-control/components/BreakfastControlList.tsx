import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { type BreakfastControlProps } from '../utils/BreakfastControlProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import BreakfastControlItem from './BreakfastControlItem';
import { filterCheckLists } from '../utils/filterCheckLists';
import { useFormContext } from 'react-hook-form';
import { type BreakfastControlFiltersSchema } from '../schemas/breakfastControlFiltersSchema';

export default function BreakfastControlList({
 dic,
 breakfastControlProps,
}: {
 dic: BreakfastControlDictionary;
 breakfastControlProps: BreakfastControlProps;
}) {
 const { watch } = useFormContext<BreakfastControlFiltersSchema>();
 const [search, showNotServed, showServed] = watch([
  'search',
  'showNotServed',
  'showServed',
 ]);
 if (
  breakfastControlProps.isSuccess &&
  !breakfastControlProps.data?.bfCheckListDatas.length
 ) {
  return <NoItemFound />;
 }
 if (!breakfastControlProps.isFetching && breakfastControlProps.isError) {
  return <UnExpectedError />;
 }
 const visibleCheckLists = filterCheckLists({
  checkLists: breakfastControlProps.data?.bfCheckListDatas ?? [],
  search,
  showNotServed,
  showServed,
 });
 return (
  <div className='p-4 lg:p-6 pt-2!'>
   {breakfastControlProps.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
    {visibleCheckLists.length ? (
     visibleCheckLists.map((checklist) => (
      <BreakfastControlItem
       key={checklist.id}
       dic={dic}
       checklist={checklist}
       onInvalidQueries={breakfastControlProps.onInvalidateQueries}
       searchText={search}
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
