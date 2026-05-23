import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { StayRevenueProps } from '../../../utils/guest-expenses/StayRevenueProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import StayExpensesItem from './StayExpensesItem';

export default function StayExpensesList({
 dic,
 stayRevenueTypes,
}: {
 dic: RoomsRackDictionary;
 stayRevenueTypes: StayRevenueProps;
}) {
 if (stayRevenueTypes.isSuccess && !stayRevenueTypes.data?.length) {
  return <NoItemFound />;
 }
 if (!stayRevenueTypes.isFetching && stayRevenueTypes.isError) {
  return <UnExpectedError />;
 }
 return (
  <div className='mt-4'>
   {stayRevenueTypes.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {stayRevenueTypes.data?.map((revenue) => (
     <StayExpensesItem key={revenue.id} dic={dic} revenue={revenue} />
    ))}
   </div>
  </div>
 );
}
