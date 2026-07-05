import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { InvoicesProps } from '../../../utils/guest-expenses/InvoicesProps';
import { EditInvoiceProps } from '../../../utils/guest-expenses/EditInvoiceProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import RevenueExpensesItem from './RevenueExpensesItem';

export default function RevenueExpensesList({
 dic,
 invoicesProps,
 editRevenue,
}: {
 dic: RoomsRackDictionary;
 invoicesProps: InvoicesProps;
 editRevenue: EditInvoiceProps;
}) {
 if (invoicesProps.isSuccess && !invoicesProps.data?.length) {
  return <NoItemFound />;
 }
 if (!invoicesProps.isFetching && invoicesProps.isError) {
  return <UnExpectedError />;
 }
 return (
  <div>
   {invoicesProps.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {invoicesProps.data?.map((revenue) => (
     <RevenueExpensesItem
      key={revenue.id}
      dic={dic}
      revenue={revenue}
      editRevenue={editRevenue}
     />
    ))}
   </div>
  </div>
 );
}
