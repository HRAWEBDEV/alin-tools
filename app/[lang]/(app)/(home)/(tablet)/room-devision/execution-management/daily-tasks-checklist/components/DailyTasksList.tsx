import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
import { type DailyTasksChecklistProps } from '../utils/dailyTasksChecklistProps';
import { type EditDailyTaskProps } from '../utils/editDailyTaskProps';
import DailyTaskItem from './DailyTaskItem';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';

export default function DailyTasksList({
 dic,
 checklist,
 editChecklist,
}: {
 dic: DailyTasksChecklistDictionary;
 checklist: DailyTasksChecklistProps;
 editChecklist: EditDailyTaskProps;
}) {
 if (checklist.isSuccess && !checklist.data?.length) {
  return <NoItemFound />;
 }
 if (!checklist.isFetching && checklist.isError) {
  return <UnExpectedError />;
 }
 return (
  <div>
   {checklist.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {checklist.data?.map((item) => (
     <DailyTaskItem
      key={item.id}
      dic={dic}
      checkoutItem={item}
      editChecklist={editChecklist}
     />
    ))}
   </div>
  </div>
 );
}
